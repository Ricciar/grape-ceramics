import React from "react";
import { CartItem } from "../Cart/CartContext";
import useCart from "../Cart/UseCart";
import closeicon from "../../assets/closeicon.svg";
import CheckoutRedirect from "./CheckoutRedirect";

interface CartPageProps {
   isOpen: boolean;
   onClose: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ isOpen, onClose }) => {
   const { cart, removeFromCart, addToCart } = useCart();

   // Beräkna totalsumman av varukorgen
   const totalPrice = cart.reduce(
      (sum: number, item: CartItem) =>
         sum + parseFloat(item.price) * item.quantity,
      0
   );

   if (!isOpen) return null;

   return (
      <div
         className={`fixed inset-0 bg-white z-50 flex flex-col p-4 transition-transform transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
         }`}>
         {/* Close button */}
         <button onClick={onClose} className="self-end group">
            <img
               src={closeicon}
               alt="Close"
               className="w-6 h-6 transition-all duration-500 group-hover:opacity-75 group-focus:opacity-75"
            />
         </button>

         {/* Check if cart is empty */}
         {cart.length === 0 ? (
            <div className="flex justify-center items-center h-full">
               <p className="text-[#afb0b5] text-lg">Din varukorg är tom</p>
            </div>
         ) : (
            <>
               {/* Cart items */}
               <div className="flex flex-col space-y-6 mt-4">
                  {cart.map((item: CartItem) => (
                     <div
                        key={item.id}
                        className="flex items-center border-b border-gray-300 pb-4">
                        {/* Image */}
                        <img
                           src={item.imageUrl}
                           alt={item.name}
                           className="w-20 h-20 object-cover mr-4"
                        />

                        {/* Product details */}
                        <div className="flex-grow flex flex-col justify-between h-full">
                           <h3 className="text-lg font-extralight">
                              {item.name}
                           </h3>
                           {/* <p className="text-black">{item.description}</p> */}

                           {/* Quantity controls */}
                           <div className="flex items-center mt-2 space-x-2">
                              <button
                                 onClick={(event) => {
                                    event.stopPropagation();
                                    addToCart(item, -1);
                                 }}>
                                 -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                 onClick={(event) => {
                                    event.stopPropagation();
                                    addToCart(item, 1);
                                 }}>
                                 +
                              </button>
                           </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex flex-col justify-between items-end h-full">
                           <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs mb-2">
                              TA BORT
                           </button>
                           <p className="">{item.price} SEK</p>
                        </div>
                     </div>
                  ))}
               </div>
               {/* Total price and checkout button */}
               <div className="mt-4 border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm uppercase tracking-wider">
                        Summa
                     </span>
                     <span className="text-lg">
                        {totalPrice.toFixed(2)} SEK
                     </span>
                  </div>
                  <CheckoutRedirect
                     cart={cart}
                     checkoutUrl="https://grapeceramics.se/checkout"
                  />
                  {/* <Button
                     text="GÅ TILL KASSAN"
                     onClick={redirectToCheckout}
                     className="w-full mt-4 bg-[#272727] text-white py-3 uppercase tracking-widest hover:bg-opacity-90 focus:outline-none"
                  /> */}
               </div>
            </>
         )}
      </div>
   );
};

export default React.memo(CartPage);
