// ============================================================================
// CLASE: Graph
// Representa el grafo completo con nodos y aristas
// ============================================================================

class Graph {
  constructor(n) {
    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    this.n = n;
    this.nodes = [];
    this.edges = [];
    this.adjacencyMatrix = [];
  }

  addNode(node) {
    // Ajustar el límite dinámicamente si es necesario
    if (this.nodes.length >= 16) {
      throw new Error(`No se pueden agregar más de 16 nodos`);
    }

    if (this.nodes.find((n) => n.id === node.id)) {
      throw new Error(`El nodo con id ${node.id} ya existe`);
    }

    this.nodes.push({
      id: node.id,
      name: node.name || `Punto ${node.id}`,
      x: node.x || 0,
      y: node.y || 0,
      wasteAmount: node.wasteAmount || node.waste || 0,
      type: node.type || "residencial",
    });

    // Actualizar el límite n si es necesario
    if (this.nodes.length > this.n) {
      this.n = this.nodes.length;
    }
  }

  addEdge(from, to, distance = null) {
    const nodeFrom = this.nodes.find((n) => n.id === from);
    const nodeTo = this.nodes.find((n) => n.id === to);

    if (!nodeFrom || !nodeTo) {
      throw new Error(`Uno o ambos nodos no existen: ${from}, ${to}`);
    }

    if (distance === null) {
      distance = this.calculateDistance(nodeFrom, nodeTo);
    }

    const time = (distance / 25) * 60;

    this.edges.push({
      from,
      to,
      distance: parseFloat(distance.toFixed(2)),
      time: parseFloat(time.toFixed(2)),
      co2PerKm: 0.2,
    });
  }

  calculateDistance(node1, node2) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy) * 0.01;
  }

  buildAdjacencyMatrix() {
    const n = this.nodes.length;
    this.adjacencyMatrix = Array(n)
      .fill(null)
      .map(() => Array(n).fill(Infinity));

    for (let i = 0; i < n; i++) {
      this.adjacencyMatrix[i][i] = 0;
    }

    this.edges.forEach((edge) => {
      const fromIndex = this.nodes.findIndex((n) => n.id === edge.from);
      const toIndex = this.nodes.findIndex((n) => n.id === edge.to);

      if (fromIndex !== -1 && toIndex !== -1) {
        this.adjacencyMatrix[fromIndex][toIndex] = edge.distance;
        this.adjacencyMatrix[toIndex][fromIndex] = edge.distance;
      }
    });
  }

  getMatrix() {
    if (this.adjacencyMatrix.length === 0) {
      this.buildAdjacencyMatrix();
    }
    return this.adjacencyMatrix;
  }

  hasEdge(from, to) {
    return this.edges.some(
      (e) =>
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
  }

  getDistance(from, to) {
    const edge = this.edges.find(
      (e) =>
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    return edge ? edge.distance : null;
  }

  isComplete() {
    const n = this.nodes.length;
    const expectedEdges = (n * (n - 1)) / 2;
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

  getInfo() {
    return {
      nodeCount: this.nodes.length,
      edgeCount: this.edges.length,
      isComplete: this.isComplete(),
      totalWaste: this.nodes.reduce((sum, node) => sum + node.wasteAmount, 0),
    };
  }
}
