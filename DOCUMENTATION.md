# Documentación General - GreenCircuit

## Visión General

GreenCircuit es una aplicación web (HTML, CSS y JavaScript) enfocada en optimizar rutas de recolección de residuos urbanos. Todo el procesamiento sucede en el navegador; no existe backend. El flujo principal guía al usuario por etapas para configurar el grafo, generar nodos, visualizar el resultado y ejecutar el algoritmo TSP.

## Arquitectura de Código

El código JavaScript se organiza en módulos especializados, orquestados desde `src/js/app.js`:

| Módulo                 | Rol principal                                                           |
| ---------------------- | ----------------------------------------------------------------------- |
| `Graph.js`             | Modelo del grafo: nodos, aristas, matriz de adyacencia y métricas.      |
| `RandomGenerator.js`   | Genera nodos y layouts (aleatorio, circular, grid) y completa aristas.  |
| `HamiltonianFinder.js` | Backtracking para obtener todos los ciclos hamiltonianos.               |
| `TSPSolver.js`         | Evalúa los ciclos y calcula la ruta óptima, peor ruta y ahorros.        |
| `CytoscapeRenderer.js` | Renderiza y estiliza el grafo con Cytoscape.js.                         |
| `GraphEditor.js`       | Modo edición: agrega nodos, conecta aristas y ajusta pesos manualmente. |
| `LogDisplay.js`        | Consola visual de eventos, matrices y resultados.                       |

### Estado Global (`app.js`)

`app.js` mantiene el estado común (grafo, renderer, logger, modo de ejecución, flags de progreso) y conecta los eventos de UI con las funciones de negocio.

## Flujo del Algoritmo

1. **Configuración**: el usuario define \(N\) (entre 8 y 16). Se crea un grafo vacío y se inicializa el editor.
2. **Generación**: se generan nodos mediante `RandomGenerator` y se completa el grafo (aristas con distancias euclidianas). `CytoscapeRenderer` actualiza la vista.
3. **Visualización / Edición manual**: el usuario puede editar el grafo (nuevos nodos, eliminar, cambiar pesos). `GraphEditor` mantiene sincronía con `Graph` y actualiza estadísticas.
4. **Ejecución**: `HamiltonianFinder` obtiene todos los ciclos hamiltonianos; `TSPSolver` calcula métricas (distancia total, tiempo estimado, emisiones) y selecciona la ruta óptima. Los resultados se muestran en la consola visual y se resalta la ruta en el grafo.

## Datos y Cálculos Clave

- **Nodos**: contienen id, nombre, coordenadas, tipo de zona y volumen de residuos.
- **Aristas**: guardan la distancia (km) entre nodos; se normaliza a dos decimales.
- **Matriz de adyacencia**: permite consultas O(1) para validar conexiones y sumar distancias.
- **Ciclos Hamiltonianos**: se generan con backtracking. El algoritmo tiene complejidad O(N!), adecuado para N ≤ 16.
- **Métricas TSP**: para cada ciclo se calculan distancia total, tiempo (asumiendo 25 km/h) y CO₂ (0.2 kg/km). Se comparan la mejor y la peor rutas para mostrar ahorros.

## Interfaz de Usuario

- **Wizard**: encabezado con 4 pasos (Configuración → Generación → Visualización → Ejecución) que refleja el estado actual.
- **Controles principales**: formularios y tarjetas para configurar N, layout y velocidad de ejecución.
- **Graph Editor**: modo edición con selección guiada, modales para pesos y toasts informativos.
- **Logs**: panel tipo terminal que registra fases, matrices, ciclos y resultados.

## Estilos

- Sistema de diseño basado en CSS modular (`variables.css`, `layout.css`, `components.css`, `animations.css`).
- Uso de gradientes suaves, efecto "glass" en la cabecera y patrón de fondo tenue.
- Paleta principal verde (sostenibilidad) con acentos azules.

## Dependencias

- **Cytoscape.js** (CDN) para renderizado interactivo del grafo.
- **Flaticon UIcons** para iconografía (regular-rounded y solid-rounded).

## Estructura de Carpetas (reducida)

```text
root
├─ index.html
├─ landing.html
├─ DOCUMENTATION.md
├─ README.md
└─ src/
   ├─ js/
   │  ├─ app.js
   │  ├─ Graph.js
   │  ├─ GraphEditor.js
   │  ├─ CytoscapeRenderer.js
   │  ├─ RandomGenerator.js
   │  ├─ HamiltonianFinder.js
   │  ├─ TSPSolver.js
   │  └─ LogDisplay.js
   └─ styles/
      ├─ main.css
      ├─ layout.css
      ├─ components.css
      ├─ animations.css
      └─ variables.css
```

## Próximos Pasos Sugeridos

- Añadir pruebas unitarias para los módulos algorítmicos (`Graph`, `TSPSolver`).
- Explorar heurísticas rápidas (Nearest Neighbor, 2-opt) para escenarios con más nodos.
- Exportar resultados (CSV/JSON) desde el panel de logs.
