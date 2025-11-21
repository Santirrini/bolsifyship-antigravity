---
description: Compilar y preparar la aplicación para producción
---

# Compilar Bolsifyshop para Producción

Esta guía te ayudará a compilar tanto el frontend como el backend para desplegar en un servidor de producción.

## Frontend (Next.js)

### 1. Configurar variables de entorno para producción

Crea un archivo `.env.production` en la carpeta `frontend/`:

```env
NEXT_PUBLIC_API_URL=https://tu-dominio-backend.com/api
```

**Importante:** Reemplaza `https://tu-dominio-backend.com/api` con la URL real donde estará tu backend en producción.

### 2. Compilar el frontend

Desde la carpeta `frontend/`, ejecuta:

```bash
npm run build
```

Este comando creará una carpeta `.next` con la aplicación optimizada para producción.

### 3. Opciones para desplegar el frontend

#### Opción A: Vercel (Recomendado para Next.js)
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel` en la carpeta `frontend/`
3. Sigue las instrucciones en pantalla
4. Configura las variables de entorno en el dashboard de Vercel

#### Opción B: Servidor propio con Node.js
1. Sube la carpeta completa `frontend/` a tu servidor
2. Instala dependencias: `npm install --production`
3. Ejecuta: `npm run start` (corre en puerto 3000 por defecto)
4. Usa PM2 o similar para mantenerlo corriendo:
   ```bash
   npm install -g pm2
   pm2 start npm --name "bolsifyshop-frontend" -- start
   ```

#### Opción C: Exportación estática (si no usas features de servidor)
1. Modifica `next.config.ts` para agregar: `output: 'export'`
2. Ejecuta: `npm run build`
3. Sube la carpeta `out/` a cualquier hosting estático (Netlify, GitHub Pages, etc.)

**Nota:** Esta opción solo funciona si no usas API Routes o Server-Side Rendering.

## Backend (FastAPI)

### 1. Crear archivo de dependencias

Si no tienes `requirements.txt`, créalo ejecutando desde `backend/`:

```bash
pip freeze > requirements.txt
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
DATABASE_URL=sqlite:///./bolsifyshop.db
SECRET_KEY=tu-clave-secreta-super-segura-en-produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://tu-dominio-frontend.com
```

**Importante:** 
- Usa una `SECRET_KEY` fuerte y diferente a la de desarrollo
- Actualiza `CORS_ORIGINS` con tu dominio de frontend real
- Considera usar PostgreSQL en lugar de SQLite para producción

### 3. Opciones para desplegar el backend

#### Opción A: Servidor VPS (DigitalOcean, AWS EC2, etc.)

1. **Instalar Python 3.9+ en el servidor**
2. **Clonar o subir tu proyecto**
3. **Crear entorno virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Linux/Mac
   # o en Windows: .\venv\Scripts\Activate.ps1
   ```
4. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   pip install uvicorn gunicorn
   ```
5. **Ejecutar con Gunicorn (producción):**
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
6. **Configurar servicio systemd o usar PM2:**
   ```bash
   # Con PM2
   npm install -g pm2
   pm2 start "gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000" --name bolsifyshop-backend
   ```

#### Opción B: Railway, Render, o Fly.io

1. Crea un archivo `Procfile` en `backend/`:
   ```
   web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
   ```
2. Crea un archivo `runtime.txt` (opcional):
   ```
   python-3.11
   ```
3. Conecta tu repositorio Git a Railway/Render
4. Configura las variables de entorno en el dashboard
5. Despliega automáticamente

#### Opción C: Docker

1. Crea `Dockerfile` en `backend/`:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
   ```
2. Construir imagen: `docker build -t bolsifyshop-backend .`
3. Ejecutar: `docker run -p 8000:8000 bolsifyshop-backend`

## Configuración de Nginx (Recomendado)

Si usas un VPS, configura Nginx como reverse proxy:

```nginx
# Frontend
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend
server {
    listen 80;
    server_name api.tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Después configura SSL con Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d api.tu-dominio.com
```

## Checklist Final

- [ ] Variables de entorno configuradas en frontend y backend
- [ ] Frontend compilado con `npm run build`
- [ ] Backend con Gunicorn en lugar de Uvicorn con --reload
- [ ] Base de datos de producción configurada (PostgreSQL recomendado)
- [ ] CORS configurado con dominio de producción
- [ ] SSL/HTTPS habilitado
- [ ] Logs configurados
- [ ] Backup de base de datos automatizado
- [ ] Monitoreo configurado (opcional pero recomendado)
