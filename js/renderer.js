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
const CHAR_IMAGES = {};
CHARACTER_CLASSES.forEach(obj => {
  if (obj.hasImage) CHAR_IMAGES[obj.id] = loadImg(`assets/chars/${obj.id}.png`);
});

const ENEMY_IMAGES = {};
ENEMY_TYPES.forEach(obj => {
  if (obj.hasImage) ENEMY_IMAGES[obj.id] = loadImg(`assets/enemies/${obj.id}.png`);
});

const ENV_IMAGES = {};
ENV_OBJECTS.forEach(obj => {
  if (obj.hasImage) ENV_IMAGES[obj.id] = loadImg(`assets/env/${obj.id}.png`);
});

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
  toxic:   { bg: '#332211', fg: '#44aa22', accent: '#aaff66' },
  void:    { bg: '#050508', fg: 'rgba(50, 20, 90, 0.4)', accent: '#e2e2ff' },
  cobble:  { bg: '#4a4a55', fg: '#33333b', accent: '#777788' },
  magic:   { bg: '#1c0a2e', fg: '#441188', accent: '#a855f7' },
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
    case 'toxic': {
      ctx.fillStyle=tc.fg;
      for(let i=0;i<4;i++){ctx.beginPath(); ctx.ellipse(x+(col*11+i*17+5)%(sz/2)+sz*.25,y+(row*13+i*11+5)%(sz/2)+sz*.25,12,8,0.5,0,Math.PI*2); ctx.fill();}
      ctx.fillStyle=tc.accent;
      for(let i=0;i<3;i++){ctx.beginPath(); ctx.arc(x+(col*5+i*23+2)%(sz-8)+4, y+(row*7+i*19+1)%(sz-8)+4, 2, 0, Math.PI*2); ctx.fill();}
      break;
    }
    case 'void': {
      // Nebula clouds
      ctx.fillStyle = tc.fg;
      for (let i = 0; i < 3; i++) {
        const bx = x + (col * 13 + i * 27) % sz;
        const by = y + (row * 19 + i * 11) % sz;
        ctx.beginPath();
        ctx.ellipse(bx, by, 15 + (i * 5), 10 + i * 3, i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Little stars
      ctx.fillStyle = tc.accent;
      for (let i = 0; i < 5; i++) {
        const sx = x + (col * 29 + i * 17) % (sz - 4) + 2;
        const sy = y + (row * 31 + i * 43) % (sz - 4) + 2;
        const radius = i % 2 === 0 ? 1.2 : 0.6;
        ctx.beginPath(); ctx.arc(sx, sy, radius, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case 'cobble': {
      ctx.strokeStyle=tc.fg; ctx.lineWidth=2;
      ctx.strokeRect(x+2,y+2,sz/2-4,sz/2-4); ctx.strokeRect(x+sz/2+2,y+2,sz/2-4,sz/2-4);
      ctx.strokeRect(x+2,y+sz/2+2,sz/2-4,sz/2-4); ctx.strokeRect(x+sz/2+2,y+sz/2+2,sz/2-4,sz/2-4);
      ctx.fillStyle=tc.accent;
      ctx.fillRect(x+sz/4-2, y+sz/4-2, 4, 4); ctx.fillRect(x+sz*0.75-2, y+sz*0.75-2, 4, 4);
      break;
    }
    case 'magic': {
      ctx.strokeStyle = tc.accent; ctx.lineWidth = 1.5;
      
      // Large rune circle overlay
      ctx.beginPath(); ctx.arc(x+sz/2, y+sz/2, sz*0.4, 0, Math.PI*2); ctx.stroke();
      
      // Runes/Angular lines around the edge
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x+10, y+10);
      ctx.moveTo(x+sz, y); ctx.lineTo(x+sz-10, y+10);
      ctx.moveTo(x, y+sz); ctx.lineTo(x+10, y+sz-10);
      ctx.moveTo(x+sz, y+sz); ctx.lineTo(x+sz-10, y+sz-10);
      ctx.stroke();

      // Glowing dense inner core
      ctx.fillStyle = tc.fg;
      ctx.save();
      ctx.translate(x+sz/2, y+sz/2);
      ctx.rotate(Math.PI/4);
      ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = tc.accent;
      ctx.fillRect(-2, -2, 4, 4);
      ctx.restore();
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


// ── Individual Image Token ─────────────────────────────────
function drawIndividualToken(ctx, x, y, img, bgColor, borderColor, icon, label, size = 48) {
  const imgReady = img && img.complete && img.naturalWidth > 0;
  if (!imgReady) {
    drawEmojiToken(ctx, x, y, icon, bgColor, borderColor, label, size);
    return;
  }
  const cx = x + size/2, cy = y + size/2, r = size/2 - 2;
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
  ctx.beginPath(); ctx.arc(cx,cy,r+2.5,0,Math.PI*2); ctx.fillStyle=borderColor; ctx.fill();
  ctx.shadowBlur=0; ctx.shadowOffsetY=0;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=bgColor; ctx.fill();
  
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r - 1, 0, Math.PI*2); ctx.clip();
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, size, size);
  ctx.restore();

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
    this.exportMode = false;
    this.hoverCell = null;
    
    if (this.canvas.parentElement) {
      this._resize();
      new ResizeObserver(() => { this._resize(); this.render(); }).observe(this.canvas.parentElement);
    }
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

    // Viewport Frustum Culling limits
    const viewLeft   = -panX / zoom;
    const viewTop    = -panY / zoom;
    const viewRight  = viewLeft + canvas.width / zoom;
    const viewBottom = viewTop + canvas.height / zoom;

    // Floor
    if (st.layers.floor.visible) {
      for (const [key, tid] of Object.entries(st.floorGrid)) {
        const [col, row] = key.split(',').map(Number);
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        
        // Skip rendering if tile is entirely outside viewport
        if (x + TILE_SIZE < viewLeft || x > viewRight || 
            y + TILE_SIZE < viewTop || y > viewBottom) {
          continue;
        }
        
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
        if (def.hasImage) {
          drawIndividualToken(ctx, obj.x, obj.y, ENV_IMAGES[def.id], def.color + 'cc', def.color, def.icon, null, 44);
        } else {
          drawEmojiToken(ctx, obj.x, obj.y, def.icon, def.color + 'cc', def.color, null, 44);
        }
      }
    }

    // ── Drawings & AoE ─────────────────────────────────────
    if (st.layers.draw && st.layers.draw.visible && st.drawings) {
      for (const d of st.drawings) {
        ctx.save();
        if (d.shape === 'path') {
          ctx.strokeStyle = d.color;
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          if (d.points.length > 0) {
            ctx.moveTo(d.points[0].x, d.points[0].y);
            for (let i = 1; i < d.points.length; i++) ctx.lineTo(d.points[i].x, d.points[i].y);
          }
          ctx.stroke();
        } else if (d.shape === 'circle') {
          ctx.fillStyle = d.color + '66'; // ~40% opacity
          ctx.strokeStyle = d.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (d.shape === 'cone') {
          ctx.fillStyle = d.color + '66';
          ctx.strokeStyle = d.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          // Cone uses ~53 degree arc
          ctx.arc(d.x, d.y, d.radius, d.angle - 0.46, d.angle + 0.46);
          ctx.lineTo(d.x, d.y);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // ── Characters ─────────────────────────────────────────
    if (st.layers.characters.visible) {
      for (const ch of st.characters) {
        const def = CHARACTER_CLASSES.find(c => c.id === ch.type);
        if (!def) continue;
        if (activeUid === ch.uid) drawTurnRing(ctx, ch.x, ch.y, 56, def.border);
        if (def.hasImage) {
          drawIndividualToken(ctx, ch.x, ch.y, CHAR_IMAGES[def.id], def.color, def.border, def.icon, ch.label, 56);
        } else {
          drawEmojiToken(ctx, ch.x, ch.y, def.icon, def.color, def.border, ch.label, 56);
        }
      }
    }

    // ── Enemies ────────────────────────────────────────────
    if (st.layers.enemies.visible) {
      for (const en of st.enemies) {
        const def = ENEMY_TYPES.find(e => e.id === en.type);
        if (!def) continue;
        if (activeUid === en.uid) drawTurnRing(ctx, en.x, en.y, 52, def.border);
        if (def.hasImage) {
          drawIndividualToken(ctx, en.x, en.y, ENEMY_IMAGES[def.id], def.color, def.border, def.icon, en.label, 52);
        } else {
          drawEmojiToken(ctx, en.x, en.y, def.icon, def.color, def.border, en.label, 52);
        }
      }
    }

    // ── Fog of War ─────────────────────────────────────────
    if (st.layers.fog && st.layers.fog.visible) {
      ctx.fillStyle = 'rgba(0,0,0,1)';
      for (let c = 0; c < GRID_COLS; c++) {
        const x = c * TILE_SIZE;
        if (x + TILE_SIZE < viewLeft || x > viewRight) continue;
        
        for (let r = 0; r < GRID_ROWS; r++) {
          const y = r * TILE_SIZE;
          if (y + TILE_SIZE < viewTop || y > viewBottom) continue;
          
          if (st.fogGrid[`${c},${r}`]) {
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }

    // ── Hover Highlight ──────────────────────────────────────
    const toolsWithHover = ['floor', 'fog'];
    if (this.hoverCell && toolsWithHover.includes(st.activeTool)) {
      const { col, row } = this.hoverCell;
      const bs = st.brushSize || 1;
      const offset = Math.floor(bs/2);

      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.14)'; 
      ctx.fillRect((col-offset)*TILE_SIZE, (row-offset)*TILE_SIZE, bs*TILE_SIZE, bs*TILE_SIZE);
      
      let borderColor = st.isErasing ? 'rgba(255,50,50,0.8)' : 'rgba(255,255,255,0.6)';
      if (st.activeTool === 'fog') {
        borderColor = st.isErasing ? 'rgba(255,255,255,0.8)' : 'rgba(30,30,30,0.8)';
      }
      ctx.strokeStyle = borderColor; 
      ctx.lineWidth = 1.5/zoom; 
      ctx.strokeRect((col-offset)*TILE_SIZE, (row-offset)*TILE_SIZE, bs*TILE_SIZE, bs*TILE_SIZE);
      ctx.restore();
    }

    ctx.restore();
  }
}
