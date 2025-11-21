# Bolsifyshop Backend API

API backend para la plataforma de e-commerce Bolsifyshop, construida con FastAPI y SQLAlchemy.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Autenticación](#autenticación)
- [Scripts Útiles](#scripts-útiles)

## 🚀 Tecnologías

- **FastAPI** - Framework web moderno y de alto rendimiento
- **SQLAlchemy** - ORM para gestión de base de datos
- **SQLite** - Base de datos (para desarrollo)
- **Pydantic** - Validación de datos y serialización
- **JWT** - Autenticación basada en tokens
- **Passlib** - Hashing de contraseñas con bcrypt

## 📁 Estructura del Proyecto

```
backend/
├── routers/              # Endpoints de la API organizados por dominio
│   ├── admin.py         # Panel de administración
│   ├── auth.py          # Autenticación y registro
│   ├── cart.py          # Carrito de compras
│   ├── categories.py    # Categorías de productos
│   ├── offers.py        # Ofertas y promociones
│   ├── orders.py        # Gestión de pedidos
│   ├── search.py        # Búsqueda de productos
│   ├── users.py         # Gestión de usuarios y perfiles
│   └── wishlist.py      # Lista de deseos
├── main.py              # Aplicación principal y configuración CORS
├── models.py            # Modelos de base de datos (SQLAlchemy)
├── schemas.py           # Esquemas de validación (Pydantic)
├── database.py          # Configuración de conexión a BD
├── crud.py              # Operaciones CRUD básicas
├── seed.py              # Script para poblar datos iniciales
├── create_admin.py      # Script para crear usuario administrador
├── test_auth.py         # Tests de autenticación
└── bolsifyshop.db       # Base de datos SQLite
```

## 💿 Instalación

### Prerequisitos

- Python 3.8 o superior
- pip

### Pasos

1. **Crear y activar entorno virtual:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. **Instalar dependencias:**

```bash
pip install fastapi uvicorn sqlalchemy pydantic passlib[bcrypt] python-jose[cryptography] python-multipart
```

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza las siguientes configuraciones por defecto:

- **Base de datos**: `sqlite:///./bolsifyshop.db`
- **Puerto**: `8000`
- **CORS**: Configurado para `http://localhost:3000` (frontend)

### Inicialización de la Base de Datos

La base de datos se crea automáticamente al iniciar la aplicación por primera vez.

Para poblar con datos de prueba:

```bash
python seed.py
```

Para crear un usuario administrador:

```bash
python create_admin.py
```

## 🏃 Ejecución

### Modo Desarrollo

```bash
uvicorn main:app --reload --port 8000
```

### Modo Producción

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

La API estará disponible en: `http://localhost:8000`

Documentación interactiva (Swagger UI): `http://localhost:8000/docs`

Documentación alternativa (ReDoc): `http://localhost:8000/redoc`

## 🔌 API Endpoints

### Autenticación (`/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/token` | Login y obtener token JWT | No |
| GET | `/me` | Obtener información del usuario actual | Sí |

### Productos y Búsqueda (`/search`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/search` | Buscar productos con filtros | No |
| GET | `/products/{id}` | Obtener producto por ID | No |
| POST | `/compare` | Comparar productos | No |

### Carrito (`/cart`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/cart` | Obtener carrito del usuario | Sí |
| POST | `/cart` | Añadir producto al carrito | Sí |
| DELETE | `/cart/{product_id}` | Eliminar producto del carrito | Sí |
| PUT | `/cart/{product_id}` | Actualizar cantidad | Sí |

### Lista de Deseos (`/wishlist`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/wishlist` | Obtener lista de deseos | Sí |
| POST | `/wishlist` | Añadir a favoritos | Sí |
| DELETE | `/wishlist/{product_id}` | Eliminar de favoritos | Sí |

### Categorías (`/categories`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/categories` | Listar todas las categorías | No |

### Ofertas (`/offers`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/offers/pre-season` | Productos pre-temporada | No |
| GET | `/offers/past-season` | Productos fuera de temporada | No |
| GET | `/offers/clearance` | Productos en liquidación | No |
| GET | `/offers/trending` | Productos más solicitados | No |

### Usuarios (`/users`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Obtener perfil del usuario | Sí |
| PUT | `/users/me` | Actualizar perfil | Sí |
| GET | `/users/me/addresses` | Listar direcciones | Sí |
| POST | `/users/me/addresses` | Añadir dirección | Sí |
| PUT | `/users/me/addresses/{id}` | Actualizar dirección | Sí |
| DELETE | `/users/me/addresses/{id}` | Eliminar dirección | Sí |
| GET | `/users/me/payment-methods` | Listar métodos de pago | Sí |
| POST | `/users/me/payment-methods` | Añadir método de pago | Sí |
| DELETE | `/users/me/payment-methods/{id}` | Eliminar método de pago | Sí |

### Pedidos (`/orders`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/orders/me` | Listar pedidos del usuario | Sí |

### Administración (`/admin`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/admin/stats` | Estadísticas del dashboard | Admin |
| GET | `/admin/products` | Listar todos los productos | Admin |
| POST | `/admin/products` | Crear nuevo producto | Admin |
| PUT | `/admin/products/{id}` | Actualizar producto | Admin |
| DELETE | `/admin/products/{id}` | Eliminar producto | Admin |
| GET | `/admin/orders` | Listar todos los pedidos | Admin |
| PUT | `/admin/orders/{id}` | Actualizar estado de pedido | Admin |
| GET | `/admin/users` | Listar todos los usuarios | Admin |
| PUT | `/admin/users/{id}` | Actualizar usuario | Admin |
| DELETE | `/admin/users/{id}` | Eliminar usuario | Admin |

## 📊 Modelos de Datos

### Product (Producto)

```python
{
    "id": int,
    "name": str,
    "description": str | null,
    "price": float,
    "discount_price": float | null,
    "category": str,
    "rating": float,
    "reviews": int,
    "source": str,
    "image": str | null,
    "season": str | null,
    "sales_count": int
}
```

### User (Usuario)

```python
{
    "id": int,
    "email": str,
    "full_name": str,
    "is_active": int,
    "is_admin": int
}
```

### CartItem (Item de Carrito)

```python
{
    "id": int,
    "user_id": int,
    "product_id": int,
    "quantity": int
}
```

### Order (Pedido)

```python
{
    "id": int,
    "user_id": int,
    "total_amount": float,
    "status": str,  # "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    "created_at": str,
    "shipping_address": str
}
```

### Address (Dirección)

```python
{
    "id": int,
    "user_id": int,
    "full_name": str,
    "address_line1": str,
    "address_line2": str | null,
    "city": str,
    "state": str,
    "zip_code": str,
    "country": str,
    "phone": str,
    "is_default": int
}
```

## 🔐 Autenticación

El backend utiliza **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. **Registro**: `POST /register` con email, contraseña y nombre completo
2. **Login**: `POST /token` con credenciales, recibe un access_token
3. **Peticiones autenticadas**: Incluir header `Authorization: Bearer {token}`

### Ejemplo de Uso

```javascript
// Registro
const response = await fetch('http://localhost:8000/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    full_name: 'John Doe'
  })
});

// Login
const loginResponse = await fetch('http://localhost:8000/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=user@example.com&password=securepassword'
});
const { access_token } = await loginResponse.json();

// Petición autenticada
const userData = await fetch('http://localhost:8000/auth/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

## 🛠️ Scripts Útiles

### `seed.py`

Puebla la base de datos con productos de ejemplo para desarrollo.

```bash
python seed.py
```

### `create_admin.py`

Crea un usuario administrador con credenciales específicas.

```bash
python create_admin.py
```

### `test_auth.py`

Tests básicos para verificar el sistema de autenticación.

```bash
python test_auth.py
```

### `debug_register.py`

Script de depuración para el proceso de registro.

```bash
python debug_register.py
```

## 📝 Notas de Desarrollo

### CORS

El backend está configurado para aceptar peticiones desde `http://localhost:3000`. Para modificar esto, edita la configuración de CORS en [`main.py`](file:///c:/Users/LENOVO/OneDrive/Documents/Bolsifyshop/backend/main.py#L29-L35):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Modificar según necesidad
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Migraciones

El proyecto incluye una migración automática al inicio para añadir la columna `is_admin` a la tabla de usuarios si no existe.

### Base de Datos

- **Desarrollo**: SQLite (`bolsifyshop.db`)
- **Producción**: Se recomienda migrar a PostgreSQL o MySQL

Para cambiar la base de datos, modifica `SQLALCHEMY_DATABASE_URL` en [`database.py`](file:///c:/Users/LENOVO/OneDrive/Documents/Bolsifyshop/backend/database.py#L5).

## 🐛 Troubleshooting

### Error: "ModuleNotFoundError"

Asegúrate de tener el entorno virtual activado y todas las dependencias instaladas:

```bash
pip install -r requirements.txt  # Si existe
# O instalar manualmente las dependencias principales
```

### Error: "No module named 'auth'"

Verifica que estés ejecutando el servidor desde el directorio `backend`:

```bash
cd backend
uvicorn main:app --reload
```

### Base de datos bloqueada

Si SQLite muestra errores de bloqueo, cierra todas las conexiones activas o elimina el archivo `.db` y vuelve a ejecutar los scripts de inicialización.

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Última actualización**: 2025-11-21
