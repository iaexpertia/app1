# Configuración de EmailJS para Envío de Emails Reales

Por defecto, la aplicación muestra el enlace de recuperación en la consola del navegador. Para recibir emails reales, sigue estos pasos:

## Paso 1: Crear Cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" y crea una cuenta gratuita
3. Verifica tu email

## Paso 2: Configurar Servicio de Email

1. Una vez dentro del dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Anota tu **Service ID** (ejemplo: `service_abc123`)

### Configuración para Gmail:

- Email: tu email de Gmail
- Necesitarás crear una "App Password" si tienes 2FA activado
- Ve a: https://myaccount.google.com/apppasswords
- Crea una contraseña de aplicación y úsala en EmailJS

## Paso 3: Crear Plantilla de Recuperación

1. Ve a "Email Templates" en el dashboard
2. Haz clic en "Create New Template"
3. Dale un nombre: "Password Recovery"
4. Anota el **Template ID** (ejemplo: `template_xyz789`)

### Contenido de la Plantilla:

**Subject:**
```
🔐 CyclePeaks - Recuperación de Contraseña
```

**Content:**
```html
Hola {{to_name}},

Has solicitado restablecer tu contraseña en CyclePeaks.

Para restablecer tu contraseña, haz clic en el siguiente enlace:

{{recovery_link}}

Este enlace es válido por {{expiry_hours}} horas.

Si no solicitaste este cambio, puedes ignorar este email.

---
CyclePeaks Team
```

**Variables que debes incluir en la plantilla:**
- `{{to_name}}` - Nombre del destinatario
- `{{recovery_link}}` - Enlace de recuperación
- `{{expiry_hours}}` - Horas de validez del enlace

## Paso 4: Obtener tu Public Key

1. Ve a "Account" en el menú superior
2. Busca la sección "API Keys"
3. Copia tu **Public Key** (ejemplo: `abc123XYZ`)

## Paso 5: Configurar Variables de Entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID_RECOVERY=tu_template_id_aqui
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=tu_template_id_registro_aqui
```

Ejemplo:
```env
VITE_EMAILJS_PUBLIC_KEY=abc123XYZ
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID_RECOVERY=template_xyz789
VITE_EMAILJS_TEMPLATE_ID_REGISTRATION=template_reg456
```

## Paso 6: Reiniciar Servidor de Desarrollo

```bash
npm run dev
```

## Verificación

Una vez configurado:

1. Ve a la página de recuperación de contraseña
2. Ingresa un email registrado
3. Deberías recibir un email real en tu bandeja
4. El email contendrá el enlace de recuperación funcional

## Limitaciones de la Cuenta Gratuita

EmailJS ofrece:
- ✅ 200 emails gratis por mes
- ✅ Sin tarjeta de crédito requerida
- ✅ Múltiples servicios de email
- ✅ Plantillas personalizables

Para más emails, considera:
- Plan Pro: $15/mes (1,000 emails)
- Plan Premium: $35/mes (5,000 emails)

## Modo Desarrollo (Sin Configuración)

Si no configuras EmailJS, la aplicación funciona en modo desarrollo:
- ✅ El sistema genera el token correctamente
- ✅ Muestra el enlace de recuperación en la consola
- ✅ Puedes copiar el enlace desde la consola
- ✅ El enlace funciona normalmente
- ❌ No se envían emails reales

Para ver el enlace en la consola:
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca el mensaje con el enlace de recuperación
4. Copia y pega el enlace en el navegador

## Troubleshooting

### Error: "Public Key is required"
- Asegúrate de que `VITE_EMAILJS_PUBLIC_KEY` esté en el `.env`
- Reinicia el servidor después de editar `.env`

### Error: "Service is not configured"
- Verifica que `VITE_EMAILJS_SERVICE_ID` sea correcto
- Asegúrate de que el servicio esté activo en EmailJS

### No recibo emails
- Revisa la carpeta de spam
- Verifica que el servicio de email esté configurado correctamente
- Comprueba que tu plantilla tenga todas las variables necesarias
- Revisa los logs en el dashboard de EmailJS

### Variables no se reemplazan
- Asegúrate de usar la sintaxis correcta: `{{variable}}`
- Las variables deben coincidir exactamente (case-sensitive)
- Guarda la plantilla después de editarla
