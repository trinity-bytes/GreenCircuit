/**
 * Graph.js
 * Clase principal que representa el grafo completo del sistema de recolección.
 * Almacena nodos (puntos de recolección), aristas (conexiones) y la matriz de adyacencia.
 */

export default class Graph {
  constructor(n) {
    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    this.n = n; // Número de nodos
    this.nodes = []; // Array de objetos nodo
    this.edges = []; // Array de aristas
    this.adjacencyMatrix = []; // Matriz N×N
  }

  /**
   * Agrega un nodo al grafo
   * @param {Object} node - {id, name, x, y, wasteAmount, type}
   */
  addNode(node) {
    if (this.nodes.length >= this.n) {
      throw new Error(`No se pueden agregar más de ${this.n} nodos`);
    }

    // Validar que el id no exista
    if (this.nodes.find((n) => n.id === node.id)) {
      throw new Error(`El nodo con id ${node.id} ya existe`);
    }

    this.nodes.push({
      id: node.id,
      name: node.name || `Punto ${node.id}`,
      x: node.x || 0,
      y: node.y || 0,
      wasteAmount: node.wasteAmount || 0,
      type: node.type || "residencial",
    });
  }

  /**
   * Agrega una arista entre dos nodos
   * @param {number} from - ID del nodo origen
   * @param {number} to - ID del nodo destino
   * @param {number} distance - Distancia en km (opcional, se calcula si no se proporciona)
   */
  addEdge(from, to, distance = null) {
    // Validar que los nodos existan
    const nodeFrom = this.nodes.find((n) => n.id === from);
    const nodeTo = this.nodes.find((n) => n.id === to);

    if (!nodeFrom || !nodeTo) {
      throw new Error(`Uno o ambos nodos no existen: ${from}, ${to}`);
    }

    // Calcular distancia si no se proporciona
    if (distance === null) {
      distance = this.calculateDistance(nodeFrom, nodeTo);
    }

    // Calcular tiempo (asumiendo velocidad promedio de 25 km/h en ciudad)
    const time = (distance / 25) * 60; // minutos

    this.edges.push({
      from,
      to,
      distance: parseFloat(distance.toFixed(2)),
      time: parseFloat(time.toFixed(2)),
      co2PerKm: 0.2, // kg CO₂ por km (camión de basura estándar)
    });
  }

  /**
   * Elimina un nodo del grafo
   * @param {number} id - ID del nodo a eliminar
   */
  removeNode(id) {
    this.nodes = this.nodes.filter((n) => n.id !== id);
    this.edges = this.edges.filter((e) => e.from !== id && e.to !== id);
  }

  /**
   * Elimina una arista del grafo
   * @param {number} from - ID del nodo origen
   * @param {number} to - ID del nodo destino
   */
  removeEdge(from, to) {
    this.edges = this.edges.filter(
      (e) =>
        !(e.from === from && e.to === to) && !(e.from === to && e.to === from) // Grafo no dirigido
    );
  }

  /**
   * Calcula la distancia euclidiana entre dos nodos
   * @param {Object} node1 - Primer nodo
   * @param {Object} node2 - Segundo nodo
   * @returns {number} Distancia en km
   */
  calculateDistance(node1, node2) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    // Asumimos que cada unidad de coordenada representa 0.1 km
    return Math.sqrt(dx * dx + dy * dy) * 0.1;
  }

  /**
   * Construye la matriz de adyacencia del grafo
   * Matriz[i][j] = distancia entre nodo i y nodo j
   * Si no hay arista, el valor es Infinity
   */
  buildAdjacencyMatrix() {
    const n = this.nodes.length;
    this.adjacencyMatrix = Array(n)
      .fill(null)
      .map(() => Array(n).fill(Infinity));

    // Diagonal principal = 0 (distancia de un nodo a sí mismo)
    for (let i = 0; i < n; i++) {
      this.adjacencyMatrix[i][i] = 0;
    }

    // Llenar matriz con las aristas existentes
    this.edges.forEach((edge) => {
      const fromIndex = this.nodes.findIndex((n) => n.id === edge.from);
      const toIndex = this.nodes.findIndex((n) => n.id === edge.to);

      if (fromIndex !== -1 && toIndex !== -1) {
        this.adjacencyMatrix[fromIndex][toIndex] = edge.distance;
        this.adjacencyMatrix[toIndex][fromIndex] = edge.distance; // Grafo no dirigido
      }
    });
  }

  /**
   * Obtiene la matriz de adyacencia
   * @returns {Array<Array<number>>} Matriz de adyacencia
   */
  getMatrix() {
    if (this.adjacencyMatrix.length === 0) {
      this.buildAdjacencyMatrix();
    }
    return this.adjacencyMatrix;
  }

  /**
   * Verifica si el grafo es completo (todos los nodos están conectados entre sí)
   * @returns {boolean} True si es completo, false en caso contrario
   */
  isComplete() {
    const n = this.nodes.length;
    // Un grafo completo con n nodos debe tener n(n-1)/2 aristas
    const expectedEdges = (n * (n - 1)) / 2;

    // Contar aristas únicas (considerando que es no dirigido)
    const uniqueEdges = new Set();
    this.edges.forEach((edge) => {
      const key =
        edge.from < edge.to
          ? `${edge.from}-${edge.to}`
          : `${edge.to}-${edge.from}`;
      uniqueEdges.add(key);
    });

    return uniqueEdges.size === expectedEdges;
  }

  /**
   * Verifica si existe una arista entre dos nodos
   * @param {number} from - ID del nodo origen
   * @param {number} to - ID del nodo destino
   * @returns {boolean} True si existe la arista
   */
  hasEdge(from, to) {
    return this.edges.some(
      (e) =>
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
  }

  /**
   * Obtiene la distancia entre dos nodos
   * @param {number} from - ID del nodo origen
   * @param {number} to - ID del nodo destino
   * @returns {number|null} Distancia en km o null si no hay arista
   */
  getDistance(from, to) {
    const edge = this.edges.find(
      (e) =>
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    return edge ? edge.distance : null;
  }

  /**
   * Obtiene información resumida del grafo
   * @returns {Object} Información del grafo
   */
  getInfo() {
    return {
      nodeCount: this.nodes.length,
      edgeCount: this.edges.length,
      isComplete: this.isComplete(),
      totalWaste: this.nodes.reduce((sum, node) => sum + node.wasteAmount, 0),
    };
  }

  /**
   * Exporta el grafo a formato JSON
   * @returns {Object} Representación JSON del grafo
   */
  toJSON() {
    return {
      n: this.n,
      nodes: this.nodes,
      edges: this.edges,
      adjacencyMatrix: this.adjacencyMatrix,
    };
  }

  /**
   * Importa un grafo desde formato JSON
   * @param {Object} json - Representación JSON del grafo
   * @returns {Graph} Nueva instancia de Graph
   */
  static fromJSON(json) {
    const graph = new Graph(json.n);
    json.nodes.forEach((node) => graph.addNode(node));
    json.edges.forEach((edge) =>
      graph.addEdge(edge.from, edge.to, edge.distance)
    );
    return graph;
  }
}
