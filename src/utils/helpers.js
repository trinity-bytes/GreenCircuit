/**
 * helpers.js
 * Funciones auxiliares de utilidad general.
 */

/**
 * Calcula la distancia euclidiana entre dos puntos
 * @param {Object} p1 - Punto 1 {x, y}
 * @param {Object} p2 - Punto 2 {x, y}
 * @returns {number} Distancia
 */
export function euclideanDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Formatea un número con separadores de miles
 * @param {number} num - Número a formatear
 * @param {number} decimals - Cantidad de decimales
 * @returns {string} Número formateado
 */
export function formatNumber(num, decimals = 2) {
  return num.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Genera un color aleatorio en formato hexadecimal
 * @returns {string} Color hex
 */
export function randomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Convierte un array de IDs en una cadena legible
 * @param {Array<number>} arr - Array de IDs
 * @returns {string} Cadena formateada
 */
export function arrayToString(arr) {
  return arr.join(" → ");
}

/**
 * Calcula el factorial de un número
 * @param {number} n - Número
 * @returns {number} Factorial
 */
export function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Genera todas las permutaciones de un array
 * @param {Array} arr - Array a permutar
 * @returns {Array<Array>} Array de permutaciones
 */
export function permutations(arr) {
  if (arr.length <= 1) return [arr];

  const result = [];

  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = permutations(rest);

    for (const perm of perms) {
      result.push([arr[i], ...perm]);
    }
  }

  return result;
}

/**
 * Clona un objeto profundamente
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Clon del objeto
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convierte grados a radianes
 * @param {number} degrees - Grados
 * @returns {number} Radianes
 */
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convierte radianes a grados
 * @param {number} radians - Radianes
 * @returns {number} Grados
 */
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Obtiene un valor aleatorio entre min y max
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Valor aleatorio
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Obtiene un entero aleatorio entre min y max (inclusive)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Entero aleatorio
 */
export function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Mezcla un array aleatoriamente (shuffle)
 * @param {Array} arr - Array a mezclar
 * @returns {Array} Array mezclado
 */
export function shuffle(arr) {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Obtiene el timestamp actual
 * @returns {number} Timestamp en milisegundos
 */
export function now() {
  return Date.now();
}

/**
 * Formatea una duración en milisegundos a formato legible
 * @param {number} ms - Milisegundos
 * @returns {string} Duración formateada
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Trunca un string a una longitud máxima
 * @param {string} str - String a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} String truncado
 */
export function truncate(str, maxLength = 50) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}

export default {
  euclideanDistance,
  formatNumber,
  randomColor,
  generateId,
  arrayToString,
  factorial,
  permutations,
  deepClone,
  sleep,
  degreesToRadians,
  radiansToDegrees,
  randomBetween,
  randomIntBetween,
  shuffle,
  now,
  formatDuration,
  truncate,
};
