# Mi Setlist 🎵 - Gestor de Música y Playlists

**Mi Setlist** es una aplicación web interactiva desarrollada con **JavaScript Vanilla (ESM)** que permite explorar el catálogo musical en tiempo real de la API de iTunes, crear playlists personalizadas, ver estadísticas de reproducción, ordenar temas y recuperar el estado ante posibles fallos de almacenamiento.

---

## 🚀 Stack Tecnológico

* **HTML5 Semántico:** Estructura limpia y accesible.
* **CSS3 Nativo:** Maquetación responsiva en 2 columnas (Sidebar + Main Content), variables CSS, animación de componentes y estilo tipo plataforma de streaming.
* **JavaScript ES6+ (ES Modules - ESM):**
  * `js/models/cancion.js`: Modelo adaptador de datos.
  * `js/api.js`: Servicio asíncrono (`fetch`, `async/await`) con la API de iTunes.
  * `js/storage.js`: Capa de persistencia y resiliencia en `localStorage`.
  * `js/ui.js`: Capa de renderizado del DOM y modales interactivos.
  * `js/utils.js`: Funciones puras de cálculo de métricas y formateo de fechas/tiempos.
  * `js/app.js`: Controlador principal y gestión de estado.
* **Sin Dependencias Externas:** Construido desde cero sin frameworks (React/Vue) ni librerías de manejo de estado.

---

## 📋 Historias de Usuario Implementadas

### 🔹 Historias Base (MVP - Sprint 1 y Sprint 2):
* **[HU1] Búsqueda Interactiva de Canciones:** Conexión con iTunes API, indicator visual (spinner), manejo de errores de red y estado vacío.
* **[HU2] Creación de Playlists Personalizadas:** Formulario con validación visual para nombres vacíos y contador en el sidebar.
* **[HU3] Guardado de Canciones en Playlists:** Selección de playlist destino y notificaciones emergentes (Toast).
* **[HU4] Visualización de Contenido de Playlist:** Vista de detalle con duración y fecha exacta de adición.
* **[HU5] Control de Tiempo y Estadísticas:** Tiempo total acumulado (ej: `1 h 23 min`), conteo de temas, top artista y top género.
* **[HU6] Eliminación Segura de Canciones y Playlists:** Modal propio de confirmación (accesible con `Escape`) y reactividad sin refrescar pantalla.
* **[HU7] Ordenamiento Personalizado:** Selector interactivo para ordenar por fecha (más recientes/antiguas) o título (A-Z, Z-A).
* **[HU8] Persistencia y Recuperación ante Fallos:** Auto-guardado en `localStorage`, interceptado de JSON corrupto con `try/catch` y panel de recuperación "Empezar de cero".

### 🔸 Historias Propias (Demo Day):
* **[HU9] [x] Filtrado Rápido en Playlist Activa (Implementada):** Buscador interno que filtra en tiempo real los temas de la playlist activa por nombre o artista.
* **[HU10] [ ] Marcar y Filtrar Canciones Favoritas (Propuesta Propia 2):** Botón de corazón (❤️/🤍) para destacar canciones y filtro rápido de temas preferidos.

*Ver detalles de criterios en [HISTORIAS.md](./HISTORIAS.md), [SPRINTS.md](./SPRINTS.md) y [PROMPTS.md](./PROMPTS.md).*

---

## 💡 Decisiones Técnicas Explicadas

1. **Gestión de Estado Inmutable y Eventos Desacoplados (`CustomEvent`):**
   * *Decisión:* Para evitar mutaciones directas que causen fallos difíciles de rastrear, el estado central se actualiza de forma inmutable usando la sintaxis de propagación (`[...playlists, nuevaPlaylist]`) y métodos puros como `.map()` y `.filter()`. Además, los componentes de interfaz no modifican el estado directamente; en su lugar, emiten eventos personalizados del DOM (`CustomEvent`), lo que desacopla la vista de la lógica del controlador.

2. **Resiliencia de Almacenamiento y Recuperación Defensiva (`try/catch` + Fallback UI):**
   * *Decisión:* Dado que el usuario o extensiones pueden alterar o corromper el contenido de `localStorage`, la carga inicial se envolvió en un bloque `try/catch` defensivo tanto en `storage.js` como en `app.js`. Si se detecta un error de sintaxis en el JSON, la aplicación bloquea la ejecución que rompería el flujo y reemplaza la interfaz por un panel informativo de error que ofrece el botón "Empezar de cero", limpiando la clave dañada y restableciendo el sistema a un estado estable.

---

## 💻 Cómo Ejecutar el Proyecto Localmente

Dado que la aplicación utiliza Módulos de JavaScript (`type="module"`), no se puede ejecutar abriendo el archivo `index.html` directamente (protocolo `file://`).

1. Clona el repositorio o abre la carpeta del proyecto en **VS Code**.
2. Asegúrate de tener instalada la extensión **Live Server** en VS Code.
3. Haz clic derecho sobre el archivo `index.html` y selecciona **Open with Live Server**.
4. La aplicación se abrirá en tu navegador en `http://127.0.0.1:5500`.

---

## 🌐 Deploy Público
El proyecto se encuentra desplegado y accesible públicamente a través de **GitHub Pages**.
