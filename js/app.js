// Importamos las funciones de la API y los controladores de la interfaz
import { buscarCanciones } from './api.js';
import { 
    mostrarCargando, 
    mostrarError, 
    renderizarResultados,
    renderizarPlaylists,
    alternarAdvertenciaPlaylist
} from './ui.js';

// ==========================================================================
// ESTADO GLOBAL DE LA APLICACIÓN (Sobrevive al recargar la página)
// ==========================================================================
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];

/**
 * Guarda las playlists actuales en el almacenamiento local del navegador.
 */
function guardarEnLocalStorage() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

// ==========================================================================
// INICIO DE LA APLICACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Selectores del buscador (HU1)
    const formularioBusqueda = document.getElementById('formulario-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    const contenedorResultados = document.getElementById('resultados-busqueda');

    // Selectores del creador de Playlists (HU2)
    const formularioPlaylist = document.getElementById('formulario-playlist');
    const inputPlaylist = document.getElementById('input-playlist');
    const advertenciaPlaylist = document.getElementById('advertencia-playlist');
    const contenedorPlaylists = document.getElementById('lista-playlists');

    // HU2 - CRITERIO 4: Al iniciar la app, si no hay listas, se renderiza el mensaje amigable.
    // HU2 - CRITERIO 2: Si ya existen listas guardadas, se cargan inmediatamente en pantalla.
    renderizarPlaylists(contenedorPlaylists, playlists);

    // ==========================================================================
    // EVENTO 1: CREAR PLAYLIST (HU2)
    // ==========================================================================
    formularioPlaylist.addEventListener('submit', (evento) => {
        // Evitamos que la página se recargue al enviar el formulario
        evento.preventDefault();

        const nombreNuevaPlaylist = inputPlaylist.value.trim();

        // HU2 - CRITERIO 3: Validar que el nombre no esté vacío antes de crear
        if (!nombreNuevaPlaylist) {
            // Muestra el mensaje de advertencia visual en pantalla
            alternarAdvertenciaPlaylist(advertenciaPlaylist, true);
            return; // Detiene la ejecución para que no se cree nada
        }

        // Si pasa la validación, ocultamos la advertencia visual
        alternarAdvertenciaPlaylist(advertenciaPlaylist, false);

        // Creamos la nueva estructura de la playlist
        const nuevaPlaylist = {
            id: crypto.randomUUID(),
            nombre: nombreNuevaPlaylist,
            canciones: [] // Arreglo vacío listo para recibir temas en la HU3
        };

        // Agregamos la playlist al estado global
        playlists.push(nuevaPlaylist);

        // Guardamos en LocalStorage para cumplir la meta del Sprint 1 (sobrevivir al recargar)
        guardarEnLocalStorage();

        // HU2 - CRITERIO 2: Se actualiza la pantalla mostrando inmediatamente la nueva lista
        renderizarPlaylists(contenedorPlaylists, playlists);

        // Limpiamos el campo de texto
        inputPlaylist.value = '';
    });

    // ==========================================================================
    // EVENTO 2: BUSCAR CANCIONES (HU1)
    // ==========================================================================
    formularioBusqueda.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const termino = inputBusqueda.value.trim();
        if (!termino) return;

        try {
            // HU1 - CRITERIO 2: Mostrar indicador visual de carga
            mostrarCargando(contenedorResultados);

            const canciones = await buscarCanciones(termino);

            // HU1 - CRITERIO 3 y 4: Pintar canciones o mostrar estado vacío amigable
            renderizarResultados(contenedorResultados, canciones);

        } catch (error) {
            // HU1 - CRITERIO 5: Si ocurre un error de conexión, desplegar mensaje claro
            mostrarError(
                contenedorResultados, 
                'No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet.'
            );
        }
    });
});