import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
import CoursesPage from './pages/Courses/CoursesPage';
import ProductWrapper from './pages/ProductWrapper';
import MainPage from './pages/MainPage/MainPage';
import ShopGrid1 from './pages/shopgrid/ShopGrid1';
import ContactPage from './pages/Contact/ContactPage';
import Footer from './components/Footer/Footer';
import FAQPage from './pages/FAQ/FAQPage';

function App(): JSX.Element {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/kurser" element={<CoursesPage />} />
            <Route path="/butik" element={<ShopGrid1 />} />
            <Route path="/product/:id" element={<ProductWrapper />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
