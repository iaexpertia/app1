# Guía de Despliegue en Hostinger

Esta aplicación ha sido optimizada para producción con code splitting, lazy loading y compresión avanzada.

## Preparación del Build

### 1. Configurar Variables de Entorno

Copia el archivo `.env.production` y configura tus valores de producción:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase_produccion
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_produccion
```

### 2. Generar Build de Producción

```bash
npm install
npm run build
```

El build se generará en la carpeta `dist/` con las siguientes optimizaciones:

- **Code Splitting**: La aplicación se divide en chunks más pequeños
  - react-vendor: React y React-DOM (139 KB)
  - leaflet-vendor: Mapas de Leaflet (152 KB)
  - supabase-vendor: Cliente de Supabase (129 KB)
  - utils-vendor: Utilidades y iconos (15 KB)

- **Lazy Loading**: Los componentes se cargan bajo demanda
- **Minificación**: Eliminación de console.logs y código muerto
- **Compresión Gzip**: Reducción de tamaño hasta un 70%

## Despliegue en Hostinger

### Opción 1: File Manager (Gestor de Archivos)

1. Accede a tu panel de Hostinger
2. Ve a **File Manager** (Gestor de Archivos)
3. Navega a la carpeta `public_html` o tu directorio de dominio
4. Sube **todo el contenido** de la carpeta `dist/` (no la carpeta dist en sí)
5. Asegúrate de subir también el archivo `.htaccess`

### Opción 2: FTP

1. Conecta a tu servidor FTP usando las credenciales de Hostinger
2. Navega a `public_html` o tu directorio de dominio
3. Sube todo el contenido de la carpeta `dist/`
4. Sube el archivo `.htaccess` a la raíz

### Estructura de Archivos en el Servidor

```
public_html/
├── .htaccess
├── index.html
└── assets/
    ├── *.js
    ├── *.css
    └── ...
```

## Configuración del .htaccess

El archivo `.htaccess` incluido proporciona:

- **Reescritura de URLs**: Soporte para rutas de React Router
- **Compresión Gzip**: Compresión automática de archivos
- **Cache del Navegador**: Cacheo optimizado de recursos estáticos
- **Headers de Seguridad**: Protección contra XSS y clickjacking

## Verificación del Despliegue

1. Accede a tu dominio en el navegador
2. Verifica que la aplicación carga correctamente
3. Prueba la navegación entre diferentes secciones
4. Abre DevTools > Network para verificar:
   - Los chunks se cargan correctamente
   - La compresión gzip está activa
   - Los headers de cache están funcionando

## Variables de Entorno en Producción

Las variables de entorno se incluyen en el build. Asegúrate de:

1. **Nunca** subir archivos `.env` al servidor
2. Configurar las variables correctas antes de hacer el build
3. Hacer un nuevo build si cambias las variables de entorno

## Optimizaciones Aplicadas

### Build Configuration
- Manual chunks para mejor cacheo
- Eliminación de console.logs
- Minificación con Terser

### Code Splitting
- Lazy loading de componentes pesados
- Suspense boundaries con spinners de carga
- Separación de vendors principales

### Performance
- Gzip compression en el servidor
- Cache headers optimizados
- Preload de recursos críticos

## Solución de Problemas

### Error 404 al recargar la página
- Verifica que el archivo `.htaccess` esté en la raíz
- Asegúrate que `mod_rewrite` esté habilitado

### Archivos muy grandes
- Los chunks están optimizados
- El archivo más grande es leaflet-vendor (152 KB)
- Con gzip, se reduce a ~44 KB

### Variables de entorno no funcionan
- Regenera el build con las variables correctas
- Las variables se incluyen en tiempo de compilación, no en runtime

## Mantenimiento

### Actualizar la Aplicación
1. Hacer cambios en el código
2. Regenerar el build: `npm run build`
3. Subir solo los archivos modificados de `dist/`

### Limpiar Cache
Si los usuarios no ven los cambios:
1. Los archivos tienen hash único (ej: `index-0WCdpvb4.js`)
2. Cada build genera nuevos hashes
3. Subir el nuevo `index.html` fuerza la actualización

## Recursos Adicionales

- [Documentación de Hostinger](https://support.hostinger.com)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [React Router en Apache](https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing)

## Soporte

Si tienes problemas con el despliegue:
1. Verifica los logs del servidor en Hostinger
2. Revisa la consola del navegador (F12)
3. Confirma que todas las variables de entorno estén configuradas
