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

    console.log("Registrando eventos de GraphEditor"); // Debug

    // Click en canvas (fondo) para agregar nodo
    this.tapHandler = (event) => {
      if (event.target === cy && this.isEditMode) {
        const pos = event.position;
        this._showAddNodeModal(pos.x, pos.y);
      }
    };

    // Click derecho en nodo para eliminar - Enfoque 1: evento general
    this.ctxHandler = (event) => {
      console.log(
        "cxttap detectado:",
        event.target,
        "isEditMode:",
        this.isEditMode
      ); // Debug

      if (event.target !== cy && this.isEditMode) {
        event.preventDefault();
        const nodeId = event.target.data("id");
        const position = event.renderedPosition || event.position;
        console.log("Mostrando menú para nodo:", nodeId, "posición:", position); // Debug
        this._showDeleteMenu(nodeId, position);
      }
    };

    // Click derecho específico en nodos - Enfoque 2: evento en nodos
    this.nodeCtxHandler = (event) => {
      console.log("Click derecho en nodo específico detectado"); // Debug
      if (this.isEditMode) {
        event.preventDefault();
        const nodeId = event.target.data("id");
        const position = event.renderedPosition || event.position;
        console.log("Nodo ID:", nodeId, "Posición:", position); // Debug
        this._showDeleteMenu(nodeId, position);
      }
    };

    cy.on("tap", this.tapHandler);
    cy.on("cxttap", this.ctxHandler); // Right click general
    cy.on("cxttap", "node", this.nodeCtxHandler); // Right click específico en nodos

    console.log("Eventos registrados exitosamente"); // Debug
  }

  _unregisterEvents() {
    const cy = this.renderer.cy;

    if (this.tapHandler) {
      cy.off("tap", this.tapHandler);
    }

    if (this.ctxHandler) {
      cy.off("cxttap", this.ctxHandler);
    }

    if (this.nodeCtxHandler) {
      cy.off("cxttap", "node", this.nodeCtxHandler);
    }

    console.log("Eventos desregistrados"); // Debug
  }

  // ============================================================================
  // AGREGAR NODO
  // ============================================================================

  _showAddNodeModal(x, y) {
    console.log("_showAddNodeModal llamado con x:", x, "y:", y); // Debug

    // Validar límite de nodos
    if (this.graph.nodes.length >= 16) {
      alert("❌ Máximo 16 nodos permitidos");
      this.logger.log("Error: Máximo 16 nodos permitidos", "error");
      return;
    }

    // Crear modal
    const modal = this._createModal(x, y);
    console.log("Modal creado:", modal); // Debug

    document.body.appendChild(modal);
    console.log("Modal agregado al body"); // Debug

    // Focus en primer input
    setTimeout(() => {
      const firstInput = modal.querySelector("input");
      if (firstInput) {
        firstInput.focus();
        console.log("Focus en input"); // Debug
      }
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
        <button class="modal-close" type="button">✖</button>
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
        <button class="btn-cancel" data-action="cancel">Cancelar</button>
        <button class="btn-confirm" id="btn-add-node" data-action="confirm">✅ Agregar Nodo</button>
      </div>
    `;

    overlay.appendChild(modal);

    // Usar delegación de eventos en el overlay
    overlay.addEventListener("click", (e) => {
      const target = e.target;

      // Botón cerrar (X)
      if (target.classList.contains("modal-close")) {
        console.log("Cerrar modal con X");
        overlay.remove();
        return;
      }

      // Botón cancelar
      if (
        target.dataset.action === "cancel" ||
        target.classList.contains("btn-cancel")
      ) {
        console.log("Cancelar");
        overlay.remove();
        return;
      }

      // Botón confirmar
      if (
        target.dataset.action === "confirm" ||
        target.classList.contains("btn-confirm")
      ) {
        console.log("Confirmar - llamando _addNodeFromForm");
        e.preventDefault();
        e.stopPropagation();
        this._addNodeFromForm(x, y, overlay);
        return;
      }

      // Click en overlay (fondo) para cerrar
      if (target === overlay) {
        console.log("Click en overlay, cerrar modal");
        overlay.remove();
      }
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
    setTimeout(() => {
      const inputs = overlay.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            console.log("Enter presionado, agregar nodo");
            this._addNodeFromForm(x, y, overlay);
          }
        });
      });
    }, 10);

    return overlay;
  }

  _addNodeFromForm(x, y, overlay) {
    console.log("_addNodeFromForm llamado"); // Debug

    // Obtener valores del formulario
    const nameInput = document.getElementById("node-name");
    const typeInput = document.getElementById("node-type");
    const wasteInput = document.getElementById("node-waste");

    console.log("Inputs encontrados:", nameInput, typeInput, wasteInput); // Debug

    if (!nameInput || !typeInput || !wasteInput) {
      console.error("No se encontraron los inputs del formulario");
      alert("❌ Error: No se pudieron leer los datos del formulario");
      return;
    }

    const name = nameInput.value.trim();
    const type = typeInput.value;
    const waste = parseInt(wasteInput.value);

    console.log("Valores:", name, type, waste); // Debug

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
      wasteAmount: waste, // Cambiar 'waste' a 'wasteAmount' para coincidir con Graph.js
    };

    console.log("Nodo a agregar:", node); // Debug

    // Agregar al grafo
    try {
      this.graph.addNode(node);
      console.log("Nodo agregado exitosamente"); // Debug
    } catch (error) {
      console.error("Error al agregar nodo:", error);
      alert(`❌ Error: ${error.message}`);
      return;
    }

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

  _showDeleteMenu(nodeId, position) {
    console.log(
      "_showDeleteMenu llamado con nodeId:",
      nodeId,
      "position:",
      position
    ); // Debug

    // Extraer el ID numérico del ID de Cytoscape (ej: "node-2" -> 2)
    const numericId =
      typeof nodeId === "string" && nodeId.startsWith("node-")
        ? parseInt(nodeId.split("-")[1])
        : nodeId;

    console.log("ID numérico extraído:", numericId); // Debug

    const node = this.graph.nodes.find((n) => n.id === numericId);
    if (!node) {
      console.error("Nodo no encontrado con ID:", numericId); // Debug
      return;
    }

    // Cerrar menú previo si existe
    const existingMenu = document.getElementById("delete-context-menu");
    if (existingMenu) existingMenu.remove();

    // Resaltar nodo temporalmente
    const cyNode = this.renderer.cy.getElementById(nodeId);
    if (!cyNode) {
      console.error("Nodo de Cytoscape no encontrado:", nodeId); // Debug
      return;
    }

    cyNode.style("border-width", "4px");
    cyNode.style("border-color", "#f44336");

    // Obtener posición renderizada (en píxeles de la pantalla)
    const renderedPos = cyNode.renderedPosition();
    const containerOffset = this.renderer.cy
      .container()
      .getBoundingClientRect();

    // Calcular posición absoluta del menú
    const menuX = containerOffset.left + renderedPos.x;
    const menuY = containerOffset.top + renderedPos.y;

    console.log("Posición del menú:", menuX, menuY); // Debug

    // Crear menú contextual
    const menu = document.createElement("div");
    menu.id = "delete-context-menu";
    menu.className = "context-menu";
    menu.style.left = menuX + "px";
    menu.style.top = menuY + "px";

    menu.innerHTML = `
      <div class="context-menu-header">
        <strong>${node.name}</strong>
        <span class="node-type-badge ${node.type}">${this._getTypeEmoji(
      node.type
    )}</span>
      </div>
      <div class="context-menu-info">
        <small>ID: ${node.id} | Residuos: ${node.wasteAmount} kg</small>
      </div>
      <div class="context-menu-divider"></div>
      <button class="context-menu-item danger" data-action="delete">
        🗑️ Eliminar Nodo
      </button>
      <button class="context-menu-item" data-action="cancel">
        ❌ Cancelar
      </button>
    `;

    document.body.appendChild(menu);

    // Eventos del menú
    menu.addEventListener("click", (e) => {
      const action = e.target.dataset.action;

      if (action === "delete") {
        this._deleteNode(numericId, nodeId); // Pasar ambos IDs
        menu.remove();
      } else if (action === "cancel") {
        // Restaurar estilo del nodo
        cyNode.style("border-width", "0px");
        menu.remove();
      }
    });

    // Cerrar al hacer click fuera
    const closeHandler = (e) => {
      if (!menu.contains(e.target)) {
        cyNode.style("border-width", "0px");
        menu.remove();
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", closeHandler);
    }, 10);

    // Cerrar con ESC
    const escHandler = (e) => {
      if (e.key === "Escape") {
        cyNode.style("border-width", "0px");
        menu.remove();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  _getTypeEmoji(type) {
    const emojis = {
      residencial: "🏘️",
      comercial: "🏢",
      industrial: "🏭",
    };
    return emojis[type] || "📍";
  }

  _confirmDeleteNode(nodeId) {
    // Extraer el ID numérico si viene de Cytoscape
    const numericId =
      typeof nodeId === "string" && nodeId.startsWith("node-")
        ? parseInt(nodeId.split("-")[1])
        : nodeId;

    const node = this.graph.nodes.find((n) => n.id === numericId);
    if (!node) return;

    const confirmed = confirm(
      `¿Eliminar el nodo "${node.name}"?\n\nEsto también eliminará todas sus conexiones.`
    );

    if (confirmed) {
      this._deleteNode(numericId, nodeId);
    }
  }

  _deleteNode(numericId, cytoscapeId) {
    const node = this.graph.nodes.find((n) => n.id === numericId);
    if (!node) return;

    console.log("Eliminando nodo:", numericId, node); // Debug

    // Si no se proporciona cytoscapeId, construirlo
    const cyNodeId = cytoscapeId || `node-${numericId}`;

    // Animación: hacer que el nodo desaparezca suavemente
    const cyNode = this.renderer.cy.getElementById(cyNodeId);
    if (cyNode) {
      cyNode.animate({
        style: { opacity: 0, width: 10, height: 10 },
        duration: 300,
      });
    }

    // Esperar animación antes de eliminar del grafo
    setTimeout(() => {
      // Eliminar aristas conectadas
      this.graph.edges = this.graph.edges.filter(
        (edge) => edge.from !== numericId && edge.to !== numericId
      );

      // Eliminar nodo
      this.graph.nodes = this.graph.nodes.filter((n) => n.id !== numericId);

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

      // Actualizar info del grafo en la UI
      if (this.graph.nodes.length > 0) {
        const info = this.graph.getInfo();
        const stats = window.RandomGenerator
          ? RandomGenerator.getStatistics(this.graph.nodes)
          : null;
        if (stats) {
          window.showGraphInfo?.(info, stats);
        }
      }
    }, 300);
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
