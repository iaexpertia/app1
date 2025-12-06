# Configuración de Password Reset en Supabase

## ✅ Cambios Implementados

### 1. Rutas Actualizadas

**Nueva ruta principal:**
- `/auth/reset-password` - Página para establecer nueva contraseña

**Ruta legacy (mantiene compatibilidad):**
- `/update-password` - Funciona también para enlaces antiguos

### 2. Archivos Modificados

#### `src/components/ForgotPassword.tsx`
```typescript
redirectTo: 'https://cyclepeaks.com/auth/reset-password'
```

#### `src/utils/authService.ts`
```typescript
redirectTo: redirectUrl || 'https://cyclepeaks.com/auth/reset-password'
```

#### `src/App.tsx`
```typescript
const isUpdatePasswordPage = window.location.pathname === '/auth/reset-password' ||
                               window.location.pathname === '/update-password';
```

---

## 🔧 Configuración Requerida en Supabase Dashboard

### Paso 1: Configurar Redirect URLs

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)

2. Navega a **Authentication** → **URL Configuration**

3. En la sección **Redirect URLs**, agrega las siguientes URLs:

   ```
   https://cyclepeaks.com/auth/reset-password
   https://www.cyclepeaks.com/auth/reset-password
   ```

   Si también usas un dominio de staging/desarrollo:
   ```
   http://localhost:5173/auth/reset-password
   https://staging.cyclepeaks.com/auth/reset-password
   ```

4. Haz clic en **Save** para guardar los cambios

### Paso 2: Configurar Email Templates (Opcional)

1. Ve a **Authentication** → **Email Templates**

2. Selecciona **Reset Password**

3. Personaliza el template si lo deseas. El template por defecto es:

   ```html
   <h2>Reset Password</h2>
   <p>Follow this link to reset your password:</p>
   <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
   ```

4. La variable `{{ .ConfirmationURL }}` será reemplazada automáticamente con:
   ```
   https://cyclepeaks.com/auth/reset-password?token=XXXXX&type=recovery
   ```

---

## 🔍 Flujo Completo de Password Reset

### 1. Usuario solicita reset
- El usuario accede a `/forgot-password`
- Ingresa su email
- Click en "Enviar Email"

### 2. Backend envía email
```typescript
await supabase.auth.resetPasswordForEmail('user@example.com', {
  redirectTo: 'https://cyclepeaks.com/auth/reset-password'
});
```

### 3. Usuario recibe email
- Supabase envía un email con un enlace
- El enlace contiene un token de recuperación:
  ```
  https://cyclepeaks.com/auth/reset-password?token=abc123...&type=recovery
  ```

### 4. Usuario hace click en el enlace
- Es redirigido a `/auth/reset-password`
- Supabase valida automáticamente el token
- Se crea una sesión temporal para el usuario

### 5. Usuario establece nueva contraseña
- El componente `UpdatePassword` verifica la sesión
- El usuario ingresa su nueva contraseña
- Se validan los requisitos de seguridad
- Click en "Restablecer Contraseña"

### 6. Contraseña actualizada
```typescript
await supabase.auth.updateUser({
  password: newPassword
});
```
- La contraseña se actualiza en Supabase
- Usuario es redirigido al login
- La sesión temporal se cierra

---

## 🧪 Testing del Flujo

### En Desarrollo (localhost)

1. Actualiza la URL en `ForgotPassword.tsx` temporalmente:
   ```typescript
   redirectTo: 'http://localhost:5173/auth/reset-password'
   ```

2. Asegúrate de tener esta URL en Supabase Dashboard

3. Prueba el flujo completo:
   ```bash
   npm run dev
   # Navega a http://localhost:5173/forgot-password
   ```

### En Producción

1. Despliega tu aplicación con las URLs de producción

2. Prueba el flujo:
   - Ir a `https://cyclepeaks.com/forgot-password`
   - Ingresar un email válido
   - Revisar inbox
   - Click en el enlace del email
   - Establecer nueva contraseña

---

## ⚠️ Notas Importantes

### 1. Dominios Permitidos
Supabase solo enviará emails con redirect URLs que estén configuradas en el dashboard. Si olvidas agregar una URL, el email no se enviará.

### 2. Email Confirmation
Por defecto, Supabase requiere confirmación de email. Si prefieres deshabilitarlo:
1. Ve a **Authentication** → **Providers** → **Email**
2. Desmarca **"Confirm email"**
3. Guarda los cambios

### 3. Token Expiration
Los tokens de password reset expiran después de 1 hora por defecto. El usuario debe completar el proceso antes de este tiempo.

### 4. Rate Limiting
Supabase limita el número de emails de reset que se pueden enviar:
- Máximo 4 emails por hora por IP
- Máximo 10 emails por hora por email

### 5. Testing en Desarrollo
Durante desarrollo, puedes usar [Mailtrap](https://mailtrap.io/) o revisar los logs de Supabase para ver los enlaces generados sin necesidad de enviar emails reales.

---

## 🔒 Seguridad

### Validaciones Implementadas

1. **Password Strength:**
   - Mínimo 8 caracteres
   - Al menos 1 mayúscula
   - Al menos 1 número
   - Al menos 1 carácter especial

2. **Session Validation:**
   - Se verifica que el usuario tenga una sesión válida
   - El token debe ser válido y no expirado
   - Se muestra error si la sesión es inválida

3. **HTTPS Only:**
   - Las URLs de producción deben usar HTTPS
   - Los tokens solo se envían por conexiones seguras

---

## 📱 URLs de Configuración Recomendadas

### Producción
```
Site URL: https://cyclepeaks.com
Redirect URLs:
  - https://cyclepeaks.com/auth/reset-password
  - https://www.cyclepeaks.com/auth/reset-password
```

### Desarrollo
```
Site URL: http://localhost:5173
Redirect URLs:
  - http://localhost:5173/auth/reset-password
```

### Staging (opcional)
```
Site URL: https://staging.cyclepeaks.com
Redirect URLs:
  - https://staging.cyclepeaks.com/auth/reset-password
```

---

## 🐛 Troubleshooting

### Error: "Email link is invalid or has expired"
**Causa:** Token expirado (>1 hora) o sesión inválida
**Solución:** Solicitar un nuevo enlace desde `/forgot-password`

### Error: "Invalid redirect URL"
**Causa:** La URL no está configurada en Supabase Dashboard
**Solución:** Agregar la URL en Authentication → URL Configuration

### Email no llega
**Posibles causas:**
1. Email en spam
2. Rate limit alcanzado (esperar 1 hora)
3. Email no existe en la base de datos
4. Proveedor de email bloqueando Supabase

### Error: "Password is too weak"
**Causa:** La contraseña no cumple los requisitos de seguridad
**Solución:** Usar una contraseña que cumpla todos los requisitos

---

## ✅ Checklist de Implementación

- [x] ✅ Componente `ForgotPassword.tsx` actualizado
- [x] ✅ Componente `UpdatePassword.tsx` ya existente
- [x] ✅ Ruta `/auth/reset-password` configurada en App.tsx
- [x] ✅ URL de producción configurada: `https://cyclepeaks.com/auth/reset-password`
- [x] ✅ Validaciones de contraseña implementadas
- [x] ✅ Manejo de errores y estados
- [ ] ⏳ Agregar redirect URL en Supabase Dashboard
- [ ] ⏳ Probar flujo completo en desarrollo
- [ ] ⏳ Probar flujo completo en producción

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Supabase Dashboard
2. Verifica que las URLs estén correctamente configuradas
3. Prueba el flujo en modo incógnito (para evitar cache)
4. Revisa la consola del navegador para errores

---

**Última actualización:** 2025-12-06
**Versión:** 1.0
