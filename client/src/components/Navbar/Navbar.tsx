import React, { useState, useEffect, useRef } from 'react';
import CartIcon from './CartIcon';
import CartPage from '../Cart/CartPage';
import NavMenu from './NavMenu';
import { Link } from 'react-router-dom';
import logotype from '../../assets/logotype.svg';

const Navbar: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (navbarRef.current) {
        const actualHeight = navbarRef.current.offsetHeight;
        const reducedHeight = window.innerWidth < 768 ? actualHeight - 2 : actualHeight - 1;
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
        <div className="mx-auto w-full max-w-6xl px-[2px] font-sans">
          {/* ===== MOBILE ===== */}
          <div className="md:hidden grid grid-cols-[auto_1fr_auto] items-center">
            <div className="pl-3">
              <NavMenu />
            </div>

            <Link to="/" className="justify-self-center text-center" aria-label="Till startsidan" title="Grape Ceramics Startsida">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-1">
                  <img src={logotype} alt="Grape Ceramics Logo" className="h-8 w-auto" />
                </div>
                <div className="text-[13px] tracking-[2.66px] uppercase">GRAPE CERAMICS</div>
              </div>
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="p-2 pr-3 justify-self-end" aria-label="Öppna kundvagn">
              <CartIcon />
            </button>
          </div>

          {/* ===== DESKTOP ===== */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center relative">
            {/* Vänster meny (lämna layouten som du är nöjd med) */}
            <div className="justify-self-stretch flex justify-start gap-8">
              <Link to="/butik" className="text-black tracking-widest hover:text-gray-600">BUTIK</Link>
              <Link to="/kurser" className="text-black tracking-widest hover:text-gray-600">KURSER</Link>
              <Link to="/bestallning" className="text-black tracking-widest hover:text-gray-600">BESTÄLLNING</Link>
              <Link to="/kontakt" className="text-black tracking-widest hover:text-gray-600">OM&nbsp;MIG</Link>
            </div>

            {/* Mitten: logo + text */}
            <Link to="/" className="justify-self-center text-center" aria-label="Till startsidan" title="Grape Ceramics Startsida">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2">
                  <img src={logotype} alt="Grape Ceramics Logo" className="h-10 w-auto" />
                </div>
                <div className="text-xl tracking-widest">GRAPE CERAMICS</div>
              </div>
            </Link>

            {/* Höger: varukorg (långt ut till höger) */}
            <div className="flex justify-end">
              <button onClick={() => setIsCartOpen(true)} className="p-2 md:pr-0" aria-label="Öppna kundvagn">
                <CartIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer för fixed-nav */}
      <div style={{ width: '100%', height: `${spacerHeight}px` }} />

      <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
