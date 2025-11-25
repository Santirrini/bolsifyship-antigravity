# Reporte de Preparación para Producción

Este reporte detalla los pasos necesarios para llevar tu aplicación e-commerce `Bolsifyshop` a un entorno de producción seguro, escalable y confiable.

## 🚨 Crítico (Debe arreglarse antes de salir a vivo)

### 1. Base de Datos (Migración de SQLite)
- **Estado Actual:** El backend utiliza SQLite (`bolsifyshop.db`), que es una base de datos basada en archivos, no apta para concurrencia en producción.
- **Acción Requerida:** Migrar a **PostgreSQL** o **MySQL**.
  - Actualizar `backend/database.py` para usar drivers de producción (ej. `psycopg2` para Postgres).
  - Provisionar una instancia de base de datos en tu proveedor de nube (AWS RDS, Supabase, Railway, etc.).

### 2. Gestión de Migraciones
- **Estado Actual:** Las migraciones de esquema se ejecutan "al vuelo" en el evento `startup` de `main.py` (líneas 22-39). Esto es peligroso y puede causar corrupción de datos o condiciones de carrera si tienes múltiples réplicas.
- **Acción Requerida:** Implementar **Alembic** para gestionar las migraciones de base de datos de forma controlada y versionada.

### 3. Seguridad de Secretos (.gitignore)
- **Estado Actual:** No se detectó un archivo `.gitignore` en la raíz ni en `backend`. El archivo `.env` (que contiene secretos) está presente en el directorio y corre riesgo de ser subido al repositorio.
- **Acción Requerida:**
  - Crear un archivo `.gitignore` en la raíz.
  - Añadir `.env`, `__pycache__`, `venv/`, `*.db`, `.DS_Store` a este archivo inmediatamente.

### 4. Configuración CORS
- **Estado Actual:** `backend/main.py` permite todos los orígenes (`allow_origins=["*"]`) si no se configura la variable de entorno.
- **Acción Requerida:** Restringir `ALLOWED_ORIGINS` estrictamente al dominio de tu frontend en producción (ej. `https://bolsifyshop.com`).

### 5. Dockerización
- **Estado Actual:** No existen archivos `Dockerfile` ni `docker-compose.yml`.
- **Acción Requerida:**
  - Crear `Dockerfile` para el backend (Python).
  - Crear `Dockerfile` para el frontend (Next.js).
  - Crear `docker-compose.yml` para orquestar los servicios localmente y facilitar el despliegue.

## ⚠️ Importante (Altamente recomendado)

### 6. Servidor de Aplicaciones (WSGI/ASGI)
- **Estado Actual:** Se usa `uvicorn` directamente (típico de desarrollo).
- **Acción Requerida:** Usar **Gunicorn** con workers de Uvicorn para producción para mejor gestión de procesos y rendimiento.
  ```bash
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
  ```

### 7. Logging Estructurado
- **Estado Actual:** Se usan `print()` statements para errores (ej. `main.py:39`). Los logs de `print` pueden perderse o no tener contexto en producción.
- **Acción Requerida:** Configurar el módulo `logging` de Python para enviar logs estructurados (JSON) a la salida estándar o a un servicio de monitoreo.

### 8. CI/CD Completo
- **Estado Actual:** El workflow de GitHub (`playwright.yml`) solo prueba el frontend.
- **Acción Requerida:** Añadir un job para ejecutar los tests del backend (`pytest`) en cada Pull Request.

## 🚀 Mejoras de Rendimiento y UX

### 9. Optimización de Imágenes
- **Estado Actual:** Verificar si se usa `next/image` correctamente en todo el frontend para servir imágenes en formatos modernos (WebP/AVIF) y con lazy loading.

### 10. Rate Limiting
- **Estado Actual:** No se observa protección contra fuerza bruta o abuso de API.
- **Acción Requerida:** Implementar `slowapi` o middleware similar en FastAPI para limitar el número de peticiones por IP.

---

## Plan de Acción Inmediato

1.  **Crear .gitignore** (Prioridad Máxima).
2.  **Configurar Docker** para estandarizar el entorno.
3.  **Configurar Alembic** y eliminar las migraciones manuales de `main.py`.
