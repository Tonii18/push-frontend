# Push — Gym Routine Tracker

Aplicación web desarrollada con **Next.js**, **React** y **Tailwind CSS** para organizar tu rutina semanal de gimnasio, personalizar el nombre de cada día de entrenamiento y registrar tus ejercicios.

## ✨ Funcionalidades

- **Autenticación con JWT:** registro, inicio de sesión y protección de rutas mediante token.
- **Organización semanal:** vista general de la semana y pantallas dinámicas por día (`monday` – `sunday`).
- **Título editable por día:** personalización del nombre de cada sesión (ej. *Push Day*, *Upper Body*, *Leg Day*).
- **Gestión de ejercicios:** formulario para añadir ejercicios y edición o borrado en línea (series, repeticiones y peso en `kg`).

## 🛠️ Stack tecnológico

- **Framework:** Next.js (App Router)
- **Librería UI:** React + Tailwind CSS
- **Lenguaje:** TypeScript

## 🚀 Instalación y ejecución en local

1. **Clona el repositorio e instala las dependencias:**
   ```bash
   git clone <url-de-tu-repo-frontend>
   cd <nombre-carpeta-frontend>
   npm install
   ```

2. **Configura las variables de entorno:**
   Crea un archivo `.env` local en la raíz del proyecto con la URL del backend:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

Abre `http://localhost:3000` en tu navegador para empezar a usar la aplicación.