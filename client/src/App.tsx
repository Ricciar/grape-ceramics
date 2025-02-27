import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
import ShopGrid from './pages/ShopGrid';
import ProductWrapper from './pages/ProductWrapper';

function App(): JSX.Element {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} */}

          {/* Redirect från home till shop */}
          <Route path="/" element={<Navigate to="/shop" replace />} />

          {/* Shop page - Product listing */}
          <Route path="/shop" element={<ShopGrid />} />

          {/* Route för produktsidan, med dynamisk produkt-ID */}
          <Route path="/product/:id" element={<ProductWrapper />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
