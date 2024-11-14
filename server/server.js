import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Ladda miljövariabler från .env-filen
dotenv.config();

// Kontrollera miljövariabler
if (
   !process.env.PORT ||
   !process.env.WOOCOMMERCE_API_URL ||
   !process.env.WOOCOMMERCE_CONSUMER_KEY ||
   !process.env.WOOCOMMERCE_CONSUMER_SECRET
) {
   console.error("Warning: Some required environment variables are not set.");
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS-konfiguration
const corsOptions = {
   origin: ["http://localhost:5173"], // Specificera tillåtna domäner
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware för att hantera JSON
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
   console.log(`${req.method} ${req.url}`);
   next();
});

// Funktion för att ta bort HTML-taggar från beskrivning
function stripHtml(htmlString) {
   return htmlString
      .replace(/<\/?p>/g, "\n") // Ersätter <p>-taggar med radbrytningar
      .replace(/<\/?br\s*\/?>/g, "\n") // Ersätter <br>-taggar med radbrytningar
      .replace(/<\/?[^>]+(>|$)/g, "") // Tar bort övriga HTML-taggar
      .replace(/\n/g, "\n")
      .trim();
}

// Route för att hämta alla produkter från WooCommerce API
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

      console.log(response.data);

      //Extrahera endast de specifika fälten från produkterna
      const products = response.data.map((product) => ({
         id: product.id,
         name: product.name,
         images: product.images.map((image) => image.src), // Array med bild-URL:er
         description: stripHtml(product.description),
         price: product.price,
         sale_price: product.sale_price,
         stock_status: product.stock_status,
      }));

      res.json(products); // Skicka de filtrerade produkterna till frontend
   } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching products" });
   }
});

// Route för att hämta en specifik produkt från WooCommerce API
app.get("/api/products/:id", async (req, res) => {
   const productId = req.params.id;
   try {
      const response = await axios.get(
         `${process.env.WOOCOMMERCE_API_URL}products/${productId}`,
         {
            auth: {
               username: process.env.WOOCOMMERCE_CONSUMER_KEY,
               password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
            },
         }
      );

      const product = response.data;

      // Extrahera endast de specifika fälten för produkten
      const productData = {
         id: product.id,
         name: product.name,
         images: product.images.map((image) => image.src), // Array med bild-URL:er
         description: stripHtml(product.description),
         price: product.price,
         sale_price: product.sale_price,
         stock_quantity: product.stock_quantity,
         stock_status: product.stock_status,
      };

      res.json(productData);
   } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
   }
});

// Grundläggande route för att testa servern
app.get("/", (req, res) => {
   res.send("Server is running");
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ error: "Something went wrong!" });
});

// Starta servern
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
