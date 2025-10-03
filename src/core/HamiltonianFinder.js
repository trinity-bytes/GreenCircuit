/**
 * HamiltonianFinder.js
 * Implementa algoritmo de backtracking para encontrar TODOS los ciclos hamiltonianos
 * en el grafo. Un ciclo hamiltoniano visita cada nodo exactamente una vez y regresa al inicio.
 */

export default class HamiltonianFinder {
  constructor(graph) {
    this.graph = graph;
    this.cycles = []; // Todos los ciclos encontrados
    this.steps = []; // Pasos del algoritmo para logging
    this.visitCount = 0; // Contador de nodos visitados (para debugging)
  }

  /**
   * Encuentra todos los ciclos hamiltonianos en el grafo
   * @param {number} startNode - Nodo inicial (por defecto 0)
   * @returns {Array<Array<number>>} Array de ciclos (cada ciclo es un array de IDs de nodos)
   */
  findAllCycles(startNode = 0) {
    this.cycles = [];
    this.steps = [];
    this.visitCount = 0;

    const n = this.graph.nodes.length;

    if (n < 3) {
      this.log(
        "El grafo debe tener al menos 3 nodos para ciclos hamiltonianos",
        "warning"
      );
      return [];
    }

    this.log(
      `Iniciando búsqueda de ciclos hamiltonianos desde nodo ${startNode}`,
      "info"
    );
    this.log(`Total de nodos: ${n}`, "info");

    // Array para marcar nodos visitados
    const visited = Array(n).fill(false);

    // Camino actual
    const path = [startNode];
    visited[startNode] = true;

    // Iniciar backtracking
    this._backtrack(path, visited, startNode, startNode);

    this.log(
      `Búsqueda completada. Se encontraron ${this.cycles.length} ciclos hamiltonianos`,
      "success"
    );

    return this.cycles;
  }

  /**
   * Algoritmo de backtracking recursivo
   * @param {Array<number>} path - Camino actual
   * @param {Array<boolean>} visited - Nodos visitados
   * @param {number} currentNode - Nodo actual
   * @param {number} startNode - Nodo inicial
   */
  _backtrack(path, visited, currentNode, startNode) {
    this.visitCount++;

    const n = this.graph.nodes.length;

    // Caso base: si hemos visitado todos los nodos
    if (path.length === n) {
      // Verificar si hay arista de vuelta al nodo inicial
      if (this.graph.hasEdge(currentNode, startNode)) {
        // Ciclo hamiltoniano encontrado
        const cycle = [...path, startNode]; // Agregar nodo inicial al final
        this.cycles.push(cycle);

        this.log(
          `✓ Ciclo #${this.cycles.length} encontrado: ${cycle.join(" → ")}`,
          "cycle"
        );
      } else {
        this.log(
          `✗ Camino completo pero sin arista de retorno: ${path.join(" → ")}`,
          "attempt"
        );
      }
      return;
    }

    // Intentar visitar cada nodo no visitado
    for (let i = 0; i < n; i++) {
      const nextNode = this.graph.nodes[i].id;

      // Si el nodo no ha sido visitado y existe una arista desde el nodo actual
      if (!visited[i] && this.graph.hasEdge(currentNode, nextNode)) {
        // Registrar intento
        this.log(`Explorando: ${path.join(" → ")} → ${nextNode}`, "exploring");

        // Marcar como visitado y agregar al camino
        visited[i] = true;
        path.push(nextNode);

        // Llamada recursiva
        this._backtrack(path, visited, nextNode, startNode);

        // Backtrack: desmarcar y quitar del camino
        visited[i] = false;
        path.pop();

        this.log(
          `Retrocediendo desde ${nextNode}. Camino actual: ${path.join(" → ")}`,
          "backtrack"
        );
      }
    }
  }

  /**
   * Registra un paso del algoritmo
   * @param {string} message - Mensaje a registrar
   * @param {string} type - Tipo de mensaje
   */
  log(message, type = "info") {
    const step = {
      message,
      type,
      timestamp: Date.now(),
      visitCount: this.visitCount,
    };
    this.steps.push(step);
  }

  /**
   * Obtiene todos los pasos registrados
   * @returns {Array<Object>} Array de pasos
   */
  getSteps() {
    return this.steps;
  }

  /**
   * Obtiene la cantidad de ciclos encontrados
   * @returns {number} Cantidad de ciclos
   */
  getCyclesCount() {
    return this.cycles.length;
  }

  /**
   * Obtiene estadísticas de la búsqueda
   * @returns {Object} Estadísticas
   */
  getStatistics() {
    return {
      cyclesFound: this.cycles.length,
      totalSteps: this.steps.length,
      nodesVisited: this.visitCount,
      explorations: this.steps.filter((s) => s.type === "exploring").length,
      backtracks: this.steps.filter((s) => s.type === "backtrack").length,
    };
  }

  /**
   * Verifica si un ciclo es hamiltoniano válido
   * @param {Array<number>} cycle - Ciclo a verificar
   * @returns {boolean} True si es válido
   */
  isValidHamiltonianCycle(cycle) {
    const n = this.graph.nodes.length;

    // Debe tener n+1 elementos (n nodos + regreso al inicio)
    if (cycle.length !== n + 1) {
      return false;
    }

    // El primer y último nodo deben ser iguales
    if (cycle[0] !== cycle[cycle.length - 1]) {
      return false;
    }

    // Verificar que todos los nodos intermedios sean únicos
    const uniqueNodes = new Set(cycle.slice(0, -1));
    if (uniqueNodes.size !== n) {
      return false;
    }

    // Verificar que todas las aristas existan
    for (let i = 0; i < cycle.length - 1; i++) {
      if (!this.graph.hasEdge(cycle[i], cycle[i + 1])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Obtiene los ciclos únicos (elimina duplicados causados por rotaciones)
   * Por ejemplo: [0,1,2,3,0] es el mismo que [1,2,3,0,1]
   * @returns {Array<Array<number>>} Ciclos únicos
   */
  getUniqueCycles() {
    if (this.cycles.length === 0) {
      return [];
    }

    const uniqueCycles = [];
    const seen = new Set();

    for (const cycle of this.cycles) {
      // Normalizar el ciclo: empezar desde el nodo con ID mínimo
      const normalized = this._normalizeCycle(cycle);
      const key = normalized.join("-");

      if (!seen.has(key)) {
        seen.add(key);
        uniqueCycles.push(cycle);
      }
    }

    return uniqueCycles;
  }

  /**
   * Normaliza un ciclo para comparación
   * @param {Array<number>} cycle - Ciclo a normalizar
   * @returns {Array<number>} Ciclo normalizado
   */
  _normalizeCycle(cycle) {
    const withoutLast = cycle.slice(0, -1); // Quitar el último (que es igual al primero)
    const minIndex = withoutLast.indexOf(Math.min(...withoutLast));

    // Rotar el array para que empiece con el mínimo
    const rotated = [
      ...withoutLast.slice(minIndex),
      ...withoutLast.slice(0, minIndex),
    ];

    return rotated;
  }

  /**
   * Exporta los ciclos encontrados
   * @returns {Object} Información de los ciclos
   */
  exportCycles() {
    return {
      cycles: this.cycles,
      count: this.cycles.length,
      uniqueCount: this.getUniqueCycles().length,
      statistics: this.getStatistics(),
    };
  }
}
