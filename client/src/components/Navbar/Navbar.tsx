import React, { useState, useEffect, useRef } from 'react';
import CartIcon from './CartIcon';
import CartPage from '../Cart/CartPage';
import NavMenu from './NavMenu';
import { Link } from 'react-router-dom';
import logotype from '../../assets/logotype.svg';

const Navbar: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);

  // Lyssna på förändringar i fönsterstorlek och beräkna navbarhöjd
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // Mät faktisk höjd på navbaren
      if (navbarRef.current) {
        // Beräkna en mindre höjd för att visa mer innehåll under
        // Du kan justera dessa värden för att få mer/mindre synligt innehåll
        const actualHeight = navbarRef.current.offsetHeight;
        const reducedHeight = newIsMobile ? actualHeight - 2 : actualHeight - 1;
        setSpacerHeight(Math.max(reducedHeight, 0)); // Säkerställ att vi inte får negativ höjd
      }
    };

    window.addEventListener('resize', handleResize);

    // Kör handleResize när komponenten mountas för initial beräkning
    setTimeout(handleResize, 100); // Kort timeout för att säkerställa att DOM har uppdaterats

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 w-full bg-[#F8F4EC] px-6 py-3 z-40 shadow-sm md:py-6"
      >
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
                <h1 className="flex flex-col justify-center items-center">
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
      </nav>

      {/* Dynamisk rymdhållare med justerad höjd för att visa mer innehåll */}
      <div style={{ width: '100%', height: `${spacerHeight}px` }}></div>

      {/* Cart Page */}
      <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
