import React from 'react';
import useCart from '../Cart/UseCart';
import shoppingBagIcon from '../../assets/shoppingBagIcon.svg';
import shoppingBagIconGrey from '../../assets/shoppingBagIconGrey.svg';

// Typ för varukorgens objekt (anpassa efter din CartItem-typ i CartContext)
export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

const CartIcon: React.FC = () => {
  // Använd `useCart` hooken för att hämta varukorgens innehåll
  const { cart } = useCart();

  // Beräkna det totala antalet varor i varukorgen
  const totalItems = cart.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  return (
    <div className="relative flex items-center">
      {/* Varukorgsikon */}
      <div
        className="w-6 h-6 bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: `url(${shoppingBagIcon})`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundImage = `url(${shoppingBagIconGrey})`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundImage = `url(${shoppingBagIcon})`;
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundImage = `url(${shoppingBagIconGrey})`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundImage = `url(${shoppingBagIcon})`;
        }}
        role="button"
        tabIndex={0} // Gör elementet fokuserbart för tillgänglighet
        aria-label="Shopping bag"
      ></div>

      {/* Totalantalet varor */}
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[#272727] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
