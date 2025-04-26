import React, { useState } from 'react';
import CartIcon from './CartIcon';
import CartPage from '../Cart/CartPage';
import NavMenu from './NavMenu';

const Navbar: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="bg-[#F8F4EC]">
      <nav className="mx-auto w-[300px] min-w-[300px] md:w-full flex justify-between items-center p-1 px-4 md:px-4 lg:px-8 bg-[#F8F4EC]">
        {/* Hamburger Menu */}
        <div className="flex items-center">
          <NavMenu />
        </div>

        {/* Logo */}
        <h1 className="flex flex-col justify-center items-center leading-none">
          <span className="text-[20px] md:text-[23px] tracking-[4.37px]">
            GRAPE
          </span>
          <span className="text-[12px] md:text-[14px] tracking-[2.66px]">
            CERAMICS
          </span>
        </h1>

        {/* Cart Icon */}
        <div className="flex items-center">
          <button onClick={() => setIsCartOpen(true)} className="p-2">
            <CartIcon />
          </button>
        </div>

        {/* Cart Page */}
        <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>
    </div>
  );
};

export default Navbar;
