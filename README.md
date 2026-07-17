# Mi Setlist 🎵

Una aplicación web interactiva que permite buscar canciones en el catálogo real de iTunes y organizarlas en playlists personales que se guardan de forma persistente en el navegador.

## 🚀 Stack Tecnológico
- **HTML5**: Estructura semántica para una excelente accesibilidad.
- **CSS3**: Diseño visual estilizado y moderno.
- **JavaScript (Vanilla)**: Lógica nativa utilizando módulos ESM (`import`/`export`).
- **Persistencia**: `localStorage` para conservar tus playlists al recargar la página.
- **Integración**: iTunes Search API para la búsqueda en tiempo real de canciones.

## 📋 Planificación del Proyecto (Historias de Usuario)
La planificación detallada de las Historias de Usuario (HUs) y la distribución por Sprints se encuentran documentadas en los siguientes archivos:
- Ver [HISTORIAS.md](./HISTORIAS.md) para el detalle de los criterios de aceptación observables de cada funcionalidad.
- Ver [SPRINTS.md](./SPRINTS.md) para la distribución de tareas y dependencias del Sprint 1 y Sprint 2.
- Ver [PROMPTS.md](./PROMPTS.md) para el registro de la interacción de diseño y desarrollo con la Inteligencia Artificial.

## 💻 Cómo correr el proyecto localmente
Dado que la aplicación utiliza módulos de JavaScript (ESM), **no se puede ejecutar abriendo el archivo `index.html` con doble clic** (protocolo `file://`).

Sigue estos pasos para iniciarlo correctamente:
1. Abre este proyecto en tu editor de código (ej: **VS Code**).
2. Asegúrate de tener instalada la extensión **Live Server**.
3. Haz clic derecho sobre el archivo `index.html` y selecciona **Open with Live Server** (o presiona el botón `Go Live` en la barra inferior).
4. La aplicación se abrirá automáticamente en tu navegador web bajo un servidor local (usualmente `http://127.0.0.1:5500`).
