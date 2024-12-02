import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
   id: number;
   name: string;
   images: string[];
   regular_price: string;
   sale_price: string | null;
   price: string;
}

const ShopGrid: React.FC = () => {
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await axios.get("/api/products");
            setProducts(response.data);
         } catch (error) {
            console.error("Error fetching products:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchProducts();
   }, []);

   const handleProductClick = (productId: number) => {
      navigate(`/product/${productId}`); // Navigera till produktdetaljsidan
   };

   const capitalizeFirstLetter = (name: string) => {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
   };

   if (loading) return <p>Loading...</p>;

   return (
      <div className="p-[1px]">
         {/* Filterikon */}
         <div className="flex ml-[50px]">
            <button className="p-3">
               <img
                  src="../src/assets/filtericon.svg"
                  alt="Filter"
                  className="w-6 h-6"
               />
            </button>
         </div>

         {/* Produktgrid */}
         <div className="grid grid-cols-2 gap-[1px]">
            {products.map((product) => (
               <div
                  key={product.id}
                  className="cursor-pointer"
                  onClick={() => handleProductClick(product.id)}>
                  {/* Produktbild */}
                  <div className="w-full h-[257px] bg-gray-100 overflow-hidden">
                     <img
                        src={product.images.at(0)} // Visa första bilden
                        alt={product.name}
                        className="w-full h-full object-cover"
                     />
                  </div>
                  {/* Produktnamn och pris */}
                  <div className="mt-2 ml-3 flex flex-col justify-between">
                     <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
                        {capitalizeFirstLetter(product.name)}
                     </span>
                     <div className="flex text-right font-light mr-2 mt-2 mb-2">
                        {product.sale_price ? (
                           <>
                              <span className="text-xs line-through text-gray-400">
                                 {product.regular_price} SEK
                              </span>
                              <br />
                              <span className="text-xs ml-2">
                                 {product.price} SEK
                              </span>
                           </>
                        ) : (
                           <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
                              {product.price} SEK
                           </span>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ShopGrid;
