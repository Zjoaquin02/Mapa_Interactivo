// ============================================================
// D&D Interactive Map Builder — Presets Generator
// ============================================================
import { GRID_COLS, GRID_ROWS } from './constants.js';

// Base generator
function createBaseState(name) {
  return {
    activeTool: 'floor', activeItem: null, isErasing: false,
    mapName: name,
    viewport: { zoom: 0.8, panX: 40, panY: 40 },
    layers: {
      floor: { locked: false, visible: true },
      env: { locked: false, visible: true },
      characters: { locked: false, visible: true },
      enemies: { locked: false, visible: true },
    },
    floorGrid: {},
    envObjects: [], characters: [], enemies: [],
    initiative: { entries: [], currentIndex: -1, round: 1 },
    _uidCounter: 1000
  };
}

// Helpers
function addRect(grid, col1, row1, w, h, tile) {
  for (let r = row1; r < row1 + h; r++) {
    for (let c = col1; c < col1 + w; c++) {
      grid[`${c},${r}`] = tile;
    }
  }
}
function addCircle(grid, col, row, radius, tile) {
  for (let r = row - radius; r <= row + radius; r++) {
    for (let c = col - radius; c <= col + radius; c++) {
      if ((c-col)**2 + (r-row)**2 <= radius**2) grid[`${c},${r}`] = tile;
    }
  }
}
function addObj(st, type, x, y) {
  st.envObjects.push({ uid: ++st._uidCounter, type, x, y });
}

export const PRESETS = [
  {
    id: 'camp', name: '🏕️ Campamento Bosque',
    generate: () => {
      const st = createBaseState('Campamento en el Bosque');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'grass');
      addCircle(st.floorGrid, 25, 17, 7, 'dirt');
      addCircle(st.floorGrid, 25, 17, 2, 'mud');
      
      // Campfire
      addObj(st, 'campfire', 25 * 64, 17 * 64);
      addObj(st, 'rock', 24 * 64, 16 * 64);
      addObj(st, 'debris', 26 * 64, 18 * 64);

      // Trees
      for (let i=0; i<30; i++) {
        let x = Math.random() * 50; let y = Math.random() * 35;
        if ((x-25)**2 + (y-17)**2 > 100) addObj(st, 'tree', x*64, y*64);
      }
      return st;
    }
  },
  {
    id: 'village', name: '🏘️ Aldea Pequeña',
    generate: () => {
      const st = createBaseState('Aldea Pequeña');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'grass');
      // Main road
      addRect(st.floorGrid, 0, 16, 50, 4, 'dirt');
      addRect(st.floorGrid, 20, 0, 4, 35, 'dirt');
      // Plaza
      addCircle(st.floorGrid, 22, 18, 5, 'stone');
      addObj(st, 'well', 21.5 * 64, 17.5 * 64);

      // Houses (Wood floor + walls)
      const houses = [
        { c: 8, r: 8, w: 8, h: 6 }, { c: 30, r: 8, w: 6, h: 6 },
        { c: 8, r: 24, w: 7, h: 5 }, { c: 32, r: 22, w: 9, h: 8 }
      ];
      houses.forEach(h => {
        addRect(st.floorGrid, h.c, h.r, h.w, h.h, 'wood');
        addObj(st, 'barrel', (h.c - 1)*64, h.r*64);
      });
      return st;
    }
  },
  {
    id: 'bridge', name: '🌉 Puente sobre Río',
    generate: () => {
      const st = createBaseState('Puente sobre Río');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'grass');
      // River
      for (let r=0; r<GRID_ROWS; r++) {
        let offset = Math.floor(Math.sin(r * 0.2) * 3);
        addRect(st.floorGrid, 20 + offset, r, 8, 1, 'water');
        addRect(st.floorGrid, 19 + offset, r, 1, 1, 'sand');
        addRect(st.floorGrid, 28 + offset, r, 1, 1, 'sand');
      }
      // Bridge
      addRect(st.floorGrid, 16, 15, 16, 4, 'wood');
      addObj(st, 'torch', 16*64, 14*64); addObj(st, 'torch', 31*64, 14*64);
      addObj(st, 'torch', 16*64, 19*64); addObj(st, 'torch', 31*64, 19*64);
      return st;
    }
  },
  {
    id: 'dungeon', name: '🧱 Mazmorra Clásica',
    generate: () => {
      const st = createBaseState('Mazmorra Clásica');
      
      // We don't fill the entire base with dungeon; we leave the void (black).
      
      // Room 1: Entrance Hall
      addRect(st.floorGrid, 20, 28, 10, 6, 'dungeon');
      addObj(st, 'statue', 21*64, 29*64);
      addObj(st, 'statue', 28*64, 29*64);
      addObj(st, 'torch', 21*64, 32*64);
      addObj(st, 'torch', 28*64, 32*64);

      // Corridor 1 (North to Main Chamber)
      addRect(st.floorGrid, 23, 20, 4, 8, 'dungeon');
      addObj(st, 'torch', 23*64, 24*64);
      addObj(st, 'torch', 26*64, 24*64);

      // Room 2: Main Chamber
      addRect(st.floorGrid, 18, 10, 14, 10, 'luxury');
      addObj(st, 'altar', 24*64, 12*64);
      [11, 14, 17].forEach(y => {
        addObj(st, 'pillar', 19*64, y*64);
        addObj(st, 'pillar', 30*64, y*64);
      });
      addObj(st, 'candelabra', 22*64, 11*64);
      addObj(st, 'candelabra', 27*64, 11*64);

      // Corridor 2 (West to Vault)
      addRect(st.floorGrid, 10, 13, 8, 4, 'dungeon');
      
      // Room 3: Treasure Vault
      addRect(st.floorGrid, 2, 11, 8, 8, 'stone');
      addObj(st, 'chest', 3*64, 12*64);
      addObj(st, 'chest', 5*64, 12*64);
      addObj(st, 'chest', 4*64, 14*64); // classic triangle of chests
      addObj(st, 'torch', 2*64, 15*64);
      addObj(st, 'trap', 6*64, 15*64);

      // Corridor 3 (East to Prison)
      addRect(st.floorGrid, 32, 13, 8, 4, 'dungeon');

      // Room 4: Prison / Crypt
      addRect(st.floorGrid, 40, 9, 8, 12, 'dirt');
      addObj(st, 'sarcophagus', 42*64, 10*64);
      addObj(st, 'sarcophagus', 45*64, 10*64);
      addObj(st, 'chains', 41*64, 14*64);
      addObj(st, 'chains', 41*64, 17*64);
      addObj(st, 'chains', 46*64, 16*64);
      addObj(st, 'debris', 45*64, 19*64);
      addObj(st, 'torch', 43*64, 15*64);
      
      return st;
    }
  },
  {
    id: 'cave', name: '🦇 Cueva de Cristal',
    generate: () => {
      const st = createBaseState('Cueva de Cristal');
      // Base rock
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'stone');
      addCircle(st.floorGrid, 25, 17, 12, 'dirt');
      addCircle(st.floorGrid, 25, 17, 6, 'mud');
      
      // Crystals and mushrooms
      for(let i=0; i<40; i++) {
        let x = Math.random() * 45 + 2; let y = Math.random() * 30 + 2;
        let type = Math.random() > 0.5 ? 'crystal' : 'mushroom';
        if (Math.random() > 0.7) type = 'rock';
        addObj(st, type, x*64, y*64);
      }
      return st;
    }
  },
  {
    id: 'ruins', name: '🏛️ Ruinas del Desierto',
    generate: () => {
      const st = createBaseState('Ruinas del Desierto');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'sand');
      addCircle(st.floorGrid, 25, 17, 10, 'dirt');
      
      // Temple layout
      addRect(st.floorGrid, 20, 10, 10, 15, 'stone');
      addObj(st, 'altar', 24*64, 12*64);
      
      // Pillars
      [11, 15, 19, 23].forEach(y => {
        addObj(st, 'pillar', 19*64, y*64);
        addObj(st, 'pillar', 30*64, y*64);
      });
      
      for(let i=0;i<15;i++) {
        addObj(st, 'debris', (Math.random()*40+5)*64, (Math.random()*30+2)*64);
      }
      
      return st;
    }
  },
  {
    id: 'swamp', name: '🧪 Pantano Tóxico',
    generate: () => {
      const st = createBaseState('Pantano Tóxico');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'mud');
      
      for(let i = 0; i < 8; i++) {
        addCircle(st.floorGrid, Math.floor(Math.random()*40+5), Math.floor(Math.random()*25+5), Math.floor(Math.random()*3+2), 'toxic');
      }
      
      for(let i=0; i<25; i++) {
        let x = Math.random() * 45 + 2; let y = Math.random() * 30 + 2;
        addObj(st, 'tree', x*64, y*64);
        addObj(st, 'bush', (x+1)*64, (y+1)*64);
      }
      return st;
    }
  },
  {
    id: 'city', name: '🛣️ Calles Adoquinadas',
    generate: () => {
      const st = createBaseState('Calles Adoquinadas');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'grass');
      
      // Main crossroad
      addRect(st.floorGrid, 0, 16, 50, 4, 'cobble');
      addRect(st.floorGrid, 23, 0, 4, 35, 'cobble');
      
      // Central plaza
      addCircle(st.floorGrid, 25, 18, 5, 'cobble');
      addObj(st, 'statue', 24.5*64, 16.5*64);
      
      // Buildings
      addRect(st.floorGrid, 5, 5, 12, 8, 'wood');
      addRect(st.floorGrid, 33, 5, 12, 8, 'wood');
      addRect(st.floorGrid, 5, 25, 12, 8, 'wood');
      addRect(st.floorGrid, 33, 25, 12, 8, 'wood');
      
      addObj(st, 'barrel', 17*64, 12*64);
      addObj(st, 'barrel', 17*64, 11*64);
      addObj(st, 'barrel', 32*64, 26*64);
      
      return st;
    }
  },
  {
    id: 'ritual', name: '🔮 El Vacío Arcano',
    generate: () => {
      const st = createBaseState('El Vacío Arcano');
      addRect(st.floorGrid, 0, 0, GRID_COLS, GRID_ROWS, 'void');
      
      // Floating platform
      addCircle(st.floorGrid, 25, 17, 10, 'magic');
      addCircle(st.floorGrid, 25, 17, 4, 'luxury');
      
      addObj(st, 'crystal', 24.5 * 64, 16.5 * 64);
      
      // Outer pillars
      addObj(st, 'pillar', 16 * 64, 17 * 64);
      addObj(st, 'pillar', 34 * 64, 17 * 64);
      addObj(st, 'pillar', 25 * 64, 8 * 64);
      addObj(st, 'pillar', 25 * 64, 26 * 64);
      
      return st;
    }
  }
];
