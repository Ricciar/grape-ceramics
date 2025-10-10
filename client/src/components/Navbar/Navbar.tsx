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

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      if (navbarRef.current) {
        const actualHeight = navbarRef.current.offsetHeight;
        const reducedHeight = newIsMobile ? actualHeight - 2 : actualHeight - 1;
        setSpacerHeight(Math.max(reducedHeight, 0));
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav
        ref={navbarRef}
        role="navigation"
        aria-label="Huvudnavigation"
        className="fixed top-0 left-0 right-0 w-full bg-[#F8F4EC] px-0 py-3 z-40 shadow-sm md:py-6"
      >
        {/* Samma container som sidorna */}
        <div className="mx-auto w-full max-w-6xl px-[2px] flex items-center justify-between font-sans">
          {/* Vänster del */}
          <div className="flex-1 md:pl-0 pl-3">
            <div className="md:hidden">
              <NavMenu />
            </div>

            <div className="hidden md:flex space-x-8 md:text-[16px]">
              <Link to="/butik" className="text-black tracking-widest hover:text-gray-600">
                BUTIK
              </Link>
              <Link to="/kurser" className="text-black tracking-widest hover:text-gray-600">
                KURSER
              </Link>
              <Link to="/kontakt" className="text-black tracking-widest hover:text-gray-600">
                KONTAKT
              </Link>
              <Link to="/faq" className="text-black tracking-widest hover:text-gray-600">
                FAQ
              </Link>
            </div>
          </div>

          {/* Logo i mitten */}
          <div className="flex-1 flex justify-center items-center">
            <Link to="/" className="text-center" aria-label="Till startsidan" title="Grape Ceramics Startsida">
              {isMobile ? (
                <h1 className="flex flex-col justify-center items-center">
                  <span className="text-[20px] tracking-[4.37px]">GRAPE</span>
                  <span className="text-[12px] tracking-[2.66px] -mt-1">CERAMICS</span>
                </h1>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-2">
                    <img src={logotype} alt="Grape Ceramics Logo" className="h-10 w-auto" />
                  </div>
                  {/* Med mellanslag */}
                  <div className="text-xl tracking-widest">GRAPE CERAMICS</div>
                </div>
              )}
            </Link>
          </div>

          {/* Kundvagn till höger */}
          <div className="flex-1 flex justify-end md:pr-0 pr-3">
            <button onClick={() => setIsCartOpen(true)} className="p-2" aria-label="Öppna kundvagn">
              <CartIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ width: '100%', height: `${spacerHeight}px` }} />

      {/* Cart Page */}
      <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
