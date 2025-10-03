# 🚀 Cómo Ejecutar GreenCircuit

## ⚠️ IMPORTANTE: Usar un Servidor Local

Este proyecto usa **ES6 Modules** que requieren un servidor HTTP para funcionar correctamente. **NO** puedes simplemente abrir `index.html` haciendo doble click.

## ✅ Métodos para Ejecutar

### Opción 1: Python (Recomendado - Más Simple)

Si tienes Python instalado:

```bash
# Navega a la carpeta del proyecto
cd d:\Projects\GreenCircuit

# Python 3
python -m http.server 8000

# O si solo tienes Python 2
python -m SimpleHTTPServer 8000
```

Luego abre en tu navegador: **http://localhost:8000**

---

### Opción 2: Live Server (VS Code)

Si usas Visual Studio Code:

1. Instala la extensión **"Live Server"**
2. Click derecho en `index.html`
3. Selecciona **"Open with Live Server"**

Se abrirá automáticamente en el navegador.

---

### Opción 3: Node.js (http-server)

Si tienes Node.js instalado:

```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# Navegar a la carpeta del proyecto
cd d:\Projects\GreenCircuit

# Ejecutar servidor
http-server

# O en un puerto específico
http-server -p 8000
```

Luego abre: **http://localhost:8080** (o el puerto que indique)

---

### Opción 4: XAMPP/WAMP/MAMP

Si tienes un servidor web instalado:

1. Copia la carpeta `GreenCircuit` a `htdocs` (XAMPP) o `www` (WAMP)
2. Inicia Apache
3. Abre: **http://localhost/GreenCircuit**

---

## 🐛 Solución de Problemas

### ❌ Error: "Failed to load module script"

**Causa:** Intentaste abrir el archivo directamente (file:// protocol)

**Solución:** Usa uno de los métodos anteriores con un servidor HTTP

---

### ❌ Error: "CORS policy" o "Cross-origin"

**Causa:** Problema de CORS con file:// protocol

**Solución:** Usa un servidor local (Python, Live Server, etc.)

---

### ❌ La sección de generación no aparece

**Posibles causas:**

1. **Módulos no cargados correctamente**

   - Abre la consola del navegador (F12)
   - Verifica si hay errores en rojo
   - Usa un servidor local

2. **JavaScript deshabilitado**

   - Verifica que JavaScript esté habilitado en tu navegador

3. **Error en el código**
   - Abre la consola (F12)
   - Busca mensajes de error
   - Verifica los logs de diagnóstico

---

## 🔍 Verificar que Funciona Correctamente

1. **Abre la consola del navegador** (F12)
2. Deberías ver estos mensajes:

   ```
   ✅ HTML cargado correctamente
   ✅ DOMContentLoaded disparado
   🌱 Iniciando GreenCircuit...
   ✅ CytoscapeRenderer inicializado
   ✅ LogDisplay inicializado
   ✅ ExecutionController inicializado
   ✅ StepByStepManager inicializado
   ✅ Event listeners configurados
   ✅ GreenCircuit listo
   ```

3. **Configura 10 nodos** y click en "Configurar"
4. Deberías ver:
   ```
   🔍 onConfigSubmit ejecutado
   ✅ Grafo configurado con 10 nodos
   ```
5. **La sección 2 (Generación)** debe aparecer

---

## 📋 Flujo Completo de Uso

### 1️⃣ Configuración

- Ingresa un número entre 8 y 16
- Click en "✅ Configurar"
- **Verifica:** Debe aparecer la sección de generación

### 2️⃣ Generación

- Click en uno de los botones:
  - 🎲 Generar Aleatoriamente
  - ⭕ Generar en Círculo (recomendado)
  - ⊞ Generar en Grid
- **Verifica:** Debe aparecer el grafo visualizado

### 3️⃣ Visualización

- El grafo debe mostrarse con nodos coloreados
- Verde = Residencial
- Azul = Comercial
- Naranja = Industrial

### 4️⃣ Ejecución

- Selecciona velocidad (recomendado: Manual o Lento)
- Click en "▶️ EJECUTAR ALGORITMO"
- Observa el proceso en el panel de logs

### 5️⃣ Resultados

- Ruta óptima destacada en azul
- Nodo inicial en rojo
- Métricas en el panel de logs

---

## 💡 Recomendaciones

### Para Testing Rápido

- **N = 8 nodos** - Ejecución instantánea
- **Layout:** Circular
- **Velocidad:** Lento

### Para Demostración

- **N = 10 nodos** - Balance entre complejidad y velocidad
- **Layout:** Circular o Grid
- **Velocidad:** Lento o Manual

### Para Análisis de Complejidad

- **N = 12-14 nodos** - Demostración de crecimiento factorial
- ⚠️ **Advertencia:** Puede tardar varios segundos

### ⚠️ NO Recomendado para uso normal

- **N = 15-16 nodos** - Solo para demostración de límites
- Puede tardar minutos o congelar el navegador

---

## 🛠️ Tecnologías Usadas

- **HTML5** - Estructura
- **CSS3** (inline) - Estilos básicos
- **JavaScript ES6+** - Lógica
- **ES Modules** - Modularidad (requiere servidor)
- **Cytoscape.js** (CDN) - Visualización de grafos

---

## 📞 Si Aún Tienes Problemas

1. **Abre la consola del navegador** (F12)
2. **Copia todos los errores** que veas en rojo
3. **Verifica** que estás usando un servidor local
4. **Intenta** con diferentes navegadores (Chrome, Firefox, Edge)

---

## ✅ Checklist de Verificación

- [ ] Estoy usando un servidor local (NO abriendo file:// directamente)
- [ ] La consola muestra "✅ GreenCircuit listo"
- [ ] No hay errores en rojo en la consola
- [ ] Cytoscape.js se cargó correctamente (verificar en Network tab)
- [ ] Los módulos se importaron sin errores
- [ ] La sección de configuración es visible
- [ ] Puedo ingresar un número y hacer click en Configurar

---

**🌱 GreenCircuit** - Si sigues estos pasos, debería funcionar correctamente.
