import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
//import ProductPageDetail from './pages/ProductPageDetail';
import ShopGrid from './pages/ShopGrid';
import ProductDetail from './pages/ProductDetail/ProductDetail';

function App(): JSX.Element {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Home page - Product listing */}
          <Route path="/" element={<ShopGrid />} />

          {/* Route för produktsidan, med dynamisk produkt-ID */}
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
