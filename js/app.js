import { buscarCanciones } from './api.js';
import { 
    mostrarCargando, 
    mostrarError, 
    renderizarResultados,
    renderizarPlaylists,
    alternarAdvertenciaPlaylist,
    mostrarToast,
    renderizarDetallePlaylist,
    mostrarPantallaErrorDatos
} from './ui.js';
import { cargarPlaylists, guardarPlaylists, limpiarStorage } from './storage.js';

// ESTADO GLOBAL DE LA APLICACIÓN
let playlists = [];
let ultimasCancionesBuscadas = [];
let idPlaylistSeleccionada = null;
let criteriosOrdenPlaylists = {}; // HU7: Almacena el criterio de ordenamiento activo por cada playlistId

function guardarEnLocalStorage() {
    guardarPlaylists(playlists);
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
    const appLayout = document.querySelector('.app-layout');

    // ==========================================================================
    // HU8 - CRITERIO 1 y 2: Cargar playlists al inicio con manejo de fallos.
    // Si el JSON está corrupto, se captura el error y se muestra la pantalla
    // de recuperación en lugar de dejar la app congelada o en blanco.
    // ==========================================================================
    try {
        playlists = cargarPlaylists();
        renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);
    } catch (error) {
        // HU8 - CRITERIO 2 y 3: Datos corruptos — mostrar panel de error y no continuar
        console.error('Error al cargar los datos guardados:', error);

        mostrarPantallaErrorDatos(appLayout, () => {
            // HU8 - CRITERIO 4: Limpiar storage y recargar la página al estado inicial vacío
            limpiarStorage();
            location.reload();
        });

        return; // Detiene la inicialización normal de la app
    }

    // ==========================================================================
    // HU2: CREAR PLAYLIST (Actualización Inmutable)
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

        // Actualización inmutable sin mutación directa (.push)
        playlists = [...playlists, nuevaPlaylist];
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
    // HU3: GUARDAR CANCIÓN EN PLAYLIST (Actualización Inmutable)
    // ==========================================================================
    contenedorResultados.addEventListener('agregarACancion', (evento) => {
        const { cancion, playlistId } = evento.detail;

        // Actualización inmutable usando map y spread
        playlists = playlists.map(playlist => {
            if (playlist.id !== playlistId) return playlist;

            const cancionConFecha = {
                ...cancion,
                fechaAgregada: new Date().toISOString()
            };

            return {
                ...playlist,
                canciones: [...playlist.canciones, cancionConFecha]
            };
        });

        guardarEnLocalStorage();
        renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);

        const playlistDestino = playlists.find(p => p.id === playlistId);
        if (playlistDestino) {
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
        
        playlists = playlists.filter(p => p.id !== playlistId);
        delete criteriosOrdenPlaylists[playlistId]; // Limpiar registro de criterio
        guardarEnLocalStorage();

        // Si la playlist activa era la eliminada, resetear vista al buscador
        if (idPlaylistSeleccionada === playlistId) {
            cambiarVistaMain('buscador');
        }

        renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);
        
        if (ultimasCancionesBuscadas.length > 0) {
            renderizarResultados(contenedorResultados, ultimasCancionesBuscadas, playlists);
        }

        mostrarToast('Playlist eliminada correctamente');
    });

    // Escuchar eliminación de canción de una playlist (Inmutable)
    document.addEventListener('quitarCancionPlaylist', (e) => {
        const { playlistId, cancionId } = e.detail;
        
        playlists = playlists.map(playlist => {
            if (playlist.id !== playlistId) return playlist;
            return {
                ...playlist,
                canciones: playlist.canciones.filter(c => c.id !== cancionId)
            };
        });

        guardarEnLocalStorage();

        const playlistActualizada = playlists.find(p => p.id === playlistId);
        if (playlistActualizada) {
            const criterioActual = criteriosOrdenPlaylists[playlistId] || 'recientes';
            renderizarDetallePlaylist(contenedorVistaPlaylist, playlistActualizada, criterioActual);
        }

        renderizarPlaylists(contenedorPlaylists, playlists, idPlaylistSeleccionada);
        mostrarToast('Canción quitada de la playlist');
    });
});