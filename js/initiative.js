// ============================================================
//  D&D Interactive Map Builder — Initiative Panel
// ============================================================
import { state } from './state.js';
import { showToast } from './interactions.js';

const container = () => document.getElementById('initiative-list');
const roundEl   = () => document.getElementById('initiative-round');

function hpBarHtml(hp, maxHp) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const cls = pct > 60 ? 'hp-bar--high' : pct > 30 ? 'hp-bar--mid' : 'hp-bar--low';
  return `<div class="hp-bar"><div class="hp-bar__fill ${cls}" style="width:${pct}%"></div></div>`;
}

export function renderInitiativePanel() {
  const st = state.getAll();
  const { entries, currentIndex, round } = st.initiative;

  // Round counter
  const rEl = roundEl();
  if (rEl) rEl.textContent = `Ronda ${round}`;

  const list = container();
  if (!list) return;
  list.innerHTML = '';

  if (entries.length === 0) {
    list.innerHTML = `
      <div class="init-empty">
        <div style="font-size:32px">🎲</div>
        <div>Añade combatientes usando el botón de abajo, luego tira iniciativa.</div>
      </div>`;
    return;
  }

  entries.forEach((entry, i) => {
    const isActive = i === currentIndex;
    const row = document.createElement('div');
    row.className = `init-entry${isActive ? ' init-entry--active' : ''}`;
    row.dataset.uid = entry.uid;

    row.innerHTML = `
      <div class="init-pos">${i + 1}</div>
      <div class="init-token" style="background:${entry.color};border:2px solid ${entry.border};">
        ${entry.icon}
      </div>
      <div class="init-info">
        <div class="init-name">${entry.name}</div>
        <div class="init-type-badge init-type--${entry.type}">${entry.type === 'hero' ? '⚔️ Héroe' : '💀 Enemigo'}</div>
        ${hpBarHtml(entry.hp, entry.maxHp)}
        <div class="init-hp-row">
          <button class="init-hp-btn" data-uid="${entry.uid}" data-delta="-5" title="−5 HP">−5</button>
          <button class="init-hp-btn" data-uid="${entry.uid}" data-delta="-1" title="−1 HP">−1</button>
          <span class="init-hp-val">${entry.hp} / <input type="number" class="init-max-hp-input" data-uid="${entry.uid}" value="${entry.maxHp}" title="HP Máximo" min="1"></span>
          <button class="init-hp-btn" data-uid="${entry.uid}" data-delta="+1" title="+1 HP">+1</button>
          <button class="init-hp-btn" data-uid="${entry.uid}" data-delta="+5" title="+5 HP">+5</button>
        </div>
      </div>
      <div class="init-roll-col">
        <div class="init-roll-controls">
          <button class="init-mod-btn" data-uid="${entry.uid}" data-delta="-1" title="−1 Iniciativa">▼</button>
          <div class="init-roll ${entry.roll !== null ? 'init-roll--set' : ''}">${entry.roll ?? '—'}</div>
          <button class="init-mod-btn" data-uid="${entry.uid}" data-delta="1" title="+1 Iniciativa">▲</button>
        </div>
        <div class="init-roll-actions">
          <button class="init-roll-btn" data-uid="${entry.uid}" title="Tirar d20">🎲</button>
          <button class="init-remove-btn" data-uid="${entry.uid}" title="Quitar">✕</button>
        </div>
      </div>`;

    list.appendChild(row);
  });

  // HP buttons
  list.querySelectorAll('.init-hp-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const uid   = +btn.dataset.uid;
      const delta = +btn.dataset.delta;
      const entry = state.getAll().initiative.entries.find(e => e.uid === uid);
      if (entry) state.setEntryHp(uid, entry.hp + delta);
    });
  });

  // Max HP input
  list.querySelectorAll('.init-max-hp-input').forEach(inp => {
    inp.addEventListener('click', e => e.stopPropagation()); // prevent row selection if active was implemented
    inp.addEventListener('change', () => {
      const uid = +inp.dataset.uid;
      const maxHp = parseInt(inp.value, 10);
      if (!isNaN(maxHp) && maxHp > 0) state.setEntryMaxHp(uid, maxHp);
    });
  });

  // Initiative modifiers (+1 / -1)
  list.querySelectorAll('.init-mod-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.modInitiativeRoll(+btn.dataset.uid, +btn.dataset.delta);
    });
  });

  // Roll individual
  list.querySelectorAll('.init-roll-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const roll = Math.floor(Math.random() * 20) + 1;
      state.setInitiativeRoll(+btn.dataset.uid, roll);
    });
  });

  // Remove
  list.querySelectorAll('.init-remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.removeFromInitiative(+btn.dataset.uid);
    });
  });
}

export function bindInitiativeControls() {
  document.getElementById('btn-init-sync')?.addEventListener('click', () => {
    state.syncInitiativeFromMap();
    showToast('Combatientes sincronizados desde el mapa', 'info');
  });

  document.getElementById('btn-init-roll-all')?.addEventListener('click', () => {
    if (state.getAll().initiative.entries.length === 0) {
      showToast('Primero añade combatientes', 'warning'); return;
    }
    state.rollAllInitiative();
    showToast('¡Iniciativa lanzada! El combate comienza 🎲', 'info');
  });

  document.getElementById('btn-init-next')?.addEventListener('click', () => state.nextTurn());
  document.getElementById('btn-init-prev')?.addEventListener('click', () => state.prevTurn());

  document.getElementById('btn-init-clear')?.addEventListener('click', () => {
    if (confirm('¿Limpiar toda la iniciativa?')) state.clearInitiative();
  });

  // Subscribe to updates
  state.subscribe((key) => {
    if (key === 'initiative' || key === 'all') renderInitiativePanel();
  });

  // Initial render
  renderInitiativePanel();
}
