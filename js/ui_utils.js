/**
 * D&D MapForge — UI Utilities
 * Helper functions for UI feedback.
 */

export function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  container.appendChild(t);

  setTimeout(() => t.classList.add('toast--visible'), 10);
  setTimeout(() => {
    t.classList.remove('toast--visible');
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

export function renderEnemyList(container, enemies, onSelect, onToggleGroup, activeId, expandedGroups = []) {
  if (!container) return;
  container.innerHTML = '';

  enemies.forEach(enemy => {
    // If it's a group, we render a header and potentially a variant grid
    if (enemy.isGroup) {
      const isExpanded = expandedGroups.includes(enemy.id);
      
      const groupEl = document.createElement('div');
      groupEl.className = 'enemy-group';

      const header = document.createElement('button');
      header.className = `group-header ${isExpanded ? 'expanded' : ''}`;
      header.innerHTML = `
        <div class="tome-icon"></div>
        <span class="char-name">${enemy.label}</span>
        <span class="group-chevron">▼</span>
      `;
      header.addEventListener('click', () => onToggleGroup(enemy.id));
      groupEl.appendChild(header);

      if (isExpanded && enemy.variants) {
        const grid = document.createElement('div');
        grid.className = 'variant-grid visible';
        
        enemy.variants.forEach(variant => {
          const vBtn = createEnemyButton(variant, onSelect, activeId);
          vBtn.classList.add('variant-btn');
          grid.appendChild(vBtn);
        });
        
        groupEl.appendChild(grid);
      } else if (isExpanded && !enemy.variants) {
        // Loading state or empty
        const loading = document.createElement('div');
        loading.className = 'panel-hint';
        loading.style.padding = '10px';
        loading.textContent = 'Cargando variantes...';
        groupEl.appendChild(loading);
      }

      container.appendChild(groupEl);
    } else {
      // Normal single enemy
      const btn = createEnemyButton(enemy, onSelect, activeId);
      container.appendChild(btn);
    }
  });
}

function createEnemyButton(enemy, onSelect, activeId) {
  const btn = document.createElement('button');
  btn.className = 'item-btn char-btn';
  if (activeId === enemy.id) btn.classList.add('active');
  btn.dataset.id = enemy.id;
  btn.style.setProperty('--item-color', enemy.color || '#444');

  const infoLink = document.createElement('a');
  infoLink.className = 'info-link';
  const bestiaryId = enemy.parentGroup || enemy.id;
  infoLink.href = `https://zjoaquin02.github.io/Bestiary-D-D/criatura.html?id=${bestiaryId}`;
  infoLink.target = '_blank';
  infoLink.title = 'Ver en el Bestiario';
  infoLink.addEventListener('click', (e) => e.stopPropagation());
  btn.appendChild(infoLink);

  const iconSpan = document.createElement('span');
  iconSpan.className = 'char-icon';
  iconSpan.textContent = enemy.icon || '💀';
  btn.appendChild(iconSpan);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'char-info';
  
  const nameSpan = document.createElement('span');
  nameSpan.className = 'char-name';
  nameSpan.textContent = enemy.label;
  infoDiv.appendChild(nameSpan);

  const hintSpan = document.createElement('span');
  hintSpan.className = 'char-hint';
  hintSpan.textContent = `${enemy.type === 'boss' ? 'Jefe' : 'Monstruo'} · ${enemy.defaultHp} HP`;
  infoDiv.appendChild(hintSpan);

  btn.appendChild(infoDiv);

  btn.addEventListener('click', () => {
    onSelect(enemy.id);
  });

  return btn;
}
