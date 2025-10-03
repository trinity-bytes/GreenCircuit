/**
 * MetricsCalculator.js
 * Módulo para calcular métricas de impacto ambiental y eficiencia.
 * Calcula distancia, tiempo, emisiones de CO₂ y ahorros.
 */

export default class MetricsCalculator {
  // Constantes
  static CO2_FACTOR = 0.2; // kg CO₂ por km (camión de basura estándar)
  static AVG_SPEED = 25; // km/h promedio en ciudad
  static FUEL_CONSUMPTION = 0.35; // litros por km
  static FUEL_COST = 1.5; // USD por litro

  /**
   * Calcula el tiempo de recorrido
   * @param {number} distance - Distancia en km
   * @returns {number} Tiempo en minutos
   */
  static calculateTime(distance) {
    // tiempo = distancia / velocidad (convertido a minutos)
    const timeInHours = distance / this.AVG_SPEED;
    const timeInMinutes = timeInHours * 60;
    return parseFloat(timeInMinutes.toFixed(2));
  }

  /**
   * Calcula las emisiones de CO₂
   * @param {number} distance - Distancia en km
   * @returns {number} CO₂ en kg
   */
  static calculateCO2(distance) {
    const co2 = distance * this.CO2_FACTOR;
    return parseFloat(co2.toFixed(2));
  }

  /**
   * Calcula el consumo de combustible
   * @param {number} distance - Distancia en km
   * @returns {number} Combustible en litros
   */
  static calculateFuelConsumption(distance) {
    const fuel = distance * this.FUEL_CONSUMPTION;
    return parseFloat(fuel.toFixed(2));
  }

  /**
   * Calcula el costo de combustible
   * @param {number} distance - Distancia en km
   * @returns {number} Costo en USD
   */
  static calculateFuelCost(distance) {
    const fuel = this.calculateFuelConsumption(distance);
    const cost = fuel * this.FUEL_COST;
    return parseFloat(cost.toFixed(2));
  }

  /**
   * Calcula métricas completas para una ruta
   * @param {number} distance - Distancia total en km
   * @returns {Object} Métricas completas
   */
  static calculateMetrics(distance) {
    return {
      distance: parseFloat(distance.toFixed(2)),
      time: this.calculateTime(distance),
      co2: this.calculateCO2(distance),
      fuel: this.calculateFuelConsumption(distance),
      cost: this.calculateFuelCost(distance),
    };
  }

  /**
   * Calcula los ahorros entre ruta óptima y ruta no optimizada
   * @param {Object} optimal - Resultado de la ruta óptima {distance, time, co2}
   * @param {Object} worst - Resultado de la peor ruta {distance, time, co2}
   * @returns {Object} Ahorros calculados
   */
  static calculateSavings(optimal, worst) {
    const distanceSaved = worst.distance - optimal.distance;
    const timeSaved = worst.time - optimal.time;
    const co2Saved = worst.co2 - optimal.co2;

    const fuelSaved = this.calculateFuelConsumption(distanceSaved);
    const costSaved = this.calculateFuelCost(distanceSaved);

    // Porcentajes
    const distancePercent = (distanceSaved / worst.distance) * 100;
    const timePercent = (timeSaved / worst.time) * 100;
    const co2Percent = (co2Saved / worst.co2) * 100;

    return {
      distanceSaved: parseFloat(distanceSaved.toFixed(2)),
      timeSaved: parseFloat(timeSaved.toFixed(2)),
      co2Saved: parseFloat(co2Saved.toFixed(2)),
      fuelSaved: parseFloat(fuelSaved.toFixed(2)),
      costSaved: parseFloat(costSaved.toFixed(2)),
      distancePercent: parseFloat(distancePercent.toFixed(2)),
      timePercent: parseFloat(timePercent.toFixed(2)),
      co2Percent: parseFloat(co2Percent.toFixed(2)),
    };
  }

  /**
   * Calcula el total de residuos a recolectar
   * @param {Array<Object>} nodes - Array de nodos con wasteAmount
   * @returns {number} Total de residuos en kg
   */
  static getTotalWaste(nodes) {
    return nodes.reduce((sum, node) => sum + (node.wasteAmount || 0), 0);
  }

  /**
   * Calcula la eficiencia de recolección (kg de residuos por km recorrido)
   * @param {number} totalWaste - Total de residuos en kg
   * @param {number} distance - Distancia recorrida en km
   * @returns {number} Eficiencia en kg/km
   */
  static calculateEfficiency(totalWaste, distance) {
    if (distance === 0) return 0;
    return parseFloat((totalWaste / distance).toFixed(2));
  }

  /**
   * Calcula el impacto ambiental anual
   * Asume que la ruta se hace diariamente
   * @param {Object} savings - Ahorros diarios
   * @param {number} daysPerYear - Días operativos al año (por defecto 365)
   * @returns {Object} Impacto anual
   */
  static calculateAnnualImpact(savings, daysPerYear = 365) {
    return {
      distanceSaved: parseFloat(
        (savings.distanceSaved * daysPerYear).toFixed(2)
      ),
      timeSaved: parseFloat((savings.timeSaved * daysPerYear).toFixed(2)),
      timeInHours: parseFloat(
        ((savings.timeSaved * daysPerYear) / 60).toFixed(2)
      ),
      co2Saved: parseFloat((savings.co2Saved * daysPerYear).toFixed(2)),
      fuelSaved: parseFloat((savings.fuelSaved * daysPerYear).toFixed(2)),
      costSaved: parseFloat((savings.costSaved * daysPerYear).toFixed(2)),
      treesEquivalent: this.co2ToTrees(savings.co2Saved * daysPerYear),
    };
  }

  /**
   * Convierte kg de CO₂ ahorrados a equivalente en árboles
   * Un árbol absorbe aproximadamente 21 kg de CO₂ al año
   * @param {number} co2Kg - kg de CO₂
   * @returns {number} Número equivalente de árboles
   */
  static co2ToTrees(co2Kg) {
    const co2PerTree = 21; // kg por año
    return parseFloat((co2Kg / co2PerTree).toFixed(2));
  }

  /**
   * Calcula el costo por kg de residuo recolectado
   * @param {number} totalCost - Costo total de la ruta
   * @param {number} totalWaste - Total de residuos recolectados
   * @returns {number} Costo por kg
   */
  static calculateCostPerKg(totalCost, totalWaste) {
    if (totalWaste === 0) return 0;
    return parseFloat((totalCost / totalWaste).toFixed(4));
  }

  /**
   * Genera un resumen de métricas ambientales
   * @param {Object} optimal - Ruta óptima
   * @param {Object} worst - Peor ruta
   * @param {Array<Object>} nodes - Nodos del grafo
   * @returns {Object} Resumen completo
   */
  static generateEnvironmentalSummary(optimal, worst, nodes) {
    const savings = this.calculateSavings(optimal, worst);
    const annualImpact = this.calculateAnnualImpact(savings);
    const totalWaste = this.getTotalWaste(nodes);

    const optimalEfficiency = this.calculateEfficiency(
      totalWaste,
      optimal.distance
    );
    const worstEfficiency = this.calculateEfficiency(
      totalWaste,
      worst.distance
    );

    return {
      daily: {
        optimal: {
          ...optimal,
          efficiency: optimalEfficiency,
          fuel: this.calculateFuelConsumption(optimal.distance),
          cost: this.calculateFuelCost(optimal.distance),
        },
        worst: {
          ...worst,
          efficiency: worstEfficiency,
          fuel: this.calculateFuelConsumption(worst.distance),
          cost: this.calculateFuelCost(worst.distance),
        },
        savings: {
          ...savings,
          treesEquivalent: this.co2ToTrees(savings.co2Saved),
        },
      },
      annual: annualImpact,
      wasteInfo: {
        total: totalWaste,
        costPerKgOptimal: this.calculateCostPerKg(
          this.calculateFuelCost(optimal.distance),
          totalWaste
        ),
        costPerKgWorst: this.calculateCostPerKg(
          this.calculateFuelCost(worst.distance),
          totalWaste
        ),
      },
    };
  }

  /**
   * Formatea un número con separadores de miles
   * @param {number} num - Número a formatear
   * @returns {string} Número formateado
   */
  static formatNumber(num) {
    return num.toLocaleString("es-ES", { maximumFractionDigits: 2 });
  }

  /**
   * Genera un reporte textual de impacto ambiental
   * @param {Object} summary - Resumen de métricas ambientales
   * @returns {string} Reporte formateado
   */
  static generateImpactReport(summary) {
    const { daily, annual, wasteInfo } = summary;

    return `
╔═══════════════════════════════════════════════════════════╗
║          🌍 IMPACTO AMBIENTAL - GREENCIRCUIT             ║
╚═══════════════════════════════════════════════════════════╝

📦 RESIDUOS A RECOLECTAR: ${wasteInfo.total} kg

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 COMPARACIÓN DIARIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🏆 RUTA ÓPTIMA:
     📏 Distancia: ${daily.optimal.distance} km
     ⏱️  Tiempo: ${daily.optimal.time} min
     ⛽ Combustible: ${daily.optimal.fuel} litros
     💰 Costo: $${daily.optimal.cost}
     🌍 CO₂: ${daily.optimal.co2} kg
     📊 Eficiencia: ${daily.optimal.efficiency} kg/km

  ❌ PEOR RUTA:
     📏 Distancia: ${daily.worst.distance} km
     ⏱️  Tiempo: ${daily.worst.time} min
     ⛽ Combustible: ${daily.worst.fuel} litros
     💰 Costo: $${daily.worst.cost}
     🌍 CO₂: ${daily.worst.co2} kg
     📊 Eficiencia: ${daily.worst.efficiency} kg/km

  💚 AHORROS DIARIOS:
     📏 ${daily.savings.distanceSaved} km menos (-${
      daily.savings.distancePercent
    }%)
     ⏱️  ${daily.savings.timeSaved} min ahorrados (-${
      daily.savings.timePercent
    }%)
     ⛽ ${daily.savings.fuelSaved} litros menos
     💰 $${daily.savings.costSaved} ahorrados
     🌍 ${daily.savings.co2Saved} kg CO₂ reducidos (-${
      daily.savings.co2Percent
    }%)
     🌳 Equivalente a ${daily.savings.treesEquivalent} árboles/año

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📅 IMPACTO ANUAL (365 días)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🌍 ${this.formatNumber(annual.co2Saved)} kg de CO₂ ahorrados
  🌳 Equivalente a plantar ${this.formatNumber(annual.treesEquivalent)} árboles
  📏 ${this.formatNumber(annual.distanceSaved)} km menos recorridos
  ⏱️  ${this.formatNumber(annual.timeInHours)} horas ahorradas
  ⛽ ${this.formatNumber(annual.fuelSaved)} litros de combustible ahorrados
  💰 $${this.formatNumber(annual.costSaved)} en costos reducidos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }
}
