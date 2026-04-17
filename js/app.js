// ============================================================
//  D&D Interactive Map Builder — Main App
// ============================================================
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from './constants.js';
import { state } from './state.js';
import { MapRenderer } from './renderer.js';
import { bindInteractions } from './interactions.js';
import { renderInitiativePanel, bindInitiativeControls } from './initiative.js';
import { renderMapSlots, bindMapSlotControls } from './mapslots.js';

// ── Canvas Setup ──────────────────────────────────────────
const canvas   = document.getElementById('map-canvas');
const renderer = new MapRenderer(canvas);

function render() { renderer.render(); }

bindInteractions(canvas, renderer, render);
render();

// ── Right Panel Toggle ────────────────────────────────────
const rightPanel  = document.getElementById('right-panel');
let rightPanelOpen = false;

function openRightPanel(tabId) {
  rightPanel.classList.add('open');
  rightPanelOpen = true;
  document.querySelectorAll('.rpanel-tab').forEach(t => t.classList.toggle('active', t.dataset.panel === tabId));
  document.querySelectorAll('.rpanel-content').forEach(p => p.classList.toggle('active', p.id === `rpanel-${tabId}`));
  if (tabId === 'maps') renderMapSlots();
}

document.getElementById('btn-open-initiative')?.addEventListener('click', () => {
  if (rightPanelOpen && rightPanel.querySelector('.rpanel-tab[data-panel="initiative"]')?.classList.contains('active')) {
    rightPanel.classList.remove('open'); rightPanelOpen = false;
  } else {
    openRightPanel('initiative');
  }
});

document.getElementById('btn-open-maps')?.addEventListener('click', () => {
  if (rightPanelOpen && rightPanel.querySelector('.rpanel-tab[data-panel="maps"]')?.classList.contains('active')) {
    rightPanel.classList.remove('open'); rightPanelOpen = false;
  } else {
    openRightPanel('maps');
  }
});

document.getElementById('btn-close-rpanel')?.addEventListener('click', () => {
  rightPanel.classList.remove('open'); rightPanelOpen = false;
});

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

document.getElementById('btn-reset-all')?.addEventListener('click', () => {
  if (confirm('¿Reiniciar el mapa completo? Se perderán todos los datos.')) {
    state.resetAll(); updateLayerUI(); render();
    document.querySelectorAll('.item-btn, .erase-btn').forEach(b => b.classList.remove('active'));
  }
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
    if (el) { el.textContent = `${n}/6`; el.className = n >= 6 ? 'count-badge count-badge--full' : 'count-badge'; }
  }
  if (key === 'layers' || key === 'all') updateLayerUI();
  if (key === 'viewport' || key === 'all') updateZoomDisplay();
  render();
});

// ── Init ──────────────────────────────────────────────────
updateLayerUI();
updateZoomDisplay();
bindInitiativeControls();
bindMapSlotControls();

// Center the map on first load
const vp = state.getAll().viewport;
if (vp.zoom === 0.8 && vp.panX === 40) {
  setTimeout(() => {
    const rect = canvas.getBoundingClientRect();
    state.resetViewport(rect.width, rect.height, GRID_COLS * TILE_SIZE, GRID_ROWS * TILE_SIZE);
    render();
  }, 100);
}
