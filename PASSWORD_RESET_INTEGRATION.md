# Integración de Recuperación de Contraseña

## Resumen de Cambios

Se ha integrado completamente la funcionalidad de recuperación de contraseña en la aplicación React. Ahora funciona tanto en desarrollo como en producción.

## Cómo Funciona

### Paso 1: Solicitar Recuperación
1. El usuario hace clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión
2. Es redirigido a `/auth/forgot-password`
3. Ingresa su email y hace clic en "Enviar Email"
4. Supabase envía un correo con un enlace de recuperación

### Paso 2: Restablecer Contraseña
1. El usuario hace clic en el enlace del correo
2. Es redirigido a `/auth/reset-password` con un token de seguridad
3. Ingresa su nueva contraseña
4. La contraseña se actualiza en Supabase
5. Es redirigido automáticamente a la página principal

## Archivos Modificados

### 1. `/src/App.tsx`
- Actualizado el routing para detectar `/auth/forgot-password`
- Ahora soporta tanto `/forgot-password` como `/auth/forgot-password`

### 2. `/src/components/ForgotPassword.tsx`
- Cambiado el `redirectTo` para usar URL dinámica basada en `window.location.origin`
- Funciona en cualquier entorno (desarrollo, staging, producción)

### 3. `/src/components/CyclistRegistration.tsx`
- Enlaces "¿Olvidaste tu contraseña?" actualizados a rutas relativas
- Eliminados `target="_blank"` para mantener al usuario en la misma pestaña

### 4. `/src/components/UpdatePassword.tsx`
- Enlace "Solicitar nuevo enlace" actualizado a ruta relativa

## Rutas Disponibles

- **`/auth/forgot-password`** - Solicitar recuperación de contraseña
- **`/forgot-password`** - Ruta alternativa (también funciona)
- **`/auth/reset-password`** - Restablecer contraseña (se accede desde el email)
- **`/update-password`** - Ruta alternativa para restablecer contraseña

## Configuración en Supabase

Para que todo funcione correctamente, asegúrate de configurar en Supabase Dashboard:

1. Ve a **Authentication > URL Configuration**
2. Añade las siguientes URLs a **Redirect URLs**:
   - `http://localhost:5173/auth/reset-password` (para desarrollo)
   - `https://www.cyclepeaks.com/auth/reset-password` (para producción)

## Archivos HTML Standalone

Los archivos HTML en `/public/auth/` son versiones standalone que pueden subirse a un servidor externo si se desea tener las páginas fuera de la aplicación React. Sin embargo, ahora no son necesarios ya que la funcionalidad está completamente integrada en la aplicación.

## Ventajas de la Integración

- Todo funciona dentro de la misma aplicación
- No requiere configuración de servidor adicional
- URLs dinámicas que funcionan en cualquier entorno
- Experiencia de usuario consistente
- No se abren nuevas pestañas
