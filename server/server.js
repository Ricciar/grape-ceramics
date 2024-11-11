import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Ladda miljövariabler från .env-filen
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware för att hanter JSON och CORS
app.use(express.json());
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
});

// Route för att hämta produkter från WooCommerce API

app.get("/api/products", async (req, res) => {
   try {
      const response = await axios.get(
         `${process.env.WOOCOMMERCE_API_URL}products`,
         {
            auth: {
               username: process.env.WOOCOMMERCE_CONSUMER_KEY,
               password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
            },
         }
      );
      res.json(response.data); // Skicka produkterna som JSON till frontend
   } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching products" });
   }
});

// Grundläggande route för att testa servern
app.get("/", (req, res) => {
   res.send("Server is running");
});

// Starta servern
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
