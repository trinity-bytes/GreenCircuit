/**
 * StepByStepManager.js
 * Gestiona el proceso paso a paso del algoritmo.
 * Coordina la ejecución, visualización y logging de cada paso.
 */

export default class StepByStepManager {
  constructor(controller, visualizer, logger) {
    this.controller = controller;
    this.visualizer = visualizer;
    this.logger = logger;
    this.currentPhase = null;
    this.history = [];
  }

  /**
   * Ejecuta el proceso completo paso a paso
   * @param {Graph} graph - Grafo a procesar
   * @param {HamiltonianFinder} finder - Buscador de ciclos
   * @param {TSPSolver} solver - Resolutor de TSP
   */
  async executeFullProcess(graph, finder, solver) {
    this.history = [];
    this.logger.clear();
    this.logger.log("=== INICIANDO PROCESO COMPLETO ===", "header");

    // Fase 1: Construcción de matriz de adyacencia
    await this.phaseAdjacencyMatrix(graph);

    // Fase 2: Búsqueda de ciclos hamiltonianos
    await this.phaseHamiltonianSearch(graph, finder);

    // Fase 3: Resolución TSP
    await this.phaseTSPSolution(graph, finder.cycles, solver);

    // Fase 4: Resultados finales
    await this.phaseResults(solver);

    this.logger.log("=== PROCESO COMPLETADO ===", "header");
  }

  /**
   * Fase 1: Construcción de matriz de adyacencia
   * @param {Graph} graph - Grafo
   */
  async phaseAdjacencyMatrix(graph) {
    this.currentPhase = "adjacency-matrix";
    this.logger.log("\n--- FASE 1: MATRIZ DE ADYACENCIA ---", "phase");

    const steps = [
      async () => {
        this.logger.log("Construyendo matriz de adyacencia...", "info");
        graph.buildAdjacencyMatrix();
      },
      async () => {
        this.logger.log("Matriz construida correctamente", "success");
        this.logger.displayMatrix(graph.getMatrix());
      },
    ];

    await this.controller.executeSteps(steps, (index, step) => {
      this.history.push({
        phase: "adjacency-matrix",
        step: index,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Fase 2: Búsqueda de ciclos hamiltonianos
   * @param {Graph} graph - Grafo
   * @param {HamiltonianFinder} finder - Buscador
   */
  async phaseHamiltonianSearch(graph, finder) {
    this.currentPhase = "hamiltonian-search";
    this.logger.log(
      "\n--- FASE 2: BÚSQUEDA DE CICLOS HAMILTONIANOS ---",
      "phase"
    );

    const steps = [
      async () => {
        this.logger.log(
          "Iniciando búsqueda de ciclos hamiltonianos...",
          "info"
        );
        this.logger.log(`Nodos en el grafo: ${graph.nodes.length}`, "info");
      },
      async () => {
        const cycles = finder.findAllCycles(0);
        this.logger.log(`Búsqueda completada`, "success");
        this.logger.log(`Ciclos encontrados: ${cycles.length}`, "success");
      },
      async () => {
        this.logger.log("\nCiclos hamiltonianos encontrados:", "info");
        finder.cycles.forEach((cycle, index) => {
          this.logger.log(`Ciclo #${index + 1}: ${cycle.join(" → ")}`, "cycle");
        });
      },
      async () => {
        const stats = finder.getStatistics();
        this.logger.log("\nEstadísticas de búsqueda:", "info");
        this.logger.log(`  - Exploraciones: ${stats.explorations}`, "info");
        this.logger.log(`  - Retrocesos: ${stats.backtracks}`, "info");
        this.logger.log(`  - Nodos visitados: ${stats.nodesVisited}`, "info");
      },
    ];

    await this.controller.executeSteps(steps, (index, step) => {
      this.history.push({
        phase: "hamiltonian-search",
        step: index,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Fase 3: Resolución del TSP
   * @param {Graph} graph - Grafo
   * @param {Array} cycles - Ciclos hamiltonianos
   * @param {TSPSolver} solver - Resolutor
   */
  async phaseTSPSolution(graph, cycles, solver) {
    this.currentPhase = "tsp-solution";
    this.logger.log(
      "\n--- FASE 3: RESOLUCIÓN DEL PROBLEMA DEL AGENTE VIAJERO ---",
      "phase"
    );

    const steps = [
      async () => {
        this.logger.log(
          `Evaluando ${cycles.length} ciclos hamiltonianos...`,
          "info"
        );
      },
      async () => {
        const solution = solver.solve();
        this.logger.log("TSP resuelto correctamente", "success");
        return solution;
      },
      async () => {
        this.logger.log("\nEvaluación de ciclos:", "info");
        solver.results.slice(0, 5).forEach((result, index) => {
          this.logger.log(
            `Ciclo #${index + 1}: ${result.distance.toFixed(2)} km, ` +
              `${result.time.toFixed(2)} min, ${result.co2.toFixed(2)} kg CO₂`,
            "info"
          );
        });

        if (solver.results.length > 5) {
          this.logger.log(
            `... y ${solver.results.length - 5} ciclos más`,
            "info"
          );
        }
      },
    ];

    await this.controller.executeSteps(steps, (index, step) => {
      this.history.push({
        phase: "tsp-solution",
        step: index,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Fase 4: Presentación de resultados
   * @param {TSPSolver} solver - Resolutor con solución
   */
  async phaseResults(solver) {
    this.currentPhase = "results";
    this.logger.log("\n--- FASE 4: RESULTADOS FINALES ---", "phase");

    const steps = [
      async () => {
        const solution = solver.exportResults();
        this.logger.displayResults(solution);
      },
      async () => {
        this.logger.log("\n" + solver.generateReport(), "report");
      },
      async () => {
        if (this.visualizer) {
          this.logger.log("Visualizando ruta óptima en el grafo...", "info");
          this.visualizer.highlightPath(solver.optimalSolution.cycle);
        }
      },
    ];

    await this.controller.executeSteps(steps, (index, step) => {
      this.history.push({
        phase: "results",
        step: index,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Ejecuta solo la búsqueda de ciclos (para debugging)
   * @param {Graph} graph - Grafo
   * @param {HamiltonianFinder} finder - Buscador
   */
  async executeHamiltonianOnly(graph, finder) {
    this.logger.clear();
    await this.phaseAdjacencyMatrix(graph);
    await this.phaseHamiltonianSearch(graph, finder);
  }

  /**
   * Ejecuta solo el TSP (asumiendo ciclos ya encontrados)
   * @param {Graph} graph - Grafo
   * @param {Array} cycles - Ciclos hamiltonianos
   * @param {TSPSolver} solver - Resolutor
   */
  async executeTSPOnly(graph, cycles, solver) {
    this.logger.clear();
    await this.phaseTSPSolution(graph, cycles, solver);
    await this.phaseResults(solver);
  }

  /**
   * Obtiene el historial de pasos ejecutados
   * @returns {Array} Historial
   */
  getHistory() {
    return this.history;
  }

  /**
   * Obtiene la fase actual
   * @returns {string} Fase actual
   */
  getCurrentPhase() {
    return this.currentPhase;
  }

  /**
   * Reinicia el manager
   */
  reset() {
    this.currentPhase = null;
    this.history = [];
    this.controller.reset();
  }

  /**
   * Pausa la ejecución
   */
  pause() {
    this.controller.pause();
    this.logger.log("⏸️ EJECUCIÓN PAUSADA", "warning");
  }

  /**
   * Reanuda la ejecución
   */
  resume() {
    this.controller.resume();
    this.logger.log("▶️ EJECUCIÓN REANUDADA", "success");
  }

  /**
   * Detiene la ejecución
   */
  stop() {
    this.controller.stop();
    this.logger.log("⏹️ EJECUCIÓN DETENIDA", "error");
  }
}
