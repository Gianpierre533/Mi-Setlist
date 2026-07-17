# Historias de Usuario - Mi Setlist

Este documento detalla las 8 Historias de Usuario que componen el MVP de la aplicación, con criterios de aceptación enfocados exclusivamente en el comportamiento observable en la interfaz de usuario.

---

### HU1: Creación de Playlists Personalizadas

**Como** entusiasta de la música,  
**Quiero** crear una nueva playlist asignándole un nombre propio,  
**Para** empezar a organizar mis canciones favoritas en listas temáticas.

- **Criterio 1:** En la pantalla se visualiza un formulario con un campo de texto para escribir el nombre de la playlist y un botón para crearla.
- **Criterio 2:** Al escribir un nombre y presionar el botón de creación, la nueva playlist aparece inmediatamente en la lista de playlists de la pantalla.
- **Criterio 3:** Si intento crear una playlist con el nombre vacío, se muestra un mensaje de advertencia visual en pantalla y no se crea nada.
- **Criterio 4:** Si no tengo ninguna playlist creada, la pantalla muestra un mensaje amigable indicando que aún no hay playlists y sugiriendo crear la primera.

---

### HU2: Búsqueda Interactiva de Canciones

**Como** usuario de la aplicación,  
**Quiero** buscar canciones introduciendo el nombre de un artista o el título de un tema,  
**Para** explorar el catálogo disponible y encontrar música de mi interés.

- **Criterio 1:** En la pantalla se presenta un campo de búsqueda de texto y un botón de buscar.
- **Criterio 2:** Mientras la aplicación está consultando la música, se muestra un indicador visual de carga (como un spinner o texto de "Buscando...").
- **Criterio 3:** Al finalizar la búsqueda con éxito, se despliega una lista de resultados donde cada canción muestra claramente su carátula (imagen), título, nombre del artista y su duración.
- **Criterio 4:** Si la búsqueda no arroja resultados, se oculta el indicador de carga y se muestra en pantalla un mensaje amigable indicando que no se encontraron coincidencias.
- **Criterio 5:** Si ocurre un error de conexión durante la búsqueda, se despliega un mensaje de error claro en pantalla explicando que hubo un problema al conectar con el servidor.

---

### HU3: Guardar Canciones en una Playlist

**Como** oyente organizado,  
**Quiero** añadir canciones de los resultados de búsqueda a una de mis playlists,  
**Para** construir y personalizar mi selección musical.

- **Criterio 1:** Cada canción en la lista de resultados de búsqueda tiene un control interactivo (como un botón o menú desplegable) para elegir a qué playlist existente añadirla.
- **Criterio 2:** Al agregar una canción a una playlist, la pantalla muestra un mensaje de confirmación temporal de que la canción fue añadida con éxito.
- **Criterio 3:** Si no hay playlists creadas todavía, el control para añadir canciones aparece desactivado o muestra un aviso visual indicando que primero se debe crear una playlist.

---

### HU4: Visualización del Contenido de una Playlist

**Como** melómano,  
**Quiero** seleccionar una de mis playlists para ver detalladamente su contenido,  
**Para** revisar qué canciones tiene guardadas y cuándo las agregué.

- **Criterio 1:** Al hacer clic en una playlist de la lista, la pantalla cambia o se actualiza para mostrar el listado de canciones pertenecientes a esa playlist.
- **Criterio 2:** Por cada canción dentro de la playlist, se visualiza su título, artista, duración y la fecha exacta (o relativa) en la que fue agregada.
- **Criterio 3:** Si la playlist seleccionada está vacía, se visualiza un mensaje amigable en pantalla invitando al usuario a buscar canciones para añadir.

---

### HU5: Control de Tiempo y Estadísticas de la Playlist

**Como** programador de mis propias sesiones de música,  
**Quiero** ver la duración acumulada y las estadísticas de mi playlist activa,  
**Para** conocer la extensión de mi lista y saber cuáles son mis preferencias musicales en ella.

- **Criterio 1:** Al visualizar una playlist, se muestra en pantalla su duración total acumulada en un formato legible para personas (por ejemplo, "1 h 23 min" o "45 min").
- **Criterio 2:** Se muestra una sección de estadísticas de la playlist activa que incluye la cantidad total de canciones que contiene.
- **Criterio 3:** La sección de estadísticas muestra claramente el género musical más frecuente y el artista que más veces se repite dentro de esa playlist.

---

### HU6: Eliminación Segura de Canciones y Playlists

**Como** usuario que actualiza constantemente sus gustos,  
**Quiero** quitar canciones individuales de una playlist o eliminar una playlist completa,  
**Para** mantener únicamente el contenido musical que deseo conservar.

- **Criterio 1:** Cada canción dentro de una playlist muestra un botón interactivo para removerla de la lista.
- **Criterio 2:** La vista de la playlist muestra un botón para eliminar la playlist completa con todos sus elementos.
- **Criterio 3:** Al presionar cualquiera de los dos botones de eliminación, no se borra inmediatamente; en su lugar, se abre un cuadro de diálogo (modal propio diseñado en pantalla) solicitando confirmar la acción.
- **Criterio 4:** Si el usuario confirma la acción en el diálogo modal, el elemento se remueve de la pantalla; si cancela, el cuadro de diálogo se cierra y el contenido permanece intacto.

---

### HU7: Ordenamiento Personalizado de la Playlist

**Como** director de mi propia experiencia musical,  
**Quiero** ordenar las canciones de mi playlist bajo diferentes criterios,  
**Para** decidir el flujo exacto de reproducción de mis temas.

- **Criterio 1:** La vista de la playlist activa ofrece un selector desplegable o botones para elegir el criterio de ordenamiento.
- **Criterio 2:** El usuario puede seleccionar ordenar las canciones de manera alfabética (por título) o por fecha de adición (de las más recientes a las más antiguas, o viceversa).
- **Criterio 3:** Al cambiar la opción de ordenamiento, la lista de canciones en pantalla se reorganiza instantáneamente reflejando el orden seleccionado.

---

### HU8: Persistencia del Estado y Recuperación ante Fallos

**Como** usuario recurrente de la aplicación,  
**Quiero** que mi información se guarde automáticamente al cerrar la página y que la app se recupere si los datos guardados tienen problemas,  
**Para** no perder mis playlists creadas y garantizar que la aplicación siempre sea utilizable.

- **Criterio 1:** Al recargar el navegador o cerrar y volver a abrir la pestaña de la aplicación, todas las playlists creadas y sus canciones asignadas vuelven a aparecer en pantalla exactamente como estaban.
- **Criterio 2:** Si los datos guardados en el dispositivo se corrompen o están alterados de forma que impidan el inicio de la app, esta no se queda en blanco ni se congela con un error.
- **Criterio 3:** Ante datos dañados, la interfaz muestra un cuadro informativo de error y ofrece un botón destacado que dice "Empezar de cero".
- **Criterio 4:** Al pulsar el botón "Empezar de cero", la pantalla se limpia por completo regresando al estado inicial vacío, lista para volver a crear playlists sin errores.
