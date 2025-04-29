import React from 'react';
import useCart from '../Cart/UseCart';
import shoppingBagIcon from '../../assets/shoppingBagIcon.svg';
import shoppingBagIconGrey from '../../assets/shoppingBagIconGrey.svg';
import { CartItem } from '../Cart/CartContext';

const CartIcon: React.FC = () => {
  const { cart } = useCart();

  const totalItems = cart.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  return (
    <div className="relative flex items-center">
      {/* Varukorgsikon */}
      <img
        src={shoppingBagIcon}
        alt="Shopping bag"
        className="w-6 h-6 object-contain"
        onMouseEnter={(e) => {
          e.currentTarget.src = shoppingBagIconGrey;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.src = shoppingBagIcon;
        }}
        role="button"
        tabIndex={0}
        aria-label="Shopping bag"
      />

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
