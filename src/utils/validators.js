/**
 * validators.js
 * Funciones de validación para el sistema GreenCircuit.
 */

/**
 * Valida que N esté en el rango permitido
 * @param {number} n - Número de nodos
 * @returns {Object} {valid: boolean, message: string}
 */
export function validateN(n) {
  if (typeof n !== "number" || isNaN(n)) {
    return { valid: false, message: "N debe ser un número" };
  }

  if (!Number.isInteger(n)) {
    return { valid: false, message: "N debe ser un número entero" };
  }

  if (n < 8) {
    return { valid: false, message: "N debe ser al menos 8" };
  }

  if (n > 16) {
    return { valid: false, message: "N debe ser máximo 16" };
  }

  return { valid: true, message: "N válido" };
}

/**
 * Valida un nodo
 * @param {Object} node - Nodo a validar
 * @returns {Object} {valid: boolean, message: string}
 */
export function validateNode(node) {
  if (!node || typeof node !== "object") {
    return { valid: false, message: "Nodo debe ser un objeto" };
  }

  if (typeof node.id !== "number") {
    return { valid: false, message: "El nodo debe tener un ID numérico" };
  }

  if (typeof node.x !== "number" || typeof node.y !== "number") {
    return {
      valid: false,
      message: "El nodo debe tener coordenadas x,y numéricas",
    };
  }

  if (
    node.wasteAmount !== undefined &&
    (typeof node.wasteAmount !== "number" || node.wasteAmount < 0)
  ) {
    return { valid: false, message: "wasteAmount debe ser un número positivo" };
  }

  return { valid: true, message: "Nodo válido" };
}

/**
 * Valida una arista
 * @param {Object} edge - Arista a validar
 * @returns {Object} {valid: boolean, message: string}
 */
export function validateEdge(edge) {
  if (!edge || typeof edge !== "object") {
    return { valid: false, message: "Arista debe ser un objeto" };
  }

  if (typeof edge.from !== "number" || typeof edge.to !== "number") {
    return {
      valid: false,
      message: "La arista debe tener from y to numéricos",
    };
  }

  if (edge.from === edge.to) {
    return {
      valid: false,
      message: "Una arista no puede conectar un nodo consigo mismo",
    };
  }

  if (
    edge.distance !== undefined &&
    (typeof edge.distance !== "number" || edge.distance < 0)
  ) {
    return {
      valid: false,
      message: "La distancia debe ser un número positivo",
    };
  }

  return { valid: true, message: "Arista válida" };
}

/**
 * Valida un ciclo hamiltoniano
 * @param {Array<number>} cycle - Ciclo a validar
 * @param {number} n - Número de nodos en el grafo
 * @returns {Object} {valid: boolean, message: string}
 */
export function validateHamiltonianCycle(cycle, n) {
  if (!Array.isArray(cycle)) {
    return { valid: false, message: "El ciclo debe ser un array" };
  }

  if (cycle.length !== n + 1) {
    return { valid: false, message: `El ciclo debe tener ${n + 1} elementos` };
  }

  if (cycle[0] !== cycle[cycle.length - 1]) {
    return {
      valid: false,
      message: "El ciclo debe empezar y terminar en el mismo nodo",
    };
  }

  // Verificar que todos los nodos intermedios sean únicos
  const intermediateNodes = cycle.slice(0, -1);
  const uniqueNodes = new Set(intermediateNodes);

  if (uniqueNodes.size !== n) {
    return {
      valid: false,
      message: "Todos los nodos deben aparecer exactamente una vez",
    };
  }

  return { valid: true, message: "Ciclo hamiltoniano válido" };
}

/**
 * Valida coordenadas
 * @param {number} x - Coordenada x
 * @param {number} y - Coordenada y
 * @param {Object} bounds - {minX, maxX, minY, maxY}
 * @returns {Object} {valid: boolean, message: string}
 */
export function validateCoordinates(x, y, bounds = {}) {
  const { minX = 0, maxX = Infinity, minY = 0, maxY = Infinity } = bounds;

  if (typeof x !== "number" || typeof y !== "number") {
    return { valid: false, message: "Las coordenadas deben ser números" };
  }

  if (x < minX || x > maxX) {
    return { valid: false, message: `X debe estar entre ${minX} y ${maxX}` };
  }

  if (y < minY || y > maxY) {
    return { valid: false, message: `Y debe estar entre ${minY} y ${maxY}` };
  }

  return { valid: true, message: "Coordenadas válidas" };
}

export default {
  validateN,
  validateNode,
  validateEdge,
  validateHamiltonianCycle,
  validateCoordinates,
};
