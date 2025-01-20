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
   process.exit(1);
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
      .replace(/<p>/g, "\n") // Ersätter öppnande <p> med en ny rad
      .replace(/<\/p>/g, "") // Tar bort stängande </p>
      .replace(/<br\s*\/?>/g, "\n") // Ersätter <br> med en ny rad
      .replace(/<\/?[^>]+(>|$)/g, "") // Tar bort övriga HTML-taggar
      .replace(/\n{2,}/g, "\n\n") // Säkerställer att det inte finns mer än två efterföljande radbrytningar
      .trim(); // Tar bort extra blanksteg i början och slutet
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

      //console.log(response.data);

      //Extrahera endast de specifika fälten från produkterna
      const products = response.data.map((product) => ({
         id: product.id,
         name: product.name,
         images: product.images.map((image) => image.src), // Array med bild-URL:er
         description: stripHtml(product.description),
         regular_price: product.regular_price,
         sale_price: product.sale_price,
         price: product.price,
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
         images: product.images.map((image) => image.src),
         description: stripHtml(product.description),
         regular_price: product.regular_price,
         sale_price: product.sale_price,
         price: product.price,
         stock_quantity: product.stock_quantity,
         stock_status: product.stock_status,
      };

      res.json(productData);
   } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
   }
});

// Route för att skapa en order
app.post("/api/orders", async (req, res) => {
   const { cart, billing, shipping } = req.body;

   try {
      // Validera varukorgen
      if (!cart || cart.length === 0) {
         return res.status(400).json({ message: "Cart is empty or invalid" });
      }

      // Formatera line_items baserat på varukorgsinnehåll
      const lineItems = cart.map((item) => ({
         product_id: item.id,
         quantity: item.quantity,
      }));

      // Standard billing/shipping data (om inget skickas)
      const defaultBilling = {
         first_name: "Placeholder",
         last_name: "Customer",
         address_1: "123 Main St",
         city: "Stockholm",
         state: "Stockholm",
         postcode: "12345",
         country: "SE",
         email: "placeholder@example.com",
         phone: "0701234567",
      };

      // Skapa orderdata
      const orderData = {
         payment_method: "woocommerce_payments",
         payment_method_title: "Credit Card / Debit Card",
         set_paid: false,
         billing: billing || defaultBilling,
         shipping: shipping || billing || defaultBilling,
         line_items: lineItems,
      };

      // Logga orderdata som skickas till WooCommerce
      // console.log(
      //    "Order data sent to WooCommerce:",
      //    JSON.stringify(orderData, null, 2)
      // );

      // Skicka orderdata till WooCommerce
      const response = await axios.post(
         `${process.env.WOOCOMMERCE_API_URL}orders`,
         orderData,
         {
            auth: {
               username: process.env.WOOCOMMERCE_CONSUMER_KEY,
               password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
            },
         }
      );
      // Få order och generera betalningslänk
      const order = response.data;
      const checkoutUrl = `${process.env.WOOCOMMERCE_STORE_URL}checkout/order-pay/${order.id}/?key=${order.order_key}`;
      // console.log(
      //    "WooCommerce Response:",
      //    JSON.stringify(response.data, null, 2)
      // );

      // console.log(
      //    "WooCommerce Response:",
      //    JSON.stringify(response.data, null, 2)
      // );
      // console.log("Generated Checkout URL:", checkoutUrl);

      // Returnera order och betalningslänk till frontend
      res.status(201).json({ order: response.data, checkoutUrl });
   } catch (error) {
      console.error(
         "Error creating order:",
         error.response?.data || error.message
      );
      res.status(error.response?.status || 500).json({
         message: "Error creating order",
         error: error.response?.data || "Unknown error",
      });
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
