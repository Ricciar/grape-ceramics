import "./App.css";
import { CartProvider } from "./components/Cart/CartContext";
import ProductPageDetail from "./pages/ProductPageDetail";
import Navbar from "./components/Navbar/Navbar";

function App() {
   return (
      <CartProvider>
         <Navbar />
         <ProductPageDetail productId={80} />
         {/* Andra komponenter i appen som ska kunna komma åt varukorgen */}
      </CartProvider>
   );
}

export default App;
