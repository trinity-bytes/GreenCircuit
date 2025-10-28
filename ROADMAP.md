# 🗺️ ROADMAP - GreenCircuit

## 📋 Documento de Desarrollo y Hoja de Ruta

**Última actualización:** 28 de octubre de 2025  
**Versión actual:** 1.0 (Funcionalidad base completada)  
**Próxima versión:** 2.0 (Editor manual + mejoras de UI)

---

## 📊 Estado Actual del Proyecto

### ✅ Features Completadas (v1.0)

#### Core - Algoritmo TSP

- [x] Implementación de algoritmo de fuerza bruta
- [x] Búsqueda de ciclos hamiltonianos con backtracking
- [x] Construcción de matriz de adyacencia
- [x] Evaluación de todas las rutas posibles
- [x] Cálculo de métricas (distancia, tiempo, CO₂)
- [x] Identificación de ruta óptima y peor ruta
- [x] Cálculo de ahorros y porcentajes

#### Generación de Grafos

- [x] Generación aleatoria de nodos
- [x] Layout circular
- [x] Layout en cuadrícula (grid)
- [x] Generación de grafo completo automático
- [x] Asignación de propiedades a nodos (tipo, residuos)
- [x] Cálculo de distancias euclidianas

#### Visualización

- [x] Renderizado con Cytoscape.js
- [x] Diferenciación de nodos por tipo (color)
- [x] Visualización de todas las aristas
- [x] Destacado de ruta óptima
- [x] Controles de zoom y navegación
- [x] Ajustar vista y resetear vista

#### Interfaz de Usuario

- [x] Configuración de número de nodos (8-16)
- [x] Selección de tipo de layout
- [x] Control de velocidad de ejecución (rápido/lento/manual)
- [x] Barra de progreso
- [x] Sistema de logs categorizado
- [x] Visualización de matriz de adyacencia
- [x] Presentación de resultados detallados
- [x] Flujo secuencial guiado

#### Arquitectura

- [x] Arquitectura modular (7 archivos JS)
- [x] Separación de responsabilidades
- [x] Documentación técnica completa
- [x] README con instrucciones de uso
- [x] Código comentado y estructurado

---

## 🎯 Features Pendientes

### 🚀 Prioridad ALTA - v2.0 (Próxima versión)

#### 1. Editor Manual de Grafos ⭐⭐⭐

- [ ] **Agregar nodos manualmente**

  - [ ] Click en canvas para crear nodo
  - [ ] Modal/formulario para ingresar propiedades:
    - Nombre personalizado
    - Tipo de zona (residencial/comercial/industrial)
    - Cantidad de residuos
  - [ ] Validación de límites (máximo 16 nodos)
  - [ ] Visualización inmediata en el grafo

- [ ] **Eliminar nodos**

  - [ ] Click derecho o botón sobre nodo
  - [ ] Confirmación antes de eliminar
  - [ ] Actualización automática de aristas conectadas
  - [ ] Reindexación de IDs si es necesario

- [ ] **Mover nodos (drag & drop)**

  - [ ] Permitir arrastrar nodos en el canvas
  - [ ] Actualizar coordenadas en tiempo real
  - [ ] Recalcular distancias de aristas conectadas
  - [ ] Mantener conexiones mientras se mueve

- [ ] **Editar propiedades de nodos**

  - [ ] Double-click para editar
  - [ ] Cambiar nombre, tipo, residuos
  - [ ] Actualizar visualización en vivo

- [ ] **Agregar/eliminar aristas manualmente**

  - [ ] Modo "conectar": click en 2 nodos para unirlos
  - [ ] Mostrar distancia calculada automáticamente
  - [ ] Permitir desconectar aristas (click derecho)
  - [ ] Validar que no se repitan conexiones

- [ ] **Editar pesos de aristas**
  - [ ] Click en arista para editar distancia
  - [ ] Validación de valores positivos
  - [ ] Actualización inmediata de matriz

#### 2. Mejoras de Diseño/UI ⭐⭐

- [ ] **Rediseño visual completo**

  - [ ] Paleta de colores moderna y consistente
  - [ ] Tipografía mejorada (fuentes más legibles)
  - [ ] Espaciado y márgenes consistentes
  - [ ] Mejores iconos y elementos visuales
  - [ ] Modo claro/oscuro (opcional)

- [ ] **Layout responsive**

  - [ ] Adaptación a tablets
  - [ ] Adaptación a móviles
  - [ ] Reorganización de secciones en pantallas pequeñas
  - [ ] Botones y controles táctiles

- [ ] **Animaciones y transiciones**

  - [ ] Transiciones suaves entre estados
  - [ ] Animación de destacado de ruta óptima
  - [ ] Feedback visual en botones
  - [ ] Carga progresiva de elementos

- [ ] **Mejora del panel de logs**

  - [ ] Scroll más intuitivo
  - [ ] Timestamps en mensajes
  - [ ] Filtros por tipo de mensaje
  - [ ] Exportar logs a archivo
  - [ ] Colapsable/expandible

- [ ] **Información visual mejorada**
  - [ ] Tooltips en nodos (mostrar info al hover)
  - [ ] Tooltips en aristas (mostrar distancia)
  - [ ] Panel lateral con detalles del nodo seleccionado
  - [ ] Leyenda visual de colores y símbolos
  - [ ] Mini-mapa para grafos grandes

#### 3. Guardar/Cargar Grafos ⭐⭐

- [ ] **Guardar grafo actual**

  - [ ] Serialización a JSON
  - [ ] Guardar nodos, aristas, propiedades
  - [ ] Descarga como archivo .json
  - [ ] Validación de integridad

- [ ] **Cargar grafo desde archivo**

  - [ ] Input para subir archivo .json
  - [ ] Validación de formato
  - [ ] Carga y renderizado del grafo
  - [ ] Manejo de errores

- [ ] **LocalStorage (opcional)**
  - [ ] Guardar automáticamente en navegador
  - [ ] Lista de grafos guardados
  - [ ] Cargar grafo previo al iniciar

---

### 🔧 Prioridad MEDIA - v2.1

#### 4. Mejoras de Algoritmo

- [ ] **Algoritmos alternativos**

  - [ ] Implementar algoritmo "Nearest Neighbor" (heurística)
  - [ ] Implementar "2-opt" para mejorar soluciones
  - [ ] Comparación entre algoritmos
  - [ ] Selector de algoritmo en UI

- [ ] **Optimizaciones de rendimiento**

  - [ ] Web Workers para cálculos pesados
  - [ ] Evitar bloqueo del UI thread
  - [ ] Cacheo de cálculos intermedios
  - [ ] Progreso granular (actualizaciones frecuentes)

- [ ] **Soporte para grafos más grandes**
  - [ ] Aumentar límite a N=20 (con heurísticas)
  - [ ] Advertencias sobre tiempo de ejecución
  - [ ] Cancelación de ejecución en progreso

#### 5. Exportación de Resultados

- [ ] **Exportar a PDF**

  - [ ] Generar reporte completo
  - [ ] Incluir visualización del grafo
  - [ ] Tabla de resultados
  - [ ] Gráficas de comparación

- [ ] **Exportar a imagen**

  - [ ] PNG del grafo con ruta óptima
  - [ ] SVG para calidad vectorial
  - [ ] Configuración de resolución

- [ ] **Exportar datos a CSV/Excel**
  - [ ] Tabla de todos los ciclos evaluados
  - [ ] Métricas por ciclo
  - [ ] Importar en hojas de cálculo

#### 6. Visualizaciones Avanzadas

- [ ] **Gráficas de análisis**

  - [ ] Histograma de distribución de distancias
  - [ ] Gráfica de comparación óptimo vs peor
  - [ ] Gráfica de ahorros (barras)
  - [ ] Chart.js o D3.js para visualizaciones

- [ ] **Comparación de soluciones**

  - [ ] Tabla comparativa de top 10 mejores/peores
  - [ ] Visualización lado a lado
  - [ ] Resaltar diferencias

- [ ] **Animación de ruta**
  - [ ] Recorrido animado del camión
  - [ ] Simulación de tiempo real
  - [ ] Velocidad ajustable

---

### 💡 Prioridad BAJA - Futuro (v3.0+)

#### 7. Features Avanzadas

- [ ] **Modo multivehículo**

  - [ ] Dividir nodos entre múltiples camiones
  - [ ] Optimización global
  - [ ] Asignación inteligente de rutas

- [ ] **Restricciones temporales**

  - [ ] Horarios de recolección por zona
  - [ ] Ventanas de tiempo
  - [ ] Capacidad máxima del camión

- [ ] **Mapa real**

  - [ ] Integración con Google Maps / OpenStreetMap
  - [ ] Coordenadas geográficas reales
  - [ ] Distancias de ruta (no euclidianas)
  - [ ] Visualización en mapa interactivo

- [ ] **Base de datos**

  - [ ] Backend simple (Node.js)
  - [ ] Guardar grafos en servidor
  - [ ] Compartir grafos entre usuarios
  - [ ] Autenticación básica

- [ ] **Modo colaborativo**
  - [ ] Múltiples usuarios editando
  - [ ] Chat integrado
  - [ ] Historial de cambios

#### 8. Educación y Tutoriales

- [ ] **Tour guiado**

  - [ ] Tutorial interactivo al iniciar
  - [ ] Tooltips contextuales
  - [ ] Ejemplos precargados

- [ ] **Modo explicativo**

  - [ ] Visualización paso a paso del backtracking
  - [ ] Árbol de decisiones
  - [ ] Explicación de cada paso del algoritmo

- [ ] **Recursos educativos**
  - [ ] Sección "Acerca de TSP"
  - [ ] Videos explicativos
  - [ ] Enlaces a recursos externos

---

## 📅 Cronograma Estimado

### Fase 1: Editor Manual (4-6 semanas)

- **Semana 1-2:** Agregar/eliminar nodos manualmente
- **Semana 3-4:** Agregar/eliminar aristas, drag & drop
- **Semana 5-6:** Edición de propiedades, validaciones

### Fase 2: Mejoras de UI (3-4 semanas)

- **Semana 1-2:** Rediseño visual, paleta de colores
- **Semana 3-4:** Tooltips, panel lateral, animaciones

### Fase 3: Guardar/Cargar (2 semanas)

- **Semana 1:** Serialización y guardado
- **Semana 2:** Carga y validación

### Fase 4: Algoritmos alternativos (3-4 semanas)

- **Semana 1-2:** Implementar Nearest Neighbor
- **Semana 3-4:** Implementar 2-opt, comparaciones

### Fase 5: Exportación (2-3 semanas)

- **Semana 1:** Exportar a imagen
- **Semana 2:** Exportar a PDF/CSV
- **Semana 3:** Gráficas de análisis

---

## 🏗️ Arquitectura Propuesta para v2.0

### Nuevos Módulos Requeridos

```
src/js/
├── app.js                    (existente - actualizar)
├── Graph.js                  (existente - mantener)
├── HamiltonianFinder.js      (existente - mantener)
├── TSPSolver.js              (existente - mantener)
├── CytoscapeRenderer.js      (existente - actualizar)
├── LogDisplay.js             (existente - mantener)
├── RandomGenerator.js        (existente - mantener)
├── GraphEditor.js            ⬅️ NUEVO - Edición manual
├── FileManager.js            ⬅️ NUEVO - Guardar/cargar
├── AlgorithmSelector.js      ⬅️ NUEVO - Múltiples algoritmos
├── NearestNeighbor.js        ⬅️ NUEVO - Algoritmo heurístico
├── TwoOpt.js                 ⬅️ NUEVO - Optimización local
└── UIController.js           ⬅️ NUEVO - Control unificado de UI
```

### Actualización de HTML (index.html)

Agregar secciones:

- **Panel de edición manual** (botones, controles)
- **Selector de algoritmo** (dropdown)
- **Panel de propiedades** (sidebar)
- **Controles de guardar/cargar** (botones)

---

## 🐛 Bugs Conocidos y Mejoras Técnicas

### Bugs

- [ ] **Validación de N:** Permitir valores fuera del rango con advertencia
- [ ] **Mensaje de error:** Mejorar manejo de errores en UI
- [ ] **Progreso manual:** Implementar realmente el modo manual (actualmente no funciona)

### Mejoras Técnicas

- [ ] **Refactorización:** Extraer lógica de UI de app.js
- [ ] **Tests unitarios:** Agregar pruebas para algoritmos
- [ ] **JSDoc:** Documentar todas las funciones
- [ ] **Webpack/Bundler:** Empaquetar módulos
- [ ] **Linter:** ESLint para código consistente
- [ ] **TypeScript (opcional):** Migrar para type safety

---

## 📝 Notas de Desarrollo

### Decisiones de Diseño

- **Por qué fuerza bruta:** Garantiza solución óptima, ideal para aprendizaje
- **Por qué límite N=16:** Complejidad factorial hace inviable N > 16
- **Por qué Cytoscape.js:** Biblioteca madura, gran comunidad, bien documentada

### Consideraciones para Editor Manual

- **Validación crítica:** Evitar grafos no conexos (sin ciclos hamiltonianos)
- **UX:** Modo edición vs modo visualización (toggle)
- **Performance:** Recalcular solo lo necesario al editar

### Consideraciones para UI

- **Accesibilidad:** Contraste, tamaño de fuente, navegación por teclado
- **Consistencia:** Mantener el flujo secuencial actual
- **Feedback:** Siempre mostrar estado de operaciones

---

## 🎓 Para el Curso de Matemática Discreta

### Conceptos Cubiertos

- ✅ Grafos (completos, conexos)
- ✅ Ciclos hamiltonianos
- ✅ Problema del agente viajero (TSP)
- ✅ Algoritmo de backtracking
- ✅ Complejidad computacional (O(N!))
- ✅ Optimización combinatoria
- ✅ Matriz de adyacencia

### Conceptos por Cubrir (futuro)

- [ ] Algoritmos greedy (Nearest Neighbor)
- [ ] Optimización local (2-opt, 3-opt)
- [ ] Heurísticas vs soluciones exactas
- [ ] Complejidad vs aproximación
- [ ] Algoritmos probabilísticos

---

## 🤝 Contribuciones y Desarrollo

### Cómo usar este documento

1. **Leer estado actual:** Ver qué está hecho
2. **Elegir feature:** Seleccionar de la lista de pendientes
3. **Marcar en progreso:** Actualizar estado (🔄 En progreso)
4. **Completar:** Cambiar a ✅ cuando esté listo
5. **Documentar cambios:** Agregar notas si es necesario

### Formato de marcado

- ✅ Completado
- 🔄 En progreso
- ⏸️ Pausado
- ❌ Cancelado/Descartado
- 🐛 Bug identificado
- ⭐ Prioridad alta
- 💡 Idea/sugerencia

---

## 📞 Contacto y Soporte

**Proyecto:** GreenCircuit  
**Curso:** Matemática Discreta  
**Propósito:** Educativo - Demostración de TSP aplicado  
**Licencia:** Proyecto académico

---

**Última actualización:** 28 de octubre de 2025  
**Versión del documento:** 1.0
