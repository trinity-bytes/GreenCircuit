/**
 * CytoscapeRenderer.js
 * Renderiza y visualiza el grafo usando Cytoscape.js.
 * Maneja la visualización de nodos, aristas y la ruta óptima.
 */

export default class CytoscapeRenderer {
  constructor(containerElement) {
    this.container = containerElement;
    this.cy = null;
    this.highlightedPath = null;
  }

  /**
   * Inicializa Cytoscape en el contenedor
   */
  initialize() {
    if (!window.cytoscape) {
      console.error("Cytoscape.js no está cargado");
      return;
    }

    this.cy = cytoscape({
      container: this.container,
      elements: [],

      layout: {
        name: "preset", // Usamos coordenadas x,y predefinidas
      },

      style: [
        // Estilos para nodos
        {
          selector: "node",
          style: {
            "background-color": "#4CAF50",
            label: "data(label)",
            width: 40,
            height: 40,
            "font-size": 12,
            "text-valign": "center",
            "text-halign": "center",
            color: "#000",
            "text-outline-width": 2,
            "text-outline-color": "#fff",
          },
        },

        // Estilos para aristas
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 10,
            "text-rotation": "autorotate",
            "text-margin-y": -10,
          },
        },

        // Nodos destacados
        {
          selector: "node.highlighted",
          style: {
            "background-color": "#FF9800",
            width: 50,
            height: 50,
          },
        },

        // Aristas de la ruta óptima
        {
          selector: "edge.optimal-path",
          style: {
            width: 4,
            "line-color": "#2196F3",
            "target-arrow-color": "#2196F3",
            "target-arrow-shape": "triangle",
          },
        },

        // Nodo inicial/final
        {
          selector: "node.start-node",
          style: {
            "background-color": "#F44336",
            width: 50,
            height: 50,
          },
        },

        // Nodos por tipo de residuo
        {
          selector: 'node[type = "residencial"]',
          style: {
            "background-color": "#4CAF50",
          },
        },
        {
          selector: 'node[type = "comercial"]',
          style: {
            "background-color": "#2196F3",
          },
        },
        {
          selector: 'node[type = "industrial"]',
          style: {
            "background-color": "#FF9800",
          },
        },
      ],

      // Interactividad
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    console.log("✓ Cytoscape inicializado");
  }

  /**
   * Renderiza un grafo completo
   * @param {Graph} graph - Grafo a renderizar
   */
  renderGraph(graph) {
    if (!this.cy) {
      console.error("Cytoscape no está inicializado");
      return;
    }

    const elements = [];

    // Agregar nodos
    graph.nodes.forEach((node) => {
      elements.push({
        group: "nodes",
        data: {
          id: `node-${node.id}`,
          label: `${String.fromCharCode(65 + node.id)}\n${node.wasteAmount}kg`,
          type: node.type,
          wasteAmount: node.wasteAmount,
          name: node.name,
        },
        position: {
          x: node.x,
          y: node.y,
        },
      });
    });

    // Agregar aristas
    graph.edges.forEach((edge, index) => {
      elements.push({
        group: "edges",
        data: {
          id: `edge-${index}`,
          source: `node-${edge.from}`,
          target: `node-${edge.to}`,
          label: `${edge.distance.toFixed(1)}km`,
          distance: edge.distance,
        },
      });
    });

    // Limpiar y agregar elementos
    this.cy.elements().remove();
    this.cy.add(elements);

    // Centrar vista
    this.cy.fit(50);

    console.log(
      `✓ Grafo renderizado: ${graph.nodes.length} nodos, ${graph.edges.length} aristas`
    );
  }

  /**
   * Destaca la ruta óptima
   * @param {Array<number>} path - Array de IDs de nodos en la ruta
   */
  highlightPath(path) {
    if (!this.cy) return;

    // Limpiar destacados previos
    this.clearHighlights();

    // Destacar nodos y aristas en la ruta
    for (let i = 0; i < path.length - 1; i++) {
      const fromId = `node-${path[i]}`;
      const toId = `node-${path[i + 1]}`;

      // Destacar nodo
      const node = this.cy.getElementById(fromId);
      if (node.length > 0) {
        node.addClass("highlighted");

        // Marcar el nodo inicial
        if (i === 0) {
          node.addClass("start-node");
        }
      }

      // Destacar arista
      const edge = this.cy.edges(
        `[source = "${fromId}"][target = "${toId}"], [source = "${toId}"][target = "${fromId}"]`
      );
      if (edge.length > 0) {
        edge.addClass("optimal-path");
      }
    }

    this.highlightedPath = path;
    console.log(`✓ Ruta óptima destacada: ${path.join(" → ")}`);
  }

  /**
   * Limpia todos los destacados
   */
  clearHighlights() {
    if (!this.cy) return;

    this.cy.elements().removeClass("highlighted optimal-path start-node");
    this.highlightedPath = null;
  }

  /**
   * Anima el recorrido de una ruta
   * @param {Array<number>} path - Ruta a animar
   * @param {number} speed - Velocidad en ms (por defecto 500)
   */
  async animatePath(path, speed = 500) {
    if (!this.cy) return;

    this.clearHighlights();

    for (let i = 0; i < path.length; i++) {
      const nodeId = `node-${path[i]}`;
      const node = this.cy.getElementById(nodeId);

      if (node.length > 0) {
        // Destacar nodo actual
        node.addClass("highlighted");

        // Si no es el primer nodo, destacar la arista
        if (i > 0) {
          const prevNodeId = `node-${path[i - 1]}`;
          const edge = this.cy.edges(
            `[source = "${prevNodeId}"][target = "${nodeId}"], [source = "${nodeId}"][target = "${prevNodeId}"]`
          );

          if (edge.length > 0) {
            edge.addClass("optimal-path");
          }
        }

        // Esperar
        await this.delay(speed);
      }
    }

    console.log("✓ Animación de ruta completada");
  }

  /**
   * Centra la vista en un nodo específico
   * @param {number} nodeId - ID del nodo
   */
  centerOnNode(nodeId) {
    if (!this.cy) return;

    const node = this.cy.getElementById(`node-${nodeId}`);
    if (node.length > 0) {
      this.cy.center(node);
      this.cy.zoom(1.5);
    }
  }

  /**
   * Ajusta la vista para mostrar todo el grafo
   */
  fitView() {
    if (!this.cy) return;
    this.cy.fit(50);
  }

  /**
   * Resetea el zoom y la posición
   */
  resetView() {
    if (!this.cy) return;
    this.cy.reset();
  }

  /**
   * Obtiene información de un nodo al hacer click
   * @param {Function} callback - Función a ejecutar con los datos del nodo
   */
  onNodeClick(callback) {
    if (!this.cy) return;

    this.cy.on("tap", "node", function (evt) {
      const node = evt.target;
      callback(node.data());
    });
  }

  /**
   * Obtiene información de una arista al hacer click
   * @param {Function} callback - Función a ejecutar con los datos de la arista
   */
  onEdgeClick(callback) {
    if (!this.cy) return;

    this.cy.on("tap", "edge", function (evt) {
      const edge = evt.target;
      callback(edge.data());
    });
  }

  /**
   * Exporta el grafo como imagen PNG
   * @returns {string} Data URL de la imagen
   */
  exportAsPNG() {
    if (!this.cy) return null;

    return this.cy.png({
      full: true,
      scale: 2,
    });
  }

  /**
   * Exporta el grafo como JSON
   * @returns {Object} JSON del grafo
   */
  exportAsJSON() {
    if (!this.cy) return null;
    return this.cy.json();
  }

  /**
   * Destruye la instancia de Cytoscape
   */
  destroy() {
    if (this.cy) {
      this.cy.destroy();
      this.cy = null;
      console.log("✓ Cytoscape destruido");
    }
  }

  /**
   * Helper para delays en animaciones
   * @param {number} ms - Milisegundos
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
