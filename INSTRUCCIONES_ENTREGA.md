# 📋 INSTRUCCIONES PARA ENTREGAR Y EJECUTAR

## 🎯 Para el Evaluador (Persona sin Conocimientos Técnicos)

### ✅ OPCIÓN 1: Ejecución Directa (MÁS SIMPLE)

1. **Descarga el archivo**: `GreenCircuit.html`
2. **Doble click** sobre el archivo
3. **Eso es todo** ✅

El archivo se abrirá en tu navegador predeterminado (Chrome, Firefox, Edge).

---

### 📡 Si tienes Internet

El programa cargará automáticamente la biblioteca de visualización (Cytoscape.js) desde Internet.
**Primera vez**: Puede tardar 2-3 segundos en cargar.
**Después**: Se cachea y carga instantáneamente.

---

### 🔌 Si NO tienes Internet (Offline Total)

Si necesitas ejecutarlo completamente offline:

1. **Descarga estos 2 archivos** (incluidos en la entrega):
   - `GreenCircuit_OFFLINE.html` (versión con biblioteca incluida)
2. **Doble click** sobre `GreenCircuit_OFFLINE.html`

---

## 🚀 Cómo Usar el Programa

### Paso 1: Configurar

1. Ingresa número de puntos (entre 8 y 16)
2. Click en **"✅ Configurar"**

### Paso 2: Generar Grafo

Elige un layout:

- **🎲 Aleatorio**: Distribución aleatoria
- **⭕ Circular**: Puntos en círculo
- **⊞ Grid**: Distribución en cuadrícula

### Paso 3: Configurar Velocidad

- **⚡ Rápido**: Con pausas para evitar congelamiento (~3 segundos)
- **🐢 Lento**: 1 segundo por paso (recomendado para N > 12)
- **👆 Manual**: Click a click (mejor para presentaciones)

### Paso 4: Ejecutar

1. Click en **"▶️ EJECUTAR ALGORITMO"**
2. Espera a que complete las 4 fases
3. Los resultados aparecen en el panel inferior

---

## 📊 Qué Hace el Programa

El programa **optimiza rutas de recolección de residuos** usando el algoritmo TSP:

1. **Genera puntos** de recolección (residenciales, comerciales, industriales)
2. **Encuentra todas las rutas posibles** (ciclos hamiltonianos)
3. **Calcula la ruta más corta** que visita todos los puntos
4. **Muestra ahorros**:
   - 📏 Distancia (km)
   - ⏱️ Tiempo (minutos)
   - 🌍 CO₂ (kg)

---

## ⚙️ Requisitos Técnicos

- **Navegador moderno**: Chrome, Firefox, Edge, Safari (de 2020 en adelante)
- **JavaScript habilitado**: (viene activado por defecto)
- **Internet** (solo primera vez si usas `GreenCircuit.html`)
- **Sin instalaciones adicionales**

---

## ⚠️ Solución de Problemas

### "La página está en blanco"

→ Espera 2-3 segundos, está cargando la biblioteca de visualización

### "No se muestra el grafo"

→ Verifica que hayas completado los pasos 1 y 2 correctamente

### "El navegador se congela"

→ Usa N ≤ 10 o cambia a modo **🐢 Lento**

### "No tengo Internet"

→ Usa `GreenCircuit_OFFLINE.html` (incluido en entrega)

### "Mensaje de error en consola"

→ Presiona F12, ve a Console, copia el error y contacta al desarrollador

---

## 📁 Archivos Incluidos en la Entrega

```
📦 Entrega_GreenCircuit/
├── 📄 GreenCircuit.html .................... (PRINCIPAL - Online)
├── 📄 GreenCircuit_OFFLINE.html ............ (Versión 100% offline)
├── 📋 INSTRUCCIONES_ENTREGA.md ............. (Este archivo)
├── 📖 README.md ............................ (Documentación técnica)
└── 📸 capturas/ ............................ (Screenshots del programa)
    ├── 01_configuracion.png
    ├── 02_generacion.png
    ├── 03_visualizacion.png
    └── 04_resultados.png
```

---

## 🎥 Video Demostrativo

_(Si incluyes un video)_

Ver: `demo_greencircuit.mp4` (5 minutos)

---

## 👥 Información del Proyecto

**Nombre**: GreenCircuit  
**Descripción**: Optimización de rutas de recolección de residuos urbanos  
**Tecnología**: HTML5 + JavaScript (Vanilla)  
**Algoritmo**: Traveling Salesman Problem (TSP)  
**Visualización**: Cytoscape.js

---

## 📞 Contacto

Si el evaluador tiene problemas técnicos, puede contactar:

- **Email**: [tu_email@ejemplo.com]
- **WhatsApp**: [tu_numero]

---

## ✅ Checklist para el Evaluador

Antes de calificar, verifica que:

- [ ] El archivo `GreenCircuit.html` abre correctamente
- [ ] Se pueden configurar los nodos (8-16)
- [ ] Los grafos se generan en las 3 modalidades
- [ ] El algoritmo ejecuta completamente
- [ ] Los resultados se muestran con ahorros calculados
- [ ] La ruta óptima se destaca en azul en el grafo

---

**🌱 Gracias por evaluar GreenCircuit!**
