/**
 * D&D MapForge — Network Manager (PeerJS)
 * Handles P2P synchronization between DM and Heroes.
 */
import { state } from './state.js';
import { showToast } from './interactions.js';

class NetworkManager {
  constructor() {
    this.peer = null;
    this.connections = []; // Only for DM (list of hero connections)
    this.connToDM = null;  // Only for Heroes
    this.role = 'dm';
    this.isReady = false;
  }

  /**
   * Initialize as Host (DM)
   */
  async initHost(nickname) {
    return new Promise((resolve, reject) => {
      this.role = 'dm';
      state.getAll().session.role = 'dm';
      state.getAll().session.nickname = nickname;

      // Generate a short 5-6 char ID for easier typing
      const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
      this.peer = new Peer(shortId);

      this.peer.on('open', id => {
        state.getAll().session.roomCode = id;
        this.isReady = true;
        console.log('Room created with ID:', id);
        this._setupHostListeners();
        resolve(id);
      });

      this.peer.on('error', err => {
        console.error('Peer error:', err);
        reject(err);
      });
    });
  }

  /**
   * Initialize as Client (Hero)
   */
  async initClient(roomId, nickname) {
    return new Promise((resolve, reject) => {
      this.role = 'hero';
      state.getAll().session.role = 'hero';
      state.getAll().session.nickname = nickname;
      state.getAll().session.roomCode = roomId;

      this.peer = new Peer();

      this.peer.on('open', () => {
        const conn = this.peer.connect(roomId.toUpperCase());
        this.connToDM = conn;

        conn.on('open', () => {
          this.isReady = true;
          this._setupClientListeners(conn);
          // Notify DM about identity
          conn.send({ type: 'JOIN', nickname });
          resolve();
        });

        conn.on('error', err => reject(err));
      });

      setTimeout(() => { if (!this.isReady) reject('Timeout: No se pudo conectar a la sala.'); }, 15000);
    });
  }

  _setupHostListeners() {
    this.peer.on('connection', conn => {
      this.connections.push(conn);
      console.log('Hero connected:', conn.peer);
      showToast('¡Un héroe se ha unido a la partida!', 'info');

      // Send initial state
      this.broadcastState();

      conn.on('data', data => this._handleInboundData(data, conn));
      conn.on('close', () => {
        this.connections = this.connections.filter(c => c !== conn);
        showToast('Un héroe ha abandonado la sala.', 'warning');
      });
    });

    // Automatically broadcast state changes if we are the host
    state.subscribe((key) => {
      if (key === 'viewport') return; // Don't sync individual zoom/pan typically
      if (key === 'session') return;
      if (this.role === 'dm' && this.isReady) {
        this.broadcastState();
      }
    });
  }

  _setupClientListeners(conn) {
    conn.on('data', data => this._handleInboundData(data, conn));
    conn.on('close', () => {
      showToast('Se ha perdido la conexión con el Director de Juego.', 'error');
      setTimeout(() => location.reload(), 3000);
    });
  }

  _handleInboundData(msg, conn) {
    if (this.role === 'hero') {
      if (msg.type === 'FULL_SYNC') {
        const st = state.getAll();
        // Update local state without triggering a broadcast back
        // We selectively update grids and arrays to avoid losing local session info
        Object.assign(st.floorGrid, msg.state.floorGrid);
        Object.assign(st.fogGrid, msg.state.fogGrid);
        st.envObjects = [...msg.state.envObjects];
        st.characters = [...msg.state.characters];
        st.enemies    = [...msg.state.enemies];
        st.drawings   = [...msg.state.drawings];
        st.initiative = JSON.parse(JSON.stringify(msg.state.initiative));
        st._uidCounter = msg.state._uidCounter;
        
        // Notify local UI
        state._notify('all');
      }
    }

    if (this.role === 'dm') {
      // DM receives commands from Heroes
      switch (msg.type) {
        case 'MOVE_TOKEN':
          if (msg.layer === 'characters') state.moveCharacter(msg.uid, msg.x, msg.y);
          break;
        case 'ADD_HERO':
          const uid = state.addCharacter(msg.classId, msg.x, msg.y, msg.nickname);
          // Tell this specific connection which UID is theirs
          conn.send({ type: 'ASSIGN_UID', uid });
          break;
        case 'UPDATE_HP':
          state.setEntryHp(msg.uid, msg.hp);
          break;
        case 'UPDATE_INIT':
          state.setInitiativeRoll(msg.uid, msg.roll);
          break;
      }
    }

    // Shared: assignment of personal UID
    if (msg.type === 'ASSIGN_UID') {
      state.getAll().session.myHeroUid = msg.uid;
      state._notify('session');
    }
  }

  broadcastState() {
    if (this.role !== 'dm') return;
    const fullState = state.getAll();
    const data = {
      type: 'FULL_SYNC',
      state: {
        floorGrid:  fullState.floorGrid,
        fogGrid:    fullState.fogGrid,
        envObjects: fullState.envObjects,
        characters: fullState.characters,
        enemies:    fullState.enemies,
        drawings:   fullState.drawings,
        initiative: fullState.initiative,
        _uidCounter: fullState._uidCounter
      }
    };
    this.connections.forEach(conn => {
      if (conn.open) conn.send(data);
    });
  }

  sendCommand(type, data) {
    if (this.role !== 'hero' || !this.connToDM || !this.connToDM.open) return;
    this.connToDM.send({ type, ...data });
  }
}

export const network = new NetworkManager();
