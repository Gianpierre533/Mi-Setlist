# Registro de Prompts - Mi Setlist 🎵

Este documento resume las interacciones clave y el flujo de trabajo colaborativo con la IA durante el desarrollo del proyecto.

---

## [2026-07-16] — Descomposición del MVP en Historias de Usuario
- **Para qué:** Derivar las 8 Historias de Usuario iniciales con sus criterios de aceptación a partir de los requerimientos del MVP.
- **Prompt:** "Actúa como Product Owner y descompón mi MVP de 'Mi Setlist' en 8 HUs con criterios de aceptación observables para 2 sprints."
- **Resultado:** La IA generó la estructura base de las 8 HUs en formato 'Como / Quiero / Para' y sus criterios de aceptación.

---

## [2026-07-16] — Arquitectura ESM y Búsqueda iTunes (HU1)
- **Para qué:** Diseñar la arquitectura modular en JS (ESM) y conectar de forma asíncrona la API de iTunes.
- **Prompt:** "Genera la estructura ESM para HU1: modelo Cancion, servicio api.js con fetch/async-await y funciones UI para renderizar spinner y lista."
- **Resultado:** Aprendí a desacoplar la llamada a la API (`api.js`) del renderizado del DOM (`ui.js`) utilizando clases ES6.

---

## [2026-07-16] — Maquetación en 2 Columnas y Gestión de Playlists (HU2)
- **Para qué:** Diseñar la interfaz estilo plataforma de streaming con sidebar para crear y listar playlists.
- **Prompt:** "Diseña una distribución HTML/CSS de 2 columnas estilo Spotify, con formulario en el sidebar y validación visual de nombre vacío."
- **Resultado:** La IA ayudó a estructurar la maquetación flexbox y a gestionar las alertas visuales para campos vacíos.

---

## [2026-07-21] — Guardado y Detalle de Playlists (HU3 y HU4)
- **Para qué:** Asociar canciones del buscador a playlists y visualizar su contenido con metadatos y fechas de adición.
- **Prompt:** "Implementa la lógica para asociar canciones a playlists con notificación Toast y la vista de detalle con fechas formateadas."
- **Resultado:** La IA ayudó a desacoplar la interacción mediante `CustomEvent` y a formatear fechas en texto legible.

---

## [2026-07-28] — Estadísticas, Eliminación y Ordenamiento (HU5, HU6 y HU7)
- **Para qué:** Calcular tiempo acumulado, eliminar elementos con modal propio y ordenar la lista por fecha o título.
- **Prompt:** "Agrega el cálculo de estadísticas puras con reduce, eliminación segura mediante modal accesible y ordenamiento reactivo con sort."
- **Resultado:** Aprendí a calcular métricas sobre arreglos de objetos y a gestionar confirmaciones interactivas sin usar `confirm()` nativo.

---

## [2026-08-04] — Persistencia y Recuperación ante Datos Corruptos (HU8)
- **Para qué:** Garantizar la resiliencia del estado ante datos malformados o alterados en `localStorage`.
- **Prompt:** "Envuelve la carga inicial en try/catch y crea una pantalla de recuperación con el botón 'Empezar de cero' si el JSON está corrupto."
- **Resultado:** Logré asegurar que la app nunca se congele ni se quede en blanco ante fallos de lectura en el almacenamiento local.

---

## [2026-08-04] — Auditoría de Código y Feature Propia (HU9 y HU10)
- **Para qué:** Corregir hallazgos de code review (mutaciones e inmutabilidad) y definir 2 HUs propias para el Demo Day.
- **Prompt:** "Audita mi código en busca de mutaciones directas de arreglo y propone 2 HUs propias para el producto final."
- **Resultado:** Refactoricé el manejo de estado a sintaxis inmutable (`[...array]`) e implementé el buscador interno en la playlist (HU9).
