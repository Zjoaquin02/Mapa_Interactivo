# ⚔️ D&D MapForge — Manual de Controles

Constructor de escenarios interactivo para campañas de Dungeons & Dragons.

---

## 🖱️ Zoom y Navegación del Mapa

| Control | Acción |
|---|---|
| 🖱️ Rueda del mouse | Zoom centrado en el cursor |
| `Espacio` + arrastrar | Mover la vista (pan) |
| Botón medio del mouse (rueda) | Pan también |
| `Ctrl` + `=` | Acercar (zoom in) |
| `Ctrl` + `-` | Alejar (zoom out) |
| `Ctrl` + `0` | Ajustar el mapa completo a la pantalla |
| Botones `−` `+` en toolbar | Zoom desde la interfaz |
| Botón `⊡ Ajustar` en toolbar | Ajustar mapa a pantalla desde la interfaz |

---

## 🏔️ Capa Piso (Baldosas de Terreno)

| Control | Acción |
|---|---|
| Clic sobre baldosa del panel → clic/arrastrar en el mapa | Pintar terreno |
| Arrastrar sobre el mapa (con terreno seleccionado) | Pintar múltiples celdas |
| Clic derecho sobre el mapa | Borrar baldosa |
| Botón 🧹 Goma de borrar → clic/arrastrar | Borrar terreno |

### Tipos de terreno disponibles
- 🏔️ **Nieve** — Superficie helada con grietas de hielo
- 🏜️ **Arena** — Terreno desértico con granos de arena
- 🌿 **Pasto** — Campo verde con briznas de hierba
- 🧱 **Mazmorra** — Suelo de piedra tipo dungeon con ladrillos
- 💧 **Agua** — Superficie líquida con ondas
- 🪵 **Madera** — Tablones de madera con veta
- 🟫 **Barro** — Tierra oscura y lodosa
- ✨ **Az. Lujosos** — Mosaico de oro y azul para interiores elegantes
- 🌋 **Lava** — Río de magma incandescente
- 🧊 **Hielo** — Superficie cristalina y resbaladiza
- 🌱 **Tierra** — Suelo seco y polvoriento
- 🪨 **Piedra** — Adoquines rústicos y rocas lisas

---

## 🌲 Capa Objetos del Entorno

| Control | Acción |
|---|---|
| Seleccionar objeto → clic en el mapa | Colocar objeto |
| Arrastrar objeto ya colocado | Mover objeto |
| Clic derecho sobre objeto | Eliminar objeto |

### Objetos disponibles (20 total)

| Ícono | Objeto | Render |
|---|---|---|
| 🌲 | Árbol | Emoji |
| 🪨 | Roca | Emoji |
| 🪵 | Escombros | Emoji |
| 🌿 | Arbusto | Emoji |
| 🪣 | Balde | Emoji |
| 🧰 | Cofre | Emoji |
| 🛢️ | Barril | Emoji |
| 🔥 | Antorcha | Emoji |
| 🧱 | Pared | Sprite |
| 🏛️ | Pilar | Sprite |
| 🗿 | Estatua | Sprite |
| 🏕️ | Fogata | Sprite |
| 💎 | Cristal | Sprite |
| 🪤 | Trampa | Sprite |
| ⛲ | Pozo | Sprite |
| 🕯️ | Candelabro | Sprite |
| 🍄 | Champiñón | Sprite |
| ⚰️ | Sarcófago | Sprite |
| ⛓️ | Cadenas | Sprite |
| 🕌 | Altar | Sprite |

---

## ⚔️ Capa Personajes (Héroes)

| Control | Acción |
|---|---|
| Seleccionar clase → clic en el mapa | Colocar ficha |
| Arrastrar ficha ya colocada | Mover ficha |
| Clic derecho sobre ficha | Eliminar ficha |
| Máximo | **6 fichas simultáneas** (sin mínimo) |

### Clases disponibles
| Ícono | Clase | HP Base |
|---|---|---|
| ⚔️ | Guerrero | 40 HP |
| 🔮 | Mago | 24 HP |
| ✨ | Curador | 32 HP |
| 🏹 | Explorador | 30 HP |
| 🗡️ | Pícaro | 28 HP |
| 👊 | Artista Marcial | 34 HP |

> Podés poner múltiples fichas de la misma clase (ej: 6 guerreros).

---

## 💀 Capa Enemigos

Funciona igual que los héroes. Máximo **6 fichas**.

### Tipos disponibles (14 total)

| Ícono | Enemigo | HP | Render |
|---|---|---|---|
| 👺 | Goblin | 15 HP | Emoji |
| 👹 | Orco | 30 HP | Emoji |
| 💀 | Esqueleto | 18 HP | Emoji |
| 🐉 | Dragón | 80 HP | Emoji |
| 🧟 | Zombie | 22 HP | Emoji |
| 😈 | Demonio | 50 HP | Emoji |
| 🕷️ | Araña Gigante | 20 HP | Sprite |
| 🧌 | Troll | 45 HP | Sprite |
| 🧛 | Vampiro | 55 HP | Sprite |
| 🧙 | Hechicero Oscuro | 35 HP | Sprite |
| 🗡️ | Bandido | 15 HP | Sprite |
| 🐺 | Hombre Lobo | 40 HP | Sprite |
| 🦅 | Grifo | 38 HP | Sprite |
| 💀 | Lich | 65 HP | Sprite |

---

## 🔒 Sistema de Capas

Cada capa puede **fijarse** y **ocultarse** de forma independiente desde el panel inferior del sidebar.

| Control | Acción |
|---|---|
| 🔓 (botón de candado) | Fijar la capa — impide edición accidental |
| 🔒 (botón de candado activo) | Desfijar la capa para volver a editarla |
| 👁️ (botón de ojo) | Ocultar/mostrar la capa en el mapa |

### Capas
1. **Capa Piso** — Baldosas de terreno
2. **Objetos Entorno** — Árboles, rocas, cofres, etc.
3. **Personajes** — Fichas de héroes
4. **Enemigos** — Fichas de enemigos

---

## ⚔️ Panel de Iniciativa

Acceso: botón **⚔️ Iniciativa** en la toolbar.

| Control | Acción |
|---|---|
| 🔄 Sync desde mapa | Añade automáticamente todos los héroes y enemigos colocados |
| 🎲 Tirar todos | Lanza d20 para cada combatiente y ordena por resultado |
| 🎲 (botón individual) | Lanza d20 solo para ese combatiente |
| ▲ / ▼ | Aumenta o disminuye la iniciativa `+1` / `-1` reordenando automáticamente la lista |
| ▶ Siguiente / ◀ Anterior | Avanza o retrocede el turno |
| −5 / −1 / +1 / +5 | Ajusta la vida (HP) actual del combatiente |
| Clic en número máximo | Permite editar el **HP Máximo** de la ficha en la lista |
| ✕ | Quita al combatiente de la iniciativa |
| 🗑️ Limpiar | Borra toda la lista de iniciativa |

> El combatiente con el turno activo tiene un anillo dorado parpadeante en su ficha del mapa.

---

## 🗺️ Sistema de Slots de Mapa

Acceso: botón **🗺️ Mapas** en la toolbar. Permite guardar hasta **6 escenarios distintos**.

| Control | Acción |
|---|---|
| 💾 Guardar aquí | Guarda el mapa actual en ese slot (pide nombre) |
| 📂 Cargar | Carga el mapa guardado (reemplaza el actual) |
| 🗑️ | Borra el slot |

> El mapa en progreso se guarda automáticamente en el navegador (`localStorage`).

---

## 🛠️ Toolbar — Botones Generales

| Botón | Acción |
|---|---|
| ⊞ Grilla | Muestra u oculta la cuadrícula del mapa |
| 📷 Exportar | Descarga el mapa completo como imagen PNG |
| 🗑️ Piso | Borra todas las baldosas del piso |
| ↺ Reset | Reinicia el mapa completo (borra todo) |

---

## 📐 Información del Mapa

- **Tamaño de grilla:** 50 × 35 celdas
- **Tamaño de celda:** 64 × 64 px
- **Tamaño total del mapa:** 3200 × 2240 px
- **Zoom mínimo:** 15% · **Zoom máximo:** 300%
- **Guardado:** Automático en `localStorage` del navegador
