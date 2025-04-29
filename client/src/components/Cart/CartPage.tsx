import React, { useState, useEffect } from 'react';
import { CartItem } from '../Cart/CartContext';
import useCart from '../Cart/UseCart';
import closeicon from '../../assets/closeicon.svg';
import CheckoutRedirect from './CheckoutRedirect';

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart } = useCart();
  // Lägger till tillstånd för animationen
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Beräkna totalsumman av varukorgen
  const totalPrice: number = cart.reduce(
    (sum: number, item: CartItem) =>
      sum + parseFloat(item.price.toString()) * item.quantity,
    0
  );

  // Hantera öppning och stängning av varukorgen med animering
  useEffect(() => {
    if (isOpen) {
      // Steg 1: Visa elementet
      setIsAnimating(true);
      setIsVisible(false);

      // Steg 2: Kort fördröjning för att säkerställa att DOM har uppdaterats
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      return () => clearTimeout(showTimer);
    } else if (isAnimating) {
      // Steg 1: Starta utgångsanimation
      setIsVisible(false);

      // Steg 2: Vänta tills animationen är klar
      const hideTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      return () => clearTimeout(hideTimer);
    }
  }, [isOpen, isAnimating]);

  // Returnera null om komponenten inte ska renderas
  if (!isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Bakgrundsöverlappning */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{ opacity: isVisible ? 0.5 : 0 }}
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      ></div>

      {/* Varukorgen */}
      <div
        className="relative w-full bg-white shadow-lg transform flex flex-col"
        style={{
          maxHeight: '85vh',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.6s cubic-bezier(0.61, 1, 0.88, 1)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Drag indicator */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header med stängningsknapp */}
        <div className="flex justify-between items-center px-4 py-2">
          <h2 id="cart-title" className="text-lg font-light tracking-[2.85px]">
            VARUKORG
          </h2>
          <button
            onClick={onClose}
            className="p-2"
            aria-label="Stäng varukorgen"
          >
            <img
              src={closeicon}
              alt="Close"
              className="w-6 h-6 transition-all duration-500 group-hover:opacity-75 group-focus:opacity-75"
            />
          </button>
        </div>

        {/* Innehåll */}
        <div
          className="p-4 overflow-y-auto flex-grow"
          style={{ maxHeight: 'calc(85vh - 120px)' }}
        >
          {/* Check if cart is empty */}
          {cart.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-[#afb0b5] text-lg">Din varukorg är tom</p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="flex flex-col space-y-6">
                {cart.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-gray-300 pb-4"
                  >
                    {/* Image */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover mr-4"
                    />

                    {/* Product details */}
                    <div className="flex-grow flex flex-col justify-between h-full">
                      <h3 className="text-lg font-extralight">{item.name}</h3>
                      {/* <p className="text-black">{item.description}</p> */}

                      {/* Quantity controls */}
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            addToCart(item, -1);
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            addToCart(item, 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex flex-col justify-between items-end h-full">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs mb-2"
                      >
                        TA BORT
                      </button>
                      <p className="">{item.price} SEK</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Total price and checkout button (visas endast om varukorgen inte är tom) */}
        {cart.length > 0 && (
          <div className="px-4 py-4 border-t-2 border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-sm uppercase tracking-wider">Summa</span>
              <span className="text-lg">{totalPrice.toFixed(2)} SEK</span>
            </div>
            <CheckoutRedirect
              cart={cart}
              checkoutUrl="https://grapeceramics.se/checkout"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CartPage);
