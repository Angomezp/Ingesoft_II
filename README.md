# Ingesoft_II

Aplicación full-stack (Frontend + Backend + Database) para gestión de usuarios, localidades y consulta de versión.

Descripción
- Backend: servidor Express + TypeORM que expone endpoints para autenticación, localidades y versión.
- Frontend: aplicación React (Vite) con interfaz simple para iniciar sesión, ver tablas y localidades.
- Database: scripts y esquemas SQL para crear las tablas `usuarios`, `localidades` y `tablas`.

Características principales
- Login contra servicio remoto y persistencia del usuario en la BD.
- Obtención de localidades desde un servicio upstream, con almacenamiento local y fallback.
- Endpoint `/version` que compara la versión local con la versión del endpoint.

Requisitos
- Node.js 18+ y npm
- Una base de datos PostgreSQL accesible y configurada en `Prueba/Backend/.env`

Instalación y ejecución (Backend)
1. Abrir terminal en `Prueba/Backend`.
2. Instalar dependencias:

```powershell
cd Prueba\Backend
npm install
```

3. Configurar variables en `.env` (ejemplo mínimo):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base
API_BASE_URL=https://api.example.com
```

4. Crear la base de datos y tablas (si no existen) usando los scripts en `Prueba/Database/src/scripts`.
5. Iniciar servidor en modo desarrollo:

```powershell
npm run dev
```

Ejecución (Frontend)
1. Abrir terminal en `Prueba/Frontend`.
2. Instalar dependencias y arrancar:

```powershell
cd Prueba\Frontend
npm install
npm run dev
```

Uso
- Abrir la interfaz del frontend en el URL que indique Vite (por defecto `http://localhost:5173`).
- Iniciar sesión desde la pantalla de login; el backend autenticará contra el servicio remoto y guardará el usuario en la BD.
- Navegar a "Localidades" para obtener la lista (se usará primero la BD; si está vacía, se consultará el upstream y se guardarán los registros).

Tests
- El backend incluye un comando de pruebas: en `Prueba/Backend` ejecutar `npm run test`.

Contribuir
- Modifica el código en `Prueba/Backend/src` y `Prueba/Frontend/src`.
- Sigue las convenciones de TypeScript y ejecuta `npm run lint` / `npm run format` en el backend cuando edites.

Scripts de setup
- En la raíz del proyecto hay dos scripts para automatizar la preparación e inicio:
	- `setup.sh` (Linux / macOS / WSL)
	- `setup.bat` (Windows)

Qué hacen los scripts
- Instalan dependencias en `Database`, `Backend` y `Frontend`.
- Ejecutan el script de creación de la base de datos (`Database/src/scripts/create-db`).
- Ejecutan tests del backend y arrancan frontend y backend en modo desarrollo (abren ventanas o procesos en background según plataforma).
- Si falta un `.env` en alguno de los subproyectos, el script mostrará un aviso; no sobrescribe variables existentes.

Preparar los archivos `.env`
- En cada subproyecto hay archivos `.env.example` con las variables mínimas necesarias (`Backend`, `Database`, `Frontend`). Antes de ejecutar el setup asegúrate de crear los `.env` locales a partir de los ejemplos y editar las credenciales:

Unix / macOS / WSL (ejemplo):
```bash
cd Prueba/Backend && cp .env.example .env
cd ../Database && cp .env.example .env
cd ../Frontend && cp .env.example .env
# Edita los .env para completar DB_HOST, DB_USER, DB_PASSWORD, API_BASE_URL, etc.
```

Windows (cmd) (ejemplo):
```cmd
copy Prueba\Backend\.env.example Prueba\Backend\.env
copy Prueba\Database\.env.example Prueba\Database\.env
copy Prueba\Frontend\.env.example Prueba\Frontend\.env
REM Edita los .env con tu editor y completa las credenciales.
```

Ejecutar los scripts
- Linux / macOS / WSL:
```bash
chmod +x setup.sh   # solo si hace falta
./setup.sh
```
- Windows:
```cmd
setup.bat
```

Notas
- Edita los `.env` antes de ejecutar los scripts para no tener avisos por variables faltantes.
- Los scripts intentan ser seguros: no sobrescriben `.env` existentes y muestran mensajes si algo falta.


