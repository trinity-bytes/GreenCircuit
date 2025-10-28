# 🚀 Guía Rápida de Desarrollo - GreenCircuit

## 📖 Para empezar a trabajar HOY

### 1. Lee estos archivos en orden:

1. **OVERVIEW.md** (5 min) → Visión general del proyecto
2. **TODO.md** (3 min) → Tareas inmediatas
3. **ROADMAP.md** (10 min) → Plan completo de desarrollo

### 2. Abre el proyecto:

```bash
# Navega a la carpeta
cd d:\Projects\GreenCircuit

# Abre el proyecto en VS Code
code .

# Abre index.html en el navegador para probar
```

### 3. Próxima tarea a implementar:

**🎯 TAREA: Crear clase GraphEditor.js**

**Objetivo:** Permitir que el usuario agregue nodos manualmente con click

**Pasos:**

1. Crear archivo `src/js/GraphEditor.js`
2. Exportar clase GraphEditor
3. Agregar evento de click en canvas de Cytoscape
4. Detectar coordenadas del click
5. Crear modal/formulario para propiedades del nodo
6. Validar y agregar nodo al grafo

**Código inicial sugerido:**

```javascript
// src/js/GraphEditor.js

class GraphEditor {
  constructor(graph, renderer) {
    this.graph = graph;
    this.renderer = renderer;
    this.isEditMode = false;
  }

  enableEditMode() {
    this.isEditMode = true;
    // Agregar event listeners
  }

  disableEditMode() {
    this.isEditMode = false;
    // Remover event listeners
  }

  onCanvasClick(event) {
    if (!this.isEditMode) return;

    const x = event.position.x;
    const y = event.position.y;

    // Mostrar formulario para crear nodo
    this.showNodeForm(x, y);
  }

  showNodeForm(x, y) {
    // TODO: Crear modal con formulario
  }

  addNode(properties) {
    // Validar límite de 16 nodos
    if (this.graph.nodes.length >= 16) {
      alert("Máximo 16 nodos permitidos");
      return;
    }

    // Agregar nodo al grafo
    const node = {
      id: this.graph.nodes.length,
      x: properties.x,
      y: properties.y,
      name: properties.name,
      type: properties.type,
      waste: properties.waste,
    };

    this.graph.addNode(node);
    this.renderer.renderGraph(this.graph);
  }
}
```

---

## 📋 Checklist para hoy

- [ ] Leer OVERVIEW.md
- [ ] Leer TODO.md
- [ ] Abrir proyecto en VS Code
- [ ] Probar la app actual (abrir index.html)
- [ ] Crear archivo GraphEditor.js
- [ ] Implementar estructura básica de la clase
- [ ] Agregar botón "Modo Edición" en HTML
- [ ] Conectar evento de click
- [ ] Probar detección de coordenadas

---

## 🛠️ Comandos Útiles

### Abrir en navegador

```bash
# Windows
start index.html

# O simplemente doble-click en index.html
```

### Ver estructura del proyecto

```bash
tree /F src
```

### Buscar en el código

```bash
# Buscar una función
grep -r "function nombre" src/
```

---

## 📚 Recursos de Referencia

### Documentación de Cytoscape.js

- **Eventos:** https://js.cytoscape.org/#events
- **Agregar elementos:** https://js.cytoscape.org/#cy.add
- **Estilizado:** https://js.cytoscape.org/#style

### Ejemplo de agregar nodo en Cytoscape:

```javascript
cy.add({
  group: "nodes",
  data: { id: "n1", label: "Nodo 1" },
  position: { x: 100, y: 100 },
});
```

### Ejemplo de detectar click en canvas:

```javascript
cy.on("tap", function (event) {
  if (event.target === cy) {
    // Click en fondo, no en nodo
    const pos = event.position;
    console.log("Click en:", pos.x, pos.y);
  }
});
```

---

## 🎯 Objetivos de la Semana

### Día 1-2: Setup y estructura

- [ ] Crear GraphEditor.js
- [ ] Agregar botón "Modo Edición"
- [ ] Detectar clicks en canvas

### Día 3-4: Formulario y validación

- [ ] Crear modal/formulario
- [ ] Validar inputs
- [ ] Conectar con Graph.js

### Día 5: Testing y refinamiento

- [ ] Probar agregar múltiples nodos
- [ ] Validar límite de 16 nodos
- [ ] Mejorar UX del formulario

---

## 💡 Tips y Mejores Prácticas

1. **Comienza pequeño:** Implementa una feature a la vez
2. **Prueba frecuentemente:** Abre el navegador después de cada cambio
3. **Usa console.log:** Para debuggear coordenadas y eventos
4. **Comenta tu código:** Especialmente lógica compleja
5. **Commitea seguido:** (si usas Git) Pequeños commits frecuentes
6. **Documenta cambios:** Actualiza TODO.md cuando completes tareas

---

## 🐛 Problemas Comunes

### "No se detecta el click"

- Verifica que el modo edición esté activado
- Usa `cy.on('tap')` no `addEventListener`
- Asegúrate de que el target sea `cy` (fondo)

### "El nodo no aparece"

- Verifica que llamaste `this.graph.addNode()`
- Confirma que llamaste `this.renderer.renderGraph()`
- Revisa la consola del navegador por errores

### "Las coordenadas están mal"

- Cytoscape usa su propio sistema de coordenadas
- Usa `event.position` no `event.clientX/Y`

---

## ✅ Cuando termines la tarea

1. Prueba la funcionalidad completamente
2. Actualiza TODO.md (marca como completado ✅)
3. Commit tus cambios (si usas Git)
4. Documenta cualquier problema encontrado
5. Pasa a la siguiente tarea

---

## 📞 Si necesitas ayuda

1. **Revisa la documentación:** Documentacion_Tecnica.md
2. **Consulta ejemplos:** Lee el código existente en src/js/
3. **Busca en línea:** Cytoscape.js tiene buena documentación
4. **Pregunta:** A tu profesor o compañeros

---

## 🎉 ¡Manos a la obra!

**Recuerda:** Este es un proyecto de aprendizaje. No te preocupes si algo no sale perfecto a la primera. La práctica hace al maestro.

**¡Éxito con el desarrollo!** 🚀

---

**Creado:** 28 de octubre de 2025  
**Para:** Desarrollo de GreenCircuit v2.0
