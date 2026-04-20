// ============================================================
//  D&D Interactive Map Builder — Main App
// ============================================================
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from './constants.js';
import { state } from './state.js';
import { MapRenderer } from './renderer.js';
import { bindInteractions } from './interactions.js';
import { renderInitiativePanel, bindInitiativeControls } from './initiative.js';
import { renderMapSlots, bindMapSlotControls } from './mapslots.js';
import { network } from './network.js';
import { CHARACTER_CLASSES } from './constants.js';
import { showToast } from './ui_utils.js';

// ── Canvas Setup ──────────────────────────────────────────
const canvas   = document.getElementById('map-canvas');
window.DND_APP_LOADED = true;

// ── Global Error Handler for Debugging ───────────────────
window.addEventListener('error', (event) => {
  console.error('Fatal crash:', event.error);
  const msg = event.error ? event.error.message : 'Error desconocido';
  const debugDiv = document.createElement('div');
  debugDiv.style = 'position:fixed; top:10px; right:10px; background:rgba(220,0,0,0.9); color:white; padding:15px; border:2px solid gold; z-index:9999; font-weight:bold; border-radius:8px;';
  debugDiv.innerHTML = `⚠️ ERROR FATAL:<br>${msg}<br><small>Revisa la consola (F12) para más detalles.</small>`;
  document.body.appendChild(debugDiv);
});

// ── Lobby Logic (Moved to top for priority) ──────────────
const lobbyOverlay = document.getElementById('lobby-overlay');
const lobbyStep1   = document.getElementById('lobby-step-1');
const lobbyStepSel = document.getElementById('lobby-step-select');
const lobbyStatus  = document.getElementById('lobby-status');

function updateLobbyStatus(msg, isError = false) {
  if (!lobbyStatus) return;
  lobbyStatus.textContent = msg;
  lobbyStatus.style.color = isError ? 'var(--danger)' : 'var(--accent-light)';
}

function bindLobby() {
  console.log('Binding lobby events...');
  
  document.getElementById('btn-create-room')?.addEventListener('click', async () => {
    console.log('Click en Crear Sala');
    const nickEl = document.getElementById('input-nickname');
    const nick = nickEl ? nickEl.value.trim() : '';
    
    if (!nick) { updateLobbyStatus('Ingresa un nombre primero.', true); return; }
    
    updateLobbyStatus('Creando sala...');
    try {
      if (!network) throw new Error('Network module not loaded');
      const id = await network.initHost(nick);
      if (lobbyOverlay) lobbyOverlay.style.display = 'none';
      showToast(`Sala creada: ${id}. ¡Comparte el código!`, 'success');
      updateLobbyStatus('');
    } catch (err) {
      console.error('Error in initHost:', err);
      updateLobbyStatus('Error: ' + err, true);
    }
  });

  document.getElementById('btn-join-room')?.addEventListener('click', async () => {
    console.log('Click en Unirse a Sala');
    const nick = document.getElementById('input-nickname')?.value.trim();
    const room = document.getElementById('input-room-code')?.value.trim().toUpperCase();
    
    if (!nick || !room) { updateLobbyStatus('Ingresa nombre y código.', true); return; }
    
    updateLobbyStatus('Conectando...');
    try {
      await network.initClient(room, nick);
      updateLobbyStatus('');
      showLobbyCharacterSelection();
    } catch (err) {
      updateLobbyStatus('No se pudo encontrar la sala.', true);
    }
  });
}

function showLobbyCharacterSelection() {
  if (lobbyStep1) lobbyStep1.classList.remove('active');
  if (lobbyStepSel) lobbyStepSel.classList.add('active');
  const grid = document.getElementById('char-selection-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  CHARACTER_CLASSES.forEach(cls => {
    const btn = document.createElement('button');
    btn.className = 'item-btn char-btn';
    btn.dataset.id = cls.id;
    btn.innerHTML = `
      <span class="char-icon">${cls.icon}</span>
      <div class="char-info">
        <span class="char-name">${cls.label}</span>
        <span class="char-hint">${cls.defaultHp} HP</span>
      </div>
    `;
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const confirmBtn = document.getElementById('btn-confirm-selection');
      if (confirmBtn) confirmBtn.disabled = false;
      state.getAll().session.selectedClassId = cls.id;
    });
    grid.appendChild(btn);
  });
}

document.getElementById('btn-confirm-selection')?.addEventListener('click', () => {
  const sess = state.getAll().session;
  const classId = sess.selectedClassId;
  const nickname = sess.nickname;
  
  document.body.classList.add('is-hero');
  if (lobbyOverlay) lobbyOverlay.style.display = 'none';
  
  state.setActiveTool('characters');
  state.setActiveItem(classId);
  showToast(`¡Bienvenido ${nickname}! Clica en el mapa para posicionarte.`, 'success');
});

bindLobby();

// ── Rendering Initialization ─────────────────────────────
const renderer = new MapRenderer(canvas);
function render() { renderer.render(); }
bindInteractions(canvas, renderer, render);
render();

// ── Right Panel Toggle ────────────────────────────────────
const rightPanel  = document.getElementById('right-panel');
const leftSidebar = document.querySelector('.sidebar');
let rightPanelOpen = false;
let leftSidebarOpen  = true;

const btnToggleLeft  = document.getElementById('btn-toggle-left');
const btnToggleRight = document.getElementById('btn-toggle-right');

function openRightPanel(tabId) {
  rightPanel.classList.add('open');
  rightPanelOpen = true;
  updateToggleButtons();
  document.querySelectorAll('.rpanel-tab').forEach(t => t.classList.toggle('active', t.dataset.panel === tabId));
  document.querySelectorAll('.rpanel-content').forEach(p => p.classList.toggle('active', p.id === `rpanel-${tabId}`));
  if (tabId === 'maps') renderMapSlots();
}

function closeRightPanel() {
  rightPanel.classList.remove('open');
  rightPanelOpen = false;
  updateToggleButtons();
}

function updateToggleButtons() {
  if (btnToggleLeft) {
    btnToggleLeft.textContent = leftSidebarOpen ? '◀' : '▶';
    btnToggleLeft.title = leftSidebarOpen ? 'Contraer panel izquierdo' : 'Expandir panel izquierdo';
  }
  if (btnToggleRight) {
    btnToggleRight.textContent = rightPanelOpen ? '▶' : '◀';
    btnToggleRight.title = rightPanelOpen ? 'Contraer panel derecho' : 'Expandir panel derecho';
  }
}

document.getElementById('btn-open-initiative')?.addEventListener('click', () => {
  if (rightPanelOpen && rightPanel.querySelector('.rpanel-tab[data-panel="initiative"]')?.classList.contains('active')) {
    closeRightPanel();
  } else {
    openRightPanel('initiative');
  }
});

document.getElementById('btn-open-maps')?.addEventListener('click', () => {
  if (rightPanelOpen && rightPanel.querySelector('.rpanel-tab[data-panel="maps"]')?.classList.contains('active')) {
    closeRightPanel();
  } else {
    openRightPanel('maps');
  }
});

document.getElementById('btn-close-rpanel')?.addEventListener('click', () => {
  closeRightPanel();
});

// ── Sidebar Toggles Logic ─────────────────────────────────
btnToggleLeft?.addEventListener('click', () => {
  leftSidebarOpen = !leftSidebarOpen;
  leftSidebar.classList.toggle('collapsed', !leftSidebarOpen);
  updateToggleButtons();
  // Resizing canvas after transition
  setTimeout(() => render(), 300);
});

btnToggleRight?.addEventListener('click', () => {
  if (rightPanelOpen) closeRightPanel();
  else openRightPanel('initiative');
});

updateToggleButtons();

document.querySelectorAll('.rpanel-tab').forEach(btn => {
  btn.addEventListener('click', () => openRightPanel(btn.dataset.panel));
});

// ── Left Sidebar Tabs ─────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.dataset.tool;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tool}`)?.classList.add('active');
    state.setActiveTool(tool);
    state.setActiveItem(null);
    state.setErasing(false);
    document.querySelectorAll('.erase-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.item-btn').forEach(b => b.classList.remove('active'));
  });
});

// ── Item Buttons ──────────────────────────────────────────
document.querySelectorAll('.item-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.tab-panel')?.id?.replace('panel-', '');
    const wasActive = btn.classList.contains('active');
    document.querySelectorAll(`#panel-${panel} .item-btn`).forEach(b => b.classList.remove('active'));
    if (!wasActive) {
      btn.classList.add('active');
      state.setActiveItem(btn.dataset.id);
      state.setErasing(false);
      document.querySelectorAll('.erase-btn').forEach(b => b.classList.remove('active'));
    } else {
      state.setActiveItem(null);
    }
  });
});

// ── Erase Buttons ─────────────────────────────────────────
document.querySelectorAll('.erase-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const wasActive = btn.classList.contains('active');
    document.querySelectorAll('.erase-btn, .item-btn').forEach(b => b.classList.remove('active'));
    if (!wasActive) { btn.classList.add('active'); state.setErasing(true); state.setActiveItem(null); }
    else { state.setErasing(false); }
  });
});

// ── Brush Size Buttons ────────────────────────────────────
document.querySelectorAll('.brush-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const size = btn.dataset.size;
    document.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.brush-size-btn[data-size="${size}"]`).forEach(b => b.classList.add('active'));
    state.setBrushSize(parseInt(size, 10));
  });
});

// ── Layer Controls ────────────────────────────────────────
document.querySelectorAll('.layer-lock-btn').forEach(btn => {
  btn.addEventListener('click', () => { state.toggleLayerLock(btn.dataset.layer); updateLayerUI(); render(); });
});
document.querySelectorAll('.layer-eye-btn').forEach(btn => {
  btn.addEventListener('click', () => { state.toggleLayerVisibility(btn.dataset.layer); updateLayerUI(); render(); });
});

function updateLayerUI() {
  const st = state.getAll();
  document.querySelectorAll('.layer-lock-btn').forEach(btn => {
    const l = st.layers[btn.dataset.layer];
    btn.classList.toggle('locked', l.locked);
    btn.innerHTML = l.locked ? '🔒' : '🔓';
    btn.title = l.locked ? 'Capa fijada — clic para desfijar' : 'Capa libre — clic para fijar';
  });
  document.querySelectorAll('.layer-eye-btn').forEach(btn => {
    const l = st.layers[btn.dataset.layer];
    btn.classList.toggle('hidden-layer', !l.visible);
    btn.innerHTML = l.visible ? '👁️' : '🙈';
    btn.title = l.visible ? 'Ocultar capa' : 'Mostrar capa';
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const id = btn.dataset.tool;
    if (!st.layers[id]) return;
    btn.classList.toggle('layer-locked', st.layers[id].locked);
  });
}

// ── Toolbar Buttons ───────────────────────────────────────
document.getElementById('btn-clear-floor')?.addEventListener('click', () => {
  if (confirm('¿Borrar todas las baldosas del piso?')) { state.clearFloor(); render(); }
});

document.getElementById('btn-fill-fog')?.addEventListener('click', () => {
  state.fillFog(); render();
});

document.getElementById('btn-clear-fog')?.addEventListener('click', () => {
  state.clearFog(); render();
});

document.getElementById('btn-reset-all')?.addEventListener('click', () => {
  if (confirm('¿Reiniciar el mapa completo? Se perderán todos los datos.')) {
    state.resetAll(); updateLayerUI(); render();
    document.querySelectorAll('.item-btn, .erase-btn').forEach(b => b.classList.remove('active'));
  }
});

// ── Fog Preview Toggle ────────────────────────────────────
document.getElementById('btn-toggle-fog-preview')?.addEventListener('click', () => {
  if (state.getAll().session.role !== 'dm') return;
  const active = state.toggleFogPreview();
  const btnIcon = document.getElementById('fog-preview-icon');
  const btnText = document.getElementById('fog-preview-text');
  if (btnIcon) btnIcon.textContent = active ? '👁️' : '👁️‍🗨️';
  if (btnText) btnText.textContent = active ? 'Ocultar real (DM Vision)' : 'Ver a través de niebla';
  showToast(active ? 'Visión del DM activada' : 'Visión de juego activada');
});

document.getElementById('btn-export')?.addEventListener('click', () => {
  // Render at full map resolution for export
  const exportCanvas = document.createElement('canvas');
  const mapW = GRID_COLS * TILE_SIZE;
  const mapH = GRID_ROWS * TILE_SIZE;
  exportCanvas.width  = mapW;
  exportCanvas.height = mapH;

  // Temporarily save+replace viewport for full-res render
  const vp = state.getAll().viewport;
  state.setViewport(1, 0, 0);
  const tempRenderer = new MapRenderer(exportCanvas);
  tempRenderer.showGrid = renderer.showGrid;
  tempRenderer.exportMode = true; // Signals the renderer to make fog entirely opaque
  tempRenderer.render();
  state.setViewport(vp.zoom, vp.panX, vp.panY);

  const link = document.createElement('a');
  link.download = `mapa_dnd_${Date.now()}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
});

document.getElementById('btn-grid-toggle')?.addEventListener('click', e => {
  renderer.showGrid = !renderer.showGrid;
  e.currentTarget.classList.toggle('active', renderer.showGrid);
  render();
});

document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
  const vp = state.getAll().viewport;
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2, cy = rect.height / 2;
  const newZ = Math.min(3, vp.zoom * 1.25);
  const k = newZ / vp.zoom;
  state.setViewport(newZ, cx - (cx - vp.panX) * k, cy - (cy - vp.panY) * k);
  render();
});

document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
  const vp = state.getAll().viewport;
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2, cy = rect.height / 2;
  const newZ = Math.max(0.15, vp.zoom * 0.8);
  const k = newZ / vp.zoom;
  state.setViewport(newZ, cx - (cx - vp.panX) * k, cy - (cy - vp.panY) * k);
  render();
});

document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
  const rect = canvas.getBoundingClientRect();
  state.resetViewport(rect.width, rect.height, GRID_COLS * TILE_SIZE, GRID_ROWS * TILE_SIZE);
  render();
});

// ── Zoom % Display ────────────────────────────────────────
function updateZoomDisplay() {
  const el = document.getElementById('zoom-display');
  if (el) el.textContent = `${Math.round(state.getAll().viewport.zoom * 100)}%`;
}

// ── Reactive State ────────────────────────────────────────
state.subscribe((key, st) => {
  if (key === 'characters' || key === 'all') {
    const n = st.characters.length;
    const el = document.getElementById('char-count');
    if (el) { el.textContent = `${n}/6`; el.className = n >= 6 ? 'count-badge count-badge--full' : 'count-badge'; }
  }
  if (key === 'enemies' || key === 'all') {
    const n = st.enemies.length;
    const el = document.getElementById('enemy-count');
    if (el) { el.textContent = `${n}/30`; el.className = n >= 30 ? 'count-badge count-badge--full' : 'count-badge'; }
  }
  if (key === 'layers' || key === 'all') updateLayerUI();
  if (key === 'viewport' || key === 'all') updateZoomDisplay();
  render();
});

// (Lobby logic moved to top)

// ── App Initialization ─────────────────────────────────────
try {
  console.log('D&D MapForge — Initializing...');
  updateLayerUI();
  updateZoomDisplay();
  bindInitiativeControls();
  bindMapSlotControls();

  // Center the map on first load
  const vpInit = state.getAll().viewport;
  if (vpInit.zoom === 0.8 && vpInit.panX === 40) {
    setTimeout(() => {
      const rect = canvas.getBoundingClientRect();
      state.resetViewport(rect.width, rect.height, GRID_COLS * TILE_SIZE, GRID_ROWS * TILE_SIZE);
      render();
    }, 100);
  }
  
  console.log('D&D MapForge — Ready.');
} catch (err) {
  console.error('Fatal initialization error:', err);
  // Show error on screen for easier debugging if console is closed
  const errDiv = document.createElement('div');
  errDiv.style = 'position:fixed; bottom:0; left:0; background:red; color:white; padding:10px; z-index:9999; font-size:12px;';
  errDiv.textContent = 'Error de inicio: ' + err.message;
  document.body.appendChild(errDiv);
}
