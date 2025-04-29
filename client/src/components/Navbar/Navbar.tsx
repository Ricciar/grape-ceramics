import React, { useState, useEffect } from 'react';
import CartIcon from './CartIcon';
import CartPage from '../Cart/CartPage';
import NavMenu from './NavMenu';
import { Link } from 'react-router-dom';
import logotype from '../../assets/logotype.svg';

const Navbar: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Lyssna på förändringar i fönsterstorlek
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full bg-[#F8F4EC] px-4 py-4 z-40 shadow-sm md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Vänster del - hamburgermenyn på mobil, länkarna på desktop */}
          <div className="flex-1">
            {/* Hamburgermenyn - bara synlig på mobil */}
            <div className="md:hidden">
              <NavMenu />
            </div>

            {/* Navigationslänkar - bara synliga på desktop */}
            <div className="hidden md:flex space-x-8 md:text-[16px]">
              <Link
                to="/butik"
                className="text-black tracking-widest hover:text-gray-600"
              >
                BUTIK
              </Link>
              <Link
                to="/kurser"
                className="text-black tracking-widest hover:text-gray-600"
              >
                KURSER
              </Link>
              <Link
                to="/kontakt"
                className="text-black tracking-widest hover:text-gray-600"
              >
                KONTAKT
              </Link>
            </div>
          </div>

          {/* Logo i mitten */}
          <div className="flex-1 flex justify-center items-center">
            <Link to="/" className="text-center">
              {isMobile ? (
                // Mobil-version av logotypen
                <h1 className="flex flex-col justify-center items-center leading-none">
                  <span className="text-[20px] tracking-[4.37px]">GRAPE</span>
                  <span className="text-[12px] tracking-[2.66px] -mt-1">
                    CERAMICS
                  </span>
                </h1>
              ) : (
                // Desktop-version av logotypen (som på bilden)
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-2">
                    <img
                      src={logotype}
                      alt="Grape Ceramics Logo"
                      className="h-10 w-auto"
                    />
                  </div>
                  <div className="text-xl tracking-widest">GRAPECERAMICS</div>
                </div>
              )}
            </Link>
          </div>

          {/* Kundvagnsikon till höger */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2"
              aria-label="Open cart"
            >
              <CartIcon />
            </button>
          </div>
        </div>

        {/* Cart Page */}
        <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>

      <div className={`w-full ${isMobile ? 'h-16' : 'h-28'}`}></div>
    </>
  );
};

export default Navbar;
