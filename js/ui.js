// ==========================================================================
// VISTA / INTERFAZ DE USUARIO (js/ui.js)
// ==========================================================================

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
 * HU2 - CRITERIO 2 y 4: Renderiza las playlists en el Sidebar y resalta la activa.
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
            <span class="playlist-nombre">📂 ${playlist.nombre}</span>
            <span class="playlist-info-secundaria">${playlist.canciones.length} canciones</span>
        `;

        // Permitimos hacer clic en la playlist para seleccionarla
        item.addEventListener('click', () => {
            const eventoSeleccionar = new CustomEvent('seleccionarPlaylist', {
                detail: { playlistId: playlist.id },
                bubbles: true
            });
            item.dispatchEvent(eventoSeleccionar);
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
 * HU4 - CRITERIO 1, 2 y 3: Renderiza el contenido detallado de la playlist activa.
 * @param {HTMLElement} contenedor - El div de la vista de detalle.
 * @param {Object} playlist - La playlist seleccionada.
 */
export function renderizarDetallePlaylist(contenedor, playlist) {
    contenedor.innerHTML = '';

    // Encabezado de la playlist
    const headerHTML = document.createElement('div');
    headerHTML.className = 'playlist-header-detalle';
    headerHTML.innerHTML = `
        <div>
            <h1>📂 ${playlist.nombre}</h1>
            <span class="playlist-stats-basicas">${playlist.canciones.length} canciones guardadas</span>
        </div>
        <button id="boton-volver-buscador" class="boton-volver-buscador">🔍 Ir al Buscador</button>
    `;
    contenedor.appendChild(headerHTML);

    // HU4 - CRITERIO 3: Si la playlist seleccionada está vacía, mostrar mensaje amigable
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

    // HU4 - CRITERIO 1 y 2: Renderizar canciones con título, artista, duración y fecha de adición
    const listaHTML = document.createElement('ul');
    listaHTML.className = 'lista-canciones';

    playlist.canciones.forEach(cancion => {
        const item = document.createElement('li');
        item.className = 'item-cancion';

        // Formateamos la fecha a formato legible (ej. 21 de jul. de 2026)
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
        `;

        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}