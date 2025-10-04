// ============================================================================
// CLASE: LogDisplay
// Muestra logs, matrices y resultados en el DOM
// ============================================================================

class LogDisplay {
  constructor(containerElement) {
    this.container = containerElement;
    this.logs = [];
  }

  clear() {
    this.container.innerHTML = "";
    this.logs = [];
  }

  log(message, type = "info") {
    const entry = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs.push(entry);

    const div = document.createElement("div");
    div.className = `log-entry log-${type}`;

    const timestamp = document.createElement("span");
    timestamp.className = "log-timestamp";
    timestamp.textContent = `[${entry.timestamp}] `;

    const content = document.createElement("span");
    content.className = "log-content";
    content.textContent = message;

    div.appendChild(timestamp);
    div.appendChild(content);

    this.container.appendChild(div);
    this.container.scrollTop = this.container.scrollHeight;
  }

  displayMatrix(matrix) {
    const n = matrix.length;

    this.log("\n📊 MATRIZ DE ADYACENCIA:", "header");

    const table = document.createElement("table");
    table.className = "adjacency-matrix";

    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));

    for (let i = 0; i < n; i++) {
      const th = document.createElement("th");
      th.textContent = String.fromCharCode(65 + i);
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let i = 0; i < n; i++) {
      const row = document.createElement("tr");

      const rowHeader = document.createElement("th");
      rowHeader.textContent = String.fromCharCode(65 + i);
      row.appendChild(rowHeader);

      for (let j = 0; j < n; j++) {
        const cell = document.createElement("td");
        const value = matrix[i][j];

        if (value === Infinity) {
          cell.textContent = "∞";
        } else if (value === 0) {
          cell.textContent = "-";
        } else {
          cell.textContent = value.toFixed(1);
        }

        if (i === j) {
          cell.style.backgroundColor = "#f0f0f0";
        }

        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    this.container.appendChild(table);
    this.container.scrollTop = this.container.scrollHeight;
  }

  displayResults(solution) {
    const { optimal, worst, savings, summary } = solution;

    this.log("\n═══════════════════════════════════════", "separator");
    this.log("🏆 RESULTADOS FINALES", "header");
    this.log("═══════════════════════════════════════", "separator");

    this.log("\n✅ RUTA ÓPTIMA:", "success");
    this.log(`   Ciclo: ${optimal.cycle.join(" → ")}`, "result");
    this.log(`   📏 Distancia: ${optimal.distance.toFixed(2)} km`, "result");
    this.log(`   ⏱️  Tiempo: ${optimal.time.toFixed(2)} minutos`, "result");
    this.log(`   🌍 CO₂: ${optimal.co2.toFixed(2)} kg`, "result");

    this.log("\n❌ PEOR RUTA:", "warning");
    this.log(`   Ciclo: ${worst.cycle.join(" → ")}`, "result");
    this.log(`   📏 Distancia: ${worst.distance.toFixed(2)} km`, "result");

    this.log("\n💰 AHORROS LOGRADOS:", "success");
    this.log(
      `   📏 Distancia: -${savings.distanceSaved.toFixed(
        2
      )} km (${savings.distancePercent.toFixed(1)}%)`,
      "savings"
    );
    this.log(
      `   ⏱️  Tiempo: -${savings.timeSaved.toFixed(
        2
      )} min (${savings.timePercent.toFixed(1)}%)`,
      "savings"
    );
    this.log(
      `   🌍 CO₂: -${savings.co2Saved.toFixed(
        2
      )} kg (${savings.co2Percent.toFixed(1)}%)`,
      "savings"
    );

    this.log("\n📊 ESTADÍSTICAS:", "info");
    this.log(`   Ciclos evaluados: ${summary.totalCyclesEvaluated}`, "info");
    this.log(
      `   Distancia promedio: ${summary.averageDistance.toFixed(2)} km`,
      "info"
    );

    this.log("═══════════════════════════════════════", "separator");
  }
}
