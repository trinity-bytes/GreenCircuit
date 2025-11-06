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
    .addEventListener("click", handleConfigSubmit);
  document
    .getElementById("btn-random")
    .addEventListener("click", () => handleGenerateRandom("random"));
  document
    .getElementById("btn-random-circular")
    .addEventListener("click", () => handleGenerateRandom("circular"));
  document
    .getElementById("btn-random-grid")
    .addEventListener("click", () => handleGenerateRandom("grid"));
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
    .getElementById("btn-clear-graph")
    .addEventListener("click", clearGraph);
  document
    .getElementById("btn-fast")
    .addEventListener("click", () => handleSetExecutionMode("fast"));
  document
    .getElementById("btn-slow")
    .addEventListener("click", () => handleSetExecutionMode("slow"));
  document
    .getElementById("btn-manual-step")
    .addEventListener("click", () => handleSetExecutionMode("manual"));
  document
    .getElementById("btn-execute")
    .addEventListener("click", executeAlgorithm);
  document
    .getElementById("btn-clear-logs")
    .addEventListener("click", () => state.logger.clear());

  // Event listeners para los inputs de radio (como respaldo)
  document
    .getElementById("speed-fast")
    .addEventListener("change", () => handleSetExecutionMode("fast"));
  document
    .getElementById("speed-slow")
    .addEventListener("change", () => handleSetExecutionMode("slow"));
  document
    .getElementById("speed-manual")
    .addEventListener("change", () => handleSetExecutionMode("manual"));
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
function onConfigSubmit() {
  // Esta función se mantiene por compatibilidad pero ya no se usa directamente
  // El wizard usa handleConfigSubmit
  handleConfigSubmit();
}

// ============================================================================
// GENERACIÓN DE GRAFO
// ============================================================================
function generateRandom(layout = "random") {
  // Esta función se mantiene por compatibilidad pero ya no se usa directamente
  // El wizard usa handleGenerateRandom
  handleGenerateRandom(layout);
}

// ============================================================================
// CONTROL DE EJECUCIÓN
// ============================================================================
function setExecutionMode(mode) {
  // Esta función se mantiene por compatibilidad pero ya no se usa directamente
  // El wizard usa handleSetExecutionMode
  handleSetExecutionMode(mode);
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
  const clearBtn = document.getElementById("btn-clear-graph");

  if (state.editor.editModeActive) {
    // Desactivar modo edición
    state.editor.disableEditMode();
    btn.classList.remove("active");
    btn.textContent = "✏️ Modo Edición";
    infoBox.classList.add("hidden");
    clearBtn.classList.add("hidden");
  } else {
    // Activar modo edición
    state.editor.enableEditMode();
    btn.classList.add("active");
    btn.textContent = "🔒 Desactivar Edición";
    infoBox.classList.remove("hidden");
    clearBtn.classList.remove("hidden");
  }
}

function updateGraphInfo() {
  if (!state.graph) return;

  const info = state.graph.getInfo();
  const stats = RandomGenerator.getStatistics(state.graph.nodes);

  showGraphInfo(info, stats);
}

function clearGraph() {
  if (!state.graph || state.graph.nodes.length === 0) {
    alert("⚠️ No hay nodos para eliminar");
    return;
  }

  const confirmed = confirm(
    `¿Eliminar todos los ${state.graph.nodes.length} nodos del grafo?\n\nEsta acción no se puede deshacer.`
  );

  if (!confirmed) return;

  // Limpiar el grafo
  state.graph.nodes = [];
  state.graph.edges = [];
  state.graph.adjacencyMatrix = [];

  // Re-renderizar (canvas vacío)
  state.renderer.renderGraph(state.graph);

  // Log
  state.logger.log("🗑️ Grafo limpiado - Todos los nodos eliminados", "warning");
  state.logger.log(
    "   Puedes agregar nodos manualmente o generar un nuevo grafo",
    "info"
  );

  // Ocultar info del grafo
  document.getElementById("graph-info").classList.add("hidden");

  // Cambiar estado
  state.isGenerated = false;

  // Opcional: desactivar modo edición
  if (state.editor && state.editor.editModeActive) {
    toggleEditMode();
  }
}

// Hacer disponible globalmente para GraphEditor
window.showGraphInfo = showGraphInfo;

// ============================================================================
// WIZARD - PROGRESIÓN PASO A PASO
// ============================================================================

const wizardState = {
  currentStep: 1,
  completedSteps: [],
};

function initWizard() {
  // Asegurar que solo el paso 1 esté visible al inicio
  showWizardStep(1);
  updateWizardProgress(1);
}

function showWizardStep(stepNumber) {
  // Ocultar secciones específicas del wizard
  const sections = [
    document.getElementById("config-section"),
    document.getElementById("generation-section"),
    document.getElementById("controls-section"),
  ];

  sections.forEach((section) => {
    if (section) section.classList.add("hidden");
  });

  // La sección de grafo y resultados se manejan por separado
  // El grafo siempre estará visible después de generarse
  // Los resultados aparecen después de ejecutar

  // Mostrar la sección correspondiente al paso
  const sectionMap = {
    1: "config-section",
    2: "generation-section",
    3: "controls-section", // Paso 3 va directo a controles/ejecución
  };

  const sectionToShow = document.getElementById(sectionMap[stepNumber]);
  if (sectionToShow) {
    sectionToShow.classList.remove("hidden");
    // Animación de entrada
    sectionToShow.style.animation = "fadeInUp 0.5s ease-out";
  }

  wizardState.currentStep = stepNumber;
}

function updateWizardProgress(completedStep) {
  // Actualizar indicador visual de progreso
  for (let i = 1; i <= 4; i++) {
    const step = document.querySelector(
      `.wizard-step[data-step="${i}"] .wizard-step-number`
    );
    const stepContainer = document.querySelector(
      `.wizard-step[data-step="${i}"]`
    );

    if (!step || !stepContainer) continue;

    if (i < completedStep) {
      // Pasos completados
      stepContainer.classList.add("completed");
      stepContainer.classList.remove("active");
      step.innerHTML = "✓";
    } else if (i === completedStep) {
      // Paso actual
      stepContainer.classList.add("active");
      stepContainer.classList.remove("completed");
      step.textContent = i;
    } else {
      // Pasos futuros
      stepContainer.classList.remove("active", "completed");
      step.textContent = i;
    }
  }

  // Marcar paso como completado
  if (!wizardState.completedSteps.includes(completedStep - 1)) {
    wizardState.completedSteps.push(completedStep - 1);
  }
}

function advanceWizard() {
  // Máximo 3 pasos en el wizard (Config → Generación → Ejecución)
  if (wizardState.currentStep < 3) {
    const nextStep = wizardState.currentStep + 1;
    showWizardStep(nextStep);
    updateWizardProgress(nextStep);
    state.logger.log(`📋 Avanzando al paso ${nextStep}`, "info");
  }
}

// ============================================================================
// HANDLERS CON INTEGRACIÓN DE WIZARD
// ============================================================================

function handleConfigSubmit() {
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

    // Avanzar al paso 2 después de configurar
    setTimeout(() => advanceWizard(), 500);
  } catch (error) {
    console.error("Error:", error);
    showStatus("config-status", `❌ Error: ${error.message}`, "error");
  }
}

function handleGenerateRandom(layout = "random") {
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

    // Avanzar al paso 3 después de generar
    setTimeout(() => advanceWizard(), 800);
  } catch (error) {
    state.logger.log(`❌ Error: ${error.message}`, "error");
    showStatus("generation-status", `❌ Error: ${error.message}`, "error");
  }
}

function handleSetExecutionMode(mode) {
  state.currentMode = mode;
  state.logger.log(`⚙️ Modo de ejecución: ${mode}`, "info");
  showStatus("execution-status", `Modo: ${mode}`, "info");

  if (mode === "manual") {
    document.getElementById("manual-controls").classList.remove("hidden");
  } else {
    document.getElementById("manual-controls").classList.add("hidden");
  }

  // Actualizar visualización de las tarjetas de velocidad
  document.querySelectorAll(".speed-card").forEach((card) => {
    card.classList.remove("active");
  });
  const selectedCard = document.querySelector(
    `.speed-card[data-speed="${mode}"]`
  );
  if (selectedCard) {
    selectedCard.classList.add("active");
  }

  // Marcar paso 3 como completo (selección de velocidad)
  // y avanzar visualmente al paso 4 (ejecución)
  if (wizardState.currentStep === 3) {
    updateWizardProgress(4);
    state.logger.log(
      `✅ Configuración completa. Listo para ejecutar`,
      "success"
    );
  }
}

// ============================================================================
// INICIO AUTOMÁTICO
// ============================================================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
    initWizard();
  });
} else {
  init();
  initWizard();
}

console.log("✅ Script cargado completamente");
