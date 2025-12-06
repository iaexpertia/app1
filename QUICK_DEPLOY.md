# Despliegue Rápido - CyclePeaks

## 🚀 Deploy en 5 Minutos

### Opción 1: Netlify (Recomendado - Gratis)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Build
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist
```

**Ya funciona en:** `https://tu-app.netlify.app`

---

### Opción 2: Vercel (Gratis)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy (build automático)
vercel --prod
```

**Ya funciona en:** `https://tu-app.vercel.app`

---

### Opción 3: Servidor Propio (Apache)

```bash
# 1. Build local
npm run build

# 2. Copiar al servidor
scp -r dist/* usuario@servidor.com:/var/www/html/

# 3. Copiar .htaccess
cp .htaccess.example /var/www/html/.htaccess

# 4. Reiniciar Apache
sudo systemctl restart apache2
```

**Ya funciona en:** `http://tu-dominio.com`

---

### Opción 4: Servidor Propio (Nginx)

```bash
# 1. Build local
npm run build

# 2. Copiar al servidor
scp -r dist/* usuario@servidor.com:/var/www/cyclepeaks/

# 3. Configurar Nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/cyclepeaks
sudo ln -s /etc/nginx/sites-available/cyclepeaks /etc/nginx/sites-enabled/

# 4. Reiniciar Nginx
sudo systemctl restart nginx
```

**Ya funciona en:** `http://tu-dominio.com`

---

## ⚙️ Variables de Entorno

Antes de hacer deploy, configura tus variables de Supabase:

### Netlify/Vercel (Dashboard)
```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

### Servidor Propio
Edita `.env.production` y reconstruye:
```bash
npm run build
```

---

## 🔒 SSL Gratis con Let's Encrypt

### Apache:
```bash
sudo certbot --apache -d tu-dominio.com
```

### Nginx:
```bash
sudo certbot --nginx -d tu-dominio.com
```

---

## ✅ Verificar que Funciona

1. Abre tu URL en el navegador
2. Verifica que cargue la página principal
3. Navega por diferentes secciones
4. Abre DevTools → Console (no debe haber errores 404 de TU código)
5. Verifica que el favicon aparezca

---

## 📦 Contenido de /dist (Listo para Deploy)

```
dist/
├── index.html          ← Tu página principal
├── favicon.svg         ← Favicon
├── favicon.ico         ← Favicon alternativo
├── robots.txt          ← Para SEO
├── assets/            ← JS y CSS optimizados
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
└── mountain_passes_template.csv
```

**Tamaño total:** ~250 KB (comprimido)

---

## 🔧 Comandos Útiles

```bash
# Development
npm run dev              # Servidor local en http://localhost:5173

# Build
npm run build            # Crear build de producción

# Preview build
npm run preview          # Ver el build localmente

# Clean build
rm -rf dist && npm run build
```

---

## 🐛 Troubleshooting Rápido

### Error: Assets no cargan
**Solución:** Verifica que `base: './'` esté en `vite.config.ts`

### Error: Rutas SPA no funcionan (404)
**Solución:** Configura redirects en tu servidor (archivos .htaccess o nginx.conf incluidos)

### Error: Variables de entorno no funcionan
**Solución:**
1. Deben empezar con `VITE_`
2. Reconstruye después de cambiarlas

### Veo errores de "messo.min.js" o "chmln.js"
**No es un problema:** Son extensiones del navegador o el entorno de Bolt. Prueba en modo incógnito.

---

## 📚 Más Información

- **Guía completa:** Lee `DEPLOYMENT_PRODUCTION.md`
- **Verificación:** Lee `BUILD_VERIFICATION.md`
- **Responsive:** Lee `RESPONSIVE.md`

---

## 🎉 ¡Listo!

Tu aplicación está lista para producción. Elige una de las opciones arriba y en 5 minutos estará online.

**Need help?** Revisa `DEPLOYMENT_PRODUCTION.md` para más detalles.
