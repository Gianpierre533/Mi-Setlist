// Importamos la función de búsqueda de la API y los controladores de la interfaz
import { buscarCanciones } from './api.js';
import { mostrarCargando, mostrarError, renderizarResultados } from './ui.js';

// Esperamos a que todo el HTML de la página esté completamente cargado en el navegador
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos clave del DOM que creamos en el index.html
    const formulario = document.getElementById('formulario-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    const contenedorResultados = document.getElementById('resultados-busqueda');

    // Escuchamos el evento 'submit' (funciona al hacer clic en "Buscar" o presionar "Enter")
    formulario.addEventListener('submit', async (evento) => {
        // Evitamos que la página se recargue por completo (comportamiento por defecto del formulario)
        evento.preventDefault();

        // Obtenemos el texto ingresado y limpiamos los espacios innecesarios con .trim()
        const termino = inputBusqueda.value.trim();

        // Si el usuario borró el texto y quedó vacío, no hacemos nada
        if (!termino) return;

        try {
            // CRITERIO 2: Mostramos inmediatamente el spinner de carga
            mostrarCargando(contenedorResultados);

            // Consultamos las canciones a la API de iTunes
            const canciones = await buscarCanciones(termino);

            // CRITERIO 3 y 4: Renderizamos los resultados o mostramos el estado vacío amigable
            renderizarResultados(contenedorResultados, canciones);

        } catch (error) {
            // CRITERIO 5: Si la API o la conexión fallan, desplegamos el mensaje de error en pantalla
            mostrarError(
                contenedorResultados, 
                'No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
            );
        }
    });
});