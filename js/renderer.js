// ============================================================
//  D&D Interactive Map Builder — Renderer (Viewport + Sprites)
// ============================================================
import { TILE_SIZE, GRID_COLS, GRID_ROWS, ENV_OBJECTS, CHARACTER_CLASSES, ENEMY_TYPES } from './constants.js';
import { state } from './state.js';

// ── Preload sprite sheets ─────────────────────────────────
function loadImg(src) {
  const img = new Image();
  img.src = src;
  return img;
}
const SHEETS = {
  chars:      loadImg('assets/characters_sheet.png'),   // 3 cols × 2 rows
  enemiesNew: loadImg('assets/enemies_new.png'),         // 4 cols × 2 rows
  envNew:     loadImg('assets/env_objects_new.png'),     // 4 cols × 3 rows
};

// ── Tile colours ──────────────────────────────────────────
const TC = {
  snow:    { bg: '#d4ecf7', fg: '#a8d5e8', accent: '#f0f8ff' },
  sand:    { bg: '#e8c97a', fg: '#d4a855', accent: '#f0dda0' },
  grass:   { bg: '#4a9c3f', fg: '#3a7c30', accent: '#5ab04f' },
  dungeon: { bg: '#44444f', fg: '#333340', accent: '#55555f' },
  water:   { bg: '#2255cc', fg: '#1a44aa', accent: '#3366dd' },
  wood:    { bg: '#8b6040', fg: '#6b4828', accent: '#a07050' },
  mud:     { bg: '#6b4520', fg: '#4a2e10', accent: '#7b5530' },
  luxury:  { bg: '#1a1a6e', fg: '#12124a', accent: '#2a2a8e' },
  lava:    { bg: '#cc3300', fg: '#ff5500', accent: '#ffaa00' },
  ice:     { bg: '#99eebb', fg: '#cceeff', accent: '#ffffff' },
  dirt:    { bg: '#776655', fg: '#554433', accent: '#998877' },
  stone:   { bg: '#889999', fg: '#667777', accent: '#aabbbb' },
};

// ── Tile drawing ──────────────────────────────────────────
function drawTile(ctx, col, row, id) {
  const x = col * TILE_SIZE, y = row * TILE_SIZE, sz = TILE_SIZE;
  const tc = TC[id] || TC.dungeon;
  ctx.save();
  ctx.fillStyle = tc.bg;
  ctx.fillRect(x, y, sz, sz);
  switch (id) {
    case 'snow': {
      ctx.fillStyle = tc.accent;
      for (let i = 0; i < 6; i++) ctx.fillRect(x + (col*13+i*17+5)%(sz-8), y+(row*11+i*19+5)%(sz-8), 3, 3);
      ctx.strokeStyle='rgba(180,220,240,0.5)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+sz*.2,y+sz*.3); ctx.lineTo(x+sz*.5,y+sz*.6); ctx.lineTo(x+sz*.7,y+sz*.4); ctx.stroke();
      break;
    }
    case 'sand': {
      ctx.fillStyle=tc.fg;
      for(let i=0;i<20;i++) ctx.fillRect(x+(col*7+i*13+3)%(sz-4), y+(row*11+i*9+3)%(sz-4), 2, 1);
      break;
    }
    case 'grass': {
      ctx.strokeStyle='#2a6020'; ctx.lineWidth=1.5;
      for(let i=0;i<10;i++){const px=x+(col*9+i*11+4)%(sz-6),py=y+(row*13+i*7+4)%(sz-10); ctx.beginPath(); ctx.moveTo(px,py+8); ctx.quadraticCurveTo(px-2,py+4,px+1,py); ctx.stroke();}
      break;
    }
    case 'dungeon': {
      const bH=sz/3; ctx.fillStyle=tc.fg;
      for(let r=0;r<3;r++){const off=(r%2)*(sz/4); for(let c=0;c<3;c++) ctx.fillRect(x+(c*sz/2+off)%sz+1,y+r*bH+1,sz/2-3,bH-3);}
      ctx.strokeStyle='#22222a'; ctx.lineWidth=1;
      for(let r=0;r<=3;r++){ctx.beginPath(); ctx.moveTo(x,y+r*bH); ctx.lineTo(x+sz,y+r*bH); ctx.stroke();}
      break;
    }
    case 'water': {
      ctx.strokeStyle='rgba(100,180,255,0.5)'; ctx.lineWidth=1.5;
      for(let r=0;r<3;r++){const wy=y+sz*.2+r*sz*.3; ctx.beginPath(); ctx.moveTo(x,wy); for(let wx=0;wx<=sz;wx+=8) ctx.lineTo(x+wx,wy+Math.sin((wx/sz)*Math.PI*2+col+row)*3); ctx.stroke();}
      ctx.fillStyle='rgba(150,200,255,0.3)'; ctx.fillRect(x+sz*.3,y+sz*.1,sz*.15,sz*.05);
      break;
    }
    case 'wood': {
      const pH=sz/4;
      for(let r=0;r<4;r++){ctx.fillStyle=r%2===0?tc.bg:tc.fg; ctx.fillRect(x,y+r*pH,sz,pH); ctx.strokeStyle='rgba(80,40,10,0.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x+sz*.3,y+r*pH+3); ctx.quadraticCurveTo(x+sz*.5,y+r*pH+pH/2,x+sz*.7,y+r*pH+pH-3); ctx.stroke();}
      break;
    }
    case 'mud': {
      ctx.fillStyle=tc.fg;
      for(let i=0;i<4;i++){ctx.beginPath(); ctx.ellipse(x+(col*11+i*19+5)%(sz/2)+sz*.25,y+(row*7+i*13+5)%(sz/2)+sz*.25,10,6,0.5,0,Math.PI*2); ctx.fill();}
      break;
    }
    case 'luxury': {
      const h=sz/2; ctx.fillStyle='#12124a'; ctx.fillRect(x,y,h,h); ctx.fillRect(x+h,y+h,h,h);
      ctx.fillStyle='#1e1e5e'; ctx.fillRect(x+h,y,h,h); ctx.fillRect(x,y+h,h,h);
      ctx.strokeStyle='#c8a820'; ctx.lineWidth=1.5; ctx.strokeRect(x+2,y+2,sz-4,sz-4);
      ctx.beginPath(); ctx.moveTo(x+h,y+2); ctx.lineTo(x+h,y+sz-2); ctx.moveTo(x+2,y+h); ctx.lineTo(x+sz-2,y+h); ctx.stroke();
      ctx.fillStyle='#c8a820'; ctx.beginPath(); ctx.moveTo(x+h,y+h-5); ctx.lineTo(x+h+5,y+h); ctx.lineTo(x+h,y+h+5); ctx.lineTo(x+h-5,y+h); ctx.fill();
      break;
    }
    case 'lava': {
      ctx.fillStyle=tc.fg;
      for(let i=0;i<5;i++){ctx.beginPath(); ctx.arc(x+(col*17+i*11+3)%(sz-6)+3,y+(row*13+i*17+5)%(sz-6)+3,4+(i%3)*2,0,Math.PI*2); ctx.fill();}
      ctx.strokeStyle=tc.accent; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(x,y+sz*.5); ctx.quadraticCurveTo(x+sz*.3,y+sz*.8,x+sz*.6,y+sz*.4); ctx.stroke();
      break;
    }
    case 'ice': {
      ctx.strokeStyle=tc.accent; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+Math.abs(Math.sin(col)*sz),y); ctx.lineTo(x+sz,y+Math.abs(Math.cos(row)*sz)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x,y+Math.abs(Math.cos(col)*sz)); ctx.lineTo(x+Math.abs(Math.sin(row)*sz),y+sz); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fillRect(x+sz*.2,y+sz*.2,sz*.15,sz*.15);
      break;
    }
    case 'dirt': {
      ctx.fillStyle=tc.fg;
      for(let i=0;i<15;i++){ctx.beginPath(); ctx.arc(x+(col*7+i*13+5)%(sz-4), y+(row*11+i*9+3)%(sz-4), 1.5,0,Math.PI*2); ctx.fill();}
      ctx.fillStyle=tc.accent;
      for(let i=0;i<5;i++){ctx.beginPath(); ctx.arc(x+(row*5+i*17+2)%(sz-4), y+(col*19+i*7+5)%(sz-4), 2,0,Math.PI*2); ctx.fill();}
      break;
    }
    case 'stone': {
      ctx.strokeStyle=tc.fg; ctx.lineWidth=1.5;
      const bw=sz/2, bh=sz/2;
      ctx.strokeRect(x+1,y+1,bw-2,bh-2); ctx.strokeRect(x+bw+1,y+1,bw-2,bh-2);
      ctx.strokeRect(x+1,y+bh+1,bw-2,bh-2); ctx.strokeRect(x+bw+1,y+bh+1,bw-2,bh-2);
      ctx.fillStyle=tc.accent; ctx.fillRect(x+4,y+4,bw-8,bh-8); ctx.fillRect(x+bw+4,y+bh+4,bw-8,bh-8);
      break;
    }
  }
  ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=0.5; ctx.strokeRect(x,y,sz,sz);
  ctx.restore();
}

function drawGrid(ctx, mapW, mapH) {
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.5;
  for(let c=0;c<=GRID_COLS;c++){ctx.beginPath();ctx.moveTo(c*TILE_SIZE,0);ctx.lineTo(c*TILE_SIZE,mapH);ctx.stroke();}
  for(let r=0;r<=GRID_ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*TILE_SIZE);ctx.lineTo(mapW,r*TILE_SIZE);ctx.stroke();}
  ctx.restore();
}

// ── Generic emoji token ────────────────────────────────────
function drawEmojiToken(ctx, x, y, icon, bgColor, borderColor, label, size = 48) {
  const cx = x + size/2, cy = y + size/2, r = size/2 - 2;
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
  ctx.beginPath(); ctx.arc(cx,cy,r+2.5,0,Math.PI*2); ctx.fillStyle=borderColor; ctx.fill();
  ctx.shadowBlur=0; ctx.shadowOffsetY=0;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=bgColor; ctx.fill();
  ctx.font=`${Math.round(size*.46)}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(icon,cx,cy);
  if(label){ ctx.font='bold 8px "Inter",sans-serif'; ctx.fillStyle='#fff'; ctx.shadowColor='rgba(0,0,0,0.95)'; ctx.shadowBlur=4; ctx.fillText(label,cx,cy+r+8); }
  ctx.restore();
}

// ── Sprite sheet token (with emoji fallback) ───────────────
function drawSheetToken(ctx, x, y, img, sheetPos, cols, rows, bgColor, borderColor, icon, label, size = 48) {
  const sheetReady = img && img.complete && img.naturalWidth > 0;

  if (!sheetReady) {
    // Fallback to emoji while image loads
    drawEmojiToken(ctx, x, y, icon, bgColor, borderColor, label, size);
    return;
  }

  const cx = x + size/2, cy = y + size/2, r = size/2 - 2;
  const srcW = img.naturalWidth  / cols;
  const srcH = img.naturalHeight / rows;
  const srcX = sheetPos.col * srcW;
  const srcY = sheetPos.row * srcH;

  ctx.save();
  // Shadow + border ring
  ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
  ctx.beginPath(); ctx.arc(cx,cy,r+2.5,0,Math.PI*2); ctx.fillStyle=borderColor; ctx.fill();
  ctx.shadowBlur=0; ctx.shadowOffsetY=0;

  // Background circle
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=bgColor; ctx.fill();

  // Clip and draw sprite
  ctx.save();
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
  ctx.drawImage(img, srcX, srcY, srcW, srcH, cx-r, cy-r, r*2, r*2);
  ctx.restore();

  // Label outside clip
  if (label) {
    ctx.font='bold 8px "Inter",sans-serif'; ctx.fillStyle='#fff';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.shadowColor='rgba(0,0,0,0.95)'; ctx.shadowBlur=4;
    ctx.fillText(label, cx, cy+r+4);
  }
  ctx.restore();
}

// ── Active-turn ring ──────────────────────────────────────
function drawTurnRing(ctx, x, y, size, borderColor) {
  const cx = x+size/2, cy = y+size/2, r = size/2+5;
  ctx.save();
  ctx.strokeStyle='#ffe066'; ctx.lineWidth=3;
  ctx.setLineDash([6,3]);
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// ── Main Renderer ─────────────────────────────────────────
export class MapRenderer {
  constructor(canvas) {
    this.canvas    = canvas;
    this.ctx       = canvas.getContext('2d');
    this.showGrid  = true;
    this.hoverCell = null;
    this._resize();
    new ResizeObserver(() => { this._resize(); this.render(); }).observe(canvas.parentElement);
  }

  _resize() {
    const p = this.canvas.parentElement;
    if (!p) return;
    if (this.canvas.width !== p.clientWidth || this.canvas.height !== p.clientHeight) {
      this.canvas.width  = p.clientWidth;
      this.canvas.height = p.clientHeight;
    }
  }

  render() {
    const { ctx, canvas } = this;
    const st = state.getAll();
    const { zoom, panX, panY } = st.viewport;
    const mapW = GRID_COLS * TILE_SIZE;
    const mapH = GRID_ROWS * TILE_SIZE;

    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Map base
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, mapW, mapH);

    // Floor
    if (st.layers.floor.visible) {
      for (const [key, tid] of Object.entries(st.floorGrid)) {
        const [col, row] = key.split(',').map(Number);
        drawTile(ctx, col, row, tid);
      }
    }

    if (this.showGrid) drawGrid(ctx, mapW, mapH);

    ctx.strokeStyle='rgba(124,58,237,0.35)'; ctx.lineWidth=2/zoom;
    ctx.strokeRect(0, 0, mapW, mapH);

    const activeUid = (st.initiative.currentIndex >= 0 && st.initiative.entries[st.initiative.currentIndex])
      ? st.initiative.entries[st.initiative.currentIndex].uid : null;

    // ── Env objects ────────────────────────────────────────
    if (st.layers.env.visible) {
      for (const obj of st.envObjects) {
        const def = ENV_OBJECTS.find(e => e.id === obj.type);
        if (!def) continue;
        if (def.sheet) {
          // New object with sprite sheet (4 cols × 3 rows)
          drawSheetToken(ctx, obj.x, obj.y, SHEETS.envNew, def.sheet, 4, 3, def.color + 'cc', def.color, def.icon, null, 44);
        } else {
          drawEmojiToken(ctx, obj.x, obj.y, def.icon, def.color + 'cc', def.color, null, 44);
        }
      }
    }

    // ── Characters — always use sprite sheet ───────────────
    if (st.layers.characters.visible) {
      for (const ch of st.characters) {
        const def = CHARACTER_CLASSES.find(c => c.id === ch.type);
        if (!def) continue;
        if (activeUid === ch.uid) drawTurnRing(ctx, ch.x, ch.y, 56, def.border);
        drawSheetToken(ctx, ch.x, ch.y, SHEETS.chars,
          { row: def.sheetRow, col: def.sheetCol }, 3, 2,
          def.color, def.border, def.icon, ch.label, 56);
      }
    }

    // ── Enemies ────────────────────────────────────────────
    if (st.layers.enemies.visible) {
      for (const en of st.enemies) {
        const def = ENEMY_TYPES.find(e => e.id === en.type);
        if (!def) continue;
        if (activeUid === en.uid) drawTurnRing(ctx, en.x, en.y, 52, def.border);
        if (def.sheet) {
          // New enemy from sprite sheet (4 cols × 2 rows)
          drawSheetToken(ctx, en.x, en.y, SHEETS.enemiesNew, def.sheet, 4, 2, def.color, def.border, def.icon, en.label, 52);
        } else {
          drawEmojiToken(ctx, en.x, en.y, def.icon, def.color, def.border, en.label, 52);
        }
      }
    }

    // Hover highlight
    if (this.hoverCell && st.activeTool === 'floor') {
      const { col, row } = this.hoverCell;
      ctx.save();
      ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.fillRect(col*TILE_SIZE,row*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=1.5/zoom; ctx.strokeRect(col*TILE_SIZE,row*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      ctx.restore();
    }

    ctx.restore();
  }
}
