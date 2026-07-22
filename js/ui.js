// ==========================================================================
// VISTA / INTERFAZ DE USUARIO (js/ui.js)
// ==========================================================================

/**
 * HU1 - CRITERIO 2: Dibuja el spinner de carga en el contenedor.
 * @param {HTMLElement} contenedor - El elemento del DOM donde se inyectará el spinner.
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
 * @param {HTMLElement} contenedor - El elemento del DOM donde se mostrará el error.
 * @param {string} mensaje - El texto explicativo del error.
 */
export function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <p class="error-mensaje">⚠️ ${mensaje}</p>
    `;
}

/**
 * HU1 - CRITERIOS 3 y 4: Renderiza la lista de canciones o muestra un estado vacío amigable.
 * @param {HTMLElement} contenedor - El elemento del DOM donde se pintarán los resultados.
 * @param {Array} canciones - Arreglo de objetos tipo Cancion.
 */
export function renderizarResultados(contenedor, canciones) {
    // Limpiamos el contenedor (esto oculta automáticamente el spinner de carga)
    contenedor.innerHTML = '';

    // HU1 - CRITERIO 4: Si la búsqueda no arroja resultados (arreglo vacío)
    if (canciones.length === 0) {
        contenedor.innerHTML = `
            <p class="estado-vacio">
                🔍 No encontramos coincidencias para tu búsqueda. <br>
                <small>Intenta verificar la ortografía o buscar otro artista.</small>
            </p>
        `;
        return;
    }

    // HU1 - CRITERIO 3: Al finalizar la búsqueda con éxito, construimos la lista estilo Spotify
    const listaHTML = document.createElement('ul');
    listaHTML.className = 'lista-canciones';

    canciones.forEach(cancion => {
        const item = document.createElement('li');
        item.className = 'item-cancion';
        
        // Estructuramos la tarjeta con carátula (imagen), título, artista y duración
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
        `;
        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}

/**
 * HU2 - CRITERIO 4: Muestra un mensaje amigable si no hay playlists creadas.
 * HU2 - CRITERIO 2: Renderiza la lista completa de playlists en el sidebar.
 * @param {HTMLElement} contenedor - El elemento del DOM donde se pintarán las playlists.
 * @param {Array} playlists - El arreglo con las playlists creadas en el estado.
 */
export function renderizarPlaylists(contenedor, playlists) {
    // Limpiamos el contenedor para evitar duplicados al redibujar
    contenedor.innerHTML = '';

    // HU2 - CRITERIO 4: Si no tengo ninguna playlist creada, se muestra el mensaje amigable
    if (playlists.length === 0) {
        contenedor.innerHTML = `
            <p class="estado-vacio">
                📂 Aún no tienes playlists creadas. <br>
                <small>¡Escribe un nombre arriba y crea la primera!</small>
            </p>
        `;
        return;
    }

    // HU2 - CRITERIO 2: Al tener playlists, las recorremos y las mostramos inmediatamente
    const listaHTML = document.createElement('div');
    listaHTML.className = 'playlists-lista-vertical';

    playlists.forEach(playlist => {
        const item = document.createElement('div');
        item.className = 'item-playlist';
        item.dataset.id = playlist.id; // Guardamos el ID para saber cuál selecciona el usuario más adelante

        item.innerHTML = `
            <span class="playlist-nombre">${playlist.nombre}</span>
            <span class="playlist-info-secundaria">${playlist.canciones.length} canciones</span>
        `;

        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}

/**
 * HU2 - CRITERIO 3: Controla la visibilidad de la advertencia visual para nombres vacíos.
 * @param {HTMLElement} elementoAdvertencia - El elemento span de la advertencia en el HTML.
 * @param {boolean} mostrar - true para mostrar la advertencia, false para ocultarla.
 */
export function alternarAdvertenciaPlaylist(elementoAdvertencia, mostrar) {
    if (mostrar) {
        elementoAdvertencia.classList.remove('ocultar'); // Muestra el mensaje de error en rojo
    } else {
        elementoAdvertencia.classList.add('ocultar');    // Esconde el mensaje de error
    }
}