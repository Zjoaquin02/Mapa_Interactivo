// ============================================================
//  D&D Interactive Map Builder — Constants
// ============================================================

export const TILE_SIZE      = 64;
export const GRID_COLS      = 50;
export const GRID_ROWS      = 35;
export const MAX_HEROES     = 6;
export const MAX_ENEMIES    = 6;
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
];

// ── Environment Objects ───────────────────────────────────────
// sheetRow/sheetCol refer to position in assets/env_objects_new.png (4 cols × 3 rows)
export const ENV_OBJECTS = [
  // Original 8
  { id: 'tree',          label: 'Árbol',         icon: '🌲', color: '#2d6a2d', sheet: null },
  { id: 'rock',          label: 'Roca',           icon: '🪨', color: '#7a7a7a', sheet: null },
  { id: 'debris',        label: 'Escombros',      icon: '🪵', color: '#8b6340', sheet: null },
  { id: 'bush',          label: 'Arbusto',        icon: '🌿', color: '#3a7a3a', sheet: null },
  { id: 'bucket',        label: 'Balde',          icon: '🪣', color: '#a05020', sheet: null },
  { id: 'chest',         label: 'Cofre',          icon: '🧰', color: '#c08030', sheet: null },
  { id: 'barrel',        label: 'Barril',         icon: '🛢️', color: '#7a4020', sheet: null },
  { id: 'torch',         label: 'Antorcha',       icon: '🔥', color: '#e06020', sheet: null },
  // New 12 — use sheet image (4 cols × 3 rows)
  { id: 'wall',          label: 'Pared',          icon: '🧱', color: '#888899', sheet: { row: 0, col: 0 } },
  { id: 'pillar',        label: 'Pilar',          icon: '🏛️', color: '#9999aa', sheet: { row: 0, col: 1 } },
  { id: 'statue',        label: 'Estatua',        icon: '🗿', color: '#778877', sheet: { row: 0, col: 2 } },
  { id: 'campfire',      label: 'Fogata',         icon: '🏕️', color: '#dd6610', sheet: { row: 0, col: 3 } },
  { id: 'crystal',       label: 'Cristal',        icon: '💎', color: '#4455cc', sheet: { row: 1, col: 0 } },
  { id: 'trap',          label: 'Trampa',         icon: '🪤', color: '#885533', sheet: { row: 1, col: 1 } },
  { id: 'well',          label: 'Pozo',           icon: '⛲', color: '#667788', sheet: { row: 1, col: 2 } },
  { id: 'candelabra',    label: 'Candelabro',     icon: '🕯️', color: '#cc9933', sheet: { row: 1, col: 3 } },
  { id: 'mushroom',      label: 'Champiñón',      icon: '🍄', color: '#882299', sheet: { row: 2, col: 0 } },
  { id: 'sarcophagus',   label: 'Sarcófago',      icon: '⚰️', color: '#556655', sheet: { row: 2, col: 1 } },
  { id: 'chains',        label: 'Cadenas',        icon: '⛓️', color: '#887766', sheet: { row: 2, col: 2 } },
  { id: 'altar',         label: 'Altar',          icon: '🕌', color: '#331133', sheet: { row: 2, col: 3 } },
];

// ── Character Classes ─────────────────────────────────────────
// sheetRow/sheetCol: position in assets/characters_sheet.png (3 cols × 2 rows)
export const CHARACTER_CLASSES = [
  { id: 'warrior', label: 'Guerrero',        icon: '⚔️',  color: '#cc2222', border: '#ff4444', defaultHp: 40, sheetRow: 0, sheetCol: 0 },
  { id: 'mage',    label: 'Mago',            icon: '🔮',  color: '#7722cc', border: '#aa44ff', defaultHp: 24, sheetRow: 0, sheetCol: 1 },
  { id: 'healer',  label: 'Curador',         icon: '✨',  color: '#ccaa00', border: '#ffdd22', defaultHp: 32, sheetRow: 0, sheetCol: 2 },
  { id: 'ranger',  label: 'Explorador',      icon: '🏹',  color: '#228833', border: '#44cc55', defaultHp: 30, sheetRow: 1, sheetCol: 0 },
  { id: 'rogue',   label: 'Pícaro',          icon: '🗡️',  color: '#116677', border: '#22aacc', defaultHp: 28, sheetRow: 1, sheetCol: 1 },
  { id: 'monk',    label: 'Artista Marcial', icon: '👊',  color: '#cc6600', border: '#ff9922', defaultHp: 34, sheetRow: 1, sheetCol: 2 },
];

// ── Enemy Types ───────────────────────────────────────────────
// Original 6 use emoji; new 8 use enemies_new.png (4 cols × 2 rows)
export const ENEMY_TYPES = [
  // Original
  { id: 'goblin',   label: 'Goblin',          icon: '👺', color: '#226622', border: '#44aa44', defaultHp: 15, sheet: null },
  { id: 'orc',      label: 'Orco',            icon: '👹', color: '#553300', border: '#aa6600', defaultHp: 30, sheet: null },
  { id: 'skeleton', label: 'Esqueleto',       icon: '💀', color: '#777777', border: '#cccccc', defaultHp: 18, sheet: null },
  { id: 'dragon',   label: 'Dragón',          icon: '🐉', color: '#cc2200', border: '#ff4400', defaultHp: 80, sheet: null },
  { id: 'zombie',   label: 'Zombie',          icon: '🧟', color: '#335533', border: '#557755', defaultHp: 22, sheet: null },
  { id: 'demon',    label: 'Demonio',         icon: '😈', color: '#550011', border: '#cc0033', defaultHp: 50, sheet: null },
  // New 8 — from assets/enemies_new.png (4×2)
  { id: 'spider',   label: 'Araña Gigante',   icon: '🕷️', color: '#330044', border: '#aa33cc', defaultHp: 20, sheet: { row: 0, col: 0 } },
  { id: 'troll',    label: 'Troll',           icon: '🧌', color: '#1a4a1a', border: '#33aa33', defaultHp: 45, sheet: { row: 0, col: 1 } },
  { id: 'vampire',  label: 'Vampiro',         icon: '🧛', color: '#550022', border: '#cc2244', defaultHp: 55, sheet: { row: 0, col: 2 } },
  { id: 'warlock',  label: 'Hechicero Oscuro',icon: '🧙', color: '#1a1155', border: '#4433cc', defaultHp: 35, sheet: { row: 0, col: 3 } },
  { id: 'bandit',   label: 'Bandido',         icon: '🗡️', color: '#443322', border: '#997755', defaultHp: 15, sheet: { row: 1, col: 0 } },
  { id: 'werewolf', label: 'Hombre Lobo',     icon: '🐺', color: '#444455', border: '#aaaacc', defaultHp: 40, sheet: { row: 1, col: 1 } },
  { id: 'griffon',  label: 'Grifo',           icon: '🦅', color: '#664422', border: '#ddaa33', defaultHp: 38, sheet: { row: 1, col: 2 } },
  { id: 'lich',     label: 'Lich',            icon: '💀', color: '#111133', border: '#eeeeff', defaultHp: 65, sheet: { row: 1, col: 3 } },
];

// ── Layer Definitions ─────────────────────────────────────────
export const LAYERS = {
  FLOOR:      { id: 'floor',      label: 'Capa Piso',       icon: '🏔️', order: 0 },
  ENV:        { id: 'env',        label: 'Objetos Entorno', icon: '🌲', order: 1 },
  CHARACTERS: { id: 'characters', label: 'Personajes',      icon: '⚔️', order: 2 },
  ENEMIES:    { id: 'enemies',    label: 'Enemigos',        icon: '💀', order: 3 },
};
