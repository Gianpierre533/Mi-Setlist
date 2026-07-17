## [2026-07-16] — Descomposición del MVP en HUs

**Para qué:** Derivar mis historias de usuario iniciales a partir del MVP y el contrato técnico.

**Prompt:**
[CONTEXTO]
Estoy construyendo "Mi Setlist", una aplicación web que permita buscar canciones en un catálogo real (API de iTunes) y organizarlas en playlists personales que sobreviven al recargar la página. La app calcula la duración total de cada playlist y muestra estadísticas de tu música.

Stack: HTML5 semántico + CSS3 (propio o Tailwind Play CDN, a tu criterio) + JavaScript vanilla con módulos ESM (import/export, <script type="module">).
Arquitectura: estado central plano + patrón “cambias el estado → llamas render()”. CRUD inmutable (.filter/.map/spread). Delegación de eventos para las listas. Ids con crypto.randomUUID().
Persistencia: localStorage + JSON.stringify/parse envueltos en try/catch; fechas rehidratadas al cargar.
UX: confirmaciones con modal propio (nada de confirm() nativo); estados vacíos amigables.
API: iTunes Search API (solo lectura, sin key).
Deploy: GitHub Pages. ESM no corre con file:// → usar Live Server.

No se permite: frameworks JS (React, Vue…), librerías de manejo de estado, backend, copiar código de la IA sin registrarlo en PROMPTS.md.

El MVP tiene estas 10 funcionalidades:

1. Buscar canciones por artista o título en la API, mostrando carátula, nombre, artista y duración.
2. Comunicar el estado de la búsqueda: indicador de carga, mensaje de error si la API falla, mensaje amigable si no hay resultados.
3. Crear playlists con nombre propio (ej: “Road trip”, “Ensayo sábado”).
4. Agregar canciones desde los resultados de búsqueda a una playlist.
5. Ver el contenido de una playlist con los datos de cada canción y la fecha en que se agregó.
6. Quitar canciones y eliminar playlists con confirmación previa (modal propio).
7. Ver la duración total de la playlist en formato legible (ej: “1 h 23 min”).
8. Ver estadísticas de la playlist: cantidad de canciones, género más frecuente, artista más repetido.
9. Ordenar las canciones de una playlist (recientes/antiguas, alfabético).
10. Persistir todo en LocalStorage y restaurar al recargar; si los datos están corruptos, la app no se rompe y ofrece “Empezar de cero”.

[TAREA]
Descompón este MVP en un conjunto de 8 historias de usuario para un único desarrollador, distribuidas idealmente para completarse en 2 sprints de una sesión de clase cada uno.

[FORMATO]
Historia de Usuario ("Como [rol] quiero [acción] para [beneficio]") + de 3 a 5 criterios de aceptación por cada una.

[RESTRICCIÓN]
Los criterios de aceptación deben describir únicamente RESULTADOS observables en pantalla por el usuario. No debes mencionar detalles de implementación técnica (por ejemplo, nada de "usar fetch", "guardar en localstorage", "funciones de javascript" o "clases de css"). No agregues ninguna funcionalidad fuera de las 10 del MVP.

**Resultado:**
La IA generó una estructura base de 8 Historias de Usuario detalladas que cubren las 10 funcionalidades del MVP. Revisé y audité los criterios de aceptación para asegurar que describan únicamente comportamientos visuales e interactivos en pantalla, guardándolos en HISTORIAS.md.
