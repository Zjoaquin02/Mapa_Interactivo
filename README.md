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

## 📍 Sistema de Ping (Señalización)

Permite marcar puntos temporales en el mapa para llamar la atención de los demás jugadores. Muy útil para indicar movimientos o señalar enemigos.

| Control | Acción |
|---|---|
| `Alt` + Clic Izquierdo | Ping **Violeta** |
| `Shift` + `Alt` + Clic Izquierdo | Ping **Blanco** |

- **Animación:** Ondas expansivas concéntricas que duran 2 segundos.
- **Sincronización:** Totalmente sincronizado entre DM y Héroes en tiempo real.

---

## 🏔️ Capa Piso (Baldosas de Terreno)

| Control | Acción |
|---|---|
| Clic sobre baldosa del panel → clic/arrastrar en el mapa | Pintar terreno |
| **🖌️ Pincel 1x1 / 3x3** | Cambia el tamaño de la brocha para pintar o borrar |
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
- 🧪 **Tóxico** — Pantano burbujeante de ácido verde
- 🌌 **Abismo** — Vacío astral profundo con nebulosas y estrellas
- 🛣️ **Adoquín** — Suelo urbano de piedra gris para ciudades
- 🔮 **Arcano** — Suelo ritual morado con runas geométricas

---

## 🌫️ Capa Niebla de Guerra

| Control | Acción |
|---|---|
| Clic/Arrastrar con brocha | Cubre o despeja la visión del mapa |
| **🖌️ Pincel 1x1 / 3x3** | Cambia el tamaño de la brocha táctica |
| ⬛ Cubrir Todo | Cubre el mapa completo de oscuridad total |
| 👁️ Despejar | Borra toda la niebla de una sola vez |

---

## 🎨 Herramienta de Dibujo y Áreas de Efecto (AoE)

Nueva pestaña **🎨 Dibujo** para marcar tácticas o hechizos en el tablero.

| Herramienta | Acción |
|---|---|
| 🖊️ Mano Alzada | Dibuja trazos libres sobre el mapa (mira el color seleccionado) |
| 🟠 Círculo | Clic y arrastra para definir el radio (Fuego, Hielo, Ácido, Arcano) |
| 📐 Cono | Clic y arrastra para definir el alcance de un aliento o spray |
| Clic derecho | Elimina un dibujo o área colocada |

---

## 🌲 Capa Objetos del Entorno

| Control | Acción |
|---|---|
| Seleccionar objeto → clic en el mapa | Colocar objeto |
| Arrastrar objeto ya colocado | Mover objeto |
| Clic derecho sobre objeto | Eliminar objeto |

### Objetos destacados
- **Nivel Sprite (Pixel Art):** Árbol, Roca, Escombros, Arbusto, Balde, Cofre.
- **Estructuras y muebles:** Pared, Pilar, Estatua, Fogata, Pozo, Piedras, etc.

---

## ⚔️ Capa Personajes (Héroes)

| Control | Acción |
|---|---|
| Seleccionar clase → clic en el mapa | Colocar ficha |
| Arrastrar ficha ya colocada | Mover ficha |
| Clic derecho sobre ficha | Eliminar ficha |
| **Estética** | Todos los héroes utilizan **Emojis** para una vista clara y clásica |

### Todas las clases oficiales (13)
⚔️ Guerrero, 🔮 Mago, ✨ Clérigo, 🏹 Explorador, 🗡️ Pícaro, 👊 Artista Marcial, 🐻 Druida, 🛡️ Paladín, 🎸 Bardo, 🪓 Bárbaro, 🧿 Brujo, ⚡ Hechicero, ⚙️ Artífice.

---

## 💀 Capa Enemigos

Máximo **30 fichas**. El panel de enemigos se sincroniza automáticamente con el **Bestiario D&D**, ofreciendo una lista siempre actualizada de criaturas.

- **Básicos:** Goblin, Orco, Esqueleto, Dragón, Zombie, Demonio.
- **Especiales:** Araña Gigante, Troll, Vampiro, Hechicero Oscuro, Bandido, Hombre Lobo, Grifo, Lich.
- **Sincronización:** Cada vez que abras el proyecto, el constructor descarga las últimas entradas y estadísticas del Bestiario remoto.

---

## 📚 Integración con el Bestiario

MapForge está vinculado directamente con el proyecto [Bestiario D&D](https://zjoaquin02.github.io/Bestiary-D-D/).

- **Selección Jerárquica (Grimorios):** Los enemigos están agrupados en tomos mágicos (ej. *Esqueletos*, *Zombies*, *Señores del Infierno*). Al expandir un libro, podrás elegir la variante específica para colocar en el mapa.
- **Estadísticas Dinámicas:** Al colocar un monstruo, el sistema asigna automáticamente su HP base y nombre real según la ficha técnica oficial.
- **Acceso Directo:** Cada botón de enemigo en el panel y cada token en la iniciativa incluye un acceso directo (ℹ️) que abre la página oficial de esa criatura en el Bestiario para consultar lore y habilidades.

---

## ⚔️ Panel de Iniciativa

Acceso: botón **⚔️ Iniciativa** en la toolbar.

- **Sync Automático:** Trae todos los nombres y HP de los tokens en el mapa.
- **Seguimiento de Turno:** Anillo dorado animado en el token del mapa que posee el turno activo.
- **Gestión de Daño:** Botones de acceso rápido para curar o dañar fichas.

---

## 💾 Gestión de Archivos y Guardado

Acceso: botón **🗺️ Mapas** en la toolbar.

### ⬇️ Exportar / ⬆️ Subir JSON
Permite guardar el estado **total** de tu campaña (vida, posición, iniciativa, dibujos) como un archivo `.json` en tu computadora y cargarlo en cualquier momento o sesión futura.

### 💾 Slots Rápidos
Hasta **6 espacios** de guardado temporales en la memoria del navegador (`localStorage`).

### ✨ Mapas de Plantilla
Modelos prearmados (9 en total) incluyendo nuevos escenarios como **Pantano Tóxico**, **Calles Adoquinadas** y **Vacío Arcano**.

---

## 🛠️ Toolbar y Motor
- ⊞ **Grilla:** Alterna la cuadrícula.
- 📷 **Exportar PNG:** Guarda una captura visual del mapa para compartir.
- ⚡ **Optimización:** Motor con *Frustum Culling* activo (solo procesa lo que ves en pantalla para máximo rendimiento).

---

## 📐 Especificaciones
- **Grilla:** 50 × 35 (3200 × 2240 px)
- **Celda:** 64 × 64 px
- **Compatibilidad:** 100% Offline tras la primera carga.

---

## 🌐 Multijugador Online (P2P)

D&D MapForge utiliza tecnología **PeerJS** para conectar al Director de Juego y a los Héroes sin necesidad de un servidor central.

### 👑 Para el Director de Juego (DM)
1. Al abrir la aplicación, elige **Crear Sala**.
2. Ingresa tu nombre y pulsa el botón púrpura.
3. Se generará un código único de 6 caracteres (ej. `A1B2C3`) que aparecerá en la barra superior.
4. Pulsa el botón 📋 al lado del código para copiarlo y compártelo con tus jugadores.
5. Los cambios que hagas en el mapa, niebla de guerra, enemigos e iniciativa se sincronizarán en tiempo real con todos los conectados.

### 🛡️ Para los Héroes (Jugadores)
1. Ingresa tu nombre y selecciona tu **Clase de Personaje**.
2. Introduce el **Código de Sala** que te pasó el DM.
3. Pulsa **Unirse**.
4. **Restricciones:** Los Héroes solo pueden mover su propia ficha y ver la niebla de guerra que el DM haya despejado. No pueden editar el mapa ni ver fichas enemigas ocultas.

> [!TIP]
> Si pierdes la conexión, la página se recargará automáticamente para intentar reconectar en 3 segundos. Asegúrate de que el DM no haya cerrado la sala.
