import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Navigate,
} from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
//import ShopGrid from './pages/shopgrid/ShopGrid';
import ProductWrapper from './pages/ProductWrapper';
import MainPage from './pages/MainPage/MainPage';
import ShopGrid1 from './pages/shopgrid/ShopGrid1';
import ContactPage from './pages/Contact/ContactPage';

function App(): JSX.Element {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Route för startsidan */}
          <Route path="/" element={<MainPage />} />

          {/* Route för kurser */}
          {/* <Route path="/kurser" element={<CoursesPage />} /> */}

          {/* Route för butik */}
          <Route path="/butik" element={<ShopGrid1 />} />

          {/* Route för produktsidan */}
          <Route path="/product/:id" element={<ProductWrapper />} />

          {/* Route för kontakt */}
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
