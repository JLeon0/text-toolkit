# text-toolkit: Kit de Herramientas de Texto

## Resumen
Utilidad web 100% frontend que ofrece un panel con múltiples herramientas de texto: limpieza, estadísticas y conversión de formato.  
Sin backend, toda la lógica se ejecuta en el navegador.

## Stack Tecnológico
- Framework: Vue 3 (Composition API, Single File Components)
- Build tool: Vite
- Estilos: Tailwind CSS (con clases utilitarias)
- Estado: Composables y localStorage
- Sin backend, sin dependencias externas de servidor

## Estructura esperada
```
text-toolkit/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│ ├── main.js
│ ├── App.vue
│ ├── components/
│ │ ├── TextInput.vue # Área de texto común
│ │ ├── ToolTabs.vue # Pestañas de modos
│ │ ├── CleanerTool.vue # Limpiador
│ │ ├── StatsTool.vue # Estadísticas
│ │ ├── ConverterTool.vue # Conversor
│ │ └── Toast.vue # Notificaciones (copiado)
│ ├── composables/
│ │ ├── useTextTools.js # Lógica compartida
│ │ └── useClipboard.js # Copiar al portapapeles
│ └── assets/
│ └── main.css # Tailwind directivas
└── GEMINI.md
```

## Funcionalidades exactas del MVP
1. Pestañas: "Limpiar", "Estadísticas", "Convertir".
2. Área de texto común compartida entre pestañas.
3. **Limpiar**: 
   - Eliminar espacios múltiples.
   - Quitar líneas vacías.
   - Recortar espacios al inicio/final.
   - Convertir a minúsculas, MAYÚSCULAS, capitalización de oraciones.
   - Reemplazar caracteres especiales (elegir conjunto).
4. **Estadísticas**:
   - Contar: caracteres (con y sin espacios), palabras, líneas, párrafos.
   - Tiempo estimado de lectura (a 200 palabras/min).
   - Nube de palabras simples (opcional).
5. **Convertir**:
   - a mayúsculas, minúsculas, tipo título, slug, snake_case, camelCase, PascalCase.
   - Invertir texto.
6. UI/UX pulida: transiciones suaves, modo oscuro por defecto, diseño limpio con Tailwind, indicador de caracteres en tiempo real, botón de copiar resultado con feedback.

## Reglas de código
- Comentarios en español dentro de `<script setup>`.
- Usar Composition API con `<script setup>` en todos los componentes.
- Tailwind para estilos; no crear CSS adicional excepto en `main.css`.
- Iconos con emojis o SVG inline muy simples; no añadir librerías de iconos.
- Sin backend, sin API calls.
- Tipografía: Inter desde Google Fonts.