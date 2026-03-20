# FUTURE_FS_02 - Mini CRM

A premium, full-stack Mini CRM application built with Node.js, Express, and SQLite.

## ✨ Features
- **Modern Premium Theme**: A dark, vibrant Slate & Neon Indigo design with glassmorphism and smooth animations.
- **Lead Management**: Full CRUD (Create, Read, Update, Delete) functionality for leads.
- **Business Dashboard**: Interactive charts and overview stats of your pipeline.
- **Export CSV**: Instantly extract lead data into a standard CSV format.
- **Authentication**: Secure admin login and registration with JWT.

## 🛠 Tech Stack
- **Frontend**: Vanilla HTML/JavaScript/CSS (optimized for performance).
- **Backend**: Node.js & Express.
- **Database**: SQLite (built-in, zero configuration).

## 🚀 Deployment Instructions

### Backend (Render.com)
1. Push this repository to GitHub.
2. Link your GitHub account on [Render.com](https://render.com).
3. Create a new **Web Service** and select the `FUTURE_FS_02` repository.
4. Render will automatically detect the `render.yaml` configuration.

### Frontend (Vercel)
1. Link your GitHub account on [Vercel.com](https://vercel.com).
2. Create a new project and select the `FUTURE_FS_02` repository.
3. Once deployed, get your Render backend URL (e.g., `https://your-app.onrender.com`).
4. Update the `rewrites` section in `vercel.json` with your actual Render URL:
   ```json
   { "source": "/api/(.*)", "destination": "https://your-render-url.onrender.com/api/$1" }
   ```
5. Commit and push the change to trigger a redeploy.

## 📄 License
MIT
