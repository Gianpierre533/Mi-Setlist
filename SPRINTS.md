## Sprint 1 (Clase 18) — Meta: Busco una canción y la agrego a una playlist que sobrevive al recargar

- **HU1: Búsqueda Interactiva de Canciones** (Va primero: casi todo depende de tener resultados en pantalla).
- **HU2: Creación de Playlists Personalizadas** (La estructura para almacenar y listar los contenedores de las canciones).
- **HU3: Guardar Canciones en una Playlist** (Permite asociar los resultados de la HU1 con la playlist creada en la HU2).
- **HU4: Visualización del Contenido de una Playlist** (Permite comprobar en pantalla que las canciones y sus fechas se añadieron con éxito).

---

## Sprint 2 (Clase 19) — Meta: La playlist se gestiona de forma completa: quitar elementos, ordenar, ver estadísticas y robustez ante fallos

- **HU6: Eliminación Segura de Canciones y Playlists** (Implementación de la limpieza de datos usando confirmación interactiva mediante un modal propio).
- **HU7: Ordenamiento Personalizado de la Playlist** (Permite reorganizar dinámicamente la lista de canciones en pantalla por orden alfabético o fechas).
- **HU5: Control de Tiempo y Estadísticas de la Playlist** (Cálculo acumulativo del tiempo en formato legible y renderizado de métricas de artistas/géneros).
- **HU8: Persistencia del Estado y Recuperación ante Fallos** (Cierre del ciclo de vida del estado de la app: validación de datos corruptos de LocalStorage y control de restauración segura "Empezar de cero").

---

## Dependencias detectadas

- Para **HU3 (Guardar Canciones en una Playlist)** necesito antes obligatoriamente implementar la **HU1 (Búsqueda Interactiva de Canciones)** y la **HU2 (Creación de Playlists Personalizadas)**, porque sin resultados que seleccionar ni una lista de destino creada, es imposible ejecutar el flujo de adición.
- Para **HU7 (Ordenamiento Personalizado)** y **HU5 (Control de Tiempo y Estadísticas)** necesito antes tener implementada la **HU4 (Visualización del Contenido)**, ya que no se puede ordenar ni calcular estadísticas sobre una interfaz que aún no sabe cómo listar las canciones asignadas.

---

## Mi reto técnico principal

La historia de usuario que más me intimida es la **HU8 (Persistencia del Estado y Recuperación ante Fallos)**, específicamente el criterio de recuperar la aplicación si los datos en LocalStorage se corrompen. Es la primera vez que debo interceptar y validar con seguridad un JSON deformado o alterado a mano dentro de un bloque `try/catch`, asegurando que el flujo de la aplicación no se rompa y ofreciendo una salida amigable ("Empezar de cero") para reescribir el estado central en el dispositivo de manera inmutable.
