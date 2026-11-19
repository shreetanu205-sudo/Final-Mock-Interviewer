# PrepOrbit Deployment Guide

This guide details how to deploy **PrepOrbit** to production environments, including Vercel (Frontend), Render or Railway (Backend), and MongoDB Atlas (Database).

---

## 1. Database Setup: MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (e.g. M0 Free Tier).
3. Under **Database Access**, create a database user:
   - Username: `preporbit_user`
   - Password: `<SECURE_PASSWORD>`
   - Role: `readWriteAnyDatabase`
4. Under **Network Access**, click **Add IP Address**:
   - For cloud deployment (Render/Railway), choose **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Under **Database > Connect**, select **Drivers > Java**:
   - Copy the connection URI:
   ```
   mongodb+srv://preporbit_user:<PASSWORD>@cluster0.abcde.mongodb.net/preporbit?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment: Render

Render natively supports Java 17 / Docker web services.

### Option A: Standard Native Java
1. Connect your Git repository to [Render.com](https://render.com).
2. Create a new **Web Service**.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Java` (or Docker)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/preporbit-backend-1.0.0.jar`
4. Configure **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `PORT` | `8080` |
   | `MONGODB_URI` | `mongodb+srv://preporbit_user:<PASSWORD>@cluster0.abcde.mongodb.net/preporbit?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `YourLongSecureJwtSecretKeyAtLeast32CharsLength!` |
   | `FRONTEND_URL` | `https://preporbit.vercel.app,http://localhost:5173` |
   | `LLM_PROVIDER` | `gemini` (or `openai`, `mock`) |
   | `LLM_API_KEY` | `your_gemini_api_key` |
   | `LLM_MODEL` | `gemini-1.5-flash` |
5. Click **Create Web Service**.
6. Note the deployed URL (e.g., `https://preporbit-backend.onrender.com`). Verify health at:
   ```
   GET https://preporbit-backend.onrender.com/api/health
   ```

---

## 3. Backend Deployment: Railway

1. In [Railway.app](https://railway.app), click **New Project > Deploy from GitHub repo**.
2. Select repository and set **Root Directory** to `backend`.
3. Railway automatically detects Maven and builds using OpenJDK 17.
4. Add the same environment variables listed above.

---

## 4. Frontend Deployment: Vercel

1. In [Vercel](https://vercel.com), click **Add New > Project** and select your repository.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://preporbit-backend.onrender.com/api` |
4. Click **Deploy**.
5. Once deployed, add your Vercel domain (e.g., `https://preporbit.vercel.app`) to the backend's `FRONTEND_URL` environment variable to ensure CORS authorization.

---

## 5. Local Docker Deployment (All-in-One)

You can run the full full-stack platform (Frontend, Backend, and MongoDB) locally with a single command:

```bash
docker compose up --build
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:8080/api`
- MongoDB: `localhost:27017`
