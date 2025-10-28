# 📊 Overview del Proyecto - GreenCircuit

## Resumen Ejecutivo

**GreenCircuit** es una aplicación web educativa que resuelve el Problema del Agente Viajero (TSP) aplicado a la optimización de rutas de recolección de residuos urbanos. Desarrollado para el curso de Matemática Discreta.

---

## 📈 Estado del Proyecto

| Aspecto                    | Estado                    |
| -------------------------- | ------------------------- |
| **Versión actual**         | v1.0 - Funcionalidad base |
| **Completado**             | ~70%                      |
| **En desarrollo**          | Editor manual (v2.0)      |
| **Progreso estimado v2.0** | 0%                        |

---

## ✅ Lo que YA está funcionando

### Algoritmos

- ✅ Fuerza bruta para TSP (garantiza óptimo)
- ✅ Backtracking para ciclos hamiltonianos
- ✅ Cálculo de distancias euclidianas
- ✅ Métricas de optimización (distancia, tiempo, CO₂)

### Interfaz

- ✅ Configuración de nodos (8-16)
- ✅ 3 tipos de generación: aleatorio, circular, grid
- ✅ Visualización interactiva con Cytoscape.js
- ✅ Sistema de logs detallado
- ✅ Control de velocidad de ejecución
- ✅ Destacado de ruta óptima

### Funcionalidades

- ✅ Generación automática de grafos completos
- ✅ Comparación óptimo vs peor ruta
- ✅ Cálculo de ahorros porcentuales
- ✅ Visualización de matriz de adyacencia
- ✅ Zoom, pan, ajustar vista

---

## ❌ Lo que AÚN falta

### Prioridad ALTA 🔴 (v2.0)

1. **Editor Manual de Grafos**

   - Agregar nodos con click
   - Eliminar nodos
   - Mover nodos (drag & drop)
   - Conectar/desconectar aristas manualmente
   - Editar propiedades (nombre, tipo, peso)

2. **Mejoras de Diseño**

   - Rediseño visual completo
   - UI más moderna y atractiva
   - Tooltips informativos
   - Animaciones suaves
   - Layout responsive

3. **Guardar/Cargar**
   - Exportar grafo a JSON
   - Importar grafo desde archivo
   - Guardar en LocalStorage

### Prioridad MEDIA 🟡 (v2.1)

- Algoritmos heurísticos (Nearest Neighbor, 2-opt)
- Exportar a PDF/imagen
- Gráficas de análisis
- Web Workers para mejor performance

### Prioridad BAJA 🟢 (v3.0+)

- Modo multivehículo
- Integración con mapas reales
- Restricciones temporales
- Backend y base de datos

---

## 🎯 Próximos Pasos Inmediatos

### Esta Semana

1. Crear clase `GraphEditor.js`
2. Implementar detección de click en canvas
3. Crear modal para agregar nodo
4. Validar y agregar nodo al grafo

### Próxima Semana

1. Implementar eliminación de nodos
2. Agregar drag & drop básico
3. Actualizar documentación técnica

---

## 📁 Estructura de Archivos

```
GreenCircuit/
├── 📄 index.html               ✅ Completo
├── 📄 README.md                ✅ Completo
├── 📄 ROADMAP.md               ✅ Nuevo - Hoja de ruta
├── 📄 TODO.md                  ✅ Nuevo - Tareas diarias
├── 📄 Documentacion_Tecnica.md ✅ Completo
├── 📄 Instrucciones_de_uso.txt ✅ Completo
│
├── 📁 src/
│   ├── 📁 js/
│   │   ├── app.js              ✅ Completo (actualizar para v2.0)
│   │   ├── Graph.js            ✅ Completo
│   │   ├── HamiltonianFinder.js ✅ Completo
│   │   ├── TSPSolver.js        ✅ Completo
│   │   ├── CytoscapeRenderer.js ✅ Completo (actualizar)
│   │   ├── LogDisplay.js       ✅ Completo
│   │   ├── RandomGenerator.js  ✅ Completo
│   │   │
│   │   ├── GraphEditor.js      ❌ Por crear
│   │   ├── FileManager.js      ❌ Por crear
│   │   └── UIController.js     ❌ Por crear
│   │
│   └── 📁 styles/
│       └── main.css            ✅ Básico (rediseñar)
```

---

## 🔧 Stack Tecnológico

| Categoría         | Tecnología                   | Estado               |
| ----------------- | ---------------------------- | -------------------- |
| **Frontend**      | HTML5, CSS3, JavaScript ES6+ | ✅ Implementado      |
| **Visualización** | Cytoscape.js                 | ✅ Implementado      |
| **Algoritmos**    | Backtracking, Fuerza bruta   | ✅ Implementado      |
| **Frameworks**    | Ninguno (Vanilla JS)         | ✅ Decisión tomada   |
| **Testing**       | -                            | ❌ Pendiente         |
| **Build Tools**   | -                            | ❌ Pendiente         |
| **Backend**       | Ninguno (cliente solo)       | ✅ No requerido v1-2 |

---

## 📊 Métricas del Proyecto

### Código

- **Líneas de código:** ~2,500 líneas
- **Archivos JS:** 7 módulos
- **Complejidad:** Media-Alta (algoritmos NP-hard)
- **Cobertura de tests:** 0% (pendiente)

### Funcionalidad

- **Features completadas:** 25+
- **Features pendientes:** 40+
- **Bugs conocidos:** 3 menores
- **Documentación:** Completa (README + Doc Técnica + ROADMAP + TODO)

### Performance

- **Tamaño N soportado:** 8-16 nodos
- **Tiempo de ejecución:** < 1s para N=10, ~10s para N=12
- **Límite práctico:** N=16 (complejidad factorial)

---

## 🎓 Objetivos Educativos

### Conceptos Demostrados

- [x] Grafos completos y conexos
- [x] Ciclos hamiltonianos
- [x] Problema del Agente Viajero (TSP)
- [x] Algoritmo de backtracking
- [x] Complejidad computacional O(N!)
- [x] Optimización combinatoria
- [x] Matriz de adyacencia
- [x] Distancia euclidiana

### Conceptos por Demostrar

- [ ] Algoritmos greedy vs exactos
- [ ] Heurísticas de aproximación
- [ ] Trade-off: tiempo vs optimalidad
- [ ] Optimización local (2-opt)

---

## 💡 Ideas y Sugerencias

### Mejoras Sugeridas por Usuarios

- 💬 "Sería genial poder crear mis propios grafos manualmente" → **EN DESARROLLO v2.0**
- 💬 "El diseño es muy básico, necesita más estilo" → **PLANEADO v2.0**
- 💬 "Quisiera guardar mis grafos y cargarlos después" → **PLANEADO v2.0**
- 💬 "¿Se pueden probar otros algoritmos más rápidos?" → **PLANEADO v2.1**

### Extensiones Posibles

- Tutorial interactivo paso a paso
- Comparación con algoritmos heurísticos
- Visualización del árbol de búsqueda
- Exportación de reportes profesionales
- Modo presentación para clase

---

## 📞 Información del Proyecto

| Campo         | Valor                        |
| ------------- | ---------------------------- |
| **Nombre**    | GreenCircuit                 |
| **Propósito** | Educativo - Demostración TSP |
| **Curso**     | Matemática Discreta          |
| **Nivel**     | Universitario                |
| **Licencia**  | Académico/Educativo          |
| **Inicio**    | Octubre 2025                 |
| **Estado**    | En desarrollo activo         |

---

## 🚀 Cómo Seguir el Desarrollo

1. **Ver progreso general:** Revisar este archivo (OVERVIEW.md)
2. **Ver tareas pendientes:** Consultar [TODO.md](TODO.md)
3. **Ver roadmap completo:** Revisar [ROADMAP.md](ROADMAP.md)
4. **Ver documentación técnica:** Leer [Documentacion_Tecnica.md](Documentacion_Tecnica.md)
5. **Ver instrucciones de uso:** Consultar [README.md](README.md)

---

## ✅ Checklist de Desarrollo v2.0

### Fase 1: Editor Manual (6 semanas)

- [ ] Agregar nodos manualmente
- [ ] Eliminar nodos
- [ ] Mover nodos (drag & drop)
- [ ] Conectar/desconectar aristas
- [ ] Editar propiedades

### Fase 2: UI/UX (4 semanas)

- [ ] Rediseño visual
- [ ] Tooltips
- [ ] Animaciones
- [ ] Responsive design

### Fase 3: Guardar/Cargar (2 semanas)

- [ ] Serialización JSON
- [ ] Importar/exportar archivos
- [ ] LocalStorage

**Total estimado:** 12 semanas (~3 meses)

---

**Última actualización:** 28 de octubre de 2025  
**Próxima revisión:** Inicio de Sprint v2.0
