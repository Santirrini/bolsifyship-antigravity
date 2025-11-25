# Guía de Despliegue y Producción

Hemos configurado tu proyecto para que esté listo para producción usando Docker y Alembic.

## 1. Ejecutar con Docker (Recomendado)

Docker orquesta el Backend, Frontend y la Base de Datos (PostgreSQL) automáticamente.

### Prerrequisitos
- Tener Docker y Docker Compose instalados.

### Pasos
1.  Construir y levantar los servicios:
    ```bash
    docker-compose up --build
    ```
2.  Acceder a la aplicación:
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:8000`
    - Base de Datos: Puerto `5432`

## 2. Gestión de Base de Datos (Alembic)

Hemos desactivado las migraciones manuales peligrosas en `main.py`. Ahora debes usar Alembic.

### Crear una nueva migración
Cuando modifiques `models.py`, ejecuta:
```bash
# Desde la carpeta backend/
alembic revision --autogenerate -m "descripcion_del_cambio"
```

### Aplicar migraciones
Para actualizar la base de datos:
```bash
alembic upgrade head
```

**Nota:** Si usas Docker, es posible que necesites ejecutar estos comandos dentro del contenedor del backend:
```bash
docker-compose exec backend alembic upgrade head
```

## 3. Variables de Entorno

El archivo `docker-compose.yml` ya configura variables por defecto. Para producción real, asegúrate de configurar:
- `DATABASE_URL`: Tu conexión a PostgreSQL real.
- `ALLOWED_ORIGINS`: El dominio de tu frontend (ej. `https://tusitio.com`).
- `SECRET_KEY`: Una clave segura para JWT.

## 4. Siguientes Pasos
- Prueba el flujo de registro y login en el entorno Docker.
- Verifica que las imágenes se carguen correctamente.
