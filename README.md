# Push — Gym Routine Tracker

Web application built with **Next.js**, **React**, and **Tailwind CSS** to organize your weekly gym split, customize each day's routine title, and track your exercises.

## ✨ Features

- **JWT authentication:** sign up, sign in, and protected routes with bearer tokens.
- **Weekly schedule:** overview of the week and dynamic pages per day (`monday` – `sunday`).
- **Editable daily titles:** customize the name of each session (e.g., *Push Day*, *Upper Body*, *Leg Day*).
- **Exercise management:** add new exercises and edit or delete them inline (sets, reps, and weight in `kg`).

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React + Tailwind CSS
- **Language:** TypeScript

## 🚀 Local Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <your-frontend-repo-url>
   cd <your-frontend-folder-name>
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in the root directory with your backend URL:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser to start using the app.