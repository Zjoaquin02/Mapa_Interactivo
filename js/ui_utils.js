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
