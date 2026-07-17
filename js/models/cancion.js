// Clase que representa una canción y limpia datos de una proveniente de la API
export class Cancion {
    /**
     * @param {Object} trackData - Objeto con los datos crudos que entrega iTunes
     */
    constructor(trackData) {
        // ID único requerido por el contrato técnico usando la API nativa del navegador
        this.id = crypto.randomUUID();
        
        // Extraemos solo lo que nuestra interfaz y las estadísticas necesitan
        this.titulo = trackData.trackName || 'Título Desconocido';
        this.artista = trackData.artistName || 'Artista Desconocido';
        
        // Obtenemos la carátula de 100x100px. Si no hay, colocamos una imagen de respaldo
        this.caratula = trackData.artworkUrl100 || 'https://via.placeholder.com/100?text=Sin+Portada';
        
        // Guardamos el género para las estadísticas del Sprint 2
        this.genero = trackData.primaryGenreName || 'Género Desconocido';
        
        // La API nos da la duración en milisegundos. La transformamos a formato MM:SS
        this.duracion = this.convertirMilisegundos(trackData.trackTimeMillis);
    }

    /**
     * Convierte milisegundos en un formato de tiempo legible para el usuario (MM:SS).
     * @param {number} ms - Tiempo en milisegundos.
     * @returns {string} Tiempo formateado.
     */
    convertirMilisegundos(ms) {
        if (!ms || isNaN(ms)) return '0:00';
        
        const totalSegundos = Math.floor(ms / 1000);
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        
        // Aseguramos que los segundos siempre tengan dos dígitos (ej: "3:05" en lugar de "3:5")
        const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
        
        return `${minutos}:${segundosFormateados}`;
    }
}