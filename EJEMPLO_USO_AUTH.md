# Ejemplo de Uso: Sistema de Recuperacion de Contrasena

Este archivo muestra ejemplos practicos de como usar el sistema de recuperacion de contrasena.

## Flujo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 1: Usuario Olvida su Contrasena                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Usuario va a /forgot-password                              │
│  Componente: ForgotPassword.tsx                             │
│                                                              │
│  [Formulario]                                                │
│  Email: [___________________]  [Enviar Email]               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  App llama a: supabase.auth.resetPasswordForEmail(email)   │
│                                                              │
│  Supabase:                                                   │
│  - Genera token unico y seguro                               │
│  - Envia email automaticamente con Magic Link                │
│  - NO necesitas configurar SMTP                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 2: Usuario Recibe Email                               │
│                                                              │
│  De: noreply@mail.app.supabase.io                           │
│  Asunto: Recuperar Contrasena                               │
│                                                              │
│  Contenido:                                                  │
│  "Haz clic aqui para restablecer tu contrasena:             │
│   https://tuapp.com/update-password?token=abc123..."        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 3: Usuario Hace Clic en el Enlace                     │
│                                                              │
│  Supabase automaticamente:                                   │
│  - Valida el token                                           │
│  - Crea una sesion temporal                                  │
│  - Redirige a /update-password                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Usuario ingresa en /update-password                         │
│  Componente: UpdatePassword.tsx                              │
│                                                              │
│  [Formulario]                                                │
│  Nueva Contrasena:     [___________]                         │
│  Confirmar Contrasena: [___________]                         │
│  [Restablecer Contrasena]                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  App llama a: supabase.auth.updateUser({ password })        │
│                                                              │
│  Supabase:                                                   │
│  - Valida la sesion                                          │
│  - Actualiza la contrasena                                   │
│  - Invalida el token                                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  EXITO: Contrasena actualizada                              │
│  Usuario puede iniciar sesion con la nueva contrasena       │
└─────────────────────────────────────────────────────────────┘
```

## Ejemplo 1: Uso del Servicio de Autenticacion

```typescript
// src/components/MiComponente.tsx
import { requestPasswordReset, updatePassword } from '../utils/authService';
import { useState } from 'react';

export const MiComponente = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRecuperarContrasena = async () => {
    // Llamar al servicio de autenticacion
    const resultado = await requestPasswordReset(email);

    if (resultado.success) {
      setMensaje('Email enviado! Revisa tu bandeja de entrada.');
    } else {
      setMensaje(`Error: ${resultado.error}`);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />
      <button onClick={handleRecuperarContrasena}>
        Recuperar Contrasena
      </button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};
```

## Ejemplo 2: Componente Completo con Validaciones

```typescript
import { useState } from 'react';
import { requestPasswordReset } from '../utils/authService';

export const FormularioRecuperacion = () => {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado'>('idle');
  const [error, setError] = useState('');

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar email
    if (!validarEmail(email)) {
      setError('Por favor ingresa un email valido');
      return;
    }

    setEstado('enviando');

    // Solicitar recuperacion
    const resultado = await requestPasswordReset(email);

    if (resultado.success) {
      setEstado('enviado');
    } else {
      setEstado('idle');
      setError(resultado.error || 'Error al enviar el email');
    }
  };

  if (estado === 'enviado') {
    return (
      <div className="mensaje-exito">
        <h2>Email Enviado!</h2>
        <p>Revisa tu bandeja de entrada y haz clic en el enlace.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Recuperar Contrasena</h2>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={estado === 'enviando'}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando...' : 'Enviar Email'}
      </button>
    </form>
  );
};
```

## Ejemplo 3: Actualizar Contrasena con Validaciones

```typescript
import { useState } from 'react';
import { updatePassword, getCurrentSession } from '../utils/authService';

export const FormularioNuevaContrasena = () => {
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');

  const validarContrasena = (pwd: string): string[] => {
    const errores: string[] = [];

    if (pwd.length < 8) {
      errores.push('Minimo 8 caracteres');
    }
    if (!/[A-Z]/.test(pwd)) {
      errores.push('Debe tener al menos 1 mayuscula');
    }
    if (!/[0-9]/.test(pwd)) {
      errores.push('Debe tener al menos 1 numero');
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      errores.push('Debe tener al menos 1 caracter especial');
    }

    return errores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que coincidan
    if (contrasena !== confirmar) {
      setError('Las contrasenas no coinciden');
      return;
    }

    // Validar requisitos
    const errores = validarContrasena(contrasena);
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

    // Verificar sesion
    const sesion = await getCurrentSession();
    if (!sesion) {
      setError('Sesion invalida. Solicita un nuevo enlace.');
      return;
    }

    // Actualizar contrasena
    const resultado = await updatePassword(contrasena);

    if (resultado.success) {
      alert('Contrasena actualizada exitosamente!');
      window.location.href = '/';
    } else {
      setError(resultado.error || 'Error al actualizar la contrasena');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nueva Contrasena</h2>

      <label>
        Nueva Contrasena:
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
      </label>

      <label>
        Confirmar Contrasena:
        <input
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />
      </label>

      <div className="requisitos">
        <p>Requisitos:</p>
        <ul>
          <li className={contrasena.length >= 8 ? 'valido' : ''}>
            Minimo 8 caracteres
          </li>
          <li className={/[A-Z]/.test(contrasena) ? 'valido' : ''}>
            Al menos 1 mayuscula
          </li>
          <li className={/[0-9]/.test(contrasena) ? 'valido' : ''}>
            Al menos 1 numero
          </li>
          <li className={/[!@#$%^&*]/.test(contrasena) ? 'valido' : ''}>
            Al menos 1 caracter especial
          </li>
        </ul>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit">Actualizar Contrasena</button>
    </form>
  );
};
```

## Configuracion de Rutas en React Router

Si usas React Router, configura las rutas asi:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ForgotPassword } from './components/ForgotPassword';
import { UpdatePassword } from './components/UpdatePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Testing Manual

### Probar el Flujo Completo

1. **Iniciar la app en desarrollo**:
   ```bash
   npm run dev
   ```

2. **Ir a la pagina de recuperacion**:
   - Abre: `http://localhost:5173/forgot-password`

3. **Ingresar un email**:
   - Usa un email que exista en tu tabla de usuarios
   - Ejemplo: `test@example.com`

4. **Revisar el email**:
   - Ve a tu bandeja de entrada
   - Busca el email de `noreply@mail.app.supabase.io`
   - Puede estar en spam la primera vez

5. **Hacer clic en el enlace**:
   - Seras redirigido a `/update-password`
   - Veras el formulario para la nueva contrasena

6. **Ingresar nueva contrasena**:
   - Ejemplo: `MiPassword123!`
   - Confirmar: `MiPassword123!`
   - Hacer clic en "Restablecer Contrasena"

7. **Verificar exito**:
   - Deberias ver un mensaje de exito
   - Seras redirigido al inicio
   - Puedes iniciar sesion con la nueva contrasena

## Manejo de Errores Comunes

### Error: "Email not found"

```typescript
// Supabase NO revela si el email existe por seguridad
// Siempre muestra el mismo mensaje de exito
const resultado = await requestPasswordReset('email@noexiste.com');
console.log(resultado.success); // true (pero no se envia email)
```

**Solucion**: Esto es intencional por seguridad.

### Error: "Invalid session"

```typescript
const sesion = await getCurrentSession();
if (!sesion) {
  // El token expiro o es invalido
  // Redirigir al usuario a solicitar un nuevo enlace
  window.location.href = '/forgot-password';
}
```

### Error: "Password should be at least 6 characters"

```typescript
// Supabase requiere minimo 6 caracteres por defecto
// Tu validacion puede ser mas estricta (8+ caracteres)
if (password.length < 8) {
  setError('La contrasena debe tener al menos 8 caracteres');
  return;
}
```

## Integracion con tu Sistema de Autenticacion

Si ya tienes un sistema de login, integra asi:

```typescript
// Despues de actualizar la contrasena
const resultado = await updatePassword(nuevaContrasena);

if (resultado.success) {
  // Opcion 1: Cerrar sesion y pedir login
  await signOut();
  window.location.href = '/login';

  // Opcion 2: Mantener sesion activa
  // El usuario ya esta autenticado via Magic Link
  window.location.href = '/dashboard';
}
```

## Variables de Entorno

Tu `.env` ya contiene las credenciales necesarias:

```env
VITE_SUPABASE_URL=https://fwkeqxleiqrzrczqibhe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**IMPORTANTE**: No las compartas publicamente. Ya estan configuradas en tu proyecto.

## Proximos Pasos

1. Personaliza las plantillas de email en Supabase Dashboard
2. Configura tu dominio en las URLs permitidas
3. Prueba el flujo completo con usuarios reales
4. Ajusta las validaciones segun tus necesidades
5. Agrega logs para monitorear solicitudes de recuperacion

## Soporte

Si tienes problemas:

1. Revisa los logs en Supabase Dashboard > Logs
2. Verifica la configuracion de Email Templates
3. Asegurate de que las URLs de redireccion esten permitidas
4. Revisa la consola del navegador para errores

Tu sistema esta listo para usarse en produccion!
