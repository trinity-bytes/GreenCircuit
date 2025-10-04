// ============================================================================
// CLASE: RandomGenerator
// Genera puntos de recolección aleatorios con diferentes layouts
// ============================================================================

class RandomGenerator {
  static WASTE_TYPES = ["residencial", "comercial", "industrial"];
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

  static generate(n, options = {}) {
    const { width = 800, height = 600 } = options;

    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    const nodes = [];
    const usedNames = new Set();

    for (let i = 0; i < n; i++) {
      let x, y, tooClose;
      let attempts = 0;
      const minDistance = Math.min(width, height) / (n / 2);

      do {
        x = Math.random() * (width - 100) + 50;
        y = Math.random() * (height - 100) + 50;

        tooClose = nodes.some((node) => {
          const dx = node.x - x;
          const dy = node.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });

        attempts++;
      } while (tooClose && attempts < 50);

      let name;
      do {
        const zoneName =
          this.ZONE_NAMES[Math.floor(Math.random() * this.ZONE_NAMES.length)];
        const letter = String.fromCharCode(65 + i);
        name = `Punto ${letter} - ${zoneName}`;
      } while (usedNames.has(name));
      usedNames.add(name);

      const rand = Math.random();
      let type;
      if (rand < 0.6) {
        type = "residencial";
      } else if (rand < 0.85) {
        type = "comercial";
      } else {
        type = "industrial";
      }

      let wasteAmount;
      if (type === "residencial") {
        wasteAmount = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      } else if (type === "comercial") {
        wasteAmount = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
      } else {
        wasteAmount = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
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

    return nodes;
  }

  static generateCircularLayout(n, options = {}) {
    const { centerX = 400, centerY = 300, radius = 200 } = options;

    if (n < 8 || n > 16) {
      throw new Error("N debe estar entre 8 y 16");
    }

    const nodes = [];
    const angleStep = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const type =
        this.WASTE_TYPES[Math.floor(Math.random() * this.WASTE_TYPES.length)];
      const wasteAmount = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
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

    return nodes;
  }

  static generateGridLayout(n, options = {}) {
    const { width = 800, height = 600 } = options;

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
      const wasteAmount = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
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

    return nodes;
  }

  static generateCompleteGraph(nodes) {
    const edges = [];
    const n = nodes.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const from = nodes[i];
        const to = nodes[j];

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy) * 0.01;

        edges.push({
          from: from.id,
          to: to.id,
          distance: parseFloat(distance.toFixed(2)),
        });
      }
    }

    return edges;
  }

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
