# Guía de Despliegue en Producción

Esta guía te ayudará a desplegar CyclePeaks en tu propio servidor o dominio.

## Pre-requisitos

- Node.js 18+ y npm instalado
- Acceso a tu servidor (Apache, Nginx, etc.)
- Variables de entorno de Supabase configuradas

## 1. Preparación del Build

### Configurar Variables de Entorno

Crea un archivo `.env.production` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### Construir el Proyecto

```bash
npm install
npm run build
```

Esto generará la carpeta `dist/` con todos los archivos optimizados para producción.

## 2. Verificación del Build

Revisa que el build se haya completado correctamente:

```bash
ls -la dist/
```

Deberías ver:
- `index.html`
- Carpeta `assets/` con todos los archivos JS y CSS
- Archivos estáticos (favicon.svg, favicon.ico, etc.)

## 3. Despliegue en Apache

### Paso 1: Copiar archivos al servidor

```bash
# Desde tu máquina local
scp -r dist/* usuario@tu-servidor:/var/www/cyclepeaks/
```

### Paso 2: Configurar .htaccess

Copia el archivo `.htaccess.example` como `.htaccess` en el directorio web:

```bash
cp .htaccess.example /var/www/cyclepeaks/.htaccess
```

### Paso 3: Configurar permisos

```bash
sudo chown -R www-data:www-data /var/www/cyclepeaks/
sudo chmod -R 755 /var/www/cyclepeaks/
```

### Paso 4: Reiniciar Apache

```bash
sudo systemctl restart apache2
```

## 4. Despliegue en Nginx

### Paso 1: Copiar archivos al servidor

```bash
scp -r dist/* usuario@tu-servidor:/var/www/cyclepeaks/
```

### Paso 2: Configurar Nginx

Copia la configuración de ejemplo:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/cyclepeaks
```

Edita el archivo y reemplaza:
- `your-domain.com` con tu dominio
- `/var/www/cyclepeaks/dist` con la ruta correcta

### Paso 3: Activar el sitio

```bash
sudo ln -s /etc/nginx/sites-available/cyclepeaks /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

## 5. Despliegue en Servicios Cloud

### Netlify

1. Instala Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Desplegar:
```bash
netlify deploy --prod --dir=dist
```

3. Configurar redirects - Netlify detecta automáticamente el archivo `dist/_redirects`

### Vercel

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Desplegar:
```bash
vercel --prod
```

3. Configurar variables de entorno en el dashboard de Vercel

### GitHub Pages

1. Agregar al `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

2. Instalar gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Desplegar:
```bash
npm run deploy
```

## 6. Configuración de SSL

### Con Let's Encrypt (gratuito)

#### Apache:
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d tu-dominio.com -d www.tu-dominio.com
```

#### Nginx:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

### Renovación automática:
```bash
sudo certbot renew --dry-run
```

## 7. Optimizaciones Post-Despliegue

### CDN (Opcional)

Considera usar un CDN como Cloudflare para:
- Mejorar velocidad de carga
- Protección DDoS
- SSL automático
- Compresión automática

### Monitoreo

Configura herramientas de monitoreo:
- Google Analytics
- Sentry para errores
- Uptime monitoring (UptimeRobot, Pingdom)

### Backups

Configura backups automáticos:
```bash
# Ejemplo con cron
0 2 * * * tar -czf /backup/cyclepeaks-$(date +\%Y\%m\%d).tar.gz /var/www/cyclepeaks/
```

## 8. Troubleshooting

### Error 404 en rutas

**Problema**: Las rutas SPA no funcionan después del refresh.

**Solución**: Verifica que el archivo `.htaccess` (Apache) o la configuración de `try_files` (Nginx) estén correctos.

### Errores de CORS con Supabase

**Problema**: Errores de CORS al hacer requests a Supabase.

**Solución**: Verifica que el dominio esté configurado en el dashboard de Supabase en "Authentication" → "URL Configuration".

### Assets no cargan

**Problema**: Los archivos CSS/JS devuelven 404.

**Solución**: Verifica que `base: './'` esté en `vite.config.ts` y que las rutas sean relativas.

### Variables de entorno no funcionan

**Problema**: Las variables de entorno no se cargan en producción.

**Solución**:
1. Asegúrate de que empiecen con `VITE_`
2. Reconstruye el proyecto después de cambiar `.env.production`
3. Las variables se embeben en el build, no se pueden cambiar sin reconstruir

## 9. Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Build de producción generado
- [ ] Archivos copiados al servidor
- [ ] Configuración del servidor aplicada
- [ ] SSL configurado
- [ ] Dominio apuntando al servidor
- [ ] Prueba de todas las rutas
- [ ] Prueba en diferentes dispositivos
- [ ] Configuración de backups
- [ ] Monitoreo configurado

## 10. Mantenimiento

### Actualizar la aplicación

```bash
# En tu máquina local
git pull origin main
npm install
npm run build

# Copiar al servidor
scp -r dist/* usuario@tu-servidor:/var/www/cyclepeaks/
```

### Limpiar caché del navegador

Después de actualizar, los usuarios pueden necesitar limpiar caché. Considera:
- Versionado de assets (ya incluido con hash en nombres)
- Service Workers para control de caché

## Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/guide/build.html)
- [Documentación de Supabase](https://supabase.com/docs)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Apache Documentation](https://httpd.apache.org/docs/)
