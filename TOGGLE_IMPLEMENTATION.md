# Sistema de Toggle para Puertos de Montaña - Documentación Técnica

## 🎯 Objetivo
Implementar un sistema robusto y reactivo para activar/desactivar puertos de montaña con actualización optimista de UI y persistencia en Supabase.

## 🏗️ Arquitectura de la Solución

### 1. **Capa de Base de Datos (Supabase)**

#### Tabla: `mountain_passes`
- **Campo**: `is_active` (boolean, default: `true`)
- **RLS Habilitado**: ✅ Sí
- **Políticas**:
  - `SELECT`: Público (cualquier usuario puede ver)
  - `UPDATE`: Autenticado (solo usuarios autenticados pueden modificar)
  - `INSERT`: Público (cualquiera puede enviar para validación)
  - `DELETE`: Autenticado

#### Verificación de Políticas RLS
```sql
-- Las políticas actuales permiten UPDATE para usuarios autenticados
SELECT * FROM pg_policies WHERE tablename = 'mountain_passes';
```

### 2. **Capa de Servicio**

**Archivo**: `src/utils/passesService.ts`

```typescript
export async function togglePassActiveStatus(
  passId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string; data?: any }>
```

#### Mejoras Implementadas:
- ✅ Retorna objeto con `success`, `error` y `data` en lugar de solo boolean
- ✅ Usa `.maybeSingle()` para evitar errores si no hay resultados
- ✅ Actualiza `updated_at` automáticamente
- ✅ Logging detallado para debugging
- ✅ Manejo de errores robusto

### 3. **Capa de Componente (AdminPanel)**

**Archivo**: `src/components/AdminPanel.tsx`

#### Patrón: Optimistic UI con Rollback

```typescript
const handleTogglePassActive = async (pass: MountainPass) => {
  // PASO 1: Actualización Optimista
  // ✅ Actualiza UI inmediatamente ANTES de la llamada a BD

  // PASO 2: Persistencia en Supabase
  // ✅ Intenta guardar en base de datos

  // PASO 3: Rollback si falla
  // ✅ Revierte cambios si hay error

  // PASO 4: Confirmación desde BD
  // ✅ Refresca desde BD para confirmar estado real
}
```

## 🚀 Flujo de Ejecución

### Caso Exitoso:

```
1. Usuario hace clic en "Desactivar"
   └─> UI se actualiza INMEDIATAMENTE (isActive: false)

2. Se envía petición a Supabase
   └─> UPDATE mountain_passes SET is_active = false WHERE id = 'xxx'

3. Supabase responde exitosamente
   └─> { success: true, data: {...} }

4. Se refresca la lista desde BD
   └─> Confirma que el cambio persiste

5. ✅ Estado final: Puerto desactivado en UI y BD
```

### Caso con Error:

```
1. Usuario hace clic en "Activar"
   └─> UI se actualiza INMEDIATAMENTE (isActive: true)

2. Se envía petición a Supabase
   └─> UPDATE mountain_passes...

3. Supabase responde con ERROR
   └─> { success: false, error: "RLS policy violated" }

4. ROLLBACK: Se revierte el cambio en UI
   └─> UI vuelve a mostrar isActive: false

5. Se refresca desde BD para confirmar consistencia

6. Se muestra alerta al usuario
   └─> "Error: RLS policy violated. El cambio no se ha guardado."

7. ✅ Estado final: Puerto permanece en estado original
```

## 🔍 Debugging

### Console Logs Implementados:

```javascript
// Al iniciar toggle
🔄 Toggle iniciado: { passId, passName, from, to }

// Después de actualizar UI
✅ UI actualizada optimísticamente

// Si la BD responde OK
✅ Actualización en BD exitosa: {...}
✅ Puerto "Col du Galibier" desactivado exitosamente

// Si la BD responde ERROR
❌ Error en BD, haciendo rollback: "error message"
❌ Error crítico en handleTogglePassActive: Error
```

### Herramientas de Debugging:

1. **Consola del Navegador**: Ver logs en tiempo real
2. **Network Tab**: Verificar requests a Supabase
3. **Supabase Dashboard**: Ver cambios en tabla directamente

## ✅ Checklist de Verificación

### Testing Manual:

- [ ] **Test 1**: Activar puerto inactivo
  - Clic en botón "Activar"
  - ¿UI cambia inmediatamente? ✅
  - ¿Al recargar página, sigue activo? ✅

- [ ] **Test 2**: Desactivar puerto activo
  - Clic en botón "Desactivar"
  - ¿UI cambia inmediatamente? ✅
  - ¿Al recargar página, sigue inactivo? ✅

- [ ] **Test 3**: Error de conexión
  - Desconectar internet
  - Intentar cambiar estado
  - ¿UI revierte el cambio? ✅
  - ¿Muestra mensaje de error? ✅

- [ ] **Test 4**: RLS Policy Block
  - Logout del usuario
  - Intentar cambiar estado
  - ¿Muestra error de permisos? ✅

### Testing Automático Sugerido:

```typescript
describe('togglePassActiveStatus', () => {
  it('should update pass status successfully', async () => {
    const result = await togglePassActiveStatus('pass-123', false);
    expect(result.success).toBe(true);
  });

  it('should return error for non-existent pass', async () => {
    const result = await togglePassActiveStatus('invalid-id', false);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## 🎨 Componente Toast (Opcional - Preparado)

Se ha creado un componente `Toast` para mejorar la experiencia de usuario:

**Archivo**: `src/components/Toast.tsx`

### Uso Futuro:
```typescript
// En lugar de alert()
showToast({
  type: 'success',
  message: 'Puerto activado exitosamente'
});

// Error
showToast({
  type: 'error',
  message: 'Error al cambiar estado del puerto'
});
```

## 📊 Ventajas de esta Implementación

### ✅ Optimistic UI
- Respuesta instantánea al usuario
- Mejor experiencia de usuario
- Sensación de aplicación rápida

### ✅ Rollback Automático
- Si falla, vuelve al estado anterior
- No deja la UI en estado inconsistente
- Usuario siempre ve el estado real

### ✅ Confirmación desde BD
- Después de éxito, refresca desde BD
- Asegura que UI = BD
- Previene estados fantasma

### ✅ Logging Detallado
- Fácil debugging
- Trazabilidad completa
- Identifica problemas rápidamente

### ✅ Manejo de Errores Robusto
- Captura todos los errores posibles
- Mensajes claros al usuario
- No crashea la aplicación

## 🔐 Seguridad

### RLS (Row Level Security)
- ✅ Habilitado en tabla `mountain_passes`
- ✅ Solo usuarios autenticados pueden modificar
- ✅ Previene modificaciones no autorizadas

### Validación
- ✅ Se verifica que el `passId` exista
- ✅ Se valida el resultado de Supabase
- ✅ Se confirma el cambio desde BD

## 📝 Notas de Implementación

### Por qué Optimistic UI:
- Usuarios esperan respuestas instantáneas
- Las operaciones de BD pueden tardar 100-500ms
- Mejor UX = mejor percepción de la app

### Por qué Rollback:
- Errores de red son comunes
- RLS puede rechazar operaciones
- Usuario debe ver siempre estado real

### Por qué Confirmar desde BD:
- Única fuente de verdad
- Previene estados desincronizados
- Maneja casos edge (múltiples usuarios)

## 🚨 Problemas Comunes y Soluciones

### Problema 1: "UI no se actualiza"
**Causa**: No hay optimistic update
**Solución**: ✅ Implementado - `onUpdatePass(updatedPass)` antes de BD

### Problema 2: "Cambio no persiste"
**Causa**: Error en RLS o conexión
**Solución**: ✅ Implementado - Logging + rollback + alert

### Problema 3: "UI muestra estado incorrecto"
**Causa**: No hay refresh desde BD
**Solución**: ✅ Implementado - `onRefreshPasses()` después de éxito

### Problema 4: "Error silencioso"
**Causa**: Función retorna solo boolean
**Solución**: ✅ Implementado - Retorna objeto con error message

## 🎓 Mejores Prácticas Aplicadas

1. **Separation of Concerns**
   - Servicio maneja BD
   - Componente maneja UI
   - App maneja estado global

2. **Error Handling**
   - Try-catch en cada capa
   - Mensajes descriptivos
   - Rollback automático

3. **User Feedback**
   - Actualización inmediata
   - Alertas en caso de error
   - Logging para debugging

4. **Data Consistency**
   - Refresco desde BD
   - Validación de resultados
   - Estados sincronizados

## 📈 Próximos Pasos (Opcional)

- [ ] Implementar sistema de Toasts en lugar de `alert()`
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar retry automático en caso de error de red
- [ ] Agregar animaciones de transición en UI
- [ ] Implementar cache local con sincronización
