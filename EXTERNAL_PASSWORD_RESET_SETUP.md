# Configuración de Recuperación de Contraseña Externa

## Archivos Creados

Se han creado dos páginas HTML standalone para el servidor externo:

### 1. `/public/auth/forgot-password.html`
Página de solicitud de recuperación de contraseña donde el usuario ingresa su email.

### 2. `/public/auth/update-password.html`
Página de actualización de contraseña donde el usuario ingresa su nueva contraseña después de hacer clic en el enlace del correo.

## Configuración en el Servidor (www.cyclepeaks.com)

### Paso 1: Subir los Archivos

Sube los archivos HTML al servidor en las siguientes rutas:

```
www.cyclepeaks.com/auth/forgot-password.html
www.cyclepeaks.com/auth/update-password.html
```

### Paso 2: Configurar las URLs en Supabase

1. Ve a tu proyecto en Supabase Dashboard: https://fwkeqxleiqrzrczqibhe.supabase.co
2. Navega a **Authentication > URL Configuration**
3. Configura las siguientes URLs:

   - **Site URL**: `https://www.cyclepeaks.com`
   - **Redirect URLs**: Añade las siguientes URLs a la lista permitida:
     ```
     https://www.cyclepeaks.com/auth/update-password
     https://www.cyclepeaks.com/auth/forgot-password
     ```

### Paso 3: Configurar Email Templates (Opcional)

Si quieres personalizar el correo de recuperación:

1. Ve a **Authentication > Email Templates** en Supabase
2. Selecciona **Reset Password**
3. Personaliza el template según tus necesidades
4. Asegúrate de que el enlace apunte a: `{{ .ConfirmationURL }}`

## Flujo de Recuperación de Contraseña

1. **Usuario solicita recuperación**:
   - Visita: `https://www.cyclepeaks.com/auth/forgot-password`
   - Ingresa su email
   - Hace clic en "Enviar enlace de recuperación"

2. **Supabase envía el correo**:
   - El usuario recibe un email con un enlace único
   - El enlace incluye un token de recuperación

3. **Usuario actualiza su contraseña**:
   - Hace clic en el enlace del correo
   - Es redirigido a: `https://www.cyclepeaks.com/auth/update-password`
   - Ingresa su nueva contraseña
   - La contraseña se actualiza en Supabase

4. **Redirección final**:
   - Después de actualizar la contraseña con éxito
   - El usuario es redirigido automáticamente a: `https://www.cyclepeaks.com`

## Características Implementadas

### forgot-password.html
- ✅ Formulario de email con validación
- ✅ Integración completa con Supabase
- ✅ Mensajes de éxito y error
- ✅ Diseño responsive
- ✅ Animaciones y UX moderna
- ✅ Manejo de rate limiting

### update-password.html
- ✅ Formulario de nueva contraseña
- ✅ Confirmación de contraseña
- ✅ Validación en tiempo real
- ✅ Toggle de visibilidad de contraseña
- ✅ Requisitos de contraseña visuales
- ✅ Verificación de sesión
- ✅ Redirección automática después del éxito
- ✅ Manejo de enlaces expirados

## Personalización

Si deseas personalizar el diseño, puedes modificar:

- **Colores**: Cambia los gradientes en la sección `<style>`
- **Logo**: Reemplaza el SVG del logo con tu propio logo
- **Textos**: Modifica los textos en español según tus necesidades
- **Redirección**: Cambia la URL de redirección final en el JavaScript

## Seguridad

- ✅ Las credenciales de Supabase (anon key) son seguras para uso público
- ✅ Los enlaces de recuperación expiran automáticamente
- ✅ Las contraseñas se envían de forma segura a través de HTTPS
- ✅ Validación de sesión antes de permitir cambio de contraseña

## Soporte

Las páginas son 100% autónomas y no requieren:
- ❌ Node.js
- ❌ npm/yarn
- ❌ Servidor backend adicional
- ❌ Base de datos local

Solo necesitas un servidor web estático (Apache, Nginx, etc.) con soporte HTTPS.
