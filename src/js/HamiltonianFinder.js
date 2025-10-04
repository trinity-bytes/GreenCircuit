// ============================================================================
// CLASE: HamiltonianFinder
// Encuentra todos los ciclos hamiltonianos usando backtracking
// ============================================================================

class HamiltonianFinder {
  constructor(graph) {
    this.graph = graph;
    this.cycles = [];
    this.steps = [];
    this.visitCount = 0;
  }

  findAllCycles(startNode = 0) {
    this.cycles = [];
    this.steps = [];
    this.visitCount = 0;

    const n = this.graph.nodes.length;

    if (n < 3) {
      return [];
    }

    const visited = Array(n).fill(false);
    const path = [startNode];
    visited[startNode] = true;

    this._backtrack(path, visited, startNode, startNode);

    return this.cycles;
  }

  _backtrack(path, visited, currentNode, startNode) {
    this.visitCount++;

    const n = this.graph.nodes.length;

    if (path.length === n) {
      if (this.graph.hasEdge(currentNode, startNode)) {
        const cycle = [...path, startNode];
        this.cycles.push(cycle);
      }
      return;
    }

    for (let i = 0; i < n; i++) {
      const nextNode = this.graph.nodes[i].id;

      if (!visited[i] && this.graph.hasEdge(currentNode, nextNode)) {
        visited[i] = true;
        path.push(nextNode);

        this._backtrack(path, visited, nextNode, startNode);

        visited[i] = false;
        path.pop();
      }
    }
  }

  getStatistics() {
    return {
      cyclesFound: this.cycles.length,
      totalSteps: this.steps.length,
      nodesVisited: this.visitCount,
    };
  }
}
