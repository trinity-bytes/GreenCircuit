# 🌱 GreenCircuit

## Optimización de Rutas de Recolección de Residuos Urbanos

Aplicación web interactiva que implementa el **Problema del Agente Viajero (TSP)** para optimizar rutas de recolección de residuos, minimizando distancias, tiempo de recorrido y emisiones de CO₂.

---

## ⚠️ Aviso Académico

Este proyecto se publica con fines académicos y de referencia. El código está disponible para que otras personas se inspiren y aprendan, pero **no me hago responsable por el plagio total o parcial en entregas con calificación**. Si reutilizas partes del proyecto para trabajos evaluados, hazlo bajo tu propio criterio y respetando las políticas de tu institución.

---

## 📋 Descripción del Proyecto

**GreenCircuit** resuelve el problema de optimización de rutas urbanas aplicado a la recolección de residuos. Utiliza algoritmos de grafos para encontrar la ruta más eficiente que visite todos los puntos de recolección exactamente una vez y regrese al punto de origen.

### Objetivos

- ✅ Minimizar la distancia total recorrida.
- ✅ Reducir el tiempo de recolección.
- ✅ Disminuir las emisiones de CO₂.
- ✅ Optimizar recursos operativos y contribuir a la sostenibilidad urbana.

---

## 🚀 Cómo Ejecutar

### Método Simple (Recomendado)

1. Abre el archivo `index.html` en tu navegador web (haciendo doble clic).
2. ¡Listo para usar! ✅

### Requisitos

- **Navegador moderno**: Chrome, Firefox, Edge o Safari (versión actualizada).
- **JavaScript habilitado** (activado por defecto en la mayoría de los navegadores).
- **Conexión a Internet**: Solo se necesita la primera vez para cargar la biblioteca de visualización (Cytoscape.js). Después, funciona sin conexión.

---

## 🎯 Cómo Usar la Aplicación

### Paso 1: Configurar el Grafo

1. Ingresa el **número de puntos de recolección (N)** en el rango de 8 a 16.
2. Haz clic en **"✅ Configurar"**.

### Paso 2: Generar Puntos de Recolección

Elige uno de los tres modos para distribuir los puntos en el mapa:

- **🎲 Aleatorio**: Distribución aleatoria con separación mínima entre puntos.
- **⭕ Circular**: Puntos distribuidos uniformemente en un círculo.
- **⊞ Grid**: Distribución en una cuadrícula regular.

### Paso 3: Configurar Velocidad de Ejecución

Selecciona la velocidad con la que se ejecutará el algoritmo:

- **⚡ Rápido**: Ejecución automática con pausas breves.
- **🐢 Lento**: 1 segundo por paso (recomendado para N > 10).
- **👆 Manual**: Avance paso a paso con clics (ideal para presentaciones y depuración).

### Paso 4: Ejecutar el Algoritmo

1. Haz clic en **"▶️ EJECUTAR ALGORITMO"**.
2. Observa las 4 fases de ejecución en la consola de logs:
   - **Fase 1**: Construcción de la matriz de adyacencia.
   - **Fase 2**: Búsqueda de ciclos hamiltonianos.
   - **Fase 3**: Resolución del problema TSP.
   - **Fase 4**: Presentación de resultados.
3. La ruta óptima se destacará en **azul** en el grafo.

---

## 📁 Estructura del Proyecto

```text
📦 GreenCircuit/
├── 📄 index.html                 # Aplicación principal
├── 📄 landing.html               # Página de aterrizaje informativa
├── 📖 README.md                  # Guía rápida y consideraciones de uso
├── � DOCUMENTATION.md           # Detalle de arquitectura y algoritmos
├── 📜 LICENSE                    # Licencia MIT del proyecto
└── 📁 src/
    ├── 📁 js/                    # Módulos JavaScript
    │   ├── app.js                # Controlador principal
    │   ├── CytoscapeRenderer.js  # Renderizado visual del grafo
    │   ├── Graph.js              # Modelo del grafo y matriz
    │   ├── GraphEditor.js        # Herramientas de edición manual
    │   ├── HamiltonianFinder.js  # Búsqueda de ciclos hamiltonianos
    │   ├── LogDisplay.js         # Sistema de logs y resultados
    │   ├── RandomGenerator.js    # Generación de puntos y layouts
    │   └── TSPSolver.js          # Evaluación de ciclos TSP
    └── 📁 styles/
        ├── main.css              # Estilos base
        ├── layout.css            # Layout general y patrones
        ├── components.css        # Componentes reutilizables
        ├── animations.css        # Animaciones y transiciones
        └── variables.css         # Sistema de diseño
```

---

## 🏗️ Arquitectura Técnica

El proyecto sigue una arquitectura modular con una clara separación de responsabilidades.

- **`Graph.js`**: Representa el grafo, almacena nodos y aristas, y construye la matriz de adyacencia.
- **`HamiltonianFinder.js`**: Implementa un algoritmo de **backtracking** para encontrar todos los ciclos hamiltonianos.
- **`TSPSolver.js`**: Resuelve el TSP mediante **fuerza bruta**, evaluando todos los ciclos hamiltonianos para encontrar el óptimo.
- **`RandomGenerator.js`**: Genera los datos de los puntos de recolección en los modos aleatorio, circular y grid.
- **`CytoscapeRenderer.js`**: Utiliza la biblioteca **Cytoscape.js** para renderizar el grafo de forma interactiva.
- **`LogDisplay.js`**: Muestra información detallada del proceso en la interfaz de usuario.
- **`app.js`**: Orquesta todos los componentes y maneja el flujo principal de la aplicación.

---

## 📈 Complejidad Computacional

| Operación                        | Complejidad   | Descripción                                         |
| -------------------------------- | ------------- | --------------------------------------------------- |
| Búsqueda de ciclos hamiltonianos | **O((n-1)!)** | Backtracking recursivo para explorar permutaciones. |
| Resolución TSP (fuerza bruta)    | **O(n!)**     | Evalúa la distancia de todos los ciclos.            |
| Construcción del grafo completo  | **O(n²)**     | Genera n(n-1)/2 aristas para un grafo completo.     |

**⚠️ Importante:** Debido a la complejidad factorial, se recomienda usar el modo **🐢 Lento** o **👆 Manual** para N > 12 para evitar que el navegador se congele.

---

## 🌍 Impacto Ambiental del Proyecto

Este proyecto demuestra cómo la optimización algorítmica puede generar un impacto real en la sostenibilidad urbana:

- 🌳 **Reducción de emisiones de CO₂**: Menor contaminación atmosférica.
- ⛽ **Ahorro de combustible**: Reducción de costos operativos.
- ⏱️ **Eficiencia operativa**: Menor tiempo de recorrido.

Para una ruta de **10 puntos**, los ahorros diarios pueden rondar el **25%** en distancia, tiempo y emisiones de CO₂.

---

## 🐛 Solución de Problemas

- **La página está en blanco**: Espera 2-3 segundos. La biblioteca Cytoscape.js se está cargando desde internet.
- **No se muestra el grafo**: Asegúrate de haber completado los pasos 1 (Configurar) y 2 (Generar).
- **El navegador se congela**: El número de puntos (N) es muy grande. Usa N ≤ 10 para pruebas rápidas o cambia al modo **🐢 Lento**.

---

## 📄 Licencia

Este repositorio se distribuye bajo la [licencia MIT](LICENSE). Úsalo, modifícalo o compártelo citando la fuente original.

### 🌱 GreenCircuit - 2025
