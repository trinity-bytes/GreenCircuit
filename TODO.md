# ✅ Lista de Tareas - GreenCircuit

> Documento simplificado para seguimiento diario de tareas

---

## 🚀 SPRINT ACTUAL - Editor Manual (v2.0)

### En Progreso 🔄

_Implementación del editor manual completada en su primera versión_

### Próximas Tareas 📋

#### Semana 1-2: Agregar Nodos Manualmente

- [x] Crear clase `GraphEditor.js` ✅
- [x] Detectar click en canvas (Cytoscape) ✅
- [x] Modal/formulario para propiedades del nodo ✅
- [x] Validar límite de 16 nodos ✅
- [x] Agregar nodo al grafo y renderizar ✅
- [x] Botón "Modo Edición" vs "Modo Visualización" ✅

#### Semana 3: Eliminar Nodos

- [x] Click derecho en nodo → menú contextual ✅
- [x] Diálogo de confirmación ✅
- [x] Eliminar nodo del grafo ✅
- [x] Actualizar aristas conectadas ✅
- [x] Actualizar visualización ✅
- [x] Menú contextual visual mejorado ✅
- [x] Animación al eliminar ✅
- [x] Botón para limpiar todo el grafo ✅
- [x] Fix: Resolver mismatch de IDs (Cytoscape "node-X" vs Graph numericId) ✅

#### Semana 4: Drag & Drop de Nodos

- [ ] Habilitar drag en Cytoscape
- [ ] Capturar evento de movimiento
- [ ] Recalcular distancias de aristas
- [ ] Actualizar matriz de adyacencia
- [ ] Guardar nuevas coordenadas

#### Semana 5: Aristas Manuales

- [ ] Modo "Conectar": click en 2 nodos
- [ ] Calcular distancia automáticamente
- [ ] Agregar arista al grafo
- [ ] Permitir eliminar arista (click derecho)
- [ ] Validar grafo conexo

#### Semana 6: Editar Propiedades

- [ ] Double-click en nodo → editar
- [ ] Formulario de edición
- [ ] Actualizar propiedades
- [ ] Click en arista → editar peso
- [ ] Validaciones

---

## 🎨 PRÓXIMO SPRINT - Mejoras de UI (v2.0)

### Tareas Pendientes

- [ ] Crear nueva paleta de colores
- [ ] Mejorar tipografía (fuentes)
- [ ] Rediseñar botones y controles
- [ ] Agregar tooltips a nodos
- [ ] Agregar tooltips a aristas
- [ ] Panel lateral con detalles
- [ ] Animación de ruta óptima
- [ ] Leyenda visual de colores
- [ ] Timestamps en logs
- [ ] Filtros de logs
- [ ] Layout responsive (tablet/móvil)

---

## 💾 BACKLOG - Features Futuras

### Guardar/Cargar Grafos

- [ ] Serializar grafo a JSON
- [ ] Descargar archivo .json
- [ ] Subir archivo .json
- [ ] Validar formato
- [ ] Cargar y renderizar
- [ ] LocalStorage (opcional)

### Algoritmos Alternativos

- [ ] Implementar Nearest Neighbor
- [ ] Implementar 2-opt
- [ ] Selector de algoritmo en UI
- [ ] Comparación de resultados

### Exportación

- [ ] Exportar grafo a PNG
- [ ] Exportar resultados a PDF
- [ ] Exportar datos a CSV
- [ ] Gráficas de análisis (Chart.js)

### Visualizaciones Avanzadas

- [ ] Histograma de distancias
- [ ] Gráfica comparativa
- [ ] Top 10 mejores/peores rutas
- [ ] Animación de recorrido

---

## 🐛 Bugs y Fixes

### Críticos 🔴

_Ninguno actualmente_

### Importantes 🟡

- [ ] Implementar modo manual real (actualmente no funciona)
- [ ] Mejorar manejo de errores en UI
- [ ] Validación más robusta de entrada

### Menores 🟢

- [ ] Mejorar mensajes de advertencia
- [ ] Scroll automático en logs más suave
- [ ] Optimizar renderizado para N grande

---

## ✅ Tareas Completadas

### v1.0 - Funcionalidad Base (Completado)

- [x] Algoritmo TSP con fuerza bruta
- [x] Búsqueda de ciclos hamiltonianos
- [x] Generación aleatoria de grafos
- [x] Visualización con Cytoscape.js
- [x] Sistema de logs
- [x] Cálculo de métricas (distancia, tiempo, CO₂)
- [x] Interfaz básica funcional
- [x] Documentación técnica completa
- [x] README con instrucciones

---

## 📝 Notas Rápidas

### Decisiones Pendientes

- **UI Framework:** ¿Mantener vanilla JS o usar algo como Bootstrap?
- **State Management:** ¿Implementar patrón más robusto?
- **Testing:** ¿Agregar Jest para pruebas unitarias?

### Ideas para Evaluar

- 💡 Integración con Google Maps para distancias reales
- 💡 Modo multivehículo (múltiples camiones)
- 💡 Restricciones de tiempo y capacidad
- 💡 Tutorial interactivo para nuevos usuarios
- 💡 Modo oscuro

### Recursos Útiles

- [Cytoscape.js Docs](https://js.cytoscape.org/)
- [TSP Algorithms](https://en.wikipedia.org/wiki/Travelling_salesman_problem)
- [Backtracking Explained](https://www.geeksforgeeks.org/backtracking-algorithms/)

---

**Fecha última actualización:** 28 de octubre de 2025  
**Próxima revisión:** Al completar Sprint actual
