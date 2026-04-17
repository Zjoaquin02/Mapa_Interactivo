// ============================================================
//  D&D Interactive Map Builder — Map Slots Panel
// ============================================================
import { state, getSlots, deleteSlot } from './state.js';
import { PRESETS } from './presets.js';
import { showToast } from './interactions.js';

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Hace un momento';
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h/24)}d`;
}

function tileCount(slotData) {
  try {
    const d = JSON.parse(slotData);
    return Object.keys(d.floorGrid || {}).length;
  } catch { return 0; }
}

export function renderMapSlots() {
  const container = document.getElementById('map-slots-list');
  if (!container) return;

  const slots = getSlots();
  container.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const slot = slots[i];
    const card = document.createElement('div');
    card.className = `slot-card${slot ? ' slot-card--used' : ' slot-card--empty'}`;

    if (slot) {
      const tiles = tileCount(slot.data);
      card.innerHTML = `
        <div class="slot-header">
          <span class="slot-index">${i + 1}</span>
          <span class="slot-name-display">${slot.name}</span>
        </div>
        <div class="slot-meta">
          <span>🗺️ ${tiles} baldosas</span>
          <span>${timeAgo(slot.timestamp)}</span>
        </div>
        <div class="slot-actions">
          <button class="slot-btn slot-btn--load"   data-i="${i}" title="Cargar este mapa">📂 Cargar</button>
          <button class="slot-btn slot-btn--save"   data-i="${i}" title="Sobreescribir con el mapa actual">💾 Guardar</button>
          <button class="slot-btn slot-btn--delete" data-i="${i}" title="Borrar slot">🗑️</button>
        </div>`;
    } else {
      card.innerHTML = `
        <div class="slot-header">
          <span class="slot-index">${i + 1}</span>
          <span class="slot-name-display slot-empty-label">Slot vacío</span>
        </div>
        <div class="slot-meta"><span>Sin datos</span></div>
        <div class="slot-actions">
          <button class="slot-btn slot-btn--save" data-i="${i}" title="Guardar mapa actual aquí">💾 Guardar aquí</button>
        </div>`;
    }

    container.appendChild(card);
  }

  // Divider for presets
  const divider = document.createElement('div');
  divider.className = 'rpanel-section-title';
  divider.style.marginTop = '10px';
  divider.style.flexShrink = '0';
  divider.innerHTML = '✨ Mapas de Plantilla';
  container.appendChild(divider);

  const pstHint = document.createElement('p');
  pstHint.style = 'font-size:11px;color:var(--text-secondary);padding:0 12px 10px;line-height:1.5;flex-shrink:0;';
  pstHint.innerHTML = 'Modelos prearmados. Cárgalos y luego guárdalos en tus propios slots si deseas.';
  container.appendChild(pstHint);

  // Render presets
  PRESETS.forEach((preset, presetIdx) => {
    const card = document.createElement('div');
    card.className = 'slot-card slot-card--used';
    card.style.borderColor = 'rgba(232,184,72,0.3)';
    
    card.innerHTML = `
      <div class="slot-header">
        <span class="slot-index" style="background:rgba(232,184,72,0.15);color:var(--gold);border-color:rgba(232,184,72,0.3)">✦</span>
        <span class="slot-name-display" style="color:var(--gold)">${preset.name}</span>
      </div>
      <div class="slot-actions">
        <button class="slot-btn slot-btn--load preset-load-btn" data-pi="${presetIdx}" style="width:100%">📂 Cargar Modelo</button>
      </div>`;
    container.appendChild(card);
  });

  // Bind Load (User Slots)
  container.querySelectorAll('.slot-btn--load').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      if (!confirm(`¿Cargar el slot ${i + 1}? Los cambios no guardados se perderán.`)) return;
      if (state.loadFromSlot(i)) {
        showToast(`Mapa "${getSlots()[i]?.name}" cargado`, 'info');
        renderMapSlots();
      }
    });
  });

  // Bind Load Presets
  container.querySelectorAll('.preset-load-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pi = +btn.dataset.pi;
      if (!confirm(`¿Cargar la plantilla "${PRESETS[pi].name}"? Los cambios no guardados se perderán.`)) return;
      const presetState = PRESETS[pi].generate();
      state.loadPreset(presetState);
      showToast(`Plantilla "${PRESETS[pi].name}" cargada`, 'info');
      renderMapSlots();
    });
  });

  // Bind Save
  container.querySelectorAll('.slot-btn--save').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      const slots = getSlots();
      const existing = slots[i];
      if (existing && !confirm(`¿Sobreescribir "${existing.name}"?`)) return;
      const name = prompt('Nombre del mapa:', existing?.name || `Mapa ${i + 1}`) || `Mapa ${i + 1}`;
      state.saveToSlot(i, name);
      showToast(`Mapa guardado en slot ${i + 1} ✅`, 'info');
      renderMapSlots();
    });
  });

  // Bind Delete
  container.querySelectorAll('.slot-btn--delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      if (!confirm(`¿Borrar el slot ${i + 1}?`)) return;
      deleteSlot(i);
      showToast(`Slot ${i + 1} eliminado`, 'warning');
      renderMapSlots();
    });
  });
}

export function bindMapSlotControls() {
  // Refresh the panel when shown
  document.getElementById('rpanel-tab-maps')?.addEventListener('click', renderMapSlots);

  // Subscribe: re-render if map name changes
  state.subscribe(key => {
    if (key === 'mapName') renderMapSlots();
  });

  renderMapSlots();

  // ── JSON Export/Import ────────────────────────────────────
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const rawData = state.getAll();
    const dataStr = JSON.stringify(rawData);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    let title = rawData.mapName || 'Mapa';
    title = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${title}.json`;
    link.href = url;
    link.click();
    showToast('Archivo JSON descargado exitosamente.', 'info');
  });

  const importInput = document.getElementById('input-import-json');
  document.getElementById('btn-import-json')?.addEventListener('click', () => {
    importInput?.click();
  });

  importInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const jsonData = JSON.parse(ev.target.result);
        if (!confirm('¿Cargar este archivo JSON? Perderás cualquier progreso actual que no se haya guardado.')) return;
        state.loadPreset(jsonData);
        showToast('Mapa cargado desde tu PC con éxito.', 'info');
        renderMapSlots();
      } catch (err) {
        showToast('El archivo JSON está corrupto o es inválido.', 'warning');
      }
      importInput.value = ''; // Reset input to allow selecting the same file again
    };
    reader.readAsText(file);
  });
}
