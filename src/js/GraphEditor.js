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
    this.edgeSelection = null;
    this.edgeSelectionEscHandler = null;
    this.edgeModalEscHandler = null;
    this.edgeTapHandler = null;
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
    this.logger.log(
      "   Selecciona dos nodos para conectar y definir su peso",
      "info"
    );
    this.logger.log("   Haz click en una arista para ajustar su peso", "info");
  }

  disableEditMode() {
    if (!this.editModeActive) return;

    this.editModeActive = false;
    this.isEditMode = false;

    // Desregistrar eventos
    this._unregisterEvents();

    const edgeModal = document.getElementById("edge-modal-overlay");
    if (edgeModal) {
      this._closeEdgeModal(edgeModal);
    } else {
      this._clearEdgeSelection();
    }

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
        if (this.edgeSelection) {
          this._clearEdgeSelection();
          return;
        }
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

    this.nodeTapHandler = (event) => {
      this._handleNodeTap(event);
    };

    this.edgeTapHandler = (event) => {
      this._handleEdgeTap(event);
    };

    cy.on("tap", this.tapHandler);
    cy.on("cxttap", this.ctxHandler); // Right click general
    cy.on("cxttap", "node", this.nodeCtxHandler); // Right click específico en nodos
    cy.on("tap", "node", this.nodeTapHandler);
    cy.on("tap", "edge", this.edgeTapHandler);

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

    if (this.nodeTapHandler) {
      cy.off("tap", "node", this.nodeTapHandler);
    }

    if (this.edgeTapHandler) {
      cy.off("tap", "edge", this.edgeTapHandler);
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
    if (this.graph && typeof this.graph.calculateDistance === "function") {
      const distance = this.graph.calculateDistance(node1, node2);
      return parseFloat(distance.toFixed(2));
    }

    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    return parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2));
  }

  // ============================================================================
  // CONEXIÓN MANUAL DE NODOS
  // ============================================================================

  _extractNumericId(rawId) {
    if (typeof rawId === "number") {
      return rawId;
    }

    if (typeof rawId === "string") {
      if (rawId.startsWith("node-")) {
        const parsed = parseInt(rawId.split("-")[1], 10);
        return Number.isNaN(parsed) ? null : parsed;
      }

      const parsed = parseInt(rawId, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
  }

  _formatNodeLabel(node) {
    if (!node) return "Nodo desconocido";
    const safeId = typeof node.id === "number" ? node.id : 0;
    const letter = String.fromCharCode(65 + (safeId % 26));
    const name = node.name || `Punto ${letter}`;
    return `${name} · ID ${safeId}`;
  }

  _findExistingEdge(fromId, toId) {
    return this.graph.edges.find(
      (edge) =>
        (edge.from === fromId && edge.to === toId) ||
        (edge.from === toId && edge.to === fromId)
    );
  }

  _clearEdgeSelection() {
    if (this.renderer?.cy && this.edgeSelection) {
      const cy = this.renderer.cy;

      if (this.edgeSelection.cyNodeId) {
        const sourceNode = cy.getElementById(this.edgeSelection.cyNodeId);
        if (sourceNode) {
          sourceNode.removeClass("edge-selection");
        }
      }

      if (this.edgeSelection.targetCyId) {
        const targetNode = cy.getElementById(this.edgeSelection.targetCyId);
        if (targetNode) {
          targetNode.removeClass("edge-selection-target");
        }
      }

      if (this.edgeSelection.edgeId) {
        const selectedEdge = cy.getElementById(this.edgeSelection.edgeId);
        if (selectedEdge) {
          selectedEdge.removeClass("edge-selection");
        }
      }
    }

    if (this.edgeSelectionEscHandler) {
      document.removeEventListener("keydown", this.edgeSelectionEscHandler);
      this.edgeSelectionEscHandler = null;
    }

    this.edgeSelection = null;
  }

  _closeEdgeModal(overlay) {
    if (this.edgeModalEscHandler) {
      document.removeEventListener("keydown", this.edgeModalEscHandler);
      this.edgeModalEscHandler = null;
    }

    if (overlay && overlay.parentNode) {
      overlay.remove();
    }

    this._clearEdgeSelection();
  }

  _selectNodeForEdge(cyNode, numericId) {
    if (!cyNode) return;

    this._clearEdgeSelection();

    this.edgeSelection = {
      numericId,
      cyNodeId: cyNode.id(),
      targetCyId: null,
      edgeId: null,
    };

    cyNode.addClass("edge-selection");

    const nodeData = this.graph.nodes.find((node) => node.id === numericId);
    if (nodeData) {
      this.logger.log(
        `Nodo seleccionado: ${this._formatNodeLabel(
          nodeData
        )}. Selecciona otro nodo para crear una conexión.`,
        "info"
      );
    }

    this.edgeSelectionEscHandler = (event) => {
      if (event.key === "Escape") {
        this.logger.log("Selección de conexión cancelada", "info");
        this._clearEdgeSelection();
      }
    };

    document.addEventListener("keydown", this.edgeSelectionEscHandler);
  }

  _showEdgeModal(fromNode, toNode) {
    if (!fromNode || !toNode) {
      return;
    }

    const cy = this.renderer?.cy;
    if (!cy) {
      return;
    }

    const existingEdge = this._findExistingEdge(fromNode.id, toNode.id);
    const existingDistance =
      existingEdge && !Number.isNaN(Number(existingEdge.distance))
        ? Number(existingEdge.distance)
        : null;

    const fromLabel = this._formatNodeLabel(fromNode);
    const toLabel = this._formatNodeLabel(toNode);

    if (existingEdge) {
      this.logger.log(`✏️ Editando peso: ${fromLabel} ↔ ${toLabel}`, "info");
    } else {
      this.logger.log(`➕ Definir conexión: ${fromLabel} ↔ ${toLabel}`, "info");
    }

    const suggestedDistance = this._calculateDistance(fromNode, toNode);
    const safeSuggested =
      typeof suggestedDistance === "number" &&
      !Number.isNaN(suggestedDistance) &&
      suggestedDistance > 0
        ? suggestedDistance
        : 1;

    const defaultDistance =
      existingDistance !== null && existingDistance > 0
        ? existingDistance
        : safeSuggested;

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "edge-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "node-modal edge-modal";

    const suggestionLabel = safeSuggested.toFixed(2);
    const defaultValue = defaultDistance.toFixed(2);
    const existingLabel =
      existingDistance !== null
        ? `<div class="form-info"><p><strong>Peso actual:</strong> ${existingDistance.toFixed(
            2
          )} km</p></div>`
        : "";

    modal.innerHTML = `
      <div class="modal-header">
        <h3>🔗 Conectar nodos</h3>
        <button class="modal-close" type="button">✖</button>
      </div>
      <div class="modal-body">
        <p>Configura el peso de la arista entre <strong>${fromLabel}</strong> y <strong>${toLabel}</strong>.</p>
        <div class="form-group">
          <label for="edge-distance-input">Peso / Distancia (km)</label>
          <input type="number" id="edge-distance-input" min="0.1" step="0.1" value="${defaultValue}" />
          <small>Sugerencia automática: ${suggestionLabel} km</small>
        </div>
        ${existingLabel}
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" data-action="cancel">Cancelar</button>
        <button class="btn-confirm" data-action="confirm">✅ Guardar conexión</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const sourceCyNode = cy.getElementById(`node-${fromNode.id}`);
    const targetCyNode = cy.getElementById(`node-${toNode.id}`);

    if (sourceCyNode) {
      sourceCyNode.addClass("edge-selection");
      if (this.edgeSelection) {
        this.edgeSelection.cyNodeId = sourceCyNode.id();
      }
    }

    if (targetCyNode) {
      targetCyNode.addClass("edge-selection-target");
      if (this.edgeSelection) {
        this.edgeSelection.targetCyId = targetCyNode.id();
      }
    }

    let edgeCollection = null;

    if (this.edgeSelection?.edgeId) {
      edgeCollection = cy.getElementById(this.edgeSelection.edgeId);
    }

    if (!edgeCollection || edgeCollection.length === 0) {
      edgeCollection = cy.edges(
        `[source = "node-${fromNode.id}"][target = "node-${toNode.id}"], [source = "node-${toNode.id}"][target = "node-${fromNode.id}"]`
      );
    }

    if (edgeCollection && edgeCollection.length > 0) {
      edgeCollection.addClass("edge-selection");
      if (this.edgeSelection) {
        this.edgeSelection.edgeId = edgeCollection[0].id();
      }
    }

    overlay.addEventListener("click", (event) => {
      const target = event.target;

      if (target.classList.contains("modal-close")) {
        event.preventDefault();
        this.logger.log("Conexión cancelada", "info");
        this._closeEdgeModal(overlay);
        return;
      }

      if (target.dataset.action === "cancel") {
        event.preventDefault();
        this.logger.log("Conexión cancelada", "info");
        this._closeEdgeModal(overlay);
        return;
      }

      if (target.dataset.action === "confirm") {
        event.preventDefault();
        event.stopPropagation();
        this._addEdgeFromForm(fromNode, toNode, overlay);
        return;
      }

      if (target === overlay) {
        this.logger.log("Conexión cancelada", "info");
        this._closeEdgeModal(overlay);
      }
    });

    this.edgeModalEscHandler = (event) => {
      if (event.key === "Escape") {
        this.logger.log("Conexión cancelada", "info");
        this._closeEdgeModal(overlay);
      }
    };
    document.addEventListener("keydown", this.edgeModalEscHandler);

    setTimeout(() => {
      const input = modal.querySelector("#edge-distance-input");
      if (input) {
        input.focus();
        input.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            this._addEdgeFromForm(fromNode, toNode, overlay);
          }
        });
      }
    }, 50);
  }

  _addEdgeFromForm(fromNode, toNode, overlay) {
    if (!overlay) return;

    const input = overlay.querySelector("#edge-distance-input");
    if (!input) {
      alert("❌ Error: No se encontró el campo de distancia");
      return;
    }

    const rawValue = parseFloat(input.value);

    if (Number.isNaN(rawValue)) {
      alert("⚠️ Ingresa un número válido para la distancia");
      return;
    }

    if (rawValue <= 0) {
      alert("⚠️ La distancia debe ser mayor que cero");
      return;
    }

    const normalizedValue = parseFloat(rawValue.toFixed(2));
    const formattedDistance = normalizedValue.toFixed(2);

    try {
      const result = this.graph.addEdge(
        fromNode.id,
        toNode.id,
        normalizedValue
      );

      if (this.renderer && typeof this.renderer.renderGraph === "function") {
        this.renderer.renderGraph(this.graph);
      }

      const fromLabel = this._formatNodeLabel(fromNode);
      const toLabel = this._formatNodeLabel(toNode);

      if (result?.created) {
        this.logger.log(
          `🔗 Conexión creada: ${fromLabel} ↔ ${toLabel} (${formattedDistance} km)`,
          "success"
        );
        if (window.showToast) {
          window.showToast(
            `Conexión creada: ${fromLabel} ↔ ${toLabel} (${formattedDistance} km)`,
            "success"
          );
        }
      } else {
        this.logger.log(
          `♻️ Conexión actualizada: ${fromLabel} ↔ ${toLabel} (${formattedDistance} km)`,
          "info"
        );
        if (window.showToast) {
          window.showToast(
            `Peso actualizado: ${fromLabel} ↔ ${toLabel} (${formattedDistance} km)`,
            "info"
          );
        }
      }

      if (window.showGraphInfo && window.RandomGenerator) {
        const info = this.graph.getInfo();
        const stats = RandomGenerator.getStatistics(this.graph.nodes);
        window.showGraphInfo(info, stats);
      }

      this._closeEdgeModal(overlay);
    } catch (error) {
      console.error("Error al conectar nodos:", error);
      alert(`❌ Error: ${error.message}`);
    }
  }

  _handleNodeTap(event) {
    if (!this.isEditMode) {
      return;
    }

    if (document.getElementById("edge-modal-overlay")) {
      return;
    }

    const cyNode = event.target;
    if (!cyNode) {
      return;
    }

    if (typeof cyNode.group === "function" && cyNode.group() !== "nodes") {
      return;
    }

    const numericId = this._extractNumericId(cyNode.id());
    if (numericId === null) {
      return;
    }

    if (!this.edgeSelection) {
      this._selectNodeForEdge(cyNode, numericId);
      return;
    }

    if (this.edgeSelection.numericId === numericId) {
      this.logger.log("Selección de conexión cancelada", "info");
      this._clearEdgeSelection();
      return;
    }

    const fromNode = this.graph.nodes.find(
      (node) => node.id === this.edgeSelection.numericId
    );
    const toNode = this.graph.nodes.find((node) => node.id === numericId);

    if (!fromNode || !toNode) {
      this.logger.log(
        "❌ Error: No se pudieron obtener los nodos seleccionados",
        "error"
      );
      this._clearEdgeSelection();
      return;
    }

    // Evitar que el atajo ESC anterior interfiera con el modal
    if (this.edgeSelectionEscHandler) {
      document.removeEventListener("keydown", this.edgeSelectionEscHandler);
      this.edgeSelectionEscHandler = null;
    }

    this.edgeSelection.targetCyId = cyNode.id();
    this.edgeSelection.edgeId = null;

    this._showEdgeModal(fromNode, toNode);
  }

  _handleEdgeTap(event) {
    if (!this.isEditMode) {
      return;
    }

    if (document.getElementById("edge-modal-overlay")) {
      return;
    }

    const cyEdge = event.target;
    if (!cyEdge) {
      return;
    }

    if (typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    const sourceRaw = cyEdge.data("source");
    const targetRaw = cyEdge.data("target");

    const fromId = this._extractNumericId(sourceRaw);
    const toId = this._extractNumericId(targetRaw);

    if (fromId === null || toId === null) {
      this.logger.log(
        "❌ No se pudo identificar la arista seleccionada",
        "error"
      );
      return;
    }

    const fromNode = this.graph.nodes.find((node) => node.id === fromId);
    const toNode = this.graph.nodes.find((node) => node.id === toId);

    if (!fromNode || !toNode) {
      this.logger.log(
        "❌ Error: Nodos asociados a la arista no encontrados",
        "error"
      );
      return;
    }

    this._clearEdgeSelection();

    this.edgeSelection = {
      numericId: fromId,
      cyNodeId: `node-${fromId}`,
      targetCyId: `node-${toId}`,
      edgeId: cyEdge.id(),
    };

    this._showEdgeModal(fromNode, toNode);
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
