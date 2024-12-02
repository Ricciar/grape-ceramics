import React from "react";
import Button from "../Button";
import axios from "axios";
import { CartItem } from "../Navbar/CartIcon";

interface CheckoutRedirectProps {
   cart: CartItem[];
}

const CheckoutRedirect: React.FC<CheckoutRedirectProps> = ({ cart }) => {
   const handleRedirect = async () => {
      try {
         console.log("Sending cart data to /api/orders:", cart);

         // Skicka POST-begäran till backend för att skapa en order
         const response = await axios.post("/api/orders", {
            cart,
            payment_method: "woocommerce_payments",
            payment_method_title: "Credit Card / Debit Card",
         });

         // Hämta checkoutUrl från backend-responsen
         const { checkoutUrl } = response.data;

         if (checkoutUrl) {
            console.log("Redirecting to WooCommerce checkout:", checkoutUrl);
            // Dirigera användaren till checkout
            window.location.href = checkoutUrl;
         } else {
            console.error("No checkoutUrl received from backend.");
            alert("Ett fel inträffade när checkout-URL skulle hämtas.");
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            console.error(
               "Axios error:",
               error.response?.data || error.message
            );
            alert(
               `Något gick fel: ${
                  error.response?.data?.message || error.message
               }`
            );
         } else {
            console.error("Unknown error:", error);
            alert("Ett oväntat fel inträffade. Försök igen senare.");
         }
      }
   };

   return (
      <Button
         text="GÅ TILL KASSAN"
         onClick={handleRedirect}
         className="w-full bg-[#272727] text-white py-3 uppercase tracking-widest hover:bg-opacity-90 focus:outline-none"
      />
   );
};

export default CheckoutRedirect;
