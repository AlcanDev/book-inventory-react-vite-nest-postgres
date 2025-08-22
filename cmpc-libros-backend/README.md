# CMPC-libros — Backend (NestJS + PostgreSQL + Sequelize)

API para gestionar inventario de libros con autenticación JWT, CRUD, filtros/orden/paginación y exportación CSV.

---

## ⚙️ Requisitos

- Node 20+ · npm 9+
- PostgreSQL 13+
- (Opcional) Docker & Docker Compose

---

## 📁 Estructura proyecto

```text
src/
  auth/     (login JWT)
  books/    (CRUD + filtros + export CSV)
  users/    (modelo/servicio)
  audit/    (logs de acciones)
  common/   (interceptores, filtros, guard)
  config/   (env + validación)
test/       (unit + e2e)
  app.e2e-spec.ts
  jest-e2e.json
  auth.service.spec.ts
  books.controller.spec.ts
  books.service.spec.ts
migrations/
seeders/
jest.config.ts
tsconfig.spec.json
Dockerfile
docker-compose.yml
```

---

## 🔐 Variables de entorno (.env)

```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=supersecretchangeme
JWT_EXPIRES_IN=1d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cmpc_libros
DB_USER=cmpc
DB_PASS=cmpc_password
```

---

## ▶️ Cómo ejecutar

### Con Docker

```bash
cp .env.example .env
docker-compose up --build
# Swagger: http://localhost:3000/api
```

### Local (sin Docker)

```bash
npm ci
npm run migrate
npm run seed
npm run start:dev
# Swagger: http://localhost:3000/api
```

---

## 👤 Usuario seed

```txt
email:    admin@cmpc.local
password: admin1234
role:     admin
```

---

## 🔑 Autenticación

**POST** `/auth/login` → `{ access_token }`
Usar en header: `Authorization: Bearer <token>`

---

## 📚 Endpoints principales

### Auth

**POST** `/auth/login`
Body:

```json
{ "email": "admin@cmpc.local", "password": "admin1234" }
```

### Books (requiere JWT)

- **GET** `/books` — Lista con filtros, orden y paginación.
  **Query opcional:**
  - `q` (busca en `title`, `author`, `publisher`, `genre`)
  - `genre`, `publisher`, `author`, `available=true|false`
  - `page` (>=1), `limit` (<=100)
  - `sort` (ej: `price:asc,title:desc`)

- **GET** `/books/export` — Exporta CSV (respeta los mismos filtros).
- **POST** `/books` — Crea libro.
  Body:

  ```json
  {
    "title": "El Hobbit",
    "author": "J.R.R. Tolkien",
    "publisher": "Minotauro",
    "price": "11990.00",
    "available": true,
    "genre": "Fantasía",
    "imageUrl": "https://.../portada.jpg"
  }
  ```

- **GET** `/books/:id` — Obtiene libro.
- **PATCH** `/books/:id` — Actualiza parcial (ej: `price`, `available`, etc).
- **DELETE** `/books/:id` — Soft delete (no borrado físico).

---

## 🧪 Ejemplos rápidos (cURL)

1. **Login**

```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cmpc.local","password":"admin1234"}'
```

2. **Crear libro**

```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"El Hobbit","author":"J.R.R. Tolkien","publisher":"Minotauro","price":"11990.00","available":true,"genre":"Fantasía"}'
```

3. **Listar con filtros y orden**

```bash
curl "http://localhost:3000/books?q=tolkien&sort=price:asc&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

4. **Exportar CSV**

```bash
curl -G 'http://localhost:3000/books/export' \
  -H "Authorization: Bearer $TOKEN" \
  --data-urlencode 'genre=Fantasía' \
  -o books.csv
```

---

🧪 Testing

El proyecto usa Jest + ts-jest.

Unit tests

Los tests unitarios están en la carpeta test/ con sufijo .spec.ts.

# Ejecutar unit tests

```bash
npm run test

# Ejecutar en modo watch (útil en desarrollo)
npm run test:watch

# Ejecutar con cobertura
npm run test:cov
```

El reporte de cobertura se genera en la carpeta coverage/ y puede abrirse en navegador con:

```bash
open coverage/lcov-report/index.html
```

E2E tests

Los tests end-to-end están en test/app.e2e-spec.ts.

```bash
npm run test:e2e
```

Estricto con cobertura mínima

Opcionalmente puedes forzar que falle si baja del 80%:

```bash
npm run test:cov:strict
```

(este comando usa un jest-coverage-threshold.json con umbrales definidos al 80% para branches, functions, lines y statements).

## 📝 Notas útiles

- Swagger en `/api` con botón **Authorize** para pegar el token.
- `price` es **string** (mantener precisión de `DECIMAL`).
- Se registran **audit logs** en mutaciones y login.
- Soft delete activo (`paranoid`). Restauración fuera del alcance de esta versión.
