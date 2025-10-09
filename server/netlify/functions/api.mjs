import serverless from "serverless-http";
import app from "../../dist/app.js";

// Logg – hjälper dig se att backend startar
console.log("✅ Netlify API function loaded");

// Exportera för Netlify Functions
export const handler = serverless(app);
