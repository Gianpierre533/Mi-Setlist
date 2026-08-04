// FUNCIONES AUXILIARES Y CÁLCULOS (js/utils.js)

/**
 * Convierte milisegundos acumulados a un formato legible ("X min" o "X h Y min").
 * @param {number} msTotal 
 * @returns {string}
 */
export function formatearDuracionTotal(msTotal) {
  if (!msTotal || msTotal <= 0) return '0 min';

  const segundosTotales = Math.floor(msTotal / 1000);
  const minutosTotales = Math.floor(segundosTotales / 60);
  const horas = Math.floor(minutosTotales / 60);
  const minutosRestantes = minutosTotales % 60;

  if (horas > 0) {
    return `${horas} h ${minutosRestantes} min`;
  }
  return `${minutosTotales} min`;
}

/**
 * HU5: Calcula las estadísticas principales de un conjunto de canciones.
 * @param {Array} canciones 
 * @returns {Object} { duracionTotal, totalCanciones, artistaTop, generoTop }
 */
export function calcularEstadisticasPlaylist(canciones = []) {
  if (!canciones.length) {
    return {
      duracionTotal: '0 min',
      totalCanciones: 0,
      artistaTop: 'N/A',
      generoTop: 'N/A'
    };
  }

  let msAcumulados = 0;
  const conteoArtistas = {};
  const conteoGeneros = {};

  canciones.forEach(cancion => {
    // Suma de tiempo (iTunes entrega trackTimeMillis)
    if (cancion.duracionMs) {
      msAcumulados += cancion.duracionMs;
    }

    // Frecuencia de artista
    if (cancion.artista) {
      conteoArtistas[cancion.artista] = (conteoArtistas[cancion.artista] || 0) + 1;
    }

    // Frecuencia de género (iTunes entrega primaryGenreName)
    const genero = cancion.genero || 'Sin género';
    conteoGeneros[genero] = (conteoGeneros[genero] || 0) + 1;
  });

  // Obtener el artista con más apariciones
  const artistaTop = Object.keys(conteoArtistas).reduce((a, b) => 
    conteoArtistas[a] > conteoArtistas[b] ? a : b, 'N/A'
  );

  // Obtener el género con más apariciones
  const generoTop = Object.keys(conteoGeneros).reduce((a, b) => 
    conteoGeneros[a] > conteoGeneros[b] ? a : b, 'N/A'
  );

  return {
    duracionTotal: formatearDuracionTotal(msAcumulados),
    totalCanciones: canciones.length,
    artistaTop,
    generoTop
  };
}