/**
 * Dibuja el spinner de carga en el contenedor (Criterio 2).
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
 * Muestra un mensaje de error claro en pantalla si falla la conexión (Criterio 5).
 * @param {HTMLElement} contenedor - El elemento del DOM donde se mostrará el error.
 * @param {string} mensaje - El texto explicativo del error.
 */
export function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <p class="error-mensaje">⚠️ ${mensaje}</p>
    `;
}

/**
 * Renderiza la lista de canciones o muestra un estado vacío amigable (Criterios 3 y 4).
 * @param {HTMLElement} contenedor - El elemento del DOM donde se pintarán los resultados.
 * @param {Array} canciones - Arreglo de objetos tipo Cancion.
 */
export function renderizarResultados(contenedor, canciones) {
    // Limpiamos el contenedor (esto oculta automáticamente el spinner de carga)
    contenedor.innerHTML = '';

    // CRITERIO 4: Si la búsqueda no arroja resultados (arreglo vacío)
    if (canciones.length === 0) {
        contenedor.innerHTML = `
            <p class="estado-vacio">
                🔍 No encontramos coincidencias para tu búsqueda. <br>
                <small>Intenta verificar la ortografía o buscar otro artista.</small>
            </p>
        `;
        return;
    }

    // CRITERIO 3: Al finalizar la búsqueda con éxito, construimos la lista estilo Spotify
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
                <!-- Espacio reservado para el botón de agregar de la HU3 en el futuro -->
            </div>
        `;
        listaHTML.appendChild(item);
    });

    contenedor.appendChild(listaHTML);
}