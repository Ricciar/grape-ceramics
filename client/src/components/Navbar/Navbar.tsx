import React, { useState } from "react";
import CartIcon from "./CartIcon";
import CartPage from "../Cart/CartPage";

const Navbar: React.FC = () => {
   const [isCartOpen, setIsCartOpen] = useState(false);

   return (
      <nav className="mx-auto min-w-[319px] max-w-md flex justify-between items-center p-4 bg-[#F8F4EC]">
         {/* Logo */}
         <h1
            className="flex flex-col justify-center align-middle
       text-[24px] tracking-[4.37px]">
            GRAPE{" "}
            <span className="text-[14px] tracking-[2.66px]">
               <br />
               CERAMICS
            </span>
         </h1>
         {/* Cart Icon */}
         <button onClick={() => setIsCartOpen(true)}>
            <CartIcon />
         </button>

         {/* Cart Page */}
         <CartPage isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>
   );
};

export default Navbar;
