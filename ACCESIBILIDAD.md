# Sistema de Accesibilidad

Este documento describe la implementación del sistema de accesibilidad conforme a las nuevas leyes de accesibilidad web.

## Características Implementadas

### 1. Botón Flotante de Accesibilidad
- Ubicación: Esquina inferior derecha (fixed position)
- Icono: Símbolo universal de accesibilidad
- Estilo: Diseño oscuro con borde y efecto hover
- Z-index: 40 (por encima del contenido principal)

### 2. Panel de Configuración

El panel de accesibilidad incluye las siguientes opciones:

#### Tamaño de Fuente
- **Normal**: Tamaño estándar (16px)
- **Grande**: 18px
- **Extra Grande**: 22px

#### Modo de Contraste
- **Normal**: Contraste estándar
- **Alto Contraste**: 150% de contraste (ideal para usuarios con baja visión)
- **Bajo Contraste**: 80% de contraste (reduce fatiga visual)

#### Modo Nocturno
- Invierte los colores de la página
- Reduce la luz azul
- Ideal para uso nocturno o ambientes oscuros

#### Filtro Azul
- Aplica un filtro sepia para reducir la luz azul
- Protege la vista durante uso prolongado
- Mejora el descanso visual

#### Reducir Animaciones
- Desactiva todas las animaciones y transiciones
- Cumple con prefers-reduced-motion
- Ayuda a usuarios sensibles al movimiento

#### Lectura en Voz Alta
- Utiliza la API de síntesis de voz del navegador
- Idioma: Español (es-ES)
- Lee el contenido de la página en voz alta

#### Ocultar Imágenes
- Oculta todas las imágenes de la página
- Útil para conexiones lentas
- Ayuda a usuarios con sensibilidad visual

#### Resetear Todo
- Restaura todas las configuraciones a sus valores predeterminados
- Elimina la configuración guardada

## Persistencia de Datos

### Base de Datos Supabase

La configuración de accesibilidad se almacena en Supabase con las siguientes características:

#### Tabla: `accessibility_settings`

```sql
- id (uuid, PK)
- user_id (uuid, FK a auth.users)
- font_size (text)
- contrast (text)
- night_mode (boolean)
- blue_filter (boolean)
- hide_images (boolean)
- reduce_motion (boolean)
- text_to_speech (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### Seguridad (RLS)

- **SELECT**: Los usuarios autenticados solo pueden ver su propia configuración
- **INSERT**: Los usuarios autenticados solo pueden insertar su propia configuración
- **UPDATE**: Los usuarios autenticados solo pueden actualizar su propia configuración
- **DELETE**: Los usuarios autenticados solo pueden eliminar su propia configuración

#### Comportamiento

1. **Usuario Autenticado**:
   - La configuración se guarda automáticamente en Supabase
   - Se sincroniza entre dispositivos
   - Persiste indefinidamente

2. **Usuario No Autenticado**:
   - La configuración se guarda en localStorage
   - Solo disponible en el navegador actual
   - Se pierde al limpiar el navegador

### Servicio de Accesibilidad

El archivo `src/utils/accessibilityService.ts` proporciona:

- `getAccessibilitySettings()`: Carga la configuración del usuario
- `saveAccessibilitySettings(settings)`: Guarda la configuración
- `deleteAccessibilitySettings()`: Elimina la configuración

## Aplicación de Estilos

Los estilos de accesibilidad se aplican mediante clases CSS en el elemento `:root`:

```css
:root.font-size-large { font-size: 18px; }
:root.font-size-extra-large { font-size: 22px; }
:root.contrast-high { filter: contrast(1.5); }
:root.contrast-low { filter: contrast(0.8); }
:root.night-mode { filter: invert(1) hue-rotate(180deg); }
:root.blue-filter { filter: sepia(0.3) saturate(0.7) hue-rotate(180deg); }
:root.hide-images img { opacity: 0 !important; visibility: hidden !important; }
:root.reduce-motion * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
```

## Cumplimiento Normativo

Este sistema cumple con:

- **WCAG 2.1 Nivel AA**: Directrices de accesibilidad para contenido web
- **EN 301 549**: Norma europea de accesibilidad
- **Ley de Accesibilidad Web**: Normativas españolas y europeas
- **Section 508**: Estándares de accesibilidad de EE.UU.

## Componentes

### AccessibilityButton.tsx
Botón flotante que abre/cierra el panel

### AccessibilityPanel.tsx
Panel con todas las opciones de configuración

### accessibilityService.ts
Lógica de negocio y persistencia en Supabase

## Uso

El sistema funciona automáticamente:

1. El usuario hace clic en el botón de accesibilidad
2. Se abre el panel con las opciones
3. Cada cambio se aplica inmediatamente y se guarda
4. La configuración persiste entre sesiones
5. Para usuarios autenticados, la configuración se sincroniza entre dispositivos

## Mantenimiento

Para agregar nuevas opciones de accesibilidad:

1. Actualizar la interfaz `AccessibilitySettings` en `accessibilityService.ts`
2. Agregar la nueva columna a la tabla `accessibility_settings` mediante una migración
3. Actualizar `AccessibilityPanel.tsx` con la nueva opción UI
4. Agregar los estilos CSS correspondientes en `index.css`
5. Actualizar las funciones de carga y guardado en `accessibilityService.ts`
