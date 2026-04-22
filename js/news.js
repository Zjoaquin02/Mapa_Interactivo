// ============================================================
// D&D MapForge — Announcements System
// ============================================================

export const NEWS_CONFIG = {
  /** 
   * CONTROL DE VISIBILIDAD
   * 1 = Mostrar anuncios
   * 0 = Ocultar anuncios (completamente invisible)
   */
  showNews: 1,

  title: "📢 Novedades y Actualizaciones",

  /**
   * LISTA DE ANUNCIOS
   * Puedes usar HTML (<strong>, 🎨, etc.) para dar estilo.
   */
  items: [
    "📍 <strong>Sistema de Pings:</strong> ¡Ya disponible! Usa <strong>Alt+Clic</strong> para señalar puntos en el mapa.",
    "⚪ <strong>Pings de Contraste:</strong> Usa <strong>Shift+Alt+Clic</strong> para pings blancos en suelos oscuros.",
    "🎨 <strong>Color Personalizado:</strong> ¡Pinta con cualquier color! Busca el selector al final del panel de Piso.",
    "🛡️ <strong>Multiplayer Pro:</strong> Mejorada la estabilidad de conexión entre DM y Héroes.",
    "🚀 <strong>Rendimiento:</strong> Optimización de renderizado para mapas de gran escala."
  ]
};
