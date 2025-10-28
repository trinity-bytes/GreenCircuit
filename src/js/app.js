// ============================================================================
// APLICACIÓN GREENCIRCUIT - Lógica Principal
// ============================================================================

console.log("🌱 Iniciando GreenCircuit...");

// ============================================================================
// ESTADO GLOBAL
// ============================================================================
const state = {
  graph: null,
  renderer: null,
  logger: null,
  editor: null,
  n: 10,
  isConfigured: false,
  isGenerated: false,
  currentMode: "slow",
  isExecuting: false,
};

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
function init() {
  console.log("Inicializando componentes...");

  state.renderer = new CytoscapeRenderer(
    document.getElementById("graph-container")
  );
  state.renderer.initialize();

  state.logger = new LogDisplay(document.getElementById("log-container"));
  state.logger.log("🌱 GreenCircuit iniciado", "success");
  state.logger.log(
    "Sistema listo. Configura el número de nodos para comenzar.",
    "info"
  );

  setupEventListeners();

  console.log("✅ GreenCircuit listo");
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
  document
    .getElementById("btn-config")
    .addEventListener("click", onConfigSubmit);
  document
    .getElementById("btn-random")
    .addEventListener("click", () => generateRandom("random"));
  document
    .getElementById("btn-random-circular")
    .addEventListener("click", () => generateRandom("circular"));
  document
    .getElementById("btn-random-grid")
    .addEventListener("click", () => generateRandom("grid"));
  document
    .getElementById("btn-fit-view")
    .addEventListener("click", () => state.renderer.fitView());
  document
    .getElementById("btn-reset-view")
    .addEventListener("click", () => state.renderer.resetView());
  document
    .getElementById("btn-toggle-edit")
    .addEventListener("click", toggleEditMode);
  document
    .getElementById("btn-fast")
    .addEventListener("click", () => setExecutionMode("fast"));
  document
    .getElementById("btn-slow")
    .addEventListener("click", () => setExecutionMode("slow"));
  document
    .getElementById("btn-manual-step")
    .addEventListener("click", () => setExecutionMode("manual"));
  document
    .getElementById("btn-execute")
    .addEventListener("click", executeAlgorithm);
  document
    .getElementById("btn-clear-logs")
    .addEventListener("click", () => state.logger.clear());
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
function onConfigSubmit() {
  const n = parseInt(document.getElementById("input-n").value);

  if (isNaN(n) || n < 8 || n > 16) {
    showStatus("config-status", "❌ Error: N debe estar entre 8 y 16", "error");
    state.logger.log("Error: N debe estar entre 8 y 16", "error");
    return;
  }

  try {
    state.n = n;
    state.graph = new Graph(n);
    state.isConfigured = true;

    // Inicializar editor si no existe
    if (!state.editor) {
      state.editor = new GraphEditor(state.graph, state.renderer, state.logger);
    } else {
      // Actualizar referencia al grafo
      state.editor.graph = state.graph;
    }

    showStatus("config-status", `✅ Configurado: ${n} nodos`, "success");
    state.logger.log(`✅ Grafo configurado con ${n} nodos`, "success");

    document.getElementById("generation-section").classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    showStatus("config-status", `❌ Error: ${error.message}`, "error");
  }
}

// ============================================================================
// GENERACIÓN DE GRAFO
// ============================================================================
function generateRandom(layout = "random") {
  if (!state.isConfigured) {
    state.logger.log(
      "Error: Primero debes configurar el número de nodos",
      "error"
    );
    return;
  }

  state.logger.clear();
  state.logger.log(
    `🎲 Generando ${state.n} nodos en layout ${layout}...`,
    "info"
  );

  try {
    let nodes;

    switch (layout) {
      case "circular":
        nodes = RandomGenerator.generateCircularLayout(state.n, {
          centerX: 400,
          centerY: 250,
        });
        break;
      case "grid":
        nodes = RandomGenerator.generateGridLayout(state.n, {
          width: 800,
          height: 500,
        });
        break;
      default:
        nodes = RandomGenerator.generate(state.n, {
          width: 800,
          height: 500,
        });
    }

    nodes.forEach((node) => state.graph.addNode(node));

    const edges = RandomGenerator.generateCompleteGraph(state.graph.nodes);
    edges.forEach((edge) =>
      state.graph.addEdge(edge.from, edge.to, edge.distance)
    );

    state.renderer.renderGraph(state.graph);

    const info = state.graph.getInfo();
    const stats = RandomGenerator.getStatistics(state.graph.nodes);

    state.logger.log(`✅ Grafo generado exitosamente`, "success");
    state.logger.log(`   Nodos: ${info.nodeCount}`, "info");
    state.logger.log(`   Aristas: ${info.edgeCount}`, "info");
    state.logger.log(`   Total de residuos: ${info.totalWaste} kg`, "info");

    showStatus(
      "generation-status",
      "✅ Grafo generado correctamente",
      "success"
    );
    showGraphInfo(info, stats);

    state.isGenerated = true;

    // Actualizar referencia del editor al grafo
    if (state.editor) {
      state.editor.graph = state.graph;
    }

    document.getElementById("controls-section").classList.remove("hidden");
  } catch (error) {
    state.logger.log(`❌ Error: ${error.message}`, "error");
    showStatus("generation-status", `❌ Error: ${error.message}`, "error");
  }
}

// ============================================================================
// CONTROL DE EJECUCIÓN
// ============================================================================
function setExecutionMode(mode) {
  state.currentMode = mode;
  state.logger.log(`⚙️ Modo de ejecución: ${mode}`, "info");
  showStatus("execution-status", `Modo: ${mode}`, "info");

  if (mode === "manual") {
    document.getElementById("manual-controls").classList.remove("hidden");
  } else {
    document.getElementById("manual-controls").classList.add("hidden");
  }
}

// ============================================================================
// EJECUCIÓN DEL ALGORITMO
// ============================================================================
async function executeAlgorithm() {
  if (!state.isGenerated) {
    state.logger.log("❌ Error: Primero debes generar el grafo", "error");
    return;
  }

  if (state.isExecuting) {
    state.logger.log("⚠️ Ya hay una ejecución en curso", "warning");
    return;
  }

  try {
    state.isExecuting = true;
    document.getElementById("btn-execute").disabled = true;
    document.getElementById("progress-container").classList.remove("hidden");

    state.logger.clear();
    state.logger.log("═══════════════════════════════════════", "separator");
    state.logger.log("▶️ INICIANDO ALGORITMO", "header");
    state.logger.log("═══════════════════════════════════════", "separator");

    updateProgress(10, "Construyendo matriz de adyacencia...");
    await delay(100);

    // FASE 1: Matriz
    state.logger.log("\n--- FASE 1: MATRIZ DE ADYACENCIA ---", "phase");
    state.graph.buildAdjacencyMatrix();
    state.logger.log("✅ Matriz construida", "success");
    state.logger.displayMatrix(state.graph.getMatrix());
    await delay(state.currentMode === "fast" ? 500 : 1000);

    updateProgress(25, "Buscando ciclos hamiltonianos...");

    // FASE 2: Ciclos Hamiltonianos
    state.logger.log("\n--- FASE 2: CICLOS HAMILTONIANOS ---", "phase");

    const finder = new HamiltonianFinder(state.graph);

    // Ejecutar búsqueda de ciclos con actualizaciones de progreso
    const cycles = await findCyclesWithProgress(finder);

    if (cycles.length === 0) {
      state.logger.log("❌ No se encontraron ciclos hamiltonianos", "error");
      return;
    }

    state.logger.log(`✅ Se encontraron ${cycles.length} ciclos`, "success");

    // Mostrar algunos ciclos (no todos si son muchos)
    const cyclesToShow = Math.min(cycles.length, 10);
    state.logger.log(`\nMostrando primeros ${cyclesToShow} ciclos:`, "info");
    for (let i = 0; i < cyclesToShow; i++) {
      state.logger.log(`  Ciclo #${i + 1}: ${cycles[i].join(" → ")}`, "cycle");
    }
    if (cycles.length > cyclesToShow) {
      state.logger.log(
        `  ... y ${cycles.length - cyclesToShow} ciclos más`,
        "info"
      );
    }

    await delay(state.currentMode === "fast" ? 500 : 1000);

    updateProgress(60, "Resolviendo TSP...");

    // FASE 3: TSP
    state.logger.log("\n--- FASE 3: PROBLEMA DEL AGENTE VIAJERO ---", "phase");
    state.logger.log(`Evaluando ${cycles.length} ciclos...`, "info");

    const solver = new TSPSolver(state.graph, cycles);

    // Resolver TSP con actualizaciones de progreso
    const solution = await solveTSPWithProgress(solver);

    updateProgress(90, "Generando resultados...");

    state.logger.log("✅ TSP resuelto", "success");
    await delay(500);

    // FASE 4: Resultados
    state.logger.log("\n--- FASE 4: RESULTADOS ---", "phase");

    const fullSolution = solver.exportResults();
    state.logger.displayResults({
      optimal: fullSolution.optimal,
      worst: fullSolution.worst,
      savings: solution.savings,
      summary: solution.summary,
    });

    state.renderer.highlightPath(fullSolution.optimal.cycle);
    state.logger.log("\n✅ Ruta óptima destacada en el grafo", "success");

    updateProgress(100, "Completado");
    showStatus("execution-status", "✅ Algoritmo completado", "success");
  } catch (error) {
    state.logger.log(`❌ Error: ${error.message}`, "error");
    console.error("Error:", error);
  } finally {
    state.isExecuting = false;
    document.getElementById("btn-execute").disabled = false;
    setTimeout(() => {
      document.getElementById("progress-container").classList.add("hidden");
    }, 2000);
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Función auxiliar para buscar ciclos con pausas (evita congelamiento)
async function findCyclesWithProgress(finder) {
  const startTime = Date.now();
  const cycles = finder.findAllCycles(0);
  const duration = Date.now() - startTime;

  if (duration > 100) {
    await delay(100); // Pausa para que el navegador respire
  }

  updateProgress(50, `Encontrados ${cycles.length} ciclos`);
  return cycles;
}

// Función auxiliar para resolver TSP con pausas
async function solveTSPWithProgress(solver) {
  const solution = solver.solve();
  await delay(100); // Pausa para actualización de UI
  return solution;
}

function updateProgress(percent, message) {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  if (progressFill && progressText) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Progreso: ${percent}% - ${message}`;
  }
}

function showGraphInfo(info, stats) {
  const infoDiv = document.getElementById("graph-info");
  const statsDiv = document.getElementById("graph-stats");

  statsDiv.innerHTML = `
    <p>📊 Nodos: ${info.nodeCount} | Aristas: ${info.edgeCount} | Completo: ${
    info.isComplete ? "Sí" : "No"
  }</p>
    <p>📦 Total residuos: ${
      info.totalWaste
    } kg | Promedio: ${stats.avgWaste.toFixed(1)} kg/punto</p>
    <p>🏘️ Residencial: ${stats.wasteByType.residencial?.count || 0} puntos | 
       🏢 Comercial: ${stats.wasteByType.comercial?.count || 0} puntos | 
       🏭 Industrial: ${stats.wasteByType.industrial?.count || 0} puntos</p>
  `;

  infoDiv.classList.remove("hidden");
}

function showStatus(elementId, message, type = "info") {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.color =
      type === "error" ? "#F44336" : type === "success" ? "#4CAF50" : "#2196F3";
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// MODO EDICIÓN
// ============================================================================

function toggleEditMode() {
  if (!state.editor) {
    state.logger.log("Error: Editor no inicializado", "error");
    return;
  }

  if (!state.isGenerated) {
    alert("⚠️ Primero debes generar un grafo");
    state.logger.log(
      "Advertencia: Genera un grafo antes de activar el modo edición",
      "warning"
    );
    return;
  }

  const btn = document.getElementById("btn-toggle-edit");
  const infoBox = document.getElementById("edit-mode-info");

  if (state.editor.editModeActive) {
    // Desactivar modo edición
    state.editor.disableEditMode();
    btn.classList.remove("active");
    btn.textContent = "✏️ Modo Edición";
    infoBox.classList.add("hidden");
  } else {
    // Activar modo edición
    state.editor.enableEditMode();
    btn.classList.add("active");
    btn.textContent = "🔒 Desactivar Edición";
    infoBox.classList.remove("hidden");
  }
}

function updateGraphInfo() {
  if (!state.graph) return;

  const info = state.graph.getInfo();
  const stats = RandomGenerator.getStatistics(state.graph.nodes);

  showGraphInfo(info, stats);
}

// ============================================================================
// INICIO AUTOMÁTICO
// ============================================================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

console.log("✅ Script cargado completamente");
