@echo off
title  Iniciando setup del proyecto
cd /d "%~dp0"

echo ===============================================
echo      Setup automatico del proyecto
echo ===============================================

:: --- 1. Verificar Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  Node.js no esta instalado. Por favor instalalo y vuelve a ejecutar este script.
    pause
    exit /b
)

:: --- 2. Verificar npm ---
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  npm no está instalado. Por favor instalalo y vuelve a ejecutar este script.
    pause
    exit /b
)

set "SCRIPT_DIR=%~dp0"
set "DATABASE_DIR=%SCRIPT_DIR%Database"
set "BACKEND_DIR=%SCRIPT_DIR%Backend"
set "FRONTEND_DIR=%SCRIPT_DIR%Frontend"

:: --- 3. Cargar variables del archivo .env de cada subproyecto ---
for %%D in ("%DATABASE_DIR%" "%BACKEND_DIR%" "%FRONTEND_DIR%") do (
    if exist "%%~fD\.env" (
        echo Cargando variables desde %%~fD\.env
        for /f "usebackq tokens=1,* delims==" %%A in (`findstr /v "^#" "%%~fD\.env"`) do (
            set "%%A=%%B"
        )
    ) else (
        echo Aviso: No se encontro .env en %%~fD
    )
)

:: --- 4. Instalar dependencias de Database ---
echo.
echo  Instalando dependencias de Database...
cd "%DATABASE_DIR%" || (
    echo  No se encontro la carpeta %DATABASE_DIR%.
    pause
    exit /b
)
call npm install

:: --- 5. Crear la base de datos y tablas ---
echo.
echo  Verificando o creando base de datos...
call npm run create-db || (
    echo  Fallo al crear la base de datos.
    pause
    exit /b
)

:: --- 6. Volver al directorio raíz ---
cd /d "%SCRIPT_DIR%"

:: --- 7. Instalar dependencias del Backend ---
echo.
echo  Instalando dependencias del Backend...
cd "%BACKEND_DIR%" || (
    echo  No se encontro la carpeta %BACKEND_DIR%.
    pause
    exit /b
)
call npm install

:: --- 7.1 Ejecutar tests del Backend (si existen) ---
echo.
echo  Ejecutando tests del Backend...
call npm test || (
    echo  Tests del backend fallaron. Revisa la salida.
    pause
    exit /b
)

:: --- 8. Volver al directorio raíz ---
cd /d "%SCRIPT_DIR%"

:: --- 9. Instalar dependencias del Frontend ---
echo.
echo  Instalando dependencias del Frontend...
cd "%FRONTEND_DIR%" || (
    echo  No se encontro la carpeta %FRONTEND_DIR%.
    pause
    exit /b
)
call npm install

:: --- 10. Levantar el Frontend ---
echo.
echo  Levantando el Frontend (en nueva ventana)...
start "Frontend" /D "%FRONTEND_DIR%" cmd /k npm run dev

:: --- 12. Levantar el servidor Backend ---
echo.
echo  Levantando el servidor Backend (en nueva ventana)...
start "Backend" /D "%BACKEND_DIR%" cmd /k npm run dev

echo.
echo ===============================================
echo  Setup completado 
echo ===============================================

pause
