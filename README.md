# 🌱 GreenCircuit

**Optimización de Rutas de Recolección de Residuos Urbanos**

Aplicación del Problema del Agente Viajero (TSP) para minimizar distancias, tiempo y emisiones de CO₂ en rutas de recolección de residuos.

---

## 📋 Descripción del Problema

El programa implementa una solución al **Problema del Agente Viajero (Traveling Salesman Problem)** aplicado a la optimización de rutas de recolección de residuos urbanos.

### Requisitos Funcionales

1. **Configuración del Grafo**

   - Solicitar al usuario un número entero **N** con **N ∈ [8,16]**
   - N representa la cantidad de puntos de recolección (nodos del grafo)

2. **Generación del Grafo**

   - **Modo Aleatorio**: Genera N nodos con coordenadas, nombres y datos de residuos automáticamente
   - **Modo Manual**: Permite al usuario agregar nodos y conexiones mediante una interfaz de botones

3. **Identificación de Ciclos Hamiltonianos**

   - Encontrar **TODOS** los ciclos hamiltonianos existentes en el grafo
   - Mostrar el proceso **paso a paso** de forma detallada
   - Registrar cada ciclo encontrado

4. **Representación Matricial**

   - Convertir el grafo a su **matriz de adyacencia**
   - Mostrar la matriz con distancias entre nodos

5. **Resolución del TSP**

   - Evaluar todos los ciclos hamiltonianos mediante **fuerza bruta**
   - Calcular la distancia total de cada ciclo
   - Identificar el ciclo que **minimiza la distancia total**

6. **Cálculo de Impacto Ambiental**
   - Calcular tiempo total del recorrido
   - Calcular emisiones de CO₂
   - Comparar ruta óptima vs peor ruta
   - Mostrar ahorro en minutos y kg de CO₂

---

## 🏗️ Arquitectura del Proyecto

```
📦 GreenCircuit/
├── index.html                      # Interfaz HTML básica
├── app.js                          # Entry point - orquestador principal
├── README.md                       # Este archivo
│
└── 📁 src/
    │
    ├── 📁 core/                    # ⚙️ LÓGICA PRINCIPAL
    │   ├── Graph.js               # Clase grafo con matriz de adyacencia
    │   ├── HamiltonianFinder.js   # Encuentra TODOS los ciclos hamiltonianos
    │   ├── TSPSolver.js           # Resuelve TSP evaluando todos los ciclos
    │   └── MetricsCalculator.js   # Calcula distancia, tiempo, CO₂
    │
    ├── 📁 generators/              # 🎲 GENERACIÓN DE DATOS
    │   ├── RandomGenerator.js     # Genera N nodos aleatorios con datos
    │   └── ManualInput.js         # Sistema de botones para input manual
    │
    ├── 📁 controllers/             # 🎮 CONTROL DE FLUJO
    │   ├── ExecutionController.js # Controla velocidad: rápido/lento/manual
    │   └── StepByStepManager.js   # Gestiona el proceso paso a paso
    │
    ├── 📁 visualization/           # 👁️ VISUALIZACIÓN
    │   ├── CytoscapeRenderer.js   # Renderiza grafo con Cytoscape.js
    │   └── LogDisplay.js          # Muestra logs y resultados en DOM
    │
    └── 📁 utils/                   # 🔧 UTILIDADES
        ├── validators.js          # Validaciones (N ∈ [8,16], etc)
        └── helpers.js             # Funciones auxiliares
```

---

## 🎯 Componentes Principales

### 1. **Graph.js**

Clase principal que representa el grafo completo.

- Almacena nodos y aristas
- Construye matriz de adyacencia
- Calcula distancias euclidianas
- Valida completitud del grafo

### 2. **HamiltonianFinder.js**

Implementa algoritmo de backtracking para encontrar ciclos hamiltonianos.

- Búsqueda exhaustiva recursiva
- Registro de pasos para visualización
- Retorna todos los ciclos encontrados

### 3. **TSPSolver.js**

Resuelve el problema del agente viajero por fuerza bruta.

- Evalúa cada ciclo hamiltoniano
- Calcula distancia total de cada ciclo
- Identifica el ciclo óptimo

### 4. **MetricsCalculator.js**

Calcula métricas de impacto ambiental.

- Distancia total (km)
- Tiempo de recorrido (minutos)
- Emisiones de CO₂ (kg)
- Comparación ahorro óptima vs peor ruta

### 5. **ExecutionController.js**

Controla la velocidad de ejecución del algoritmo.

- **Rápido**: Ejecución automática inmediata
- **Lento**: Delay de 1 segundo por paso
- **Manual**: Click por click del usuario

### 6. **CytoscapeRenderer.js**

Visualización del grafo usando Cytoscape.js.

- Renderiza nodos y aristas
- Anima el proceso paso a paso
- Destaca la ruta óptima

---

## 📊 Estructuras de Datos

### Nodo (Punto de Recolección)

```javascript
{
  id: 0,
  name: "Punto A - Residencial Norte",
  x: 150,
  y: 200,
  wasteAmount: 45,        // kg de residuos
  type: "residencial"     // residencial/comercial/industrial
}
```

### Arista (Conexión entre Puntos)

```javascript
{
  from: 0,
  to: 1,
  distance: 3.2,          // km
  time: 7.68,             // minutos
  co2PerKm: 0.2           // kg CO₂ por km
}
```

### Resultado TSP

```javascript
{
  optimalCycle: [0, 3, 1, 4, 2, 0],
  optimalDistance: 25.3,
  optimalTime: 60.72,
  optimalCO2: 5.06,
  worstCycle: [0, 1, 2, 3, 4, 0],
  worstDistance: 34.0,
  comparison: {
    timeSaved: 20.88,     // minutos ahorrados
    co2Saved: 1.74,       // kg CO₂ reducidos
    distanceSaved: 8.7    // km ahorrados
  }
}
```

---

## 🔄 Flujo de Ejecución

1. **Configuración** → Usuario ingresa N ∈ [8,16]
2. **Generación** → Aleatorio o Manual
3. **Visualización** → Renderiza grafo con Cytoscape.js
4. **Matriz de Adyacencia** → Construye y muestra matriz N×N
5. **Búsqueda de Ciclos** → Encuentra todos los ciclos hamiltonianos (paso a paso)
6. **Resolución TSP** → Evalúa cada ciclo y encuentra el óptimo
7. **Resultados** → Muestra ruta óptima, ahorros de tiempo y CO₂

---

## 🚀 Tecnologías

- **HTML5** - Estructura semántica
- **JavaScript ES6+** - Lógica modular
- **Cytoscape.js** - Visualización de grafos
- **ES Modules** - Importación/exportación de módulos

---

## 📝 Notas de Implementación

### Fase 1 (Actual): Lógica + Funcionalidad

- ✅ Solo lógica y HTML básico
- ✅ Sin estilos CSS complejos
- ✅ Coordenadas aleatorias abstractas
- ✅ Foco en correcto funcionamiento de algoritmos

### Fase 2 (Futura): Interfaz y Mapas

- 🔜 Estilos CSS completos
- 🔜 Integración con mapas reales (OpenStreetMap / Google Maps)
- 🔜 Coordenadas geográficas reales
- 🔜 Diseño responsive y atractivo

---

## 📈 Complejidad Computacional

- **Búsqueda de ciclos hamiltonianos**: O((n-1)!)
- **TSP por fuerza bruta**: O(n!)
- **Para N=16**: ~20.9 billones de permutaciones
- **Recomendación**: Usar N moderado (8-12) para testing

---

## 🌍 Impacto del Proyecto

Este proyecto demuestra cómo la optimización algorítmica puede tener un impacto real en:

- **Reducción de emisiones de CO₂**
- **Ahorro de combustible**
- **Eficiencia operativa**
- **Sostenibilidad urbana**

---

## 👨‍💻 Autor

Desarrollado como demostración del Problema del Agente Viajero aplicado a optimización de rutas urbanas.
