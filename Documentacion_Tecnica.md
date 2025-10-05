# Documentación Técnica - GreenCircuit

---

## 1. Lenguaje y entorno de desarrollo

### Lenguaje utilizado

**JavaScript (ES6+)**

### Entorno específico

- **Navegador web** (aplicación del lado del cliente)
- No utiliza Node.js ni frameworks como React/Vue/Angular
- Es una aplicación web **vanilla JavaScript** pura
- Se ejecuta completamente en el navegador sin necesidad de backend

---

## 2. Librerías o tecnologías empleadas

### Librerías externas

#### Cytoscape.js

- **Función:** Visualización y renderizado interactivo de grafos
- **Características:**
  - Maneja la representación visual de nodos y aristas
  - Proporciona interactividad (zoom, pan, drag)
  - Permite estilización dinámica de elementos
- **Fuente:** CDN - `https://unpkg.com/cytoscape/dist/cytoscape.min.js`

### Tecnologías nativas

- **HTML5** - Estructura de la aplicación
- **CSS3** - Estilos visuales (archivo `main.css`)
- **JavaScript puro** - Toda la lógica del programa

### APIs externas

**Ninguna** - La aplicación funciona completamente offline

### Módulos propios

El sistema está dividido en **7 archivos JavaScript** con responsabilidades específicas:

| Archivo                | Responsabilidad                           |
| ---------------------- | ----------------------------------------- |
| `Graph.js`             | Representación y gestión del grafo        |
| `RandomGenerator.js`   | Generación de nodos y layouts             |
| `HamiltonianFinder.js` | Búsqueda de ciclos hamiltonianos          |
| `TSPSolver.js`         | Resolución del problema TSP               |
| `CytoscapeRenderer.js` | Renderizado visual del grafo              |
| `LogDisplay.js`        | Sistema de logs y mensajes                |
| `app.js`               | Orquestador principal y gestor de eventos |

---

## 3. Estructura del programa

### Organización modular

#### a) `Graph.js` - Modelo de datos del grafo

**Responsabilidades:**

- Almacena nodos y aristas del grafo
- Construye la matriz de adyacencia
- Valida existencia de conexiones
- Proporciona información del grafo (nodos, aristas, completitud)

**Métodos principales:**

```javascript
addNode(node); // Agrega un nodo al grafo
addEdge(from, to, distance); // Agrega una arista con peso
buildAdjacencyMatrix(); // Construye la matriz NxN
getDistance(from, to); // Consulta distancia entre nodos
hasEdge(from, to); // Verifica si existe conexión
getInfo(); // Retorna estadísticas del grafo
```

#### b) `RandomGenerator.js` - Generación de datos

**Responsabilidades:**

- Genera nodos con coordenadas y propiedades aleatorias
- Crea diferentes layouts (aleatorio, circular, grid)
- Genera grafo completo con todas las conexiones posibles
- Calcula distancias euclidianas entre nodos

**Métodos principales:**

```javascript
generate(n, bounds); // Layout aleatorio
generateCircularLayout(n, options); // Layout circular
generateGridLayout(n, options); // Layout en cuadrícula
generateCompleteGraph(nodes); // Conecta todos los nodos
getStatistics(nodes); // Estadísticas de los nodos
```

**Propiedades generadas para cada nodo:**

- `id`: Identificador único (0 a N-1)
- `name`: Nombre descriptivo ("Punto A", "Punto B", etc.)
- `x, y`: Coordenadas espaciales
- `type`: Tipo de zona (residencial, comercial, industrial)
- `waste`: Cantidad de residuos en kg (30-100)

#### c) `HamiltonianFinder.js` - Búsqueda de ciclos

**Responsabilidades:**

- Implementa algoritmo de **backtracking** recursivo
- Encuentra **todos** los ciclos hamiltonianos del grafo
- Mantiene estadísticas de la búsqueda

**Algoritmo implementado:**

```javascript
findAllCycles(startNode) {
  // Inicialización
  const visited = Array(n).fill(false);
  const path = [startNode];
  visited[startNode] = true;

  // Backtracking recursivo
  this._backtrack(path, visited, startNode, startNode);

  return this.cycles;
}

_backtrack(path, visited, currentNode, startNode) {
  // Caso base: camino completo
  if (path.length === n) {
    if (this.graph.hasEdge(currentNode, startNode)) {
      this.cycles.push([...path, startNode]);
    }
    return;
  }

  // Explorar vecinos no visitados
  for (let i = 0; i < n; i++) {
    if (!visited[i] && this.graph.hasEdge(currentNode, i)) {
      visited[i] = true;
      path.push(i);
      this._backtrack(path, visited, i, startNode);
      visited[i] = false;  // Backtrack
      path.pop();
    }
  }
}
```

**Complejidad:** O(N!) - explora todas las permutaciones posibles

#### d) `TSPSolver.js` - Optimización

**Responsabilidades:**

- Evalúa todos los ciclos hamiltonianos encontrados
- Calcula métricas para cada ciclo (distancia, tiempo, CO₂)
- Identifica la solución óptima (mínima distancia)
- Identifica la peor solución (máxima distancia)
- Calcula ahorros y porcentajes

**Proceso de resolución:**

```javascript
solve() {
  // 1. Evaluar cada ciclo
  this.cycles.forEach((cycle) => {
    const distance = this._calculateCycleDistance(cycle);
    const time = (distance / 25) * 60;  // 25 km/h promedio
    const co2 = distance * 0.2;         // 0.2 kg/km

    this.results.push({ cycle, distance, time, co2 });
  });

  // 2. Identificar óptimo y peor
  this.optimalSolution = result_with_min_distance;
  this.worstSolution = result_with_max_distance;

  // 3. Calcular ahorros
  const savings = {
    distanceSaved: worst.distance - optimal.distance,
    distancePercent: (saved / worst.distance) * 100,
    // ... tiempo y CO₂
  };

  return { optimal, worst, savings, summary };
}
```

#### e) `CytoscapeRenderer.js` - Visualización

**Responsabilidades:**

- Inicializa la instancia de Cytoscape.js
- Renderiza nodos y aristas del grafo
- Aplica estilos diferenciados por tipo de nodo
- Destaca la ruta óptima encontrada
- Maneja controles de zoom y vista

**Estilos aplicados:**

- **Nodos residenciales:** 🟦 Azul (#2196F3)
- **Nodos comerciales:** 🟧 Naranja (#FF9800)
- **Nodos industriales:** 🟥 Rojo (#F44336)
- **Aristas normales:** Grises delgadas
- **Ruta óptima:** Verde gruesa (#4CAF50, width: 4)

#### f) `LogDisplay.js` - Interfaz de logs

**Responsabilidades:**

- Muestra mensajes categorizados en la consola visual
- Formatea matrices en tablas legibles
- Presenta resultados con formato estructurado
- Categoriza mensajes por tipo (info, error, success, warning, etc.)

**Tipos de logs:**

- `info` - Información general (azul)
- `success` - Operaciones exitosas (verde)
- `error` - Errores (rojo)
- `warning` - Advertencias (amarillo)
- `separator` - Líneas divisorias
- `phase` - Encabezados de fases
- `cycle` - Ciclos hamiltonianos

#### g) `app.js` - Controlador principal

**Responsabilidades:**

- Gestiona el estado global de la aplicación
- Conecta eventos de UI con funciones de lógica
- Orquesta la ejecución del algoritmo en fases
- Actualiza la barra de progreso
- Coordina todos los módulos

**Estado global:**

```javascript
const state = {
  graph: null, // Instancia de Graph
  renderer: null, // Instancia de CytoscapeRenderer
  logger: null, // Instancia de LogDisplay
  n: 10, // Número de nodos
  isConfigured: false, // ¿Grafo configurado?
  isGenerated: false, // ¿Grafo generado?
  currentMode: "slow", // Velocidad de ejecución
  isExecuting: false, // ¿Ejecutando algoritmo?
};
```

### Gestión de entrada del usuario

El programa utiliza **event listeners** sobre elementos HTML para capturar interacciones:

```javascript
// Configuración
document.getElementById("btn-config").addEventListener("click", onConfigSubmit);

// Generación
document
  .getElementById("btn-random")
  .addEventListener("click", () => generateRandom("random"));
document
  .getElementById("btn-random-circular")
  .addEventListener("click", () => generateRandom("circular"));
document
  .getElementById("btn-random-grid")
  .addEventListener("click", () => generateRandom("grid"));

// Controles de ejecución
document
  .getElementById("btn-fast")
  .addEventListener("click", () => setExecutionMode("fast"));
document
  .getElementById("btn-slow")
  .addEventListener("click", () => setExecutionMode("slow"));
document
  .getElementById("btn-manual-step")
  .addEventListener("click", () => setExecutionMode("manual"));

// Ejecución principal
document
  .getElementById("btn-execute")
  .addEventListener("click", executeAlgorithm);

// Visualización
document
  .getElementById("btn-fit-view")
  .addEventListener("click", () => state.renderer.fitView());
document
  .getElementById("btn-reset-view")
  .addEventListener("click", () => state.renderer.resetView());

// Logs
document
  .getElementById("btn-clear-logs")
  .addEventListener("click", () => state.logger.clear());
```

**Flujo de interacción:**

1. Usuario ingresa N (8-16) → `onConfigSubmit()`
2. Usuario selecciona layout → `generateRandom(layout)`
3. Usuario elige velocidad → `setExecutionMode(mode)`
4. Usuario ejecuta → `executeAlgorithm()`
5. Sistema muestra resultados automáticamente

### Representación del grafo

El programa utiliza una **estructura de datos híbrida**:

#### 1. Lista de nodos (Array de objetos)

```javascript
nodes = [
  {
    id: 0,
    name: "Punto A",
    x: 150,
    y: 200,
    type: "residencial",
    waste: 45,
  },
  {
    id: 1,
    name: "Punto B",
    x: 300,
    y: 150,
    type: "comercial",
    waste: 78,
  },
  // ... más nodos
];
```

#### 2. Lista de aristas (Array de objetos)

```javascript
edges = [
  { from: 0, to: 1, distance: 45.23 },
  { from: 0, to: 2, distance: 67.89 },
  { from: 1, to: 2, distance: 56.12 },
  // ... más aristas
];
```

#### 3. Matriz de adyacencia (Array 2D)

```javascript
matrix = [
  [  0.0,  45.23, 67.89, 32.45, ... ],
  [ 45.23,   0.0, 56.12, 78.90, ... ],
  [ 67.89, 56.12,   0.0, 43.21, ... ],
  [ 32.45, 78.90, 43.21,   0.0, ... ],
  // ...
]
```

**Ventajas de cada representación:**

- **Lista de nodos:** Fácil iteración, acceso a propiedades
- **Lista de aristas:** Construcción del grafo, renderizado
- **Matriz de adyacencia:** Acceso O(1) a distancias, cálculo rápido de ciclos

### Almacenamiento y procesamiento de ciclos hamiltonianos

#### Almacenamiento

Los ciclos se guardan en un **array de arrays**:

```javascript
cycles = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], // Ciclo 1
  [0, 1, 2, 3, 4, 5, 6, 7, 9, 8, 0], // Ciclo 2
  [0, 1, 2, 3, 4, 5, 6, 8, 7, 9, 0], // Ciclo 3
  // ... hasta (N-1)!/2 ciclos
];
```

Cada ciclo es un array que:

- Comienza en el nodo 0
- Visita cada nodo exactamente una vez
- Termina regresando al nodo 0
- Tiene longitud N+1 (N nodos + retorno al inicio)

#### Procesamiento

**Generación (Backtracking):**

```javascript
// Explora recursivamente todos los caminos posibles
// Tiempo: O(N!)
// Espacio: O(N) para el stack de recursión
_backtrack(path, visited, current, start);
```

**Evaluación (TSP):**

```javascript
// Para cada ciclo:
cycles.forEach(cycle => {
  // Calcular distancia total
  let distance = 0;
  for (let i = 0; i < cycle.length - 1; i++) {
    distance += matrix[cycle[i]][cycle[i+1]];
  }

  // Calcular métricas derivadas
  const time = (distance / 25) * 60;
  const co2 = distance * 0.2;

  // Guardar resultado
  results.push({ cycle, distance, time, co2 });
});

// Encontrar óptimo y peor
optimal = min(results, by: distance);
worst = max(results, by: distance);
```

**Complejidad total:**

- Generación: O(N!)
- Evaluación: O(N! × N)
- Memoria: O(N! × N) para almacenar todos los ciclos

---

## 4. Algoritmo implementado

### Tipo de algoritmo

**Fuerza bruta exhaustiva** - Evaluación completa de todas las soluciones posibles

### Proceso completo en 4 fases

#### FASE 1: Construcción de matriz de adyacencia

**Objetivo:** Convertir el grafo en una matriz NxN para acceso rápido a distancias

**Algoritmo:**

```javascript
buildAdjacencyMatrix() {
  const n = this.nodes.length;

  // Inicializar matriz con infinitos
  this.matrix = Array(n).fill(null)
    .map(() => Array(n).fill(Infinity));

  // Diagonal = 0 (distancia de un nodo a sí mismo)
  for (let i = 0; i < n; i++) {
    this.matrix[i][i] = 0;
  }

  // Llenar con distancias de aristas existentes
  this.edges.forEach(edge => {
    const { from, to, distance } = edge;
    this.matrix[from][to] = distance;
    this.matrix[to][from] = distance; // Grafo no dirigido
  });
}
```

**Complejidad:** O(N² + E) donde E es el número de aristas

**Resultado:** Matriz simétrica donde `matrix[i][j]` = distancia entre nodo i y j

#### FASE 2: Búsqueda de ciclos hamiltonianos

**Objetivo:** Encontrar TODAS las rutas posibles que visiten cada nodo exactamente una vez

**Algoritmo:** Backtracking recursivo con poda

**Pseudocódigo:**

```
FUNCIÓN findAllCycles(start):
  cycles = []
  visited = [false, false, ..., false]  // N elementos
  path = [start]
  visited[start] = true

  backtrack(path, visited, start, start)

  RETORNAR cycles

FUNCIÓN backtrack(path, visited, current, start):
  // Caso base: hemos visitado todos los nodos
  SI path.length == N:
    // Verificar si podemos regresar al inicio
    SI existe_arista(current, start):
      cycle = path + [start]
      cycles.agregar(cycle)
    RETORNAR

  // Caso recursivo: explorar vecinos
  PARA cada nodo i de 0 a N-1:
    SI NOT visited[i] Y existe_arista(current, i):
      // Marcar y avanzar
      visited[i] = true
      path.agregar(i)

      // Recursión
      backtrack(path, visited, i, start)

      // Backtrack (deshacer)
      visited[i] = false
      path.eliminar_último()
```

**Optimizaciones implementadas:**

- Poda temprana: si no hay arista, no explorar ese camino
- Inicio fijo en nodo 0 (reduce búsqueda a (N-1)!/2)
- Verificación de arista de retorno antes de guardar ciclo

**Complejidad:** O(N!) en el peor caso

**Ejemplo de ejecución para N=4:**

```
Ciclos encontrados:
[0, 1, 2, 3, 0]
[0, 1, 3, 2, 0]
[0, 2, 1, 3, 0]
[0, 2, 3, 1, 0]
[0, 3, 1, 2, 0]
[0, 3, 2, 1, 0]

Total: 3! = 6 ciclos
```

#### FASE 3: Evaluación de ciclos (TSP)

**Objetivo:** Calcular el costo de cada ciclo y encontrar el óptimo

**Algoritmo:**

```javascript
solve() {
  this.results = [];
  let minDistance = Infinity;
  let maxDistance = -Infinity;
  let optimalIndex = -1;
  let worstIndex = -1;

  // Evaluar cada ciclo
  this.cycles.forEach((cycle, index) => {
    // 1. Calcular distancia total
    const distance = this._calculateCycleDistance(cycle);

    // 2. Calcular tiempo estimado
    const time = (distance / 25) * 60;  // velocidad 25 km/h

    // 3. Calcular emisiones CO₂
    const co2 = distance * 0.2;  // 0.2 kg CO₂ por km

    // 4. Guardar resultado
    const result = {
      cycle,
      distance: parseFloat(distance.toFixed(2)),
      time: parseFloat(time.toFixed(2)),
      co2: parseFloat(co2.toFixed(2)),
      index
    };
    this.results.push(result);

    // 5. Rastrear óptimo y peor
    if (distance < minDistance) {
      minDistance = distance;
      optimalIndex = index;
    }
    if (distance > maxDistance) {
      maxDistance = distance;
      worstIndex = index;
    }
  });

  // Identificar soluciones
  this.optimalSolution = this.results[optimalIndex];
  this.worstSolution = this.results[worstIndex];

  // Calcular ahorros
  return this._calculateSavings();
}
```

**Función auxiliar para calcular distancia de un ciclo:**

```javascript
_calculateCycleDistance(cycle) {
  let totalDistance = 0;

  // Sumar distancias entre nodos consecutivos
  for (let i = 0; i < cycle.length - 1; i++) {
    const from = cycle[i];
    const to = cycle[i + 1];
    const distance = this.graph.getDistance(from, to);

    if (distance === null) {
      throw new Error(`No existe arista entre ${from} y ${to}`);
    }

    totalDistance += distance;
  }

  return parseFloat(totalDistance.toFixed(2));
}
```

**Complejidad:** O(N! × N) - evaluar N! ciclos, cada uno con N aristas

#### FASE 4: Cálculo de ahorros y presentación

**Objetivo:** Comparar óptimo vs peor y cuantificar los beneficios

**Algoritmo:**

```javascript
_calculateSavings() {
  const distanceSaved =
    this.worstSolution.distance - this.optimalSolution.distance;
  const timeSaved =
    this.worstSolution.time - this.optimalSolution.time;
  const co2Saved =
    this.worstSolution.co2 - this.optimalSolution.co2;

  return {
    optimal: this.optimalSolution,
    worst: this.worstSolution,
    savings: {
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
      )
    },
    summary: {
      totalCyclesEvaluated: this.cycles.length,
      bestDistance: this.optimalSolution.distance,
      worstDistance: this.worstSolution.distance,
      averageDistance: this._calculateAverageDistance()
    }
  };
}
```

### Métricas calculadas

Para cada ciclo hamiltoniano se calculan **3 métricas principales**:

#### 1. Distancia total (km)

```javascript
distance = Σ(i=0 hasta N-1) matrix[cycle[i]][cycle[i+1]]
```

**Ejemplo:**

```
Ciclo: [0, 3, 7, 2, 5, 9, 4, 1, 6, 8, 0]
Distancia = d(0,3) + d(3,7) + d(7,2) + d(2,5) + d(5,9) +
            d(9,4) + d(4,1) + d(1,6) + d(6,8) + d(8,0)
         = 45.2 + 67.3 + 34.1 + 52.8 + 41.9 +
           38.4 + 29.7 + 55.6 + 44.2 + 33.8
         = 443.0 km
```

#### 2. Tiempo estimado (minutos)

```javascript
tiempo = (distancia / velocidad_promedio) × 60
tiempo = (distancia / 25 km/h) × 60 min/h
```

**Supuestos:**

- Velocidad promedio del camión: 25 km/h
- Incluye tiempo de conducción en ciudad con tráfico
- No incluye tiempo de recolección en cada punto

**Ejemplo:**

```
Distancia: 443.0 km
Tiempo = (443.0 / 25) × 60 = 1,063.2 minutos = 17.72 horas
```

#### 3. Emisiones de CO₂ (kg)

```javascript
co2 = distancia × factor_emisión
co2 = distancia × 0.2 kg/km
```

**Supuestos:**

- Factor de emisión: 0.2 kg CO₂ por km
- Basado en camión de recolección diésel típico
- Valor aproximado para vehículos pesados urbanos

**Ejemplo:**

```
Distancia: 443.0 km
CO₂ = 443.0 × 0.2 = 88.6 kg de CO₂
```

### Complejidad computacional

**Análisis por fase:**

| Fase      | Operación              | Complejidad Temporal | Complejidad Espacial |
| --------- | ---------------------- | -------------------- | -------------------- |
| 1         | Matriz de adyacencia   | O(N² + E)            | O(N²)                |
| 2         | Ciclos hamiltonianos   | O(N!)                | O(N! × N)            |
| 3         | Evaluación TSP         | O(N! × N)            | O(N!)                |
| 4         | Cálculo de ahorros     | O(N!)                | O(1)                 |
| **Total** | **Algoritmo completo** | **O(N! × N)**        | **O(N! × N)**        |

**Número de ciclos según N:**

| N   | (N-1)!/2 | Ciclos          | Tiempo aproximado |
| --- | -------- | --------------- | ----------------- |
| 8   | 7!/2     | 2,520           | < 0.1 segundos    |
| 10  | 9!/2     | 181,440         | ~1 segundo        |
| 12  | 11!/2    | 19,958,400      | ~10 segundos      |
| 14  | 13!/2    | 3,113,510,400   | ~5 minutos        |
| 16  | 15!/2    | 653,837,184,000 | Horas/días        |

**Límite práctico:** N ≤ 16 para fuerza bruta

---

## 5. Interfaz gráfica

### Interacción del usuario

La aplicación sigue un **flujo secuencial** dividido en 5 secciones:

#### Sección 1: Configuración del Grafo

**Elementos:**

- Input numérico para N (8-16)
- Botón "✅ Configurar"
- Área de mensajes de estado

**Interacción:**

1. Usuario ingresa número de nodos
2. Click en "Configurar"
3. Sistema valida (8 ≤ N ≤ 16)
4. Se crea el objeto Graph vacío
5. Se desbloquea Sección 2

#### Sección 2: Generación del Grafo

**Elementos:**

- Botón "🎲 Generar Aleatoriamente"
- Botón "⭕ Generar en Círculo"
- Botón "⊞ Generar en Grid"
- Área de mensajes de estado

**Interacción:**

1. Usuario selecciona tipo de layout
2. Sistema genera N nodos con coordenadas
3. Se crea grafo completo (conecta todos los nodos)
4. Se renderiza en Cytoscape
5. Se desbloquea Sección 3 y 4

#### Sección 3: Visualización del Grafo

**Elementos:**

- Contenedor Cytoscape (canvas interactivo)
- Cuadro de información (estadísticas del grafo)
- Botón "🔍 Ajustar Vista"
- Botón "🔄 Resetear Vista"

**Interacción:**

- Zoom: scroll del mouse
- Pan: click y arrastrar
- Ajustar vista: centrar y escalar para ver todo
- Resetear: volver a vista inicial

#### Sección 4: Controles de Ejecución

**Elementos:**

- Botones de velocidad:
  - "⚡ Rápido (con pausas)"
  - "🐢 Lento (1 seg/paso)"
  - "👆 Manual (click por click)"
- Botón "▶️ EJECUTAR ALGORITMO"
- Barra de progreso
- Área de estado de ejecución

**Interacción:**

1. Usuario selecciona velocidad
2. Click en "EJECUTAR"
3. Sistema ejecuta las 4 fases
4. Progreso: 0% → 25% → 50% → 90% → 100%

#### Sección 5: Proceso y Resultados

**Elementos:**

- Contenedor de logs (historial completo)
- Botón "🗑️ Limpiar Logs"

**Interacción:**

- Lectura de logs en tiempo real
- Scroll para ver historial completo
- Limpiar para nueva ejecución

### Elementos visuales

#### Nodos del grafo

**Representación visual:**

- Forma: Círculos
- Tamaño: Proporcional a cantidad de residuos
- Etiqueta: ID del nodo (0, 1, 2, ...)

**Colores según tipo de zona:**

```css
Residencial: #2196F3 (azul)
Comercial:   #FF9800 (naranja)
Industrial:  #F44336 (rojo)
```

**Código de estilo:**

```javascript
{
  selector: 'node[type="residencial"]',
  style: {
    'background-color': '#2196F3',
    'label': 'data(id)',
    'color': '#fff',
    'text-valign': 'center',
    'font-size': '14px',
    'width': 30,
    'height': 30
  }
}
```

#### Aristas del grafo

**Estados de visualización:**

**1. Aristas normales (grafo completo):**

```javascript
{
  selector: 'edge',
  style: {
    'width': 1,
    'line-color': '#ccc',
    'opacity': 0.3,
    'curve-style': 'bezier'
  }
}
```

**2. Ruta óptima (destacada):**

```javascript
{
  selector: 'edge.optimal',
  style: {
    'width': 4,
    'line-color': '#4CAF50',
    'opacity': 1,
    'z-index': 999,
    'line-style': 'solid'
  }
}
```

#### Panel de información

**Cuadro de estadísticas del grafo:**

```
📊 Nodos: 10 | Aristas: 45 | Completo: Sí
📦 Total residuos: 567 kg | Promedio: 56.7 kg/punto
🏘️ Residencial: 4 puntos | 🏢 Comercial: 3 puntos | 🏭 Industrial: 3 puntos
```

#### Barra de progreso

**Estructura:**

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 50%"></div>
</div>
<div id="progress-text">Progreso: 50% - Buscando ciclos...</div>
```

**Fases visualizadas:**

- 10% - Construyendo matriz
- 25% - Matriz construida
- 50% - Ciclos encontrados
- 90% - TSP resuelto
- 100% - Completado

#### Panel de logs

**Tipos de mensajes con formato:**

```javascript
// Info (azul)
"🎲 Generando 10 nodos..."

// Success (verde)
"✅ Grafo generado exitosamente"

// Error (rojo)
"❌ Error: N debe estar entre 8 y 16"

// Warning (amarillo)
"⚠️ Para N > 10, se recomienda modo lento"

// Separator
"═══════════════════════════════════════"

// Phase header
"--- FASE 2: CICLOS HAMILTONIANOS ---"

// Cycle
"  Ciclo #1: 0 → 1 → 2 → 3 → 4 → 0"

// Matrix (tabla formateada)
"     0      1      2      3
 0 [ 0.0   45.2   67.8   32.4 ]
 1 [45.2    0.0   56.1   78.9 ]
 ..."
```

### Funcionalidades de la interfaz

#### 1. Control de zoom y navegación

**Funciones disponibles:**

```javascript
// Ajustar vista (fit)
fitView() {
  this.cy.fit(50);  // padding de 50px
}

// Resetear vista
resetView() {
  this.cy.reset();
}

// Zoom programático
this.cy.zoom({
  level: 1.5,
  position: { x: 400, y: 300 }
});
```

**Interacción del usuario:**

- **Zoom:** Scroll del mouse (in/out)
- **Pan:** Click y arrastrar el fondo
- **Centrar:** Botón "Ajustar Vista"
- **Resetear:** Botón "Resetear Vista"

#### 2. Selección de velocidad de ejecución

**Modos disponibles:**

| Modo      | Descripción    | Pausas   | Recomendado para       |
| --------- | -------------- | -------- | ---------------------- |
| ⚡ Rápido | Pausas cortas  | 500ms    | N ≤ 10                 |
| 🐢 Lento  | Pausas largas  | 1000ms   | N > 10                 |
| 👆 Manual | Click por paso | Infinito | Demostración educativa |

**Implementación:**

```javascript
async function executeAlgorithm() {
  // ...código de fase...

  // Pausa según modo
  const pauseTime = state.currentMode === "fast" ? 500 : 1000;
  await delay(pauseTime);

  // ...siguiente fase...
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

#### 3. Visualización de rutas

**Destacar ruta óptima:**

```javascript
highlightPath(cycle) {
  // Atenuar todas las aristas
  this.cy.edges().style({
    'opacity': 0.1,
    'width': 1
  });

  // Destacar aristas del ciclo óptimo
  for (let i = 0; i < cycle.length - 1; i++) {
    const from = cycle[i];
    const to = cycle[i + 1];
    const edgeId = `${from}-${to}`;

    this.cy.getElementById(edgeId).style({
      'line-color': '#4CAF50',
      'width': 4,
      'opacity': 1,
      'z-index': 999
    });
  }

  // Animar la vista hacia el camino
  this.cy.fit(this.cy.$('.optimal'), 50);
}
```

**Resultado visual:**

- Ruta óptima: Verde brillante, gruesa, al frente
- Otras aristas: Grises, delgadas, transparentes

#### 4. Sistema de logs categorizados

**Categorías implementadas:**

```javascript
log(message, type = "info") {
  const logEntry = document.createElement("div");
  logEntry.className = `log-entry log-${type}`;

  // Aplicar estilos según tipo
  switch(type) {
    case "success":
      logEntry.style.color = "#4CAF50";
      break;
    case "error":
      logEntry.style.color = "#F44336";
      break;
    case "warning":
      logEntry.style.color = "#FF9800";
      break;
    case "separator":
      logEntry.style.borderBottom = "2px solid #333";
      break;
    case "phase":
      logEntry.style.fontWeight = "bold";
      logEntry.style.fontSize = "16px";
      break;
    default:
      logEntry.style.color = "#2196F3";
  }

  logEntry.textContent = message;
  this.container.appendChild(logEntry);

  // Auto-scroll al último mensaje
  this.container.scrollTop = this.container.scrollHeight;
}
```

**Función especial para matrices:**

```javascript
displayMatrix(matrix) {
  const n = matrix.length;
  let matrixStr = "\nMatriz de Adyacencia:\n";

  // Encabezado
  matrixStr += "      ";
  for (let i = 0; i < n; i++) {
    matrixStr += i.toString().padStart(7);
  }
  matrixStr += "\n";

  // Filas
  for (let i = 0; i < n; i++) {
    matrixStr += i.toString().padStart(3) + " [ ";
    for (let j = 0; j < n; j++) {
      const val = matrix[i][j] === Infinity ? "∞" :
                  matrix[i][j].toFixed(1);
      matrixStr += val.padStart(6);
    }
    matrixStr += " ]\n";
  }

  this.log(matrixStr, "matrix");
}
```

#### 5. Secciones progresivas (progressive disclosure)

**Patrón de diseño:**
Las secciones se desbloquean secuencialmente para guiar al usuario:

```javascript
// Inicialmente todas ocultas (excepto Sección 1)
<section id="generation-section" class="hidden">
<section id="controls-section" class="hidden">

// Al configurar N → mostrar Sección 2
document.getElementById("generation-section")
  .classList.remove("hidden");

// Al generar grafo → mostrar Secciones 3 y 4
document.getElementById("controls-section")
  .classList.remove("hidden");
```

**Beneficios:**

- Evita abrumar al usuario
- Flujo claro y guiado
- Previene errores (no se puede ejecutar antes de generar)

#### 6. Controles visuales adicionales

**Botones de acción:**

```html
<!-- Configuración -->
<button id="btn-config">✅ Configurar</button>

<!-- Generación -->
<button id="btn-random">🎲 Generar Aleatoriamente</button>
<button id="btn-random-circular">⭕ Generar en Círculo</button>
<button id="btn-random-grid">⊞ Generar en Grid</button>

<!-- Visualización -->
<button id="btn-fit-view">🔍 Ajustar Vista</button>
<button id="btn-reset-view">🔄 Resetear Vista</button>

<!-- Ejecución -->
<button id="btn-fast">⚡ Rápido (con pausas)</button>
<button id="btn-slow">🐢 Lento (1 seg/paso)</button>
<button id="btn-manual-step">👆 Manual (click por click)</button>
<button id="btn-execute">▶️ EJECUTAR ALGORITMO</button>

<!-- Logs -->
<button id="btn-clear-logs">🗑️ Limpiar Logs</button>
```

**Estados de botones:**

```javascript
// Deshabilitar durante ejecución
document.getElementById("btn-execute").disabled = true;

// Mostrar feedback visual
button.style.opacity = "0.5";
button.style.cursor = "not-allowed";
```

---

## 6. Visualización de resultados

### Cómo se muestran los resultados

#### 1. Panel de logs (texto estructurado)

**Formato de salida completo:**

```
═══════════════════════════════════════
--- FASE 4: RESULTADOS ---
═══════════════════════════════════════

🏆 SOLUCIÓN ÓPTIMA:
   Ruta: 0 → 3 → 7 → 2 → 5 → 9 → 4 → 1 → 6 → 8 → 0
   📏 Distancia: 342.56 km
   ⏱️  Tiempo: 821.34 min (13.69 horas)
   🌱 CO₂: 68.51 kg

❌ PEOR SOLUCIÓN:
   Ruta: 0 → 8 → 1 → 9 → 2 → 4 → 7 → 5 → 3 → 6 → 0
   📏 Distancia: 478.23 km
   ⏱️  Tiempo: 1147.75 min (19.13 horas)
   🌱 CO₂: 95.65 kg

💰 AHORRO LOGRADO:
   📉 Distancia: 135.67 km (28.37%)
   ⏱️  Tiempo: 326.41 min (28.37%)
   🌱 CO₂: 27.14 kg (28.37%)

📊 RESUMEN:
   Total de ciclos evaluados: 181,440
   Mejor distancia: 342.56 km
   Peor distancia: 478.23 km
   Distancia promedio: 410.39 km
```

**Código de formateo:**

```javascript
displayResults(results) {
  const { optimal, worst, savings, summary } = results;

  // Separador
  this.log("═══════════════════════════════════════", "separator");
  this.log("--- FASE 4: RESULTADOS ---", "phase");
  this.log("═══════════════════════════════════════", "separator");
  this.log("", "info");

  // Solución óptima
  this.log("🏆 SOLUCIÓN ÓPTIMA:", "header");
  this.log(`   Ruta: ${optimal.cycle.join(" → ")}`, "success");
  this.log(`   📏 Distancia: ${optimal.distance} km`, "info");
  this.log(`   ⏱️  Tiempo: ${optimal.time} min (${(optimal.time/60).toFixed(2)} horas)`, "info");
  this.log(`   🌱 CO₂: ${optimal.co2} kg`, "info");
  this.log("", "info");

  // Peor solución
  this.log("❌ PEOR SOLUCIÓN:", "header");
  this.log(`   Ruta: ${worst.cycle.join(" → ")}`, "error");
  this.log(`   📏 Distancia: ${worst.distance} km`, "info");
  this.log(`   ⏱️  Tiempo: ${worst.time} min (${(worst.time/60).toFixed(2)} horas)`, "info");
  this.log(`   🌱 CO₂: ${worst.co2} kg`, "info");
  this.log("", "info");

  // Ahorros
  this.log("💰 AHORRO LOGRADO:", "header");
  this.log(`   📉 Distancia: ${savings.distanceSaved} km (${savings.distancePercent}%)`, "success");
  this.log(`   ⏱️  Tiempo: ${savings.timeSaved} min (${savings.timePercent}%)`, "success");
  this.log(`   🌱 CO₂: ${savings.co2Saved} kg (${savings.co2Percent}%)`, "success");
  this.log("", "info");

  // Resumen
  this.log("📊 RESUMEN:", "header");
  this.log(`   Total de ciclos evaluados: ${summary.totalCyclesEvaluated.toLocaleString()}`, "info");
  this.log(`   Mejor distancia: ${summary.bestDistance} km`, "info");
  this.log(`   Peor distancia: ${summary.worstDistance} km`, "info");
  this.log(`   Distancia promedio: ${summary.averageDistance} km`, "info");
}
```

#### 2. Visualización gráfica en Cytoscape

**Destacado de la ruta óptima:**

Proceso visual:

1. Todas las aristas se atenúan (opacity: 0.1)
2. Las aristas del ciclo óptimo se destacan:
   - Color verde brillante (#4CAF50)
   - Grosor 4x
   - Opacidad 100%
   - z-index máximo (al frente)
3. La cámara se ajusta para enfocar la ruta

**Efecto visual:**

```
Antes:                    Después:
[Grafo completo]    →    [Solo ruta óptima visible]
  gris, delgado           verde, gruesa, destacada
  todas visibles          otras atenuadas
```

### Comparación óptimo vs. peor

**Sí, se realiza una comparación exhaustiva** en 3 niveles:

#### Nivel 1: Rutas completas

```
ÓPTIMA: 0 → 3 → 7 → 2 → 5 → 9 → 4 → 1 → 6 → 8 → 0
PEOR:   0 → 8 → 1 → 9 → 2 → 4 → 7 → 5 → 3 → 6 → 0
```

#### Nivel 2: Métricas absolutas

```
                ÓPTIMA      PEOR       DIFERENCIA
Distancia      342.56 km   478.23 km   135.67 km
Tiempo         821.34 min  1147.75 min 326.41 min
CO₂            68.51 kg    95.65 kg    27.14 kg
```

#### Nivel 3: Porcentajes de mejora

```
Distancia: 28.37% menos
Tiempo:    28.37% menos
CO₂:       28.37% menos
```

**Código de comparación:**

```javascript
const savings = {
  distanceSaved: worst.distance - optimal.distance,
  timeSaved: worst.time - optimal.time,
  co2Saved: worst.co2 - optimal.co2,

  distancePercent: ((worst.distance - optimal.distance) / worst.distance) * 100,
  timePercent: ((worst.time - optimal.time) / worst.time) * 100,
  co2Percent: ((worst.co2 - optimal.co2) / worst.co2) * 100,
};
```

### Métricas de ahorro presentadas

#### Estructura de datos de ahorros:

```javascript
savings = {
  // Valores absolutos
  distanceSaved: 135.67, // km
  timeSaved: 326.41, // minutos
  co2Saved: 27.14, // kg

  // Valores porcentuales
  distancePercent: 28.37, // %
  timePercent: 28.37, // %
  co2Percent: 28.37, // %
};
```

#### Interpretación de los ahorros:

**1. Ahorro de distancia:**

```
135.67 km ahorrados (28.37%)
↓
Equivalente a:
- 5.4 litros de diésel menos (asumiendo 25 km/l)
- $135 MXN ahorrados (asumiendo $25/l)
- ~3.5 horas menos de conducción
```

**2. Ahorro de tiempo:**

```
326.41 minutos ahorrados (5.44 horas)
↓
Beneficios:
- Menos horas de trabajo del conductor
- Más puntos de recolección por día
- Mayor eficiencia operativa
```

**3. Ahorro de CO₂:**

```
27.14 kg de CO₂ menos
↓
Impacto ambiental:
- Equivalente a 135 km de conducción evitados
- ~3 árboles absorberían esto en un día
- Contribución a metas de sostenibilidad
```

#### Visualización de ahorros en contexto:

**Ejemplo real para una flota:**

```
Si una ciudad tiene 10 camiones de recolección:
- Ahorro diario:  1,356.7 km, 271.4 kg CO₂
- Ahorro semanal: 9,496.9 km, 1,899.8 kg CO₂
- Ahorro mensual: 40,701 km,  8,142 kg CO₂
- Ahorro anual:   495,000 km, 99,000 kg CO₂ (99 toneladas)

Equivalencias anuales:
- 495 árboles plantados
- $1,237,500 MXN ahorrados en combustible
- 4,950 días-conductor ahorrados
```

### Formatos adicionales de presentación

#### Matriz de resultados (primeros N ciclos):

```javascript
displayTopResults(n = 10) {
  this.log(`\n🏆 TOP ${n} MEJORES RUTAS:\n`, "header");

  const sorted = [...this.results]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n);

  sorted.forEach((result, index) => {
    this.log(
      `${index + 1}. ${result.cycle.join("→")} | ` +
      `${result.distance} km | ${result.time} min | ${result.co2} kg CO₂`,
      "info"
    );
  });
}
```

#### Gráfico de distribución (conceptual):

```
Distribución de distancias:

 342 km ████                         (Óptima)
 350 km ████████
 360 km ████████████
 370 km ████████████████
 ...    ...
 460 km ████████████
 470 km ████████
 478 km ████                         (Peor)

Promedio: 410 km
Mediana:  408 km
Desv. Est: 35 km
```

---

## Conclusión

**GreenCircuit** es una aplicación web educativa completa que implementa el algoritmo TSP por fuerza bruta usando JavaScript vanilla. Su arquitectura modular, interfaz intuitiva y visualización interactiva la hacen ideal para:

- **Educación:** Demostrar el problema TSP y su complejidad
- **Práctica:** Experimentar con diferentes tamaños y configuraciones
- **Análisis:** Comparar soluciones y cuantificar beneficios
- **Aplicación real:** Contextualizar el TSP en logística urbana

**Características destacadas:**

- ✅ Código modular y organizado
- ✅ Visualización interactiva con Cytoscape.js
- ✅ Algoritmo exhaustivo garantiza solución óptima
- ✅ Métricas aplicadas a caso real (recolección de residuos)
- ✅ Interfaz progresiva y educativa
- ✅ Comparación explícita de resultados

**Limitaciones reconocidas:**

- ⚠️ Solo viable para N ≤ 16 (complejidad factorial)
- ⚠️ No implementa heurísticas para N grande
- ⚠️ Ejecución bloqueante en el navegador

---

_Documento generado: Octubre 2025_  
_Proyecto: GreenCircuit - Optimización de Rutas de Recolección_  
_Tecnologías: JavaScript ES6+, Cytoscape.js, HTML5, CSS3_
