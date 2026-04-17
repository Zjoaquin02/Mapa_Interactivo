// ============================================================
//  D&D Interactive Map Builder — Constants
// ============================================================

export const TILE_SIZE      = 64;
export const GRID_COLS      = 50;
export const GRID_ROWS      = 35;
export const MAX_HEROES     = 6;
export const MAX_ENEMIES    = 30;
export const MAP_SLOT_COUNT = 6;
export const ZOOM_MIN       = 0.15;
export const ZOOM_MAX       = 3.0;

// ── Terrain Tiles ─────────────────────────────────────────────
export const TERRAINS = [
  { id: 'snow',    label: 'Nieve',             color: '#b8d4e8' },
  { id: 'sand',    label: 'Arena',             color: '#d4a85a' },
  { id: 'grass',   label: 'Pasto',             color: '#4a7c3f' },
  { id: 'dungeon', label: 'Mazmorra',          color: '#555566' },
  { id: 'water',   label: 'Agua',              color: '#2255aa' },
  { id: 'wood',    label: 'Madera',            color: '#8b5e3c' },
  { id: 'mud',     label: 'Barro',             color: '#5c3d1e' },
  { id: 'luxury',  label: 'Azulejos Lujosos',  color: '#1a1a4e' },
  { id: 'lava',    label: 'Lava',              color: '#cc4400' },
  { id: 'ice',     label: 'Hielo',             color: '#99eebb' },
  { id: 'dirt',    label: 'Tierra Seca',       color: '#776655' },
  { id: 'stone',   label: 'Piedra',            color: '#889999' },
  { id: 'toxic',   label: 'Pantano Tóxico',    color: '#44aa22' },
  { id: 'void',    label: 'Abismo Astral',     color: '#110022' },
  { id: 'cobble',  label: 'Adoquines',         color: '#555555' },
  { id: 'magic',   label: 'Suelo Arcano',      color: '#441188' },
];

// ── Environment Objects ───────────────────────────────────────
export const ENV_OBJECTS = [
  { id: 'tree',          label: 'Árbol',         icon: '🌲', color: '#2d6a2d', hasImage: true },
  { id: 'rock',          label: 'Roca',           icon: '🪨', color: '#7a7a7a', hasImage: true },
  { id: 'debris',        label: 'Escombros',      icon: '🪵', color: '#8b6340', hasImage: true },
  { id: 'bush',          label: 'Arbusto',        icon: '🌿', color: '#3a7a3a', hasImage: true },
  { id: 'bucket',        label: 'Balde',          icon: '🪣', color: '#a05020', hasImage: false },
  { id: 'chest',         label: 'Cofre',          icon: '🧰', color: '#c08030', hasImage: false },
  { id: 'barrel',        label: 'Barril',         icon: '🛢️', color: '#7a4020', hasImage: false },
  { id: 'torch',         label: 'Antorcha',       icon: '🔥', color: '#e06020', hasImage: false },
  { id: 'wall',          label: 'Pared',          icon: '🧱', color: '#888899', hasImage: false },
  { id: 'pillar',        label: 'Pilar',          icon: '🏛️', color: '#9999aa', hasImage: false },
  { id: 'statue',        label: 'Estatua',        icon: '🗿', color: '#778877', hasImage: false },
  { id: 'campfire',      label: 'Fogata',         icon: '🏕️', color: '#dd6610', hasImage: false },
  { id: 'crystal',       label: 'Cristal',        icon: '💎', color: '#4455cc', hasImage: false },
  { id: 'trap',          label: 'Trampa',         icon: '🪤', color: '#885533', hasImage: false },
  { id: 'well',          label: 'Pozo',           icon: '⛲', color: '#667788', hasImage: false },
  { id: 'candelabra',    label: 'Candelabro',     icon: '🕯️', color: '#cc9933', hasImage: false },
  { id: 'mushroom',      label: 'Champiñón',      icon: '🍄', color: '#882299', hasImage: false },
  { id: 'sarcophagus',   label: 'Sarcófago',      icon: '⚰️', color: '#556655', hasImage: false },
  { id: 'chains',        label: 'Cadenas',        icon: '⛓️', color: '#887766', hasImage: false },
  { id: 'altar',         label: 'Altar',          icon: '🕌', color: '#331133', hasImage: false },
];

// ── Character Classes ─────────────────────────────────────────
export const CHARACTER_CLASSES = [
  { id: 'warrior', label: 'Guerrero',        icon: '⚔️',  color: '#cc2222', border: '#ff4444', defaultHp: 40, hasImage: false },
  { id: 'mage',    label: 'Mago',            icon: '🔮',  color: '#7722cc', border: '#aa44ff', defaultHp: 24, hasImage: false },
  { id: 'cleric',  label: 'Clérigo',         icon: '✨',  color: '#ccaa00', border: '#ffdd22', defaultHp: 32, hasImage: false },
  { id: 'ranger',  label: 'Explorador',      icon: '🏹',  color: '#228833', border: '#44cc55', defaultHp: 30, hasImage: false },
  { id: 'rogue',   label: 'Pícaro',          icon: '🗡️',  color: '#116677', border: '#22aacc', defaultHp: 28, hasImage: false },
  { id: 'monk',    label: 'Artista Marcial', icon: '👊',  color: '#cc6600', border: '#ff9922', defaultHp: 34, hasImage: false },
  // Nuevas clases usando emojis
  { id: 'druid',     label: 'Druida',        icon: '🐻',  color: '#2d882d', border: '#44cc44', defaultHp: 32 },
  { id: 'paladin',   label: 'Paladín',       icon: '🛡️',  color: '#ccccaa', border: '#eeeedd', defaultHp: 45 },
  { id: 'bard',      label: 'Bardo',         icon: '🎸',  color: '#cc22aa', border: '#ff44dd', defaultHp: 28 },
  { id: 'barbarian', label: 'Bárbaro',       icon: '🪓',  color: '#aa3311', border: '#dd4422', defaultHp: 50 },
  { id: 'warlock_hero',label: 'Brujo',       icon: '🧿',  color: '#331144', border: '#551177', defaultHp: 30 },
  { id: 'sorcerer',  label: 'Hechicero',     icon: '⚡',  color: '#1155aa', border: '#2288ff', defaultHp: 24 },
  { id: 'artificer', label: 'Artífice',      icon: '⚙️',  color: '#aa6611', border: '#ffaa33', defaultHp: 30 },
];

// ── Enemy Types ───────────────────────────────────────────────
export const ENEMY_TYPES = [
  // Original
  { id: 'goblin',   label: 'Goblin',          icon: '👺', color: '#226622', border: '#44aa44', defaultHp: 15 },
  { id: 'orc',      label: 'Orco',            icon: '👹', color: '#553300', border: '#aa6600', defaultHp: 30 },
  { id: 'skeleton', label: 'Esqueleto',       icon: '💀', color: '#777777', border: '#cccccc', defaultHp: 18 },
  { id: 'dragon',   label: 'Dragón',          icon: '🐉', color: '#cc2200', border: '#ff4400', defaultHp: 80 },
  { id: 'zombie',   label: 'Zombie',          icon: '🧟', color: '#335533', border: '#557755', defaultHp: 22 },
  { id: 'demon',    label: 'Demonio',         icon: '😈', color: '#550011', border: '#cc0033', defaultHp: 50 },
  // Nuevos 8 (imágenes individuales)
  { id: 'spider',   label: 'Araña Gigante',   icon: '🕷️', color: '#330044', border: '#aa33cc', defaultHp: 20, hasImage: true },
  { id: 'troll',    label: 'Troll',           icon: '🧌', color: '#1a4a1a', border: '#33aa33', defaultHp: 45, hasImage: true },
  { id: 'vampire',  label: 'Vampiro',         icon: '🧛', color: '#550022', border: '#cc2244', defaultHp: 55, hasImage: true },
  { id: 'warlock',  label: 'Hechicero Oscuro',icon: '🧙', color: '#1a1155', border: '#4433cc', defaultHp: 35, hasImage: true },
  { id: 'bandit',   label: 'Bandido',         icon: '🗡️', color: '#443322', border: '#997755', defaultHp: 15, hasImage: true },
  { id: 'werewolf', label: 'Hombre Lobo',     icon: '🐺', color: '#444455', border: '#aaaacc', defaultHp: 40, hasImage: true },
  { id: 'griffon',  label: 'Grifo',           icon: '🦅', color: '#664422', border: '#ddaa33', defaultHp: 38, hasImage: true },
  { id: 'lich',     label: 'Lich',            icon: '💀', color: '#111133', border: '#eeeeff', defaultHp: 65, hasImage: true },
];

// ── Layer Definitions ─────────────────────────────────────────
export const LAYERS = {
  FLOOR:      { id: 'floor',      label: 'Capa Piso',       icon: '🏔️', order: 0 },
  ENV:        { id: 'env',        label: 'Objetos Entorno', icon: '🌲', order: 1 },
  CHARACTERS: { id: 'characters', label: 'Personajes',      icon: '⚔️', order: 2 },
  ENEMIES:    { id: 'enemies',    label: 'Enemigos',        icon: '💀', order: 3 },
  FOG:        { id: 'fog',        label: 'Capa Niebla',     icon: '🌫️', order: 4 },
};
