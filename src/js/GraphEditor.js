// ============================================================================
// CLASE: GraphEditor
// Permite la edición manual del grafo (agregar, eliminar, mover nodos)
// ============================================================================

class GraphEditor {
  constructor(graph, renderer, logger) {
    this.graph = graph;
    this.renderer = renderer;
    this.logger = logger;
    this.isEditMode = false;
    this.editModeActive = false;
  }

  // ============================================================================
  // CONTROL DE MODO EDICIÓN
  // ============================================================================

  enableEditMode() {
    if (this.editModeActive) return;

    this.editModeActive = true;
    this.isEditMode = true;

    // Registrar eventos de Cytoscape
    this._registerEvents();

    // Cambiar cursor del canvas
    this.renderer.cy.container().style.cursor = "crosshair";

    this.logger.log(
      "✏️ Modo edición activado - Click en el canvas para agregar nodos",
      "info"
    );
    this.logger.log("   Click derecho en un nodo para eliminarlo", "info");
  }

  disableEditMode() {
    if (!this.editModeActive) return;

    this.editModeActive = false;
    this.isEditMode = false;

    // Desregistrar eventos
    this._unregisterEvents();

    // Restaurar cursor
    this.renderer.cy.container().style.cursor = "default";

    this.logger.log("✏️ Modo edición desactivado", "info");
  }

  toggleEditMode() {
    if (this.editModeActive) {
      this.disableEditMode();
    } else {
      this.enableEditMode();
    }
  }

  // ============================================================================
  // EVENTOS
  // ============================================================================

  _registerEvents() {
    const cy = this.renderer.cy;

    // Click en canvas (fondo) para agregar nodo
    this.tapHandler = (event) => {
      if (event.target === cy && this.isEditMode) {
        const pos = event.position;
        this._showAddNodeModal(pos.x, pos.y);
      }
    };

    // Click derecho en nodo para eliminar
    this.ctxHandler = (event) => {
      if (event.target !== cy && this.isEditMode) {
        event.preventDefault();
        const nodeId = event.target.data("id");
        this._confirmDeleteNode(nodeId);
      }
    };

    cy.on("tap", this.tapHandler);
    cy.on("cxttap", this.ctxHandler); // Right click
  }

  _unregisterEvents() {
    const cy = this.renderer.cy;

    if (this.tapHandler) {
      cy.off("tap", this.tapHandler);
    }

    if (this.ctxHandler) {
      cy.off("cxttap", this.ctxHandler);
    }
  }

  // ============================================================================
  // AGREGAR NODO
  // ============================================================================

  _showAddNodeModal(x, y) {
    // Validar límite de nodos
    if (this.graph.nodes.length >= 16) {
      alert("❌ Máximo 16 nodos permitidos");
      this.logger.log("Error: Máximo 16 nodos permitidos", "error");
      return;
    }

    // Crear modal
    const modal = this._createModal(x, y);
    document.body.appendChild(modal);

    // Focus en primer input
    setTimeout(() => {
      const firstInput = modal.querySelector("input");
      if (firstInput) firstInput.focus();
    }, 100);
  }

  _createModal(x, y) {
    // Crear overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "node-modal-overlay";

    // Crear modal
    const modal = document.createElement("div");
    modal.className = "node-modal";

    // Generar ID del próximo nodo
    const nextId = this.graph.nodes.length;
    const nextLetter = String.fromCharCode(65 + nextId); // A, B, C, ...

    modal.innerHTML = `
      <div class="modal-header">
        <h3>➕ Agregar Nuevo Nodo</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✖</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="node-name">Nombre del punto:</label>
          <input type="text" id="node-name" value="Punto ${nextLetter}" placeholder="Ej: Punto A">
        </div>

        <div class="form-group">
          <label for="node-type">Tipo de zona:</label>
          <select id="node-type">
            <option value="residencial">🏘️ Residencial</option>
            <option value="comercial">🏢 Comercial</option>
            <option value="industrial">🏭 Industrial</option>
          </select>
        </div>

        <div class="form-group">
          <label for="node-waste">Cantidad de residuos (kg):</label>
          <input type="number" id="node-waste" value="50" min="10" max="200" step="5">
          <small>Entre 10 y 200 kg</small>
        </div>

        <div class="form-info">
          <p><strong>Coordenadas:</strong> X: ${x.toFixed(0)}, Y: ${y.toFixed(
      0
    )}</p>
          <p><strong>ID:</strong> ${nextId}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
        <button class="btn-confirm" id="btn-add-node">✅ Agregar Nodo</button>
      </div>
    `;

    overlay.appendChild(modal);

    // Evento del botón confirmar
    const btnConfirm = modal.querySelector("#btn-add-node");
    btnConfirm.addEventListener("click", () => {
      this._addNodeFromForm(x, y, overlay);
    });

    // Cerrar con ESC
    const escHandler = (e) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);

    // Enter en inputs para confirmar
    modal.querySelectorAll("input").forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          btnConfirm.click();
        }
      });
    });

    return overlay;
  }

  _addNodeFromForm(x, y, overlay) {
    // Obtener valores del formulario
    const name = document.getElementById("node-name").value.trim();
    const type = document.getElementById("node-type").value;
    const waste = parseInt(document.getElementById("node-waste").value);

    // Validar
    if (!name) {
      alert("⚠️ El nombre no puede estar vacío");
      return;
    }

    if (isNaN(waste) || waste < 10 || waste > 200) {
      alert("⚠️ Los residuos deben estar entre 10 y 200 kg");
      return;
    }

    // Crear nodo
    const node = {
      id: this.graph.nodes.length,
      name: name,
      x: x,
      y: y,
      type: type,
      waste: waste,
    };

    // Agregar al grafo
    this.graph.addNode(node);

    // Conectar con todos los nodos existentes (grafo completo)
    this._connectNewNode(node);

    // Re-renderizar
    this.renderer.renderGraph(this.graph);

    // Log
    this.logger.log(
      `✅ Nodo agregado: ${name} (${type}, ${waste} kg)`,
      "success"
    );

    // Cerrar modal
    overlay.remove();
  }

  _connectNewNode(newNode) {
    // Conectar el nuevo nodo con todos los existentes
    for (let i = 0; i < this.graph.nodes.length - 1; i++) {
      const existingNode = this.graph.nodes[i];
      const distance = this._calculateDistance(newNode, existingNode);

      this.graph.addEdge(newNode.id, existingNode.id, distance);
    }
  }

  _calculateDistance(node1, node2) {
    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    return parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2));
  }

  // ============================================================================
  // ELIMINAR NODO
  // ============================================================================

  _confirmDeleteNode(nodeId) {
    const node = this.graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const confirmed = confirm(
      `¿Eliminar el nodo "${node.name}"?\n\nEsto también eliminará todas sus conexiones.`
    );

    if (confirmed) {
      this._deleteNode(nodeId);
    }
  }

  _deleteNode(nodeId) {
    const node = this.graph.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Eliminar aristas conectadas
    this.graph.edges = this.graph.edges.filter(
      (edge) => edge.from !== nodeId && edge.to !== nodeId
    );

    // Eliminar nodo
    this.graph.nodes = this.graph.nodes.filter((n) => n.id !== nodeId);

    // Re-indexar IDs (opcional, pero mantiene consistencia)
    this.graph.nodes.forEach((node, index) => {
      const oldId = node.id;
      node.id = index;

      // Actualizar referencias en aristas
      this.graph.edges.forEach((edge) => {
        if (edge.from === oldId) edge.from = index;
        if (edge.to === oldId) edge.to = index;
      });
    });

    // Re-renderizar
    this.renderer.renderGraph(this.graph);

    // Log
    this.logger.log(`🗑️ Nodo eliminado: ${node.name}`, "warning");
    this.logger.log(`   Nodos restantes: ${this.graph.nodes.length}`, "info");
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  getStatus() {
    return {
      isEditMode: this.isEditMode,
      editModeActive: this.editModeActive,
      nodeCount: this.graph.nodes.length,
      maxNodes: 16,
      canAddMore: this.graph.nodes.length < 16,
    };
  }
}
