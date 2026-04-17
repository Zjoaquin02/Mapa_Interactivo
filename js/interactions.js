// ============================================================
//  D&D Interactive Map Builder — Interactions (Zoom + Pan)
// ============================================================
import { TILE_SIZE, GRID_COLS, GRID_ROWS, ENV_OBJECTS, CHARACTER_CLASSES, ENEMY_TYPES, ZOOM_MIN, ZOOM_MAX } from './constants.js';
import { state } from './state.js';

// ── Coordinate helpers ────────────────────────────────────
function getMapPos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const vp = state.getAll().viewport;
  return {
    x: (clientX - rect.left - vp.panX) / vp.zoom,
    y: (clientY - rect.top  - vp.panY) / vp.zoom,
  };
}

function posToCell(pos) {
  return {
    col: Math.max(0, Math.min(GRID_COLS - 1, Math.floor(pos.x / TILE_SIZE))),
    row: Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(pos.y / TILE_SIZE))),
  };
}

function hitTestTokens(tokens, pos, size = 48) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    const dx = pos.x - (t.x + size / 2);
    const dy = pos.y - (t.y + size / 2);
    if (Math.sqrt(dx*dx + dy*dy) <= size / 2 + 5) return t;
  }
  return null;
}

// ── Toast ────────────────────────────────────────────────
export function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.classList.add('toast--visible'), 10);
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.remove(), 300); }, 2600);
}

// ── Main ─────────────────────────────────────────────────
export function bindInteractions(canvas, renderer, onUpdate) {
  let painting  = false;
  let dragging  = null;  // { layer, uid, offsetX, offsetY }
  let isPanning = false;
  let panStart  = null;  // { screenX, screenY, startPanX, startPanY }
  let isSpaceDown = false;
  // Touch pinch state
  let pinchStart = null;

  // ── Pan helpers ─────────────────────────────────────────
  function startPan(screenX, screenY) {
    const vp = state.getAll().viewport;
    isPanning = true;
    panStart  = { screenX, screenY, startPanX: vp.panX, startPanY: vp.panY };
    canvas.style.cursor = 'grabbing';
  }

  function doPan(screenX, screenY) {
    if (!isPanning || !panStart) return;
    const dx = screenX - panStart.screenX;
    const dy = screenY - panStart.screenY;
    const vp = state.getAll().viewport;
    state.setViewport(vp.zoom, panStart.startPanX + dx, panStart.startPanY + dy);
    onUpdate();
  }

  function endPan() {
    isPanning = false;
    panStart  = null;
    canvas.style.cursor = '';
  }

  // ── Zoom ────────────────────────────────────────────────
  function doZoom(pivotScreenX, pivotScreenY, factor) {
    const vp = state.getAll().viewport;
    const rect = canvas.getBoundingClientRect();
    const px = pivotScreenX - rect.left;
    const py = pivotScreenY - rect.top;
    const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, vp.zoom * factor));
    const k = newZoom / vp.zoom;
    state.setViewport(newZoom, px - (px - vp.panX) * k, py - (py - vp.panY) * k);
    onUpdate();
  }

  // ── Keyboard ─────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      isSpaceDown = true;
      if (!isPanning) canvas.style.cursor = 'grab';
    }
    // Zoom keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === '=') { e.preventDefault(); doZoom(canvas.width/2, canvas.height/2, 1.2); }
    if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); doZoom(canvas.width/2, canvas.height/2, 0.83); }
    if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); const rect = canvas.getBoundingClientRect(); state.resetViewport(rect.width, rect.height, GRID_COLS*TILE_SIZE, GRID_ROWS*TILE_SIZE); onUpdate(); }
  });
  document.addEventListener('keyup', e => {
    if (e.code === 'Space') { isSpaceDown = false; if (!isPanning) canvas.style.cursor = ''; }
  });

  // ── Mouse Wheel (Zoom) ───────────────────────────────────
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    doZoom(e.clientX, e.clientY, e.deltaY > 0 ? 0.88 : 1.14);
  }, { passive: false });

  // ── Mouse Down ───────────────────────────────────────────
  canvas.addEventListener('mousedown', e => {
    e.preventDefault();

    // Middle mouse OR Space = pan
    if (e.button === 1 || (e.button === 0 && isSpaceDown)) {
      startPan(e.clientX, e.clientY);
      return;
    }
    if (e.button !== 0) return;

    const pos  = getMapPos(canvas, e);
    const cell = posToCell(pos);
    const tool = state.get('activeTool');
    const item = state.get('activeItem');

    if (tool === 'floor') {
      painting = true;
      state.get('isErasing') ? state.eraseTile(cell.col, cell.row) : (item && state.paintTile(cell.col, cell.row, item));
      onUpdate(); return;
    }

    if (tool === 'env') {
      const hit = hitTestTokens(state.getAll().envObjects, pos, 44);
      if (hit) { if (!state.isLayerLocked('env')) dragging = { layer: 'env', uid: hit.uid, offsetX: pos.x - hit.x, offsetY: pos.y - hit.y }; return; }
      if (item && !state.isLayerLocked('env')) { state.addEnvObject(item, pos.x - 22, pos.y - 22); onUpdate(); }
      return;
    }

    if (tool === 'characters') {
      const hit = hitTestTokens(state.getAll().characters, pos, 52);
      if (hit) { if (!state.isLayerLocked('characters')) dragging = { layer: 'characters', uid: hit.uid, offsetX: pos.x - hit.x, offsetY: pos.y - hit.y }; return; }
      if (item && !state.isLayerLocked('characters')) {
        const r = state.addCharacter(item, pos.x - 26, pos.y - 26);
        r === 'max' ? showToast('¡Máximo 6 personajes en el mapa!', 'warning') : onUpdate();
      }
      return;
    }

    if (tool === 'enemies') {
      const hit = hitTestTokens(state.getAll().enemies, pos, 52);
      if (hit) { if (!state.isLayerLocked('enemies')) dragging = { layer: 'enemies', uid: hit.uid, offsetX: pos.x - hit.x, offsetY: pos.y - hit.y }; return; }
      if (item && !state.isLayerLocked('enemies')) {
        const r = state.addEnemy(item, pos.x - 26, pos.y - 26);
        r === 'max' ? showToast('¡Máximo 6 enemigos en el mapa!', 'warning') : onUpdate();
      }
      return;
    }
  });

  // ── Mouse Move ───────────────────────────────────────────
  canvas.addEventListener('mousemove', e => {
    if (isPanning) { doPan(e.clientX, e.clientY); return; }

    const pos  = getMapPos(canvas, e);
    const cell = posToCell(pos);
    renderer.hoverCell = cell;

    if (painting) {
      const tool = state.get('activeTool');
      const item = state.get('activeItem');
      if (tool === 'floor') {
        state.get('isErasing') ? state.eraseTile(cell.col, cell.row) : (item && state.paintTile(cell.col, cell.row, item));
        onUpdate();
      }
      return;
    }

    if (dragging) {
      const nx = pos.x - dragging.offsetX;
      const ny = pos.y - dragging.offsetY;
      if (dragging.layer === 'env')        state.moveEnvObject(dragging.uid, nx, ny);
      if (dragging.layer === 'characters') state.moveCharacter(dragging.uid, nx, ny);
      if (dragging.layer === 'enemies')    state.moveEnemy(dragging.uid, nx, ny);
      onUpdate();
    }
  });

  // ── Mouse Up ─────────────────────────────────────────────
  canvas.addEventListener('mouseup', e => {
    if (e.button === 1 || isPanning) { endPan(); return; }
    painting = false; dragging = null;
  });
  canvas.addEventListener('mouseleave', () => {
    if (isPanning) endPan();
    painting = false; dragging = null;
    renderer.hoverCell = null; onUpdate();
  });

  // ── Right Click (erase / delete) ─────────────────────────
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    const pos  = getMapPos(canvas, e);
    const tool = state.get('activeTool');
    if (tool === 'floor')      { const c = posToCell(pos); state.eraseTile(c.col, c.row); onUpdate(); }
    if (tool === 'env')        { const h = hitTestTokens(state.getAll().envObjects,  pos, 44); if (h) { state.removeEnvObject(h.uid);  onUpdate(); } }
    if (tool === 'characters') { const h = hitTestTokens(state.getAll().characters,  pos, 52); if (h) { state.removeCharacter(h.uid);   onUpdate(); } }
    if (tool === 'enemies')    { const h = hitTestTokens(state.getAll().enemies,     pos, 52); if (h) { state.removeEnemy(h.uid);       onUpdate(); } }
  });

  // ── Touch Pinch Zoom ────────────────────────────────────
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const vp = state.getAll().viewport;
      pinchStart = {
        dist: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY),
        zoom: vp.zoom,
        midX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        midY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchStart) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const factor = dist / pinchStart.dist;
      doZoom(pinchStart.midX, pinchStart.midY, factor / (state.getAll().viewport.zoom / pinchStart.zoom));
      pinchStart.dist = dist;
      pinchStart.zoom = state.getAll().viewport.zoom;
      return;
    }
    if (e.touches.length === 1) {
      const pos  = getMapPos(canvas, e);
      const cell = posToCell(pos);
      renderer.hoverCell = cell;
      if (painting) {
        const item = state.get('activeItem');
        state.get('isErasing') ? state.eraseTile(cell.col, cell.row) : (item && state.paintTile(cell.col, cell.row, item));
        onUpdate();
      }
      if (dragging) {
        const nx = pos.x - dragging.offsetX;
        const ny = pos.y - dragging.offsetY;
        if (dragging.layer === 'env')        state.moveEnvObject(dragging.uid, nx, ny);
        if (dragging.layer === 'characters') state.moveCharacter(dragging.uid, nx, ny);
        if (dragging.layer === 'enemies')    state.moveEnemy(dragging.uid, nx, ny);
        onUpdate();
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => { painting = false; dragging = null; pinchStart = null; });
}
