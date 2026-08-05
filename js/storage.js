// ==========================================================================
// MÓDULO DE PERSISTENCIA (js/storage.js)
// ==========================================================================

const CLAVE_STORAGE = 'playlists';

/**
 * HU8 - CRITERIO 1 y 2: Carga de playlists con try/catch defensivo interno.
 */
export function cargarPlaylists() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    if (!datos) return [];
    
    try {
        const resultado = JSON.parse(datos);
        return Array.isArray(resultado) ? resultado : [];
    } catch (error) {
        console.error('Error al parsear JSON en storage:', error);
        throw error; // Re-lanza para que app.js active la pantalla de recuperación (HU8)
    }
}

export function guardarPlaylists(playlists) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(playlists));
}

export function limpiarStorage() {
    localStorage.removeItem(CLAVE_STORAGE);
}