// ============================================================================
// CLASE: CytoscapeRenderer
// Renderiza y visualiza el grafo usando Cytoscape.js
// ============================================================================

class CytoscapeRenderer {
  constructor(containerElement) {
    this.container = containerElement;
    this.cy = null;
  }

  initialize() {
    if (!window.cytoscape) {
      console.error("Cytoscape.js no está cargado");
      return;
    }

    this.cy = cytoscape({
      container: this.container,
      elements: [],

      layout: {
        name: "preset",
      },

      style: [
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
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#ccc",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 10,
            "text-rotation": "autorotate",
            "text-margin-y": -10,
          },
        },
        {
          selector: "node.highlighted",
          style: {
            "background-color": "#FF9800",
            width: 50,
            height: 50,
          },
        },
        {
          selector: "edge.optimal-path",
          style: {
            width: 4,
            "line-color": "#2196F3",
            "target-arrow-color": "#2196F3",
            "target-arrow-shape": "triangle",
          },
        },
        {
          selector: "node.start-node",
          style: {
            "background-color": "#F44336",
            width: 50,
            height: 50,
          },
        },
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
        {
          selector: "edge.edge-selection",
          style: {
            width: 4,
            "line-color": "#673AB7",
            "target-arrow-color": "#673AB7",
            "text-background-color": "#E8E3FF",
            "text-background-opacity": 0.8,
            "text-background-padding": 2,
            "text-background-shape": "roundrectangle",
            "font-weight": "600",
            "z-index": 2,
          },
        },
        {
          selector: "node.edge-selection",
          style: {
            "border-width": 6,
            "border-color": "#673AB7",
            "background-color": "#EFEBFF",
            "background-opacity": 0.95,
          },
        },
        {
          selector: "node.edge-selection-target",
          style: {
            "border-width": 6,
            "border-color": "#009688",
            "background-color": "#E0F2F1",
            "background-opacity": 0.95,
          },
        },
      ],

      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });
  }

  renderGraph(graph) {
    if (!this.cy) return;

    const elements = [];

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

    this.cy.elements().remove();
    this.cy.add(elements);
    this.cy.fit(50);
  }

  highlightPath(path) {
    if (!this.cy) return;

    this.clearHighlights();

    for (let i = 0; i < path.length - 1; i++) {
      const fromId = `node-${path[i]}`;
      const toId = `node-${path[i + 1]}`;

      const node = this.cy.getElementById(fromId);
      if (node.length > 0) {
        node.addClass("highlighted");
        if (i === 0) {
          node.addClass("start-node");
        }
      }

      const edge = this.cy.edges(
        `[source = "${fromId}"][target = "${toId}"], [source = "${toId}"][target = "${fromId}"]`
      );
      if (edge.length > 0) {
        edge.addClass("optimal-path");
      }
    }
  }

  clearHighlights() {
    if (!this.cy) return;
    this.cy.elements().removeClass("highlighted optimal-path start-node");
  }

  fitView() {
    if (!this.cy) return;
    this.cy.fit(50);
  }

  resetView() {
    if (!this.cy) return;
    this.cy.reset();
  }
}
