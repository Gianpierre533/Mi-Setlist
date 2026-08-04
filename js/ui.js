// ==========================================================================
// VISTA / INTERFAZ DE USUARIO (js/ui.js)
// ==========================================================================

import { calcularEstadisticasPlaylist } from './utils.js';

/**
 * HU6 - CRITERIO 3: Control del Modal de Confirmación Accesible
 * @param {string} titulo - Título del modal.
 * @param {string} mensaje - Mensaje descriptivo con HTML permitido.
 * @param {Function} onConfirmar - Callback ejecutado al confirmar la acción.
 */
export function mostrarModalConfirmacion(titulo, mensaje, onConfirmar) {
    const modal = document.getElementById('modal-confirmacion');
    const txtTitulo = document.getElementById('modal-titulo');
    const txtMensaje = document.getElementById('modal-mensaje');
    const btnConfirmar = document.getElementById('modal-btn-confirmar');
    const btnCancelar = document.getElementById('modal-btn-cancelar');

    if (!modal) return;

    txtTitulo.textContent = titulo;
    txtMensaje.innerHTML = mensaje;

    modal.classList.remove('ocultar');

    const cerrarModal = () => {
        modal.classList.add('ocultar');
        btnConfirmar.onclick = null;
        btnCancelar.onclick = null;
        document.removeEventListener('keydown', manejarEsc);
    };

    const manejarEsc = (e) => {
        if (e.key === 'Escape') cerrarModal();
    };

    btnCancelar.onclick = cerrarModal;

    btnConfirmar.onclick = () => {
        onConfirmar();
        cerrarModal();
    };

    document.addEventListener('keydown', manejarEsc);
}

/**
 * HU1 - CRITERIO 2: Dibuja el spinner de carga en el contenedor.
 */
export function mostrarCargando(contenedor) {
    contenedor.innerHTML = `
        <div class="spinner-container">
            <div class="spinner"></div>
            <p>Buscando canciones...</p>
        </div>
    `;
}

/**
 * HU1 - CRITERIO 5: Muestra mensaje de error de conexión.
 */
export function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <p class="error-mensaje">⚠️ ${mensaje}</p>
    `;
}

/**
 * HU1 + HU3: Renderiza resultados del buscador.
 */
export function renderizarResultados(contenedor, canciones, playlists = []) {
    contenedor.innerHTML = '';

    if (canciones.length === 0) {
        contenedor.innerHTML = `
            <p class="estado-vacio">
                🔍 No encontramos coincidencias para tu búsqueda. <br>
                <small>Intenta verificar la ortografía o buscar otro artista.</small>
            </p>
        `;
        return;
    }

    const listaHTML = document.createElement('ul');
    listaHTML.className = 'lista-canciones';

    const hayPlaylists = playlists.length > 0;

    canciones.forEach(cancion => {
        const item = document.createElement('li');
        item.className = 'item-cancion';
        
        let opcionesPlaylists = '';
        if (hayPlaylists) {
            opcionesPlaylists = playlists.map(p => 
                `<option value="${p.id}">${p.nombre}</option>`
            ).join('');
        } else {
            opcionesPlaylists = `<option value="">Crea una playlist primero</option>`;
        }

        item.innerHTML = `
            <div class="cancion-info">
                <img src="${cancion.caratula}" alt="Carátula de ${cancion.titulo}" class="cancion-caratula">
                <div class="cancion-detalles">
                    <span class="cancion-titulo">${cancion.titulo}</span>
                    <span class="cancion-artista">${cancion.artista}</span>
                </div>
            </div>
            <div class="cancion-metadatos">
                <span class="cancion-duracion">${cancion.duracion}</span>
            </div>
            <div class="cancion-acciones">
                <select class="select-playlist" ${!hayPlaylists ? 'disabled' : ''}>
                    ${opcionesPlaylists}
                </select>
                <button 
                    class="boton-agregar-cancion" 
                    title="${hayPlaylists ? 'Añadir a playlist' : 'Crea una playlist primero'}"
                    ${!hayPlaylists ? 'disabled' : ''}
                >
                    +
                </button>
            </div>
        `;

        if (hayPlaylists) {
            const botonAgregar = item.querySelector('.boton-agregar-cancion');
            const select = item.querySelector('.select-playlist');

            botonAgregar.addEventListener('click', () => {
                const playlistId = select.value;
                const eventoAgregar = new CustomEvent('agregarACancion', {
                    detail: { cancion, playlistId },
                    bubbles: true
                });
                item.dispatchEvent(eventoAgregar);
            });
        }

        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}

/**
 * HU2 + HU6: Renderiza las playlists en el Sidebar con opción de eliminación.
 */
export function renderizarPlaylists(contenedor, playlists, idPlaylistActiva = null) {
    contenedor.innerHTML = '';

    if (playlists.length === 0) {
        contenedor.innerHTML = `
            <p class="estado-vacio">
                📂 Aún no tienes playlists creadas. <br>
                <small>¡Escribe un nombre arriba y crea la primera!</small>
            </p>
        `;
        return;
    }

    const listaHTML = document.createElement('div');
    listaHTML.className = 'playlists-lista-vertical';

    playlists.forEach(playlist => {
        const item = document.createElement('div');
        item.className = `item-playlist ${playlist.id === idPlaylistActiva ? 'activa' : ''}`;
        item.dataset.id = playlist.id;

        item.innerHTML = `
            <div class="playlist-info-item" style="flex-grow: 1; cursor: pointer;">
                <span class="playlist-nombre">📂 ${playlist.nombre}</span>
                <span class="playlist-info-secundaria">${playlist.canciones.length} canciones</span>
            </div>
            <button class="btn-eliminar-playlist" title="Eliminar playlist" data-id="${playlist.id}">🗑️</button>
        `;

        // Permitimos hacer clic en el nombre de la playlist para seleccionarla
        item.querySelector('.playlist-info-item').addEventListener('click', () => {
            const eventoSeleccionar = new CustomEvent('seleccionarPlaylist', {
                detail: { playlistId: playlist.id },
                bubbles: true
            });
            item.dispatchEvent(eventoSeleccionar);
        });

        // Botón para eliminar playlist desde el Sidebar (HU6 Criterio 2 y 3)
        item.querySelector('.btn-eliminar-playlist').addEventListener('click', (e) => {
            e.stopPropagation();
            mostrarModalConfirmacion(
                'Eliminar Playlist',
                `⚠️ ¿Deseas eliminar la playlist <strong>"${playlist.nombre}"</strong>? Esta acción no se puede deshacer.`,
                () => {
                    const eventoEliminar = new CustomEvent('eliminarPlaylist', {
                        detail: { playlistId: playlist.id },
                        bubbles: true
                    });
                    item.dispatchEvent(eventoEliminar);
                }
            );
        });

        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}

/**
 * HU2 - CRITERIO 3: Alternar mensaje de advertencia.
 */
export function alternarAdvertenciaPlaylist(elementoAdvertencia, mostrar) {
    if (mostrar) {
        elementoAdvertencia.classList.remove('ocultar');
    } else {
        elementoAdvertencia.classList.add('ocultar');
    }
}

/**
 * HU3 - CRITERIO 2: Toast de notificación.
 */
export function mostrarToast(mensaje) {
    const toastExistente = document.querySelector('.toast-notificacion');
    if (toastExistente) toastExistente.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notificacion';
    toast.textContent = `✓ ${mensaje}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('ocultar-toast');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * HU4 + HU5 + HU6 + HU7: Renderiza el contenido detallado de la playlist, estadísticas, 
 * controles de ordenamiento y acciones de eliminación.
 * 
 * @param {HTMLElement} contenedor - El div de la vista de detalle.
 * @param {Object} playlist - La playlist seleccionada.
 * @param {string} criterioOrden - El criterio actual de ordenamiento ('recientes', 'antiguas', 'az', 'za').
 */
export function renderizarDetallePlaylist(contenedor, playlist, criterioOrden = 'recientes') {
    contenedor.innerHTML = '';

    // Encabezado de la playlist con acción de eliminación (HU6 Criterio 2)
    const headerHTML = document.createElement('div');
    headerHTML.className = 'playlist-header-detalle';
    headerHTML.innerHTML = `
        <div>
            <h1>📂 ${playlist.nombre}</h1>
        </div>
        <div class="header-acciones" style="display: flex; gap: 10px;">
            <button id="btn-eliminar-playlist-header" class="btn-eliminar-header">🗑️ Eliminar Playlist</button>
            <button id="boton-volver-buscador" class="boton-volver-buscador">🔍 Ir al Buscador</button>
        </div>
    `;
    contenedor.appendChild(headerHTML);

    // Evento eliminar playlist desde la cabecera (HU6 Criterio 2 y 3)
    headerHTML.querySelector('#btn-eliminar-playlist-header').addEventListener('click', () => {
        mostrarModalConfirmacion(
            'Eliminar Playlist',
            `⚠️ ¿Deseas eliminar la playlist <strong>"${playlist.nombre}"</strong>? Esta acción no se puede deshacer.`,
            () => {
                const eventoEliminar = new CustomEvent('eliminarPlaylist', {
                    detail: { playlistId: playlist.id },
                    bubbles: true
                });
                headerHTML.dispatchEvent(eventoEliminar);
            }
        );
    });

    // HU5 - CRITERIOS 1, 2 y 3: Panel de estadísticas
    const stats = calcularEstadisticasPlaylist(playlist.canciones);
    const statsContainer = document.createElement('div');
    statsContainer.className = 'playlist-stats-panel';
    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-label">Canciones</span>
            <span class="stat-value">${stats.totalCanciones}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Duración Total</span>
            <span class="stat-value">${stats.duracionTotal}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Top Artista</span>
            <span class="stat-value" title="${stats.artistaTop}">${stats.artistaTop}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Top Género</span>
            <span class="stat-value" title="${stats.generoTop}">${stats.generoTop}</span>
        </div>
    `;
    contenedor.appendChild(statsContainer);

    // HU4 - CRITERIO 3: Estado vacío
    if (playlist.canciones.length === 0) {
        const estadoVacio = document.createElement('p');
        estadoVacio.className = 'estado-vacio';
        estadoVacio.innerHTML = `
            🎵 Esta playlist está vacía.<br>
            <small>Usa el buscador para añadir tus primeros temas de música.</small>
        `;
        contenedor.appendChild(estadoVacio);
        return;
    }

    // =========================================================================
    // HU7 - CRITERIO 1 Y 2: Controles y lógica de Ordenamiento Personalizado
    // =========================================================================
    const contenedorOrden = document.createElement('div');
    contenedorOrden.className = 'playlist-controles-orden';
    contenedorOrden.innerHTML = `
        <label for="select-ordenar" class="orden-label">⇅ Ordenar por:</label>
        <select id="select-ordenar" class="select-ordenar" data-playlist-id="${playlist.id}">
            <option value="recientes" ${criterioOrden === 'recientes' ? 'selected' : ''}>Más recientes primero</option>
            <option value="antiguas" ${criterioOrden === 'antiguas' ? 'selected' : ''}>Más antiguas primero</option>
            <option value="az" ${criterioOrden === 'az' ? 'selected' : ''}>Título (A - Z)</option>
            <option value="za" ${criterioOrden === 'za' ? 'selected' : ''}>Título (Z - A)</option>
        </select>
    `;
    contenedor.appendChild(contenedorOrden);

    // Evento HU7 Criterio 3: Reorganización reactiva mediante Evento Personalizado
    contenedorOrden.querySelector('#select-ordenar').addEventListener('change', (e) => {
        const nuevoCriterio = e.target.value;
        const eventoCambiarOrden = new CustomEvent('cambiarOrdenPlaylist', {
            detail: { playlistId: playlist.id, criterio: nuevoCriterio },
            bubbles: true
        });
        e.target.dispatchEvent(eventoCambiarOrden);
    });

    // Copiamos el arreglo para no mutar el estado original en memoria directamente
    let cancionesOrdenadas = [...playlist.canciones];

    // Aplicar criterio de ordenamiento (HU7 Criterio 2)
    switch (criterioOrden) {
        case 'antiguas':
            cancionesOrdenadas.sort((a, b) => new Date(a.fechaAgregada || 0) - new Date(b.fechaAgregada || 0));
            break;
        case 'az':
            cancionesOrdenadas.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        case 'za':
            cancionesOrdenadas.sort((a, b) => b.titulo.localeCompare(a.titulo));
            break;
        case 'recientes':
        default:
            cancionesOrdenadas.sort((a, b) => new Date(b.fechaAgregada || 0) - new Date(a.fechaAgregada || 0));
            break;
    }

    // HU4 + HU6: Renderizar lista de canciones ordenadas
    const listaHTML = document.createElement('ul');
    listaHTML.className = 'lista-canciones';

    cancionesOrdenadas.forEach(cancion => {
        const item = document.createElement('li');
        item.className = 'item-cancion';

        const fechaFormateada = cancion.fechaAgregada 
            ? new Date(cancion.fechaAgregada).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })
            : 'Fecha desconocida';

        item.innerHTML = `
            <div class="cancion-info">
                <img src="${cancion.caratula}" alt="Carátula de ${cancion.titulo}" class="cancion-caratula">
                <div class="cancion-detalles">
                    <span class="cancion-titulo">${cancion.titulo}</span>
                    <span class="cancion-artista">${cancion.artista}</span>
                </div>
            </div>
            <div class="cancion-metadatos-playlist">
                <span class="cancion-duracion-badge">${cancion.duracion}</span>
                <span class="cancion-fecha-agregada">Agregado el ${fechaFormateada}</span>
            </div>
            <div class="cancion-acciones">
                <button class="btn-eliminar-cancion" title="Quitar canción de la playlist">✕</button>
            </div>
        `;

        // Evento para quitar canción individual (HU6 Criterio 1 y 3)
        item.querySelector('.btn-eliminar-cancion').addEventListener('click', () => {
            mostrarModalConfirmacion(
                'Quitar Canción',
                `¿Estás seguro de que deseas eliminar <strong>"${cancion.titulo}"</strong> de esta playlist?`,
                () => {
                    const eventoQuitar = new CustomEvent('quitarCancionPlaylist', {
                        detail: { playlistId: playlist.id, cancionId: cancion.id },
                        bubbles: true
                    });
                    item.dispatchEvent(eventoQuitar);
                }
            );
        });

        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}