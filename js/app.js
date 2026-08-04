import { buscarCanciones } from './api.js';
import { 
    mostrarCargando, 
    mostrarError, 
    renderizarResultados,
    renderizarPlaylists,
    alternarAdvertenciaPlaylist,
    mostrarToast,
    renderizarDetallePlaylist
} from './ui.js';

// ESTADO GLOBAL DE LA APLICACIÓN
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
let ultimasCancionesBuscadas = [];
let idPlaylistSeleccionada = null; // Guarda cuál playlist está viendo el usuario
let criteriosOrdenPlaylists = {}; // HU7: Almacena el criterio de ordenamiento activo por cada playlistId ('recientes', 'antiguas', 'az', 'za')

function guardarEnLocalStorage() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

/**
 * Controla qué vista del Main Content se muestra en pantalla.
 * @param {'buscador' | 'playlist'} vista 
 */
function cambiarVistaMain(vista) {
    const vistaBuscador = document.getElementById('vista-buscador');
    const vistaPlaylist = document.getElementById('vista-playlist');

    if (vista === 'buscador') {
        vistaBuscador.classList.remove('ocultar');
        vistaPlaylist.classList.add('ocultar');
        idPlaylistSeleccionada = null;
    } else {
        vistaBuscador.classList.add('ocultar');
        vistaPlaylist.classList.remove('ocultar');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formularioBusqueda = document.getElementById('formulario-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    const contenedorResultados = document.getElementById('resultados-busqueda');

    const formularioPlaylist = document.getElementById('formulario-playlist');
    const inputPlaylist = document.getElementById('input-playlist');
    const advertenciaPlaylist = document.getElementById('advertencia-playlist');
    const contenedorPlaylists = document.getElementById('lista-playlists');
    const contenedorVistaPlaylist = document.getElementById('vista-playlist');

    // Carga inicial de playlists
    renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);

    // ==========================================================================
    // HU2: CREAR PLAYLIST
    // ==========================================================================
    formularioPlaylist.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const nombreNuevaPlaylist = inputPlaylist.value.trim();

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

        renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);

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
            ultimasCancionesBuscadas = canciones;

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
        const playlistDestino = playlists.find(p => p.id === playlistId);

        if (playlistDestino) {
            const cancionConFecha = {
                ...cancion,
                fechaAgregada: new Date().toISOString()
            };

            playlistDestino.canciones.push(cancionConFecha);
            guardarEnLocalStorage();

            renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);

            // Si estamos viendo esa playlist actualmente, refrescamos la pantalla manteniendo el criterio de orden activo
            if (idPlaylistSeleccionada === playlistId) {
                const criterioActual = criteriosOrdenPlaylists[playlistId] || 'recientes';
                renderizarDetallePlaylist(contenedorVistaPlaylist, playlistDestino, criterioActual);
            }

            mostrarToast(`Añadida "${cancion.titulo}" a ${playlistDestino.nombre}`);
        }
    });

    // ==========================================================================
    // HU4: SELECCIONAR Y VISUALIZAR PLAYLIST
    // ==========================================================================
    contenedorPlaylists.addEventListener('seleccionarPlaylist', (evento) => {
        const { playlistId } = evento.detail;
        idPlaylistSeleccionada = playlistId;

        const playlist = playlists.find(p => p.id === playlistId);

        if (playlist) {
            // HU4 - CRITERIO 1: Cambiamos la pantalla para mostrar el contenido de esa playlist
            cambiarVistaMain('playlist');
            
            // HU7: Recuperar el criterio de orden previo de esta playlist (por defecto 'recientes')
            const criterioActual = criteriosOrdenPlaylists[playlistId] || 'recientes';
            renderizarDetallePlaylist(contenedorVistaPlaylist, playlist, criterioActual);

            // Resaltamos la playlist activa en el Sidebar
            renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);
        }
    });

    // Escuchar botón de "Volver al Buscador" en la vista de detalle
    contenedorVistaPlaylist.addEventListener('click', (evento) => {
        if (evento.target && evento.target.id === 'boton-volver-buscador') {
            cambiarVistaMain('buscador');
            renderizarPlaylists(contenedorPlaylists, playlists, null);
        }
    });

    // ==========================================================================
    // HU7: ORDENAMIENTO PERSONALIZADO EN TIEMPO REAL
    // ==========================================================================
    document.addEventListener('cambiarOrdenPlaylist', (e) => {
        const { playlistId, criterio } = e.detail;

        // Guarda el criterio elegido para la playlist correspondiente
        criteriosOrdenPlaylists[playlistId] = criterio;

        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            // Re-renderiza con las canciones reordenadas según el criterio
            renderizarDetallePlaylist(contenedorVistaPlaylist, playlist, criterio);
        }
    });

    // ==========================================================================
    // HU6: ELIMINACIÓN Y REACCIÓN EN TIEMPO REAL
    // ==========================================================================

    // Escuchar eliminación de playlist
    document.addEventListener('eliminarPlaylist', (e) => {
        const { playlistId } = e.detail;
        
        // Filtrar la playlist eliminada
        playlists = playlists.filter(p => p.id !== playlistId);
        delete criteriosOrdenPlaylists[playlistId]; // Limpiar registro de criterio
        guardarEnLocalStorage();

        // Si la playlist activa era la eliminada, resetear vista al buscador
        if (idPlaylistSeleccionada === playlistId) {
            cambiarVistaMain('buscador');
        }

        // Volver a renderizar sidebar y toast de confirmación
        renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);
        
        // Si hay resultados de búsqueda previos, refrescar selects de playlists
        if (ultimasCancionesBuscadas.length > 0) {
            renderizarResultados(contenedorResultados, ultimasCancionesBuscadas, playlists);
        }

        mostrarToast('Playlist eliminada correctamente');
    });

    // Escuchar eliminación de canción de una playlist
    document.addEventListener('quitarCancionPlaylist', (e) => {
        const { playlistId, cancionId } = e.detail;
        
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.canciones = playlist.canciones.filter(c => c.id !== cancionId);
            guardarEnLocalStorage();

            // Re-renderizar detalle actualizado manteniendo el criterio de orden activo
            const criterioActual = criteriosOrdenPlaylists[playlistId] || 'recientes';
            renderizarDetallePlaylist(contenedorVistaPlaylist, playlist, criterioActual);
            renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);
            mostrarToast('Canción quitada de la playlist');
        }
    });
});