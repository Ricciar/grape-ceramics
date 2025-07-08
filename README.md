# Grape Ceramics – React + Vite + Netlify Functions

## 🪴 Project Overview

This project uses **React (Vite)** for the frontend and **Netlify Functions (serverless)** for backend API endpoints, enabling a clean, scalable architecture for Grape Ceramics.

It leverages:

- **Vite** for fast frontend development with HMR (Hot Module Replacement).
- **Netlify Functions** for lightweight, scalable serverless backend endpoints.
- **Netlify CLI** for local development and production deployment.

---

## 🚀 Deployment Guide

### Prerequisites

✅ **Node.js and npm installed.**
✅ **Netlify CLI installed:**

```bash
npm install -g netlify-cli
```

✅ **Login to Netlify CLI:**

```bash
netlify login
```

✅ **Link your site (if not done):**

```bash
netlify link
```

---

### Deployment Steps

#### 1️⃣ Build the Frontend

Before deploying, build your Vite frontend:

```bash
npm run build
```

This will:

- Navigate into `client/`.
- Install dependencies (if needed).
- Build the Vite frontend into `client/dist`.

#### 2️⃣ Deploy to Production

Deploy your built frontend and functions to Netlify:

```bash
npm run deploy
```

This will:

- Deploy the `client/dist` folder to Netlify (as specified in `netlify.toml`).
- Deploy your serverless functions from `server/netlify/functions`.
- Publish your site live.

✅ **Your live production site is now updated!**

---

### 🧪 Local Development

Run the project locally to test before deploying:

```bash
npm run dev
```

This will:

- Run **`netlify dev`**.
- Serve your Vite frontend with HMR.
- Emulate your Netlify Functions locally.
- Handle redirects as defined in `netlify.toml`.

✅ Open [http://localhost:8888](http://localhost:8888) to view your app with live updates and local serverless functions working.

---

## ⚡ Recommended CLI Commands

✅ **Test deploy to staging:**

```bash
netlify deploy
```

(Provides a preview URL before going live.)

✅ **Check functions logs:**

```bash
netlify functions:log
```

✅ **Invoke a specific function locally:**

```bash
netlify functions:invoke <function-name>
```

---

## 🩶 Common Issues

❌ **Deploying without building:** Ensure you run `npm run build` before `npm run deploy` when using CLI.

❌ **Stale site after deploy:** Use `netlify deploy` first to preview, then `npm run deploy` for production.

❌ **404 on frontend routes:** Ensure you have SPA fallback in `netlify.toml`.

❌ **Functions not updating:** Test locally with `netlify dev` and add `console.log` for debugging.

---

## 🛠 Tech Stack

- **React + Vite** (frontend)
- **Netlify Functions (serverless backend)**
- **Node + Express (optional, wrapped via `serverless-http` if needed)**
- **Netlify CLI**
- **ESLint + Prettier for consistent code**

---

## ✍️ Expanding ESLint Configuration (Advanced)

If you wish to add type-aware linting with `typescript-eslint`, refer to [typescript-eslint documentation](https://typescript-eslint.io/).

Example `parserOptions`:

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `strictTypeChecked`, and optionally add stylistic configurations as needed.

If using React linting:

```js
import react from 'eslint-plugin-react';
export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

---

## ✅ Summary

- **Build:** `npm run build`
- **Deploy:** `npm run deploy`
- **Local Dev:** `npm run dev`
- **Use Netlify CLI to manage and test your deploys.**
