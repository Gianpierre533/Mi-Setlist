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
 * HU1 - CRITERIO 5: Muestra un mensaje de error claro en pantalla si falla la conexión.
 */
export function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <p class="error-mensaje">⚠️ ${mensaje}</p>
    `;
}

/**
 * HU1 - CRITERIOS 3 y 4 | HU3 - CRITERIOS 1 y 3:
 * Renderiza la lista de canciones con controles para añadir a playlists.
 * @param {HTMLElement} contenedor - Dónde se pintan los resultados.
 * @param {Array} canciones - Lista de objetos Cancion.
 * @param {Array} playlists - Lista de playlists actuales para construir el selector.
 */
export function renderizarResultados(contenedor, canciones, playlists = []) {
    contenedor.innerHTML = '';

    // HU1 - CRITERIO 4: Si la búsqueda no arroja resultados
    if (canciones.length === 0) {
        contenedor.innerHTML = `
            <p class="estado-vacio">
                🔍 No encontramos coincidencias para tu búsqueda. <br>
                <small>Intenta verificar la ortografía o buscar otro artista.</small>
            </p>
        `;
        return;
    }

    // HU1 - CRITERIO 3: Construcción de la lista de resultados
    const listaHTML = document.createElement('ul');
    listaHTML.className = 'lista-canciones';

    const hayPlaylists = playlists.length > 0;

    canciones.forEach(cancion => {
        const item = document.createElement('li');
        item.className = 'item-cancion';
        
        // HU3 - CRITERIO 1 y 3: Construimos el menú desplegable con las playlists disponibles
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
            
            <!-- HU3 - CRITERIO 1: Control interactivo para seleccionar playlist -->
            <!-- HU3 - CRITERIO 3: Desactivado si no hay playlists -->
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

        // Si hay playlists, escuchamos el clic en el botón '+' de esta tarjeta
        if (hayPlaylists) {
            const botonAgregar = item.querySelector('.boton-agregar-cancion');
            const select = item.querySelector('.select-playlist');

            botonAgregar.addEventListener('click', () => {
                const playlistId = select.value;
                // Disparamos un evento personalizado con los datos de la canción y la playlist
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
 * HU2 - CRITERIO 4 / CRITERIO 2: Renderiza las playlists en el Sidebar.
 */
export function renderizarPlaylists(contenedor, playlists) {
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
        item.className = 'item-playlist';
        item.dataset.id = playlist.id;

        item.innerHTML = `
            <span class="playlist-nombre">📂 ${playlist.nombre}</span>
            <span class="playlist-info-secundaria">${playlist.canciones.length} canciones</span>
        `;

        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}

/**
 * HU2 - CRITERIO 3: Advertencia de nombre vacío.
 */
export function alternarAdvertenciaPlaylist(elementoAdvertencia, mostrar) {
    if (mostrar) {
        elementoAdvertencia.classList.remove('ocultar');
    } else {
        elementoAdvertencia.classList.add('ocultar');
    }
}

/**
 * HU3 - CRITERIO 2: Muestra un mensaje de confirmación temporal en pantalla.
 * @param {string} mensaje - Texto a mostrar.
 */
export function mostrarToast(mensaje) {
    // Si ya existe un toast activo, lo removemos
    const toastExistente = document.querySelector('.toast-notificacion');
    if (toastExistente) toastExistente.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notificacion';
    toast.textContent = `✓ ${mensaje}`;

    document.body.appendChild(toast);

    // Ocultamos y eliminamos el toast después de 3 segundos
    setTimeout(() => {
        toast.classList.add('ocultar-toast');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}