import { useContext } from "react";
import { CartContext, CartContextType } from "./CartContext";

// Anpassad hook för att använda varukorgen
const useCart = (): CartContextType => {
   const context = useContext(CartContext);
   if (!context) {
      throw new Error("useCart måste användas inom en CartProvider");
   }
   return context;
};

export default useCart;

// NOTE: useContext är en inbyggd React-hook som används för att hämta det aktuella värdet av en kontext.
