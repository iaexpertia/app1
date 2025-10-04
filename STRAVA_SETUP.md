# Configuración de Strava API

Este documento explica cómo configurar la integración con Strava para sincronizar automáticamente los puertos de montaña conquistados.

## Requisitos Previos

1. Una cuenta de Strava (gratuita o premium)
2. Acceso al panel de desarrolladores de Strava

## Pasos para Configurar

### 1. Crear una Aplicación en Strava

1. Ve a [Strava API Settings](https://www.strava.com/settings/api)
2. Si no tienes una aplicación, haz clic en "Create & Manage Your App"
3. Completa el formulario con la siguiente información:
   - **Application Name**: Puertos Conquistados (o el nombre que prefieras)
   - **Category**: Visualizer
   - **Club**: Deja vacío (opcional)
   - **Website**: La URL de tu aplicación (ej: `https://tudominio.com`)
   - **Authorization Callback Domain**: `tudominio.com` o `localhost` para desarrollo local
   - **Application Description**: Aplicación para rastrear puertos de montaña conquistados

4. Acepta los términos de servicio de Strava API
5. Haz clic en "Create"

### 2. Obtener las Credenciales

Una vez creada la aplicación, verás:
- **Client ID**: Un número de identificación
- **Client Secret**: Una clave secreta (mantén esto privado)

### 3. Configurar Variables de Entorno

Abre el archivo `.env` en la raíz del proyecto y agrega tus credenciales:

```env
VITE_STRAVA_CLIENT_ID=tu_client_id_aqui
VITE_STRAVA_CLIENT_SECRET=tu_client_secret_aqui
```

**IMPORTANTE**:
- Reemplaza `tu_client_id_aqui` con tu Client ID real
- Reemplaza `tu_client_secret_aqui` con tu Client Secret real
- Nunca compartas estas credenciales públicamente
- Asegúrate de que `.env` esté en tu `.gitignore`

### 4. Configurar la URL de Callback

En la configuración de tu aplicación en Strava, asegúrate de que la "Authorization Callback Domain" incluya el dominio donde se ejecutará tu aplicación:

- **Desarrollo local**: `localhost`
- **Producción**: `tudominio.com` (sin http:// o https://)

## Cómo Funciona

### Flujo de Autenticación

1. El ciclista hace clic en "Conectar con Strava" en la sección "Puertos Conquistados"
2. Se abre una ventana emergente con la página de autorización de Strava
3. El ciclista inicia sesión en Strava y autoriza la aplicación
4. Strava redirige con un código de autorización
5. La aplicación intercambia este código por tokens de acceso
6. Los tokens se guardan en el perfil del ciclista

### Sincronización de Actividades

Una vez conectado, el ciclista puede:
1. Hacer clic en "Sincronizar actividades"
2. La aplicación obtiene las actividades del último año
3. Compara las coordenadas de inicio/fin de cada actividad con los puertos
4. Si una actividad está dentro de 5km de un puerto, se marca como conquistado
5. Los puertos sincronizados muestran el icono de Strava y un enlace a la actividad

### Datos Sincronizados

Para cada actividad que coincide con un puerto:
- Fecha de conquista
- Hora de la actividad
- Enlace directo a la actividad en Strava
- Nota automática indicando que fue sincronizado desde Strava

## Límites de la API

Strava impone límites de tasa:
- **15 minutos**: 200 solicitudes
- **Diario**: 2,000 solicitudes

La aplicación gestiona estos límites automáticamente:
- Renueva tokens cuando expiran (cada 6 horas)
- Limita las sincronizaciones para evitar exceder los límites

## Seguridad

### Almacenamiento de Tokens

Los tokens de Strava se almacenan de forma segura:
- Access Token: válido por 6 horas
- Refresh Token: usado para obtener nuevos access tokens
- Se renuevan automáticamente antes de expirar

### Permisos Solicitados

La aplicación solicita los siguientes permisos:
- `activity:read_all`: Leer todas las actividades del usuario
- `profile:read_optional`: Leer información básica del perfil

## Solución de Problemas

### Error: "Invalid Client ID or Secret"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de modificar `.env`

### Error: "Redirect URI Mismatch"
- Verifica que la Authorization Callback Domain en Strava coincida con tu dominio
- Para desarrollo local, debe ser `localhost`

### No se Sincronizan Actividades
- Verifica que las actividades sean de tipo "Ride" o "VirtualRide"
- Las actividades deben tener coordenadas GPS
- La actividad debe estar dentro de 5km del puerto
- Solo se sincronizan actividades del último año

### Token Expirado
- Los tokens se renuevan automáticamente
- Si hay problemas, desconecta y vuelve a conectar tu cuenta de Strava

## Desconectar Strava

El ciclista puede desconectar su cuenta de Strava en cualquier momento:
1. En la sección "Puertos Conquistados", haz clic en "Desconectar"
2. Esto elimina todos los tokens almacenados
3. Los puertos ya sincronizados permanecen en el perfil
4. Se puede volver a conectar en cualquier momento

## Soporte

Para más información sobre la API de Strava:
- [Documentación oficial de Strava API](https://developers.strava.com/docs/)
- [Guía de autenticación](https://developers.strava.com/docs/authentication/)
- [Referencia de API](https://developers.strava.com/docs/reference/)
