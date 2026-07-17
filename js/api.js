// Importamos nuestro molde para limpiar cada canción que encontremos
import { Cancion } from './models/cancion.js';

/**
 * Realiza una búsqueda de canciones en la API de iTunes.
 * @param {string} termino - El texto que el usuario ingresó en el buscador.
 * @returns {Promise<Cancion[]>} Una promesa que resuelve a un arreglo de objetos Cancion.
 */
export async function buscarCanciones(termino) {
    // Codificamos el término para que sea seguro ponerlo en la URL (ej: espacios a %20)
    const query = encodeURIComponent(termino);
    const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=15`;

    try {
        const respuesta = await fetch(url);
        
        // Si la respuesta del servidor no es exitosa (ej: error 404 o 500)
        if (!respuesta.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const datos = await respuesta.json();

        // Si la API no devuelve la estructura esperadaa
        if (!datos.results) {
            return [];
        }

        // Aquí ocurre la magia: mapeamos cada resultado crudo pasándolo por el molde Cancion
        return datos.results.map(trackCrudo => new Cancion(trackCrudo));

    } catch (error) {
        // Volvemos a lanzar el error para que ui.js o app.js puedan capturarlo y mostrar el mensaje en pantalla
        console.error('Error al consultar la API de iTunes:', error);
        throw error;
    }
}