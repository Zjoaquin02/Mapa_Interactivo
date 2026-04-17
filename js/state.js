// ============================================================
//  D&D Interactive Map Builder — State Manager
// ============================================================
import { CHARACTER_CLASSES, ENEMY_TYPES } from './constants.js';

const DEFAULT_STATE = () => ({
  activeTool: 'floor',
  activeItem: null,
  isErasing:  false,

  mapName: 'Nuevo Mapa',

  viewport: { zoom: 0.8, panX: 40, panY: 40 },

  layers: {
    floor:      { locked: false, visible: true },
    env:        { locked: false, visible: true },
    characters: { locked: false, visible: true },
    enemies:    { locked: false, visible: true },
  },

  floorGrid:  {},
  envObjects: [],
  characters: [],
  enemies:    [],

  initiative: {
    entries:      [],   // [{ uid, name, icon, color, border, type, roll, hp, maxHp }]
    currentIndex: -1,
    round:        1,
  },

  _uidCounter: 0,
});

// ── Map Slots (stored separately in localStorage) ─────────────
const SLOTS_KEY = 'dnd_map_slots_v2';

export function getSlots() {
  try { return JSON.parse(localStorage.getItem(SLOTS_KEY) || 'null') || Array(6).fill(null); }
  catch { return Array(6).fill(null); }
}

export function deleteSlot(index) {
  const slots = getSlots();
  slots[index] = null;
  localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
}

// ── Main State ────────────────────────────────────────────────
class StateManager {
  constructor() {
    this._state = this._load() || DEFAULT_STATE();
    // Ensure viewport exists for older saves
    if (!this._state.viewport)   this._state.viewport   = DEFAULT_STATE().viewport;
    if (!this._state.initiative) this._state.initiative = DEFAULT_STATE().initiative;
    if (!this._state.mapName)    this._state.mapName    = DEFAULT_STATE().mapName;
    this._listeners = [];
  }

  // ── Getters ───────────────────────────────────────────────
  get(key)              { return this._state[key]; }
  getLayer(id)          { return this._state.layers[id]; }
  isLayerLocked(id)     { return this._state.layers[id]?.locked ?? false; }
  getFloorTile(col,row) { return this._state.floorGrid[`${col},${row}`] ?? null; }
  getAll()              { return this._state; }

  // ── Tool / Item ───────────────────────────────────────────
  setActiveTool(tool) { this._state.activeTool = tool;  this._notify('activeTool'); }
  setActiveItem(id)   { this._state.activeItem = id;    this._notify('activeItem'); }
  setErasing(val)     { this._state.isErasing  = val;   this._notify('isErasing'); }
  setMapName(name)    { this._state.mapName = name;      this._notify('mapName'); this._save(); }

  // ── Viewport ──────────────────────────────────────────────
  setViewport(zoom, panX, panY) {
    this._state.viewport = { zoom, panX, panY };
    this._notify('viewport');
  }

  resetViewport(canvasW, canvasH, mapW, mapH) {
    const zoom = Math.min(canvasW / mapW, canvasH / mapH) * 0.9;
    const panX = (canvasW - mapW * zoom) / 2;
    const panY = (canvasH - mapH * zoom) / 2;
    this.setViewport(zoom, panX, panY);
  }

  // ── Layers ────────────────────────────────────────────────
  toggleLayerLock(id) {
    this._state.layers[id].locked = !this._state.layers[id].locked;
    this._notify('layers');
  }
  toggleLayerVisibility(id) {
    this._state.layers[id].visible = !this._state.layers[id].visible;
    this._notify('layers');
  }

  // ── Floor ─────────────────────────────────────────────────
  paintTile(col, row, terrainId) {
    if (this.isLayerLocked('floor')) return false;
    this._state.floorGrid[`${col},${row}`] = terrainId;
    this._notify('floorGrid'); this._save(); return true;
  }
  eraseTile(col, row) {
    if (this.isLayerLocked('floor')) return false;
    delete this._state.floorGrid[`${col},${row}`];
    this._notify('floorGrid'); this._save(); return true;
  }
  clearFloor() {
    if (this.isLayerLocked('floor')) return false;
    this._state.floorGrid = {};
    this._notify('floorGrid'); this._save(); return true;
  }

  // ── Env Objects ───────────────────────────────────────────
  addEnvObject(type, x, y) {
    if (this.isLayerLocked('env')) return false;
    const uid = ++this._state._uidCounter;
    this._state.envObjects.push({ uid, type, x, y });
    this._notify('envObjects'); this._save(); return uid;
  }
  moveEnvObject(uid, x, y) {
    if (this.isLayerLocked('env')) return false;
    const o = this._state.envObjects.find(o => o.uid === uid);
    if (o) { o.x = x; o.y = y; }
    this._notify('envObjects'); this._save(); return true;
  }
  removeEnvObject(uid) {
    if (this.isLayerLocked('env')) return false;
    this._state.envObjects = this._state.envObjects.filter(o => o.uid !== uid);
    this._notify('envObjects'); this._save(); return true;
  }

  // ── Characters ────────────────────────────────────────────
  addCharacter(classId, x, y, label) {
    if (this.isLayerLocked('characters')) return false;
    if (this._state.characters.length >= 6) return 'max';
    const uid = ++this._state._uidCounter;
    const num = this._state.characters.filter(c => c.type === classId).length + 1;
    this._state.characters.push({ uid, type: classId, x, y, label: label || `${classId} ${num}` });
    this._notify('characters'); this._save(); return uid;
  }
  moveCharacter(uid, x, y) {
    if (this.isLayerLocked('characters')) return false;
    const c = this._state.characters.find(c => c.uid === uid);
    if (c) { c.x = x; c.y = y; }
    this._notify('characters'); this._save(); return true;
  }
  removeCharacter(uid) {
    if (this.isLayerLocked('characters')) return false;
    this._state.characters = this._state.characters.filter(c => c.uid !== uid);
    // also remove from initiative
    this._state.initiative.entries = this._state.initiative.entries.filter(e => e.uid !== uid);
    this._notify('characters'); this._notify('initiative'); this._save(); return true;
  }

  // ── Enemies ───────────────────────────────────────────────
  addEnemy(typeId, x, y, label) {
    if (this.isLayerLocked('enemies')) return false;
    if (this._state.enemies.length >= 6) return 'max';
    const uid = ++this._state._uidCounter;
    const num = this._state.enemies.filter(e => e.type === typeId).length + 1;
    this._state.enemies.push({ uid, type: typeId, x, y, label: label || `${typeId} ${num}` });
    this._notify('enemies'); this._save(); return uid;
  }
  moveEnemy(uid, x, y) {
    if (this.isLayerLocked('enemies')) return false;
    const e = this._state.enemies.find(e => e.uid === uid);
    if (e) { e.x = x; e.y = y; }
    this._notify('enemies'); this._save(); return true;
  }
  removeEnemy(uid) {
    if (this.isLayerLocked('enemies')) return false;
    this._state.enemies = this._state.enemies.filter(e => e.uid !== uid);
    this._state.initiative.entries = this._state.initiative.entries.filter(e => e.uid !== uid);
    this._notify('enemies'); this._notify('initiative'); this._save(); return true;
  }

  // ── Initiative ────────────────────────────────────────────
  addToInitiative({ uid, name, icon, color, border, type, maxHp }) {
    if (this._state.initiative.entries.find(e => e.uid === uid)) return;
    this._state.initiative.entries.push({ uid, name, icon, color, border, type, roll: null, hp: maxHp, maxHp });
    this._notify('initiative'); this._save();
  }

  removeFromInitiative(uid) {
    this._state.initiative.entries = this._state.initiative.entries.filter(e => e.uid !== uid);
    const len = this._state.initiative.entries.length;
    if (this._state.initiative.currentIndex >= len) this._state.initiative.currentIndex = Math.max(-1, len - 1);
    this._notify('initiative'); this._save();
  }

  setInitiativeRoll(uid, roll) {
    const entry = this._state.initiative.entries.find(e => e.uid === uid);
    if (entry) { entry.roll = roll; this._notify('initiative'); this._save(); }
  }

  sortInitiative() {
    this._state.initiative.entries.sort((a, b) => (b.roll ?? -1) - (a.roll ?? -1));
    this._state.initiative.currentIndex = this._state.initiative.entries.length > 0 ? 0 : -1;
    this._notify('initiative'); this._save();
  }

  modInitiativeRoll(uid, delta) {
    const entry = this._state.initiative.entries.find(e => e.uid === uid);
    if (entry) { 
        entry.roll = (entry.roll || 0) + delta; 
        this.sortInitiative(); 
    }
  }

  rollAllInitiative() {
    this._state.initiative.entries.forEach(e => { e.roll = Math.floor(Math.random() * 20) + 1; });
    this.sortInitiative();
  }

  nextTurn() {
    const len = this._state.initiative.entries.length;
    if (len === 0) return;
    const prev = this._state.initiative.currentIndex;
    this._state.initiative.currentIndex = (prev + 1) % len;
    if (this._state.initiative.currentIndex === 0) this._state.initiative.round++;
    this._notify('initiative'); this._save();
  }

  prevTurn() {
    const len = this._state.initiative.entries.length;
    if (len === 0) return;
    this._state.initiative.currentIndex = (this._state.initiative.currentIndex - 1 + len) % len;
    this._notify('initiative'); this._save();
  }

  setEntryHp(uid, hp) {
    const entry = this._state.initiative.entries.find(e => e.uid === uid);
    if (entry) { entry.hp = Math.max(0, Math.min(entry.maxHp, hp)); this._notify('initiative'); this._save(); }
  }

  setEntryMaxHp(uid, maxHp) {
    const entry = this._state.initiative.entries.find(e => e.uid === uid);
    if (entry) { 
      entry.maxHp = Math.max(1, maxHp); 
      entry.hp = Math.min(entry.hp, entry.maxHp);
      this._notify('initiative'); this._save(); 
    }
  }

  clearInitiative() {
    this._state.initiative = { entries: [], currentIndex: -1, round: 1 };
    this._notify('initiative'); this._save();
  }

  syncInitiativeFromMap() {
    const st = this._state;
    for (const ch of st.characters) {
      const def = CHARACTER_CLASSES.find(c => c.id === ch.type);
      if (def) this.addToInitiative({ uid: ch.uid, name: ch.label, icon: def.icon, color: def.color, border: def.border, type: 'hero', maxHp: def.defaultHp });
    }
    for (const en of st.enemies) {
      const def = ENEMY_TYPES.find(e => e.id === en.type);
      if (def) this.addToInitiative({ uid: en.uid, name: en.label, icon: def.icon, color: def.color, border: def.border, type: 'enemy', maxHp: def.defaultHp });
    }
  }

  // ── Map Slots ─────────────────────────────────────────────
  saveToSlot(index, name) {
    const slots = getSlots();
    slots[index] = {
      name: name || `Mapa ${index + 1}`,
      timestamp: Date.now(),
      data: JSON.stringify(this._state),
    };
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  }

  loadFromSlot(index) {
    const slots = getSlots();
    const slot = slots[index];
    if (!slot) return false;
    try {
      const loaded = JSON.parse(slot.data);
      this._state = loaded;
      if (!this._state.initiative) this._state.initiative = DEFAULT_STATE().initiative;
      if (!this._state.viewport)   this._state.viewport   = DEFAULT_STATE().viewport;
      if (!this._state.mapName)    this._state.mapName    = DEFAULT_STATE().mapName;
      this._notify('all');
      this._save();
      return true;
    } catch { return false; }
  }

  // ── Reset ─────────────────────────────────────────────────
  resetAll() {
    this._state = DEFAULT_STATE();
    this._notify('all'); this._save();
  }

  // ── Persistence ───────────────────────────────────────────
  _save() {
    try { localStorage.setItem('dnd_map_state_v2', JSON.stringify(this._state)); } catch {}
  }
  _load() {
    try { const r = localStorage.getItem('dnd_map_state_v2'); return r ? JSON.parse(r) : null; }
    catch { return null; }
  }

  // ── Reactivity ────────────────────────────────────────────
  subscribe(fn)  { this._listeners.push(fn); }
  _notify(key)   { this._listeners.forEach(fn => fn(key, this._state)); }
}

export const state = new StateManager();
