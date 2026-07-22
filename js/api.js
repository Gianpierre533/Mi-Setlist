import { buscarCanciones } from './api.js';
import { 
    mostrarCargando, 
    mostrarError, 
    renderizarResultados,
    renderizarPlaylists,
    alternarAdvertenciaPlaylist,
    mostrarToast
} from './ui.js';

// ESTADO GLOBAL
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
let ultimasCancionesBuscadas = []; // Guardamos la última búsqueda para re-renderizar si se crean playlists

function guardarEnLocalStorage() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

document.addEventListener('DOMContentLoaded', () => {
    const formularioBusqueda = document.getElementById('formulario-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    const contenedorResultados = document.getElementById('resultados-busqueda');

    const formularioPlaylist = document.getElementById('formulario-playlist');
    const inputPlaylist = document.getElementById('input-playlist');
    const advertenciaPlaylist = document.getElementById('advertencia-playlist');
    const contenedorPlaylists = document.getElementById('lista-playlists');

    // Carga inicial de playlists
    renderizarPlaylists(contenedorPlaylists, playlists);

    // ==========================================================================
    // HU2: CREAR PLAYLIST
    // ==========================================================================
    formularioPlaylist.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const nombreNuevaPlaylist = inputPlaylist.value.trim();

        // HU2 - CRITERIO 3: Validar nombre no vacío
        if (!nombreNuevaPlaylist) {
            alternarAdvertenciaPlaylist(advertenciaPlaylist, true);
            return;
        }

        alternarAdvertenciaPlaylist(advertenciaPlaylist, false);

        const nuevaPlaylist = {
            id: crypto.randomUUID(),
            nombre: nombreNuevaPlaylist,
            canciones: []
        };

        playlists.push(nuevaPlaylist);
        guardarEnLocalStorage();

        // Actualizamos la lista de playlists en el Sidebar
        renderizarPlaylists(contenedorPlaylists, playlists);

        // Si ya había resultados de búsqueda en pantalla, los re-renderizamos para activar sus controles
        if (ultimasCancionesBuscadas.length > 0) {
            renderizarResultados(contenedorResultados, ultimasCancionesBuscadas, playlists);
        }

        inputPlaylist.value = '';
    });

    // ==========================================================================
    // HU1: BUSCAR CANCIONES
    // ==========================================================================
    formularioBusqueda.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const termino = inputBusqueda.value.trim();
        if (!termino) return;

        try {
            mostrarCargando(contenedorResultados);

            const canciones = await buscarCanciones(termino);
            ultimasCancionesBuscadas = canciones; // Guardamos copia local

            // HU1 + HU3: Renderizamos pasando también el listado de playlists
            renderizarResultados(contenedorResultados, canciones, playlists);

        } catch (error) {
            mostrarError(
                contenedorResultados, 
                'No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet.'
            );
        }
    });

    // ==========================================================================
    // HU3: GUARDAR CANCIÓN EN PLAYLIST
    // ==========================================================================
    contenedorResultados.addEventListener('agregarACancion', (evento) => {
        const { cancion, playlistId } = evento.detail;

        // Buscamos la playlist de destino en nuestro estado
        const playlistDestino = playlists.find(p => p.id === playlistId);

        if (playlistDestino) {
            // HU4 prepara la fecha de adición, la guardamos desde ya
            const cancionConFecha = {
                ...cancion,
                fechaAgregada: new Date().toISOString()
            };

            // Añadimos la canción a la playlist
            playlistDestino.canciones.push(cancionConFecha);

            // Guardamos en LocalStorage
            guardarEnLocalStorage();

            // Actualizamos la cantidad de canciones mostrada en el Sidebar
            renderizarPlaylists(contenedorPlaylists, playlists);

            // HU3 - CRITERIO 2: Muestra mensaje de confirmación temporal
            mostrarToast(`Añadida "${cancion.titulo}" a ${playlistDestino.nombre}`);
        }
    });
});