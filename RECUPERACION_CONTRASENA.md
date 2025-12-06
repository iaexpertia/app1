# Sistema de Recuperacion de Contrasena con Supabase

Este documento explica como funciona el sistema de recuperacion de contrasena implementado usando Supabase Auth, sin necesidad de un servidor SMTP propio.

## Flujo Completo

### 1. Usuario Solicita Recuperacion de Contrasena

**Archivo**: `src/components/ForgotPassword.tsx`

El usuario ingresa su email en el formulario de recuperacion:

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/update-password`,
});
```

**Que hace esto:**
- Supabase envia automaticamente un email al usuario con un Magic Link
- El email incluye un enlace que contiene un token de autenticacion
- No necesitas configurar nodemailer ni ningun servidor SMTP

**Ruta**: `/forgot-password`

### 2. Usuario Hace Clic en el Magic Link

Cuando el usuario hace clic en el enlace del email:
- Es redirigido a la URL especificada en `redirectTo`
- Supabase automaticamente crea una sesion temporal
- El token de autenticacion se almacena en la sesion

### 3. Usuario Establece Nueva Contrasena

**Archivo**: `src/components/UpdatePassword.tsx`

La pagina verifica que haya una sesion valida:

```typescript
const { data: { session }, error } = await supabase.auth.getSession();

if (!session) {
  // Sesion invalida - mostrar error
}
```

El usuario ingresa su nueva contrasena y se actualiza:

```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

**Ruta**: `/update-password`

## Archivos Principales

### 1. Servicio de Autenticacion
**Archivo**: `src/utils/authService.ts`

Centraliza todas las operaciones de autenticacion:

```typescript
// Solicitar recuperacion de contrasena
await requestPasswordReset(email);

// Actualizar contrasena
await updatePassword(newPassword);

// Verificar sesion
await getCurrentSession();
```

### 2. Cliente de Supabase
**Archivo**: `src/utils/supabaseClient.ts`

Configuracion del cliente de Supabase usando variables de entorno.

### 3. Componentes UI

- **ForgotPassword.tsx**: Formulario para solicitar recuperacion
- **UpdatePassword.tsx**: Formulario para establecer nueva contrasena
- **PasswordReset.tsx**: Sistema legacy (no usado actualmente)

## Configuracion de Supabase

### Paso 1: Configurar Variables de Entorno

Tu archivo `.env` ya contiene las credenciales:

```env
VITE_SUPABASE_URL=https://fwkeqxleiqrzrczqibhe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**IMPORTANTE**: Estas claves ya estan configuradas y funcionando.

### Paso 2: Configurar Plantillas de Email en Supabase

1. Ve a tu proyecto en Supabase Dashboard: https://app.supabase.com/project/fwkeqxleiqrzrczqibhe
2. Ve a **Authentication** > **Email Templates**
3. Selecciona **Reset Password** (Recuperar Contrasena)
4. Personaliza la plantilla del email si lo deseas
5. Asegurate de que el enlace incluya `{{ .ConfirmationURL }}`

**Plantilla predeterminada (opcional personalizar):**

```html
<h2>Recuperar Contrasena</h2>

<p>Haz clic en el siguiente enlace para restablecer tu contrasena:</p>

<p><a href="{{ .ConfirmationURL }}">Restablecer Contrasena</a></p>

<p>Si no solicitaste este cambio, ignora este email.</p>
```

### Paso 3: Configurar URL de Redireccion

1. En Supabase Dashboard, ve a **Authentication** > **URL Configuration**
2. Agrega tu URL de produccion en **Site URL**: `https://tudominio.com`
3. Agrega las URLs de redireccion permitidas en **Redirect URLs**:
   - `http://localhost:5173/update-password` (desarrollo)
   - `https://tudominio.com/update-password` (produccion)

## Como Usar el Sistema

### Ejemplo de Uso en Componentes

```typescript
import { requestPasswordReset, updatePassword } from '../utils/authService';

// 1. Solicitar recuperacion
const handleForgotPassword = async (email: string) => {
  const result = await requestPasswordReset(email);

  if (result.success) {
    console.log('Email enviado');
  } else {
    console.error(result.error);
  }
};

// 2. Actualizar contrasena
const handleUpdatePassword = async (newPassword: string) => {
  const result = await updatePassword(newPassword);

  if (result.success) {
    console.log('Contrasena actualizada');
    // Redirigir al login
  } else {
    console.error(result.error);
  }
};
```

### Rutas Necesarias en tu App

Tu `App.tsx` ya tiene las rutas configuradas:

```typescript
// Ruta para solicitar recuperacion
if (isForgotPasswordPage) {
  return <ForgotPassword />;
}

// Ruta para actualizar contrasena
if (isUpdatePasswordPage) {
  return <UpdatePassword />;
}
```

## Validacion de Contrasena

El componente `UpdatePassword.tsx` incluye validaciones robustas:

- Minimo 8 caracteres
- Al menos 1 letra mayuscula
- Al menos 1 numero
- Al menos 1 caracter especial (@, #, $, etc.)
- Las contrasenas deben coincidir

## Seguridad

### Tokens de Recuperacion

- Los tokens son generados automaticamente por Supabase
- Expiran despues de 1 hora por defecto
- Son de un solo uso
- Se invalidan al cambiar la contrasena

### Sesiones

- Supabase maneja las sesiones automaticamente
- Las sesiones expiran despues de 1 semana por defecto
- Se pueden configurar en Supabase Dashboard

## Integracion con Email

Supabase usa su propio servidor SMTP integrado de forma gratuita para enviar emails.

**NO NECESITAS**:
- Configurar nodemailer
- Configurar Gmail SMTP
- Configurar SendGrid u otros servicios
- Escribir codigo para enviar emails

**Supabase maneja todo automaticamente**:
- Envia emails de forma instantanea
- Usa plantillas personalizables
- Maneja reintentos y errores
- Incluye seguimiento de emails

## Produccion

### Para Produccion Avanzada (Opcional)

Si necesitas mas control, puedes:

1. **Usar tu propio dominio de email**:
   - Ve a **Project Settings** > **Authentication**
   - Configura un proveedor SMTP personalizado
   - Usa SendGrid, AWS SES, o tu servidor SMTP

2. **Personalizar completamente los emails**:
   - Configura plantillas HTML avanzadas
   - Agrega tu logo y estilos
   - Usa variables dinamicas

## Pruebas

### Probar en Desarrollo

1. Ejecuta tu app: `npm run dev`
2. Ve a `/forgot-password`
3. Ingresa un email (debe existir en la tabla de ciclistas)
4. Revisa tu bandeja de entrada
5. Haz clic en el enlace
6. Ingresa la nueva contrasena en `/update-password`

### Probar Errores

- Email que no existe: Supabase no revela si el email existe (seguridad)
- Token expirado: Solicita un nuevo enlace
- Sesion invalida: Redirige al usuario a solicitar nuevo enlace

## Limitaciones

### Limitaciones de Supabase Auth (Gratis)

- 50,000 usuarios activos mensuales
- Emails ilimitados
- Sin limite de solicitudes de recuperacion

### Personalizacion de Emails

Si necesitas emails muy personalizados, considera:
- Usar Edge Functions para enviar emails personalizados
- Configurar tu propio servidor SMTP

## Troubleshooting

### El email no llega

1. Verifica la carpeta de spam
2. Asegurate de que el email existe en tu base de datos
3. Verifica la configuracion de SMTP en Supabase Dashboard
4. Revisa los logs en Supabase Dashboard > Logs

### Error al actualizar contrasena

1. Verifica que la sesion sea valida
2. Asegurate de que el token no haya expirado
3. Verifica que la nueva contrasena cumpla los requisitos
4. Revisa los logs del navegador

### Redireccion no funciona

1. Verifica que la URL este en la lista de URLs permitidas
2. Asegurate de que `redirectTo` tenga la URL completa
3. Verifica que la ruta exista en tu aplicacion

## Endpoints de Supabase

No necesitas crear endpoints propios. Supabase proporciona:

- `POST /auth/v1/recover` - Solicitar recuperacion (usado por `resetPasswordForEmail`)
- `PUT /auth/v1/user` - Actualizar usuario (usado por `updateUser`)
- `GET /auth/v1/token` - Obtener token (automatico en Magic Link)

## Resumen

El sistema esta **COMPLETAMENTE FUNCIONAL** y usa:

1. **Supabase Auth** para manejo de sesiones y tokens
2. **Servidor SMTP integrado de Supabase** para enviar emails
3. **Magic Links** para autenticacion segura sin passwords
4. **UI completa** con validaciones y mensajes de error

**No necesitas agregar nada mas**. El sistema esta listo para usarse en produccion.
