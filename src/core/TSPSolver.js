/**
 * TSPSolver.js
 * Resuelve el Problema del Agente Viajero (TSP) mediante fuerza bruta.
 * Evalúa todos los ciclos hamiltonianos y encuentra el que minimiza la distancia total.
 */

import MetricsCalculator from "./MetricsCalculator.js";

export default class TSPSolver {
  constructor(graph, hamiltonianCycles) {
    this.graph = graph;
    this.cycles = hamiltonianCycles;
    this.results = []; // Resultados de cada ciclo evaluado
    this.optimalSolution = null;
    this.worstSolution = null;
  }

  /**
   * Resuelve el TSP evaluando todos los ciclos hamiltonianos
   * @returns {Object} Solución óptima con métricas completas
   */
  solve() {
    if (this.cycles.length === 0) {
      throw new Error("No hay ciclos hamiltonianos para evaluar");
    }

    console.log(`Evaluando ${this.cycles.length} ciclos hamiltonianos...`);

    this.results = [];
    let minDistance = Infinity;
    let maxDistance = -Infinity;
    let optimalIndex = -1;
    let worstIndex = -1;

    // Evaluar cada ciclo
    this.cycles.forEach((cycle, index) => {
      const distance = this._calculateCycleDistance(cycle);
      const time = MetricsCalculator.calculateTime(distance);
      const co2 = MetricsCalculator.calculateCO2(distance);

      const result = {
        cycle,
        distance,
        time,
        co2,
        index,
      };

      this.results.push(result);

      // Actualizar óptimo
      if (distance < minDistance) {
        minDistance = distance;
        optimalIndex = index;
      }

      // Actualizar peor caso
      if (distance > maxDistance) {
        maxDistance = distance;
        worstIndex = index;
      }

      console.log(
        `Ciclo #${index + 1}: Distancia = ${distance.toFixed(2)} km, ` +
          `Tiempo = ${time.toFixed(2)} min, CO₂ = ${co2.toFixed(2)} kg`
      );
    });

    // Guardar soluciones
    this.optimalSolution = this.results[optimalIndex];
    this.worstSolution = this.results[worstIndex];

    // Calcular ahorros
    const savings = MetricsCalculator.calculateSavings(
      this.optimalSolution,
      this.worstSolution
    );

    console.log(
      `\n✓ Solución óptima encontrada: Ciclo #${optimalIndex + 1}\n` +
        `  Distancia: ${this.optimalSolution.distance.toFixed(2)} km\n` +
        `  Tiempo: ${this.optimalSolution.time.toFixed(2)} min\n` +
        `  CO₂: ${this.optimalSolution.co2.toFixed(2)} kg\n` +
        `\n✗ Peor ruta: Ciclo #${worstIndex + 1}\n` +
        `  Distancia: ${this.worstSolution.distance.toFixed(2)} km\n` +
        `\n💰 Ahorros:\n` +
        `  ${savings.distanceSaved.toFixed(2)} km menos\n` +
        `  ${savings.timeSaved.toFixed(2)} minutos ahorrados\n` +
        `  ${savings.co2Saved.toFixed(2)} kg de CO₂ reducidos`
    );

    return {
      optimal: this.optimalSolution,
      worst: this.worstSolution,
      savings,
      allResults: this.results,
      summary: {
        totalCyclesEvaluated: this.cycles.length,
        bestDistance: this.optimalSolution.distance,
        worstDistance: this.worstSolution.distance,
        averageDistance: this._calculateAverageDistance(),
      },
    };
  }

  /**
   * Calcula la distancia total de un ciclo
   * @param {Array<number>} cycle - Array de IDs de nodos
   * @returns {number} Distancia total en km
   */
  _calculateCycleDistance(cycle) {
    let totalDistance = 0;

    for (let i = 0; i < cycle.length - 1; i++) {
      const from = cycle[i];
      const to = cycle[i + 1];
      const distance = this.graph.getDistance(from, to);

      if (distance === null) {
        throw new Error(`No existe arista entre nodos ${from} y ${to}`);
      }

      totalDistance += distance;
    }

    return parseFloat(totalDistance.toFixed(2));
  }

  /**
   * Calcula la distancia promedio de todos los ciclos
   * @returns {number} Distancia promedio
   */
  _calculateAverageDistance() {
    if (this.results.length === 0) {
      return 0;
    }

    const sum = this.results.reduce((acc, result) => acc + result.distance, 0);
    return parseFloat((sum / this.results.length).toFixed(2));
  }

  /**
   * Obtiene los N mejores ciclos
   * @param {number} n - Cantidad de ciclos a retornar
   * @returns {Array<Object>} Array de resultados ordenados
   */
  getTopNCycles(n) {
    return [...this.results]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, n);
  }

  /**
   * Obtiene los N peores ciclos
   * @param {number} n - Cantidad de ciclos a retornar
   * @returns {Array<Object>} Array de resultados ordenados
   */
  getWorstNCycles(n) {
    return [...this.results]
      .sort((a, b) => b.distance - a.distance)
      .slice(0, n);
  }

  /**
   * Obtiene estadísticas detalladas
   * @returns {Object} Estadísticas
   */
  getStatistics() {
    if (this.results.length === 0) {
      return null;
    }

    const distances = this.results.map((r) => r.distance);
    const times = this.results.map((r) => r.time);
    const co2s = this.results.map((r) => r.co2);

    return {
      distance: {
        min: Math.min(...distances),
        max: Math.max(...distances),
        average: this._calculateAverageDistance(),
        median: this._calculateMedian(distances),
      },
      time: {
        min: Math.min(...times),
        max: Math.max(...times),
        average: times.reduce((a, b) => a + b, 0) / times.length,
      },
      co2: {
        min: Math.min(...co2s),
        max: Math.max(...co2s),
        average: co2s.reduce((a, b) => a + b, 0) / co2s.length,
      },
    };
  }

  /**
   * Calcula la mediana de un array
   * @param {Array<number>} arr - Array de números
   * @returns {number} Mediana
   */
  _calculateMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  }

  /**
   * Compara dos ciclos específicos
   * @param {number} index1 - Índice del primer ciclo
   * @param {number} index2 - Índice del segundo ciclo
   * @returns {Object} Comparación
   */
  compareCycles(index1, index2) {
    if (index1 >= this.results.length || index2 >= this.results.length) {
      throw new Error("Índice fuera de rango");
    }

    const cycle1 = this.results[index1];
    const cycle2 = this.results[index2];

    return {
      cycle1,
      cycle2,
      difference: {
        distance: cycle2.distance - cycle1.distance,
        time: cycle2.time - cycle1.time,
        co2: cycle2.co2 - cycle1.co2,
      },
      betterCycle: cycle1.distance < cycle2.distance ? 1 : 2,
    };
  }

  /**
   * Exporta los resultados completos
   * @returns {Object} Resultados completos
   */
  exportResults() {
    return {
      optimal: this.optimalSolution,
      worst: this.worstSolution,
      allResults: this.results,
      statistics: this.getStatistics(),
      top5: this.getTopNCycles(5),
      worst5: this.getWorstNCycles(5),
    };
  }

  /**
   * Genera un reporte textual de la solución
   * @returns {string} Reporte
   */
  generateReport() {
    if (!this.optimalSolution) {
      return "No se ha resuelto el TSP todavía";
    }

    const savings = MetricsCalculator.calculateSavings(
      this.optimalSolution,
      this.worstSolution
    );

    return `
═══════════════════════════════════════════════════════════
  🌱 GREENCIRCUIT - REPORTE DE OPTIMIZACIÓN
═══════════════════════════════════════════════════════════

📊 CICLOS EVALUADOS: ${this.cycles.length}

🏆 RUTA ÓPTIMA:
   Ciclo: ${this.optimalSolution.cycle.join(" → ")}
   Distancia: ${this.optimalSolution.distance.toFixed(2)} km
   Tiempo: ${this.optimalSolution.time.toFixed(2)} minutos
   CO₂: ${this.optimalSolution.co2.toFixed(2)} kg

❌ PEOR RUTA:
   Ciclo: ${this.worstSolution.cycle.join(" → ")}
   Distancia: ${this.worstSolution.distance.toFixed(2)} km
   Tiempo: ${this.worstSolution.time.toFixed(2)} minutos
   CO₂: ${this.worstSolution.co2.toFixed(2)} kg

💰 AHORROS LOGRADOS:
   📏 Distancia: -${savings.distanceSaved.toFixed(
     2
   )} km (${savings.distancePercent.toFixed(1)}%)
   ⏱️  Tiempo: -${savings.timeSaved.toFixed(
     2
   )} min (${savings.timePercent.toFixed(1)}%)
   🌍 CO₂: -${savings.co2Saved.toFixed(2)} kg (${savings.co2Percent.toFixed(
      1
    )}%)

📈 ESTADÍSTICAS:
   Distancia promedio: ${this._calculateAverageDistance()} km
   Rango: ${this.worstSolution.distance.toFixed(
     2
   )} - ${this.optimalSolution.distance.toFixed(2)} km

═══════════════════════════════════════════════════════════
    `;
  }
}
