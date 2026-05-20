#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/Backend"
DATABASE_DIR="$SCRIPT_DIR/Database"
FRONTEND_DIR="$SCRIPT_DIR/Frontend"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

if ! command_exists node; then
  echo "Node.js no esta instalado. Por favor instalo y vuelva a ejecutar." >&2
  exit 1
fi
if ! command_exists npm; then
  echo "npm no esta instalado. Por favor instalo y vuelva a ejecutar." >&2
  exit 1
fi

load_env_dir() {
  local dir="$1"
  if [[ -f "$dir/.env" ]]; then
    echo "Cargando variables desde $dir/.env"
    while IFS= read -r line || [[ -n "$line" ]]; do
      # skip comments and empty
      [[ -z "$line" || "$line" =~ ^# ]] && continue
      key="${line%%=*}"
      val="${line#*=}"
      export "$key=$val"
    done < "$dir/.env"
  else
    echo "Aviso: No se encontro $dir/.env"
  fi
}

load_env_dir "$DATABASE_DIR"
load_env_dir "$BACKEND_DIR"
load_env_dir "$FRONTEND_DIR"

echo "Instalando dependencias de Database..."
(cd "$DATABASE_DIR" && npm install)

echo "Creando la base de datos y las tablas..."
(cd "$DATABASE_DIR" && npm run create-db)

echo "Instalando dependencias del Backend..."
(cd "$BACKEND_DIR" && npm install)

echo "Ejecutando tests del Backend..."
if ! (cd "$BACKEND_DIR" && npm test); then
  echo "Tests del backend fallaron. Revisa la salida." >&2
  exit 1
fi

echo "Instalando dependencias del Frontend..."
(cd "$FRONTEND_DIR" && npm install)

echo "Instalando expo-speech (opcional) en Frontend..."
cd "$FRONTEND_DIR"
echo "Iniciando Frontend en background (salida: $SCRIPT_DIR/frontend.log)..."
nohup npm run preview > "$SCRIPT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

cd "$BACKEND_DIR"
echo "Iniciando Backend en background (salida: $SCRIPT_DIR/backend.log)..."
nohup npm run dev > "$SCRIPT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

trap 'echo "Deteniendo procesos..."; kill "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true; exit' INT TERM EXIT

echo "Frontend PID: $FRONTEND_PID  Backend PID: $BACKEND_PID"
echo "Logs: $SCRIPT_DIR/frontend.log, $SCRIPT_DIR/backend.log"
echo "Use 'kill <PID>' para detener los procesos si es necesario."

wait $BACKEND_PID $FRONTEND_PID || true
