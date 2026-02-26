# Curso: Ingenieria de Software II

# Estudiante:  Ángel David Gómez Pastrana

# Laboratorio: Pipeline_CICD

Descripción
-
Laboratoria con una API Express que expone endpoints de ejemplo y pruebas con `jest` y `supertest` y usa un Pipeline para crea una pagina en github Pages.

Autores
-
Ángel David Gómez Pastrana, Jauri Esteban Cortes, Camilo Borja Rojas

Estado del proyecto
-
- Lenguaje: JavaScript (Node.js, CommonJS)
- Framework: Express
- Tests: Jest + Supertest

Descripción de los endpoints
-
- `GET /` — Mensaje de bienvenida: devuelve `{ message: 'Hola, DevOps!' }`.
- `GET /health` — Estado: devuelve `{ status: 'OK', timestamp: ... }`.
- `GET /version` — Versión de la aplicación: devuelve `{ version: '1.0.0' }`.

Estructura del proyecto
-
- `package.json` — scripts y dependencias.
- `src/app.js` — servidor Express y definición de endpoints.
- `tests/app.test.js` — pruebas automatizadas que usan `supertest`.

