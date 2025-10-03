/**
 * RandomGenerator.js
 * Genera grafos completos de forma aleatoria con nodos y aristas.
 * Simula puntos de recolección de residuos con datos realistas.
 */

export default class RandomGenerator {
  // Tipos de puntos de recolección
  static WASTE_TYPES = ["residencial", "comercial", "industrial"];

  // Nombres de zonas para puntos
  static ZONE_NAMES = [
    "Centro",
    "Norte",
    "Sur",
    "Este",
    "Oeste",
    "Plaza Mayor",
    "Parque",
    "Mercado",
    "Estación",
    "Universidad",
    "Hospital",
    "Polígono",
    "Barrio Alto",
    "Puerto",
    "Avenida",
    "Residencial",
    "Industrial",
  ];

  /**
   * Genera N nodos aleatorios con coordenadas y datos de residuos
   * @param {number} n - Número de nodos a generar [8-16]
   * @param {Object} options - Opciones de generación
   * @returns {Array<Object>} Array de nodos
   */
  static generate(n, options = {}) {
    const {
      width = 800,
      height = 600,
      minWaste = 20,
      maxWaste = 100,
      seed = null,
    } = options;

    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    // Si se proporciona seed, usar random determinístico (simplificado)
    if (seed !== null) {
      Math.seedrandom = seed;
    }

    const nodes = [];
    const usedNames = new Set();

    for (let i = 0; i < n; i++) {
      // Generar coordenadas con cierta separación mínima
      let x, y, tooClose;
      let attempts = 0;
      const minDistance = Math.min(width, height) / (n / 2);

      do {
        x = Math.random() * (width - 100) + 50; // Margen de 50px
        y = Math.random() * (height - 100) + 50;

        // Verificar que no esté muy cerca de otros nodos
        tooClose = nodes.some((node) => {
          const dx = node.x - x;
          const dy = node.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });

        attempts++;
      } while (tooClose && attempts < 50);

      // Generar nombre único
      let name;
      do {
        const zoneName =
          this.ZONE_NAMES[Math.floor(Math.random() * this.ZONE_NAMES.length)];
        const letter = String.fromCharCode(65 + i); // A, B, C, ...
        name = `Punto ${letter} - ${zoneName}`;
      } while (usedNames.has(name));
      usedNames.add(name);

      // Tipo de residuo con distribución realista
      // 60% residencial, 25% comercial, 15% industrial
      const rand = Math.random();
      let type;
      if (rand < 0.6) {
        type = "residencial";
      } else if (rand < 0.85) {
        type = "comercial";
      } else {
        type = "industrial";
      }

      // Cantidad de residuos según el tipo
      let wasteAmount;
      if (type === "residencial") {
        wasteAmount = Math.floor(Math.random() * (50 - 20 + 1)) + 20; // 20-50 kg
      } else if (type === "comercial") {
        wasteAmount = Math.floor(Math.random() * (80 - 40 + 1)) + 40; // 40-80 kg
      } else {
        wasteAmount = Math.floor(Math.random() * (120 - 60 + 1)) + 60; // 60-120 kg
      }

      nodes.push({
        id: i,
        name,
        x: Math.round(x),
        y: Math.round(y),
        wasteAmount,
        type,
      });
    }

    console.log(`✓ Generados ${n} nodos aleatorios`);
    return nodes;
  }

  /**
   * Genera un grafo completo conectando todos los nodos entre sí
   * @param {Array<Object>} nodes - Array de nodos
   * @returns {Array<Object>} Array de aristas
   */
  static generateCompleteGraph(nodes) {
    const edges = [];
    const n = nodes.length;

    // Conectar cada nodo con todos los demás
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const from = nodes[i];
        const to = nodes[j];

        // Calcular distancia euclidiana
        const distance = this.calculateDistance(from, to);

        edges.push({
          from: from.id,
          to: to.id,
          distance,
        });
      }
    }

    console.log(`✓ Generadas ${edges.length} aristas para grafo completo`);
    return edges;
  }

  /**
   * Calcula la distancia euclidiana entre dos nodos
   * @param {Object} node1 - Primer nodo
   * @param {Object} node2 - Segundo nodo
   * @returns {number} Distancia en km
   */
  static calculateDistance(node1, node2) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    // Cada unidad de coordenada = 0.1 km
    const distance = Math.sqrt(dx * dx + dy * dy) * 0.01;
    return parseFloat(distance.toFixed(2));
  }

  /**
   * Genera un grafo aleatorio parcialmente conectado (no completo)
   * Útil para testing de conectividad
   * @param {Array<Object>} nodes - Array de nodos
   * @param {number} connectivity - Probabilidad de conexión [0-1]
   * @returns {Array<Object>} Array de aristas
   */
  static generatePartialGraph(nodes, connectivity = 0.7) {
    const edges = [];
    const n = nodes.length;

    // Primero asegurar que el grafo es conexo (árbol spanning)
    for (let i = 1; i < n; i++) {
      const from = nodes[i - 1];
      const to = nodes[i];
      const distance = this.calculateDistance(from, to);

      edges.push({
        from: from.id,
        to: to.id,
        distance,
      });
    }

    // Agregar aristas adicionales según conectividad
    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        // Evitar duplicados del spanning tree
        if (Math.random() < connectivity) {
          const from = nodes[i];
          const to = nodes[j];
          const distance = this.calculateDistance(from, to);

          edges.push({
            from: from.id,
            to: to.id,
            distance,
          });
        }
      }
    }

    console.log(`✓ Generado grafo parcial con ${edges.length} aristas`);
    return edges;
  }

  /**
   * Genera coordenadas en forma de círculo (útil para visualización)
   * @param {number} n - Número de nodos
   * @param {Object} options - Opciones {centerX, centerY, radius}
   * @returns {Array<Object>} Array de nodos en círculo
   */
  static generateCircularLayout(n, options = {}) {
    const {
      centerX = 400,
      centerY = 300,
      radius = 200,
      minWaste = 20,
      maxWaste = 100,
    } = options;

    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    const nodes = [];
    const angleStep = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2; // Empezar desde arriba
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const type =
        this.WASTE_TYPES[Math.floor(Math.random() * this.WASTE_TYPES.length)];
      const wasteAmount =
        Math.floor(Math.random() * (maxWaste - minWaste + 1)) + minWaste;
      const zoneName = this.ZONE_NAMES[i % this.ZONE_NAMES.length];

      nodes.push({
        id: i,
        name: `Punto ${String.fromCharCode(65 + i)} - ${zoneName}`,
        x: Math.round(x),
        y: Math.round(y),
        wasteAmount,
        type,
      });
    }

    console.log(`✓ Generados ${n} nodos en layout circular`);
    return nodes;
  }

  /**
   * Genera coordenadas en forma de grid (útil para testing)
   * @param {number} n - Número de nodos
   * @param {Object} options - Opciones de generación
   * @returns {Array<Object>} Array de nodos en grid
   */
  static generateGridLayout(n, options = {}) {
    const {
      width = 800,
      height = 600,
      minWaste = 20,
      maxWaste = 100,
    } = options;

    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    const nodes = [];
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);

    const cellWidth = (width - 100) / cols;
    const cellHeight = (height - 100) / rows;

    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x = 50 + col * cellWidth + cellWidth / 2;
      const y = 50 + row * cellHeight + cellHeight / 2;

      const type =
        this.WASTE_TYPES[Math.floor(Math.random() * this.WASTE_TYPES.length)];
      const wasteAmount =
        Math.floor(Math.random() * (maxWaste - minWaste + 1)) + minWaste;
      const zoneName = this.ZONE_NAMES[i % this.ZONE_NAMES.length];

      nodes.push({
        id: i,
        name: `Punto ${String.fromCharCode(65 + i)} - ${zoneName}`,
        x: Math.round(x),
        y: Math.round(y),
        wasteAmount,
        type,
      });
    }

    console.log(`✓ Generados ${n} nodos en layout grid`);
    return nodes;
  }

  /**
   * Genera estadísticas sobre los nodos generados
   * @param {Array<Object>} nodes - Array de nodos
   * @returns {Object} Estadísticas
   */
  static getStatistics(nodes) {
    const totalWaste = nodes.reduce((sum, node) => sum + node.wasteAmount, 0);
    const wasteByType = {};

    this.WASTE_TYPES.forEach((type) => {
      const nodesOfType = nodes.filter((n) => n.type === type);
      wasteByType[type] = {
        count: nodesOfType.length,
        totalWaste: nodesOfType.reduce((sum, n) => sum + n.wasteAmount, 0),
        avgWaste:
          nodesOfType.length > 0
            ? nodesOfType.reduce((sum, n) => sum + n.wasteAmount, 0) /
              nodesOfType.length
            : 0,
      };
    });

    return {
      totalNodes: nodes.length,
      totalWaste,
      avgWaste: totalWaste / nodes.length,
      wasteByType,
      minWaste: Math.min(...nodes.map((n) => n.wasteAmount)),
      maxWaste: Math.max(...nodes.map((n) => n.wasteAmount)),
    };
  }
}
