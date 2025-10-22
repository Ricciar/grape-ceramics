import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CartProvider } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const CoursesPage = lazy(() => import('./pages/Courses/CoursesPage'));
const ShopGrid1 = lazy(() => import('./pages/shopgrid/ShopGrid1'));
const ProductWrapper = lazy(() => import('./pages/ProductWrapper'));
const ContactPage = lazy(() => import('./pages/Contact/ContactPage'));
const BestallningPage = lazy(() => import('./pages/Bestallning/BestallningPage'));

function App(): JSX.Element {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main>
          <Suspense fallback={<div style={{ padding: 16, textAlign: 'center' }}>Laddar…</div>}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/kurser" element={<CoursesPage />} />
              <Route path="/butik" element={<ShopGrid1 />} />
              <Route path="/product/:id" element={<ProductWrapper />} />
              <Route path="/kurs/:id" element={<ProductWrapper />} />
              <Route path="/kontakt" element={<ContactPage />} />
              <Route path="/bestallning" element={<BestallningPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
