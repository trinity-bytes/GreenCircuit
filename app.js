/**
 * app.js
 * Entry point principal de GreenCircuit.
 * Orquesta todos los módulos y gestiona el flujo de la aplicación.
 */

// Importar módulos
import Graph from "./src/core/Graph.js";
import HamiltonianFinder from "./src/core/HamiltonianFinder.js";
import TSPSolver from "./src/core/TSPSolver.js";
import MetricsCalculator from "./src/core/MetricsCalculator.js";
import RandomGenerator from "./src/generators/RandomGenerator.js";
import ExecutionController from "./src/controllers/ExecutionController.js";
import StepByStepManager from "./src/controllers/StepByStepManager.js";
import CytoscapeRenderer from "./src/visualization/CytoscapeRenderer.js";
import LogDisplay from "./src/visualization/LogDisplay.js";

// Estado global de la aplicación
const state = {
  graph: null,
  renderer: null,
  logger: null,
  controller: null,
  manager: null,
  n: 10,
  isConfigured: false,
  isGenerated: false,
  currentMode: "manual",
};

/**
 * Inicialización de la aplicación
 */
function init() {
  console.log("🌱 Iniciando GreenCircuit...");

  try {
    // Inicializar visualización
    console.log("📍 Inicializando CytoscapeRenderer...");
    state.renderer = new CytoscapeRenderer(
      document.getElementById("graph-container")
    );
    state.renderer.initialize();
    console.log("✅ CytoscapeRenderer inicializado");

    // Inicializar logger
    console.log("📍 Inicializando LogDisplay...");
    state.logger = new LogDisplay(document.getElementById("log-container"));
    state.logger.log("🌱 GreenCircuit iniciado", "success");
    state.logger.log(
      "Sistema listo. Configura el número de nodos para comenzar.",
      "info"
    );
    console.log("✅ LogDisplay inicializado");

    // Inicializar controlador de ejecución
    console.log("📍 Inicializando ExecutionController...");
    state.controller = new ExecutionController();
    state.controller.setMode("manual");
    console.log("✅ ExecutionController inicializado");

    // Inicializar manager paso a paso
    console.log("📍 Inicializando StepByStepManager...");
    state.manager = new StepByStepManager(
      state.controller,
      state.renderer,
      state.logger
    );
    console.log("✅ StepByStepManager inicializado");

    // Configurar event listeners
    console.log("📍 Configurando event listeners...");
    setupEventListeners();

    console.log("✅ GreenCircuit listo");
  } catch (error) {
    console.error("❌ Error durante la inicialización:", error);
    alert(
      "Error al inicializar la aplicación. Revisa la consola del navegador (F12)."
    );
  }
}

/**
 * Configuración de event listeners
 */
function setupEventListeners() {
  // 1. CONFIGURACIÓN
  document
    .getElementById("btn-config")
    .addEventListener("click", onConfigSubmit);

  // 2. GENERACIÓN
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
    .getElementById("btn-manual")
    .addEventListener("click", enableManualInput);

  // 3. VISUALIZACIÓN
  document
    .getElementById("btn-fit-view")
    .addEventListener("click", () => state.renderer.fitView());
  document
    .getElementById("btn-reset-view")
    .addEventListener("click", () => state.renderer.resetView());

  // 4. CONTROLES DE EJECUCIÓN
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
    .getElementById("btn-next-step")
    .addEventListener("click", () => state.controller.nextStep());
  document
    .getElementById("btn-execute")
    .addEventListener("click", executeAlgorithm);

  // 5. LOGS
  document
    .getElementById("btn-clear-logs")
    .addEventListener("click", () => state.logger.clear());
  document
    .getElementById("btn-download-logs")
    .addEventListener("click", () => state.logger.downloadLogs());

  console.log("✅ Event listeners configurados");
}

/**
 * Maneja la configuración del número de nodos
 */
function onConfigSubmit() {
  console.log("🔍 onConfigSubmit ejecutado");
  const inputElement = document.getElementById("input-n");
  console.log("📝 Input element:", inputElement);
  const n = parseInt(inputElement.value);
  console.log("📊 Valor de N:", n);

  if (isNaN(n) || n < 8 || n > 16) {
    showStatus("config-status", "❌ Error: N debe estar entre 8 y 16", "error");
    state.logger.log("Error: N debe estar entre 8 y 16", "error");
    return;
  }

  try {
    state.n = n;
    console.log("🎯 Creando Graph con N =", n);
    state.graph = new Graph(n);
    state.isConfigured = true;

    showStatus("config-status", `✅ Configurado: ${n} nodos`, "success");
    state.logger.log(`✅ Grafo configurado con ${n} nodos`, "success");

    // Mostrar sección de generación
    const generationSection = document.getElementById("generation-section");
    console.log("🔍 Generation section:", generationSection);
    console.log("🔍 Classes antes:", generationSection.className);

    generationSection.classList.remove("hidden");

    console.log("🔍 Classes después:", generationSection.className);
    console.log(`✅ Grafo configurado con ${n} nodos`);
  } catch (error) {
    console.error("❌ Error en onConfigSubmit:", error);
    showStatus("config-status", `❌ Error: ${error.message}`, "error");
    state.logger.log(`❌ Error: ${error.message}`, "error");
  }
}

/**
 * Genera grafo aleatorio
 * @param {string} layout - Tipo de layout: 'random', 'circular', 'grid'
 */
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

    // Generar nodos según el layout
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

    // Agregar nodos al grafo
    nodes.forEach((node) => state.graph.addNode(node));

    // Generar grafo completo
    const edges = RandomGenerator.generateCompleteGraph(state.graph.nodes);
    edges.forEach((edge) =>
      state.graph.addEdge(edge.from, edge.to, edge.distance)
    );

    // Renderizar
    state.renderer.renderGraph(state.graph);

    // Mostrar información
    const info = state.graph.getInfo();
    const stats = RandomGenerator.getStatistics(state.graph.nodes);

    state.logger.log(`✅ Grafo generado exitosamente`, "success");
    state.logger.log(`   Nodos: ${info.nodeCount}`, "info");
    state.logger.log(`   Aristas: ${info.edgeCount}`, "info");
    state.logger.log(
      `   Grafo completo: ${info.isComplete ? "Sí" : "No"}`,
      "info"
    );
    state.logger.log(`   Total de residuos: ${info.totalWaste} kg`, "info");

    showStatus(
      "generation-status",
      "✅ Grafo generado correctamente",
      "success"
    );
    showGraphInfo(info, stats);

    state.isGenerated = true;

    // Mostrar controles de ejecución
    document.getElementById("controls-section").classList.remove("hidden");

    console.log("✅ Grafo generado:", info);
  } catch (error) {
    state.logger.log(`❌ Error al generar grafo: ${error.message}`, "error");
    showStatus("generation-status", `❌ Error: ${error.message}`, "error");
  }
}

/**
 * Habilita entrada manual de nodos
 */
function enableManualInput() {
  state.logger.log(
    "ℹ️ Entrada manual no implementada en esta versión",
    "warning"
  );
  state.logger.log("Por favor usa la generación aleatoria", "info");
  showStatus(
    "generation-status",
    "ℹ️ Entrada manual disponible en próxima versión",
    "info"
  );
}

/**
 * Establece el modo de ejecución
 * @param {string} mode - 'fast', 'slow', o 'manual'
 */
function setExecutionMode(mode) {
  state.currentMode = mode;
  state.controller.setMode(mode);

  state.logger.log(`⚙️ Modo de ejecución: ${mode}`, "info");
  showStatus("execution-status", `Modo: ${mode}`, "info");

  // Mostrar/ocultar controles manuales
  if (mode === "manual") {
    document.getElementById("manual-controls").classList.remove("hidden");
  } else {
    document.getElementById("manual-controls").classList.add("hidden");
  }

  console.log(`Modo de ejecución: ${mode}`);
}

/**
 * Ejecuta el algoritmo completo
 */
async function executeAlgorithm() {
  if (!state.isGenerated) {
    state.logger.log("❌ Error: Primero debes generar el grafo", "error");
    showStatus("execution-status", "❌ Genera el grafo primero", "error");
    return;
  }

  try {
    state.logger.clear();
    state.logger.log("═══════════════════════════════════════", "separator");
    state.logger.log("▶️ INICIANDO ALGORITMO", "header");
    state.logger.log("═══════════════════════════════════════", "separator");

    showStatus("execution-status", "⏳ Ejecutando algoritmo...", "info");

    // Deshabilitar botón de ejecución
    document.getElementById("btn-execute").disabled = true;

    // Crear instancias de los algoritmos
    const finder = new HamiltonianFinder(state.graph);
    const cycles = finder.findAllCycles(0);

    if (cycles.length === 0) {
      state.logger.log("❌ No se encontraron ciclos hamiltonianos", "error");
      showStatus("execution-status", "❌ No hay ciclos hamiltonianos", "error");
      return;
    }

    const solver = new TSPSolver(state.graph, cycles);

    // Ejecutar proceso paso a paso
    await executePhasedAlgorithm(finder, solver);

    showStatus("execution-status", "✅ Algoritmo completado", "success");
    document.getElementById("btn-execute").disabled = false;
  } catch (error) {
    state.logger.log(`❌ Error: ${error.message}`, "error");
    console.error("Error en ejecución:", error);
    showStatus("execution-status", `❌ Error: ${error.message}`, "error");
    document.getElementById("btn-execute").disabled = false;
  }
}

/**
 * Ejecuta el algoritmo en fases con control de velocidad
 */
async function executePhasedAlgorithm(finder, solver) {
  // FASE 1: Matriz de Adyacencia
  await executePhase("Matriz de Adyacencia", async () => {
    state.logger.log("\n--- FASE 1: MATRIZ DE ADYACENCIA ---", "phase");
    state.graph.buildAdjacencyMatrix();
    state.logger.log("✅ Matriz construida", "success");
    state.logger.displayMatrix(state.graph.getMatrix());
  });

  // FASE 2: Ciclos Hamiltonianos
  await executePhase("Búsqueda de Ciclos", async () => {
    state.logger.log("\n--- FASE 2: CICLOS HAMILTONIANOS ---", "phase");
    state.logger.log(`Buscando todos los ciclos hamiltonianos...`, "info");

    state.logger.log(
      `✅ Se encontraron ${finder.cycles.length} ciclos`,
      "success"
    );
    state.logger.log("\nCiclos encontrados:", "info");

    finder.cycles.forEach((cycle, i) => {
      state.logger.log(`  Ciclo #${i + 1}: ${cycle.join(" → ")}`, "cycle");
    });

    const stats = finder.getStatistics();
    state.logger.log(`\nEstadísticas:`, "info");
    state.logger.log(`  - Nodos visitados: ${stats.nodesVisited}`, "info");
    state.logger.log(`  - Exploraciones: ${stats.explorations}`, "info");
  });

  // FASE 3: Resolución TSP
  await executePhase("Resolución TSP", async () => {
    state.logger.log("\n--- FASE 3: PROBLEMA DEL AGENTE VIAJERO ---", "phase");
    state.logger.log(`Evaluando ${finder.cycles.length} ciclos...`, "info");

    const solution = solver.solve();

    state.logger.log("✅ TSP resuelto", "success");
  });

  // FASE 4: Resultados
  await executePhase("Resultados", async () => {
    state.logger.log("\n--- FASE 4: RESULTADOS ---", "phase");

    const solution = solver.exportResults();
    state.logger.displayResults(solution);

    // Visualizar ruta óptima
    state.renderer.highlightPath(solution.optimal.cycle);
    state.logger.log("\n✅ Ruta óptima destacada en el grafo", "success");

    // Reporte de impacto ambiental
    const envSummary = MetricsCalculator.generateEnvironmentalSummary(
      solution.optimal,
      solution.worst,
      state.graph.nodes
    );

    state.logger.log(
      MetricsCalculator.generateImpactReport(envSummary),
      "report"
    );
  });
}

/**
 * Ejecuta una fase con control de velocidad
 */
async function executePhase(phaseName, phaseFunction) {
  const delay = state.controller.getDelay();

  if (state.currentMode === "manual") {
    state.logger.log(
      `\n⏸️ [${phaseName}] Presiona "Siguiente Paso" para continuar`,
      "warning"
    );
    await state.controller.waitForClick();
  } else if (delay > 0) {
    await state.controller.delay(delay);
  }

  await phaseFunction();
}

/**
 * Muestra información del grafo
 */
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

  infoDiv.style.display = "block";
}

/**
 * Muestra un mensaje de estado
 */
function showStatus(elementId, message, type = "info") {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.color =
    type === "error" ? "#F44336" : type === "success" ? "#4CAF50" : "#2196F3";
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);

console.log("🌱 GreenCircuit - Módulo app.js cargado");
