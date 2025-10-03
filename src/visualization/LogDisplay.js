/**
 * LogDisplay.js
 * Muestra logs, proceso paso a paso, matriz de adyacencia y resultados en el DOM.
 */

export default class LogDisplay {
  constructor(containerElement) {
    this.container = containerElement;
    this.logs = [];
    this.maxLogs = 1000; // Límite de logs para evitar sobrecarga
  }

  /**
   * Limpia todos los logs
   */
  clear() {
    this.container.innerHTML = "";
    this.logs = [];
  }

  /**
   * Registra un mensaje
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de mensaje
   */
  log(message, type = "info") {
    const entry = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs.push(entry);

    // Limitar cantidad de logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Crear elemento visual
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

    // Auto-scroll al final
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * Muestra la matriz de adyacencia
   * @param {Array<Array<number>>} matrix - Matriz de adyacencia
   */
  displayMatrix(matrix) {
    const n = matrix.length;

    this.log("\n📊 MATRIZ DE ADYACENCIA:", "header");

    // Crear tabla HTML
    const table = document.createElement("table");
    table.className = "adjacency-matrix";
    table.style.borderCollapse = "collapse";
    table.style.margin = "10px 0";
    table.style.fontFamily = "monospace";

    // Encabezado
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th")); // Esquina superior izquierda

    for (let i = 0; i < n; i++) {
      const th = document.createElement("th");
      th.textContent = String.fromCharCode(65 + i); // A, B, C, ...
      th.style.padding = "5px";
      th.style.border = "1px solid #ccc";
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Filas de datos
    for (let i = 0; i < n; i++) {
      const row = document.createElement("tr");

      // Encabezado de fila
      const rowHeader = document.createElement("th");
      rowHeader.textContent = String.fromCharCode(65 + i);
      rowHeader.style.padding = "5px";
      rowHeader.style.border = "1px solid #ccc";
      row.appendChild(rowHeader);

      // Celdas
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

        cell.style.padding = "5px";
        cell.style.border = "1px solid #ccc";
        cell.style.textAlign = "center";

        // Color de fondo según valor
        if (i === j) {
          cell.style.backgroundColor = "#f0f0f0";
        } else if (value === Infinity) {
          cell.style.backgroundColor = "#ffebee";
        }

        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    this.container.appendChild(table);
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * Muestra los resultados del TSP
   * @param {Object} solution - Solución del TSP
   */
  displayResults(solution) {
    const { optimal, worst, savings, summary } = solution;

    this.log("\n═══════════════════════════════════════", "separator");
    this.log("🏆 RESULTADOS FINALES", "header");
    this.log("═══════════════════════════════════════", "separator");

    // Ruta óptima
    this.log("\n✅ RUTA ÓPTIMA:", "success");
    this.log(`   Ciclo: ${optimal.cycle.join(" → ")}`, "result");
    this.log(`   📏 Distancia: ${optimal.distance.toFixed(2)} km`, "result");
    this.log(`   ⏱️  Tiempo: ${optimal.time.toFixed(2)} minutos`, "result");
    this.log(`   🌍 CO₂: ${optimal.co2.toFixed(2)} kg`, "result");

    // Peor ruta
    this.log("\n❌ PEOR RUTA:", "warning");
    this.log(`   Ciclo: ${worst.cycle.join(" → ")}`, "result");
    this.log(`   📏 Distancia: ${worst.distance.toFixed(2)} km`, "result");
    this.log(`   ⏱️  Tiempo: ${worst.time.toFixed(2)} minutos`, "result");
    this.log(`   🌍 CO₂: ${worst.co2.toFixed(2)} kg`, "result");

    // Ahorros
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

    // Estadísticas
    this.log("\n📊 ESTADÍSTICAS:", "info");
    this.log(`   Ciclos evaluados: ${summary.totalCyclesEvaluated}`, "info");
    this.log(
      `   Distancia promedio: ${summary.averageDistance.toFixed(2)} km`,
      "info"
    );
    this.log(
      `   Rango: ${summary.bestDistance.toFixed(
        2
      )} - ${summary.worstDistance.toFixed(2)} km`,
      "info"
    );

    this.log("═══════════════════════════════════════", "separator");
  }

  /**
   * Muestra un separador visual
   */
  separator() {
    const div = document.createElement("div");
    div.className = "log-separator";
    div.textContent = "─────────────────────────────────────────────────────";
    div.style.color = "#999";
    div.style.margin = "10px 0";
    this.container.appendChild(div);
  }

  /**
   * Muestra una tabla de datos
   * @param {Array<Object>} data - Datos a mostrar
   * @param {Array<string>} columns - Columnas a mostrar
   */
  displayTable(data, columns) {
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.margin = "10px 0";

    // Encabezados
    const headerRow = document.createElement("tr");
    columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      th.style.padding = "5px";
      th.style.border = "1px solid #ccc";
      th.style.backgroundColor = "#f0f0f0";
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Datos
    data.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((col) => {
        const td = document.createElement("td");
        td.textContent = row[col] || "-";
        td.style.padding = "5px";
        td.style.border = "1px solid #ccc";
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    this.container.appendChild(table);
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * Muestra una barra de progreso
   * @param {number} current - Valor actual
   * @param {number} total - Valor total
   * @param {string} label - Etiqueta
   */
  displayProgress(current, total, label = "Progreso") {
    const percentage = (current / total) * 100;

    const progressDiv = document.createElement("div");
    progressDiv.className = "progress-container";
    progressDiv.style.margin = "10px 0";

    const labelSpan = document.createElement("div");
    labelSpan.textContent = `${label}: ${current}/${total} (${percentage.toFixed(
      1
    )}%)`;
    labelSpan.style.marginBottom = "5px";

    const barContainer = document.createElement("div");
    barContainer.style.width = "100%";
    barContainer.style.height = "20px";
    barContainer.style.backgroundColor = "#e0e0e0";
    barContainer.style.border = "1px solid #ccc";
    barContainer.style.overflow = "hidden";

    const bar = document.createElement("div");
    bar.style.width = `${percentage}%`;
    bar.style.height = "100%";
    bar.style.backgroundColor = "#4CAF50";
    bar.style.transition = "width 0.3s ease";

    barContainer.appendChild(bar);
    progressDiv.appendChild(labelSpan);
    progressDiv.appendChild(barContainer);

    this.container.appendChild(progressDiv);
    this.container.scrollTop = this.container.scrollHeight;
  }

  /**
   * Obtiene todos los logs
   * @returns {Array<Object>} Array de logs
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Exporta los logs como texto
   * @returns {string} Logs en formato texto
   */
  exportAsText() {
    return this.logs
      .map(
        (log) => `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`
      )
      .join("\n");
  }

  /**
   * Guarda los logs en un archivo
   */
  downloadLogs() {
    const text = this.exportAsText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `greencircuit-logs-${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Filtra logs por tipo
   * @param {string} type - Tipo de log
   * @returns {Array<Object>} Logs filtrados
   */
  filterByType(type) {
    return this.logs.filter((log) => log.type === type);
  }

  /**
   * Muestra solo logs de un tipo específico
   * @param {string} type - Tipo de log a mostrar
   */
  showOnlyType(type) {
    const entries = this.container.querySelectorAll(".log-entry");
    entries.forEach((entry) => {
      if (entry.classList.contains(`log-${type}`)) {
        entry.style.display = "block";
      } else {
        entry.style.display = "none";
      }
    });
  }

  /**
   * Muestra todos los logs
   */
  showAll() {
    const entries = this.container.querySelectorAll(".log-entry");
    entries.forEach((entry) => {
      entry.style.display = "block";
    });
  }

  /**
   * Establece el límite máximo de logs
   * @param {number} max - Límite máximo
   */
  setMaxLogs(max) {
    this.maxLogs = max;
  }
}
