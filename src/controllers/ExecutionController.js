/**
 * ExecutionController.js
 * Controla la velocidad de ejecución del algoritmo.
 * Permite ejecutar en modo rápido, lento o manual (paso a paso).
 */

export default class ExecutionController {
  constructor() {
    this.mode = "manual"; // 'fast' | 'slow' | 'manual'
    this.currentStep = 0;
    this.steps = [];
    this.isPaused = false;
    this.isRunning = false;
    this.nextStepCallback = null;
    this.stepExecutedCallback = null;

    // Velocidades (en milisegundos)
    this.speeds = {
      fast: 50,
      slow: 1000,
      manual: -1, // Espera click
    };
  }

  /**
   * Establece el modo de ejecución
   * @param {string} mode - 'fast', 'slow', o 'manual'
   */
  setMode(mode) {
    if (!["fast", "slow", "manual"].includes(mode)) {
      throw new Error("Modo no válido. Usar: fast, slow, o manual");
    }

    this.mode = mode;
    console.log(`Modo de ejecución establecido: ${mode}`);
  }

  /**
   * Obtiene el delay actual según el modo
   * @returns {number} Delay en milisegundos
   */
  getDelay() {
    return this.speeds[this.mode];
  }

  /**
   * Ejecuta una secuencia de pasos con el controlador
   * @param {Array<Function>} steps - Array de funciones a ejecutar
   * @param {Function} onStepExecuted - Callback ejecutado después de cada paso
   */
  async executeSteps(steps, onStepExecuted = null) {
    this.steps = steps;
    this.currentStep = 0;
    this.isRunning = true;
    this.isPaused = false;
    this.stepExecutedCallback = onStepExecuted;

    console.log(
      `Iniciando ejecución de ${steps.length} pasos en modo ${this.mode}`
    );

    for (let i = 0; i < steps.length; i++) {
      if (!this.isRunning) {
        console.log("Ejecución detenida");
        break;
      }

      while (this.isPaused) {
        await this.delay(100);
      }

      this.currentStep = i;

      // Ejecutar el paso
      await this.executeStep(steps[i], i);

      // Callback después del paso
      if (this.stepExecutedCallback) {
        this.stepExecutedCallback(i, steps[i]);
      }

      // Control de velocidad
      if (this.mode === "fast") {
        await this.delay(this.speeds.fast);
      } else if (this.mode === "slow") {
        await this.delay(this.speeds.slow);
      } else if (this.mode === "manual") {
        await this.waitForClick();
      }
    }

    this.isRunning = false;
    console.log("Ejecución completada");
  }

  /**
   * Ejecuta un paso individual
   * @param {Function} stepFunction - Función a ejecutar
   * @param {number} index - Índice del paso
   */
  async executeStep(stepFunction, index) {
    try {
      console.log(`Ejecutando paso ${index + 1}/${this.steps.length}`);

      if (typeof stepFunction === "function") {
        await stepFunction();
      } else {
        console.warn("El paso no es una función válida");
      }
    } catch (error) {
      console.error(`Error en paso ${index + 1}:`, error);
      throw error;
    }
  }

  /**
   * Pausa la ejecución
   */
  pause() {
    if (this.isRunning) {
      this.isPaused = true;
      console.log("Ejecución pausada");
    }
  }

  /**
   * Reanuda la ejecución
   */
  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      console.log("Ejecución reanudada");
    }
  }

  /**
   * Detiene la ejecución completamente
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentStep = 0;
    console.log("Ejecución detenida");
  }

  /**
   * Avanza al siguiente paso en modo manual
   */
  nextStep() {
    if (this.mode === "manual" && this.nextStepCallback) {
      this.nextStepCallback();
      this.nextStepCallback = null;
    }
  }

  /**
   * Retrocede al paso anterior (si es posible)
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      console.log(`Retrocediendo al paso ${this.currentStep}`);
    }
  }

  /**
   * Salta a un paso específico
   * @param {number} stepNumber - Número de paso
   */
  goToStep(stepNumber) {
    if (stepNumber >= 0 && stepNumber < this.steps.length) {
      this.currentStep = stepNumber;
      console.log(`Saltando al paso ${stepNumber}`);
    }
  }

  /**
   * Espera un click del usuario (modo manual)
   * @returns {Promise} Promesa que se resuelve al hacer click
   */
  async waitForClick() {
    return new Promise((resolve) => {
      this.nextStepCallback = resolve;
      console.log("Esperando click del usuario...");
    });
  }

  /**
   * Delay helper
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise} Promesa que se resuelve después del delay
   */
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Obtiene el progreso actual
   * @returns {Object} Información de progreso
   */
  getProgress() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.steps.length,
      percentage:
        this.steps.length > 0
          ? ((this.currentStep + 1) / this.steps.length) * 100
          : 0,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      mode: this.mode,
    };
  }

  /**
   * Establece la velocidad personalizada
   * @param {number} ms - Milisegundos de delay
   */
  setCustomSpeed(ms) {
    this.speeds.custom = ms;
    this.mode = "custom";
    console.log(`Velocidad personalizada establecida: ${ms}ms`);
  }

  /**
   * Verifica si está en modo manual
   * @returns {boolean}
   */
  isManualMode() {
    return this.mode === "manual";
  }

  /**
   * Verifica si está ejecutando
   * @returns {boolean}
   */
  isExecuting() {
    return this.isRunning;
  }

  /**
   * Reinicia el controlador
   */
  reset() {
    this.stop();
    this.steps = [];
    this.currentStep = 0;
    this.nextStepCallback = null;
    this.stepExecutedCallback = null;
    console.log("Controlador reiniciado");
  }
}
