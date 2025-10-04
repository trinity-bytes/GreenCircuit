// ============================================================================
// CLASE: TSPSolver
// Resuelve el TSP evaluando todos los ciclos hamiltonianos
// ============================================================================

class TSPSolver {
  constructor(graph, hamiltonianCycles) {
    this.graph = graph;
    this.cycles = hamiltonianCycles;
    this.results = [];
    this.optimalSolution = null;
    this.worstSolution = null;
  }

  solve() {
    if (this.cycles.length === 0) {
      throw new Error("No hay ciclos hamiltonianos para evaluar");
    }

    this.results = [];
    let minDistance = Infinity;
    let maxDistance = -Infinity;
    let optimalIndex = -1;
    let worstIndex = -1;

    this.cycles.forEach((cycle, index) => {
      const distance = this._calculateCycleDistance(cycle);
      const time = (distance / 25) * 60;
      const co2 = distance * 0.2;

      const result = {
        cycle,
        distance,
        time: parseFloat(time.toFixed(2)),
        co2: parseFloat(co2.toFixed(2)),
        index,
      };

      this.results.push(result);

      if (distance < minDistance) {
        minDistance = distance;
        optimalIndex = index;
      }

      if (distance > maxDistance) {
        maxDistance = distance;
        worstIndex = index;
      }
    });

    this.optimalSolution = this.results[optimalIndex];
    this.worstSolution = this.results[worstIndex];

    const distanceSaved =
      this.worstSolution.distance - this.optimalSolution.distance;
    const timeSaved = this.worstSolution.time - this.optimalSolution.time;
    const co2Saved = this.worstSolution.co2 - this.optimalSolution.co2;

    const savings = {
      distanceSaved: parseFloat(distanceSaved.toFixed(2)),
      timeSaved: parseFloat(timeSaved.toFixed(2)),
      co2Saved: parseFloat(co2Saved.toFixed(2)),
      distancePercent: parseFloat(
        ((distanceSaved / this.worstSolution.distance) * 100).toFixed(2)
      ),
      timePercent: parseFloat(
        ((timeSaved / this.worstSolution.time) * 100).toFixed(2)
      ),
      co2Percent: parseFloat(
        ((co2Saved / this.worstSolution.co2) * 100).toFixed(2)
      ),
    };

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

  _calculateAverageDistance() {
    if (this.results.length === 0) return 0;
    const sum = this.results.reduce((acc, result) => acc + result.distance, 0);
    return parseFloat((sum / this.results.length).toFixed(2));
  }

  exportResults() {
    return {
      optimal: this.optimalSolution,
      worst: this.worstSolution,
      allResults: this.results,
    };
  }
}
