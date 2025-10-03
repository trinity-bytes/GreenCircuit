# 📝 Guía de Uso - GreenCircuit

## 🚀 Cómo Usar la Aplicación

### Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para cargar Cytoscape.js desde CDN)
- No requiere instalación de Node.js ni dependencias

### Iniciar la Aplicación

1. **Abrir el archivo `index.html`** en un navegador web
2. La aplicación se cargará automáticamente

### Flujo de Uso

#### 1️⃣ Configuración

- Ingresa el número de puntos de recolección (N) entre 8 y 16
- Click en **"✅ Configurar"**

#### 2️⃣ Generación del Grafo

Elige una opción:

- **🎲 Generar Aleatoriamente**: Nodos en posiciones aleatorias
- **⭕ Generar en Círculo**: Distribución circular (mejor visualización)
- **⊞ Generar en Grid**: Distribución en cuadrícula
- **✏️ Entrada Manual**: (Disponible en próxima versión)

#### 3️⃣ Visualización

- El grafo se renderiza automáticamente con Cytoscape.js
- **Colores de nodos según tipo:**
  - 🟢 Verde: Residencial
  - 🔵 Azul: Comercial
  - 🟠 Naranja: Industrial
- **Zoom y pan:** Usa scroll y arrastre del mouse

#### 4️⃣ Controles de Ejecución

Selecciona la velocidad:

- **⚡ Rápido**: 50ms por paso
- **🐢 Lento**: 1 segundo por paso
- **👆 Manual**: Click por click (presiona "Siguiente Paso")

#### 5️⃣ Ejecutar Algoritmo

- Click en **"▶️ EJECUTAR ALGORITMO"**
- Observa el proceso en el panel de logs:
  1. Construcción de matriz de adyacencia
  2. Búsqueda de ciclos hamiltonianos
  3. Resolución del TSP
  4. Resultados y métricas ambientales

#### 6️⃣ Resultados

- **Ruta óptima destacada** en azul en el grafo
- **Nodo inicial** en rojo
- **Panel de resultados** con:
  - Ciclo óptimo y peor ciclo
  - Ahorros en distancia, tiempo y CO₂
  - Impacto ambiental anual
  - Equivalente en árboles plantados

---

## 🏗️ Arquitectura del Código

### Módulos Principales

#### **Core** (`src/core/`)

- `Graph.js`: Clase principal del grafo
- `HamiltonianFinder.js`: Búsqueda de ciclos hamiltonianos
- `TSPSolver.js`: Resolución del problema del agente viajero
- `MetricsCalculator.js`: Cálculo de métricas ambientales

#### **Generators** (`src/generators/`)

- `RandomGenerator.js`: Generación aleatoria de nodos y grafos

#### **Controllers** (`src/controllers/`)

- `ExecutionController.js`: Control de velocidad de ejecución
- `StepByStepManager.js`: Gestión del proceso paso a paso

#### **Visualization** (`src/visualization/`)

- `CytoscapeRenderer.js`: Renderizado con Cytoscape.js
- `LogDisplay.js`: Display de logs y resultados

#### **Utils** (`src/utils/`)

- `validators.js`: Validaciones
- `helpers.js`: Funciones auxiliares

---

## 🔍 Conceptos Clave

### Problema del Agente Viajero (TSP)

Encontrar el ciclo de menor costo que visite cada nodo exactamente una vez y regrese al origen.

**Método usado:** Fuerza bruta (evalúa todos los ciclos hamiltonianos)

### Ciclo Hamiltoniano

Un ciclo que visita cada nodo del grafo exactamente una vez y regresa al nodo inicial.

### Matriz de Adyacencia

Representación matricial donde `M[i][j]` = distancia entre nodo i y nodo j.

### Grafo Completo

Grafo donde cada nodo está conectado con todos los demás. Para N nodos hay N(N-1)/2 aristas.

---

## 📊 Métricas Calculadas

### Por Ruta

- **Distancia total** (km)
- **Tiempo** (minutos) - Asume 25 km/h promedio
- **Emisiones CO₂** (kg) - 0.2 kg/km para camión estándar
- **Consumo combustible** (litros) - 0.35 L/km
- **Costo** (USD) - $1.5 por litro

### Comparación

- Ahorros en distancia, tiempo y CO₂
- Porcentajes de mejora
- Impacto anual (365 días)
- Equivalente en árboles (1 árbol = 21 kg CO₂/año)

---

## 🧪 Testing

### Casos de Prueba Sugeridos

#### Prueba 1: Grafo Pequeño

- N = 8 nodos
- Layout: Circular
- Verifica que se encuentren todos los ciclos

#### Prueba 2: Grafo Mediano

- N = 10 nodos
- Layout: Aleatorio
- Observa el tiempo de ejecución

#### Prueba 3: Grafo Grande

- N = 12-14 nodos
- Layout: Grid
- **Advertencia:** Puede tardar varios segundos
- Para N=12: ~39.9 millones de permutaciones

#### Prueba 4: Máximo Permitido

- N = 16 nodos
- **Advertencia:** Puede tardar minutos
- Para N=16: ~20.9 billones de permutaciones
- Recomendado solo para demostración de complejidad

---

## ⚠️ Limitaciones Conocidas

### Complejidad Computacional

- **Ciclos hamiltonianos:** O((n-1)!)
- **TSP fuerza bruta:** O(n!)
- Para N > 14, el tiempo de ejecución puede ser considerable

### Navegador

- Puede congelarse temporalmente con N > 14
- Recomendado: N ≤ 12 para uso fluido

### Funcionalidades Pendientes (Fase 2)

- ✏️ Entrada manual de nodos
- 🗺️ Mapas reales (OpenStreetMap/Google Maps)
- 📍 Coordenadas geográficas reales
- 💾 Guardar/cargar configuraciones
- 📄 Exportar resultados a PDF
- 🎨 Estilos CSS completos
- 📱 Responsive design mejorado

---

## 🐛 Troubleshooting

### El grafo no se visualiza

- **Verifica** que Cytoscape.js se cargue desde el CDN
- **Verifica** la consola del navegador (F12)
- **Recarga** la página

### El algoritmo tarda mucho

- **Reduce** el número de nodos (N)
- **Usa** N ≤ 12 para ejecución fluida
- **Considera** que para N=14+ es normal esperar

### Los logs no se muestran

- **Verifica** que JavaScript esté habilitado
- **Revisa** la consola del navegador
- **Recarga** la página

### Error "Module not found"

- **Verifica** que todos los archivos estén en su lugar
- **Usa** un servidor local si es necesario:

  ```bash
  # Python 3
  python -m http.server 8000

  # Node.js (con http-server)
  npx http-server
  ```

- **Abre** en `http://localhost:8000`

---

## 🎓 Conceptos Educativos

### ¿Por qué es importante?

Este proyecto demuestra:

1. **Algoritmos clásicos** aplicados a problemas reales
2. **Optimización** reduce costos y emisiones
3. **Sostenibilidad urbana** mediante tecnología
4. **Complejidad computacional** en acción

### Aplicaciones Reales

- 🚛 Logística y distribución
- ♻️ Recolección de residuos
- 📦 Entrega de paquetes (Amazon, FedEx)
- 🚌 Rutas de transporte público
- 🏭 Manufactura (orden de producción)

---

## 📚 Referencias

### Algoritmos

- **Backtracking:** Técnica de búsqueda exhaustiva
- **TSP:** Problema NP-completo clásico
- **Grafos:** Teoría de grafos básica

### Librerías

- [Cytoscape.js](https://js.cytoscape.org/) - Visualización de grafos

### Complejidad

- Factorial: n! crece extremadamente rápido
- Para n=10: 3,628,800 permutaciones
- Para n=16: 20,922,789,888,000 permutaciones

---

## 👨‍💻 Desarrollo

### Estructura de Archivos

```
GreenCircuit/
├── index.html              # HTML principal
├── app.js                  # Entry point
├── README.md               # Documentación principal
├── USAGE_GUIDE.md         # Esta guía
└── src/
    ├── core/              # Lógica principal
    ├── generators/        # Generación de datos
    ├── controllers/       # Control de flujo
    ├── visualization/     # Renderizado
    └── utils/             # Utilidades
```

### Añadir Nuevas Funcionalidades

1. Crea el módulo en la carpeta correspondiente
2. Exporta las funciones necesarias
3. Importa en `app.js`
4. Agrega la lógica en el flujo principal
5. Documenta los cambios

---

## 📞 Soporte

Para reportar problemas o sugerencias:

- Revisa la documentación completa en `README.md`
- Verifica la consola del navegador para errores
- Consulta esta guía de uso

---

**🌱 GreenCircuit** - Optimización de Rutas para un Futuro Sostenible
