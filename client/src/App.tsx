import "./App.css";
import { CartProvider } from "./components/Cart/CartContext";
import Navbar from "./components/Navbar/Navbar";
import ProductPageDetail from "./pages/ProductPageDetail";
import ShopGrid from "./pages/ShopGrid";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
   return (
      <CartProvider>
         <Router>
            <Navbar />
            <Routes>
               {/* Route för produktlistan */}
               <Route path="/" element={<ShopGrid />} />

               {/* Route för produktsidan, med dynamisk produkt-ID */}
               <Route path="/product/:id" element={<ProductPageDetail />} />
            </Routes>
         </Router>
      </CartProvider>
   );
}

export default App;
