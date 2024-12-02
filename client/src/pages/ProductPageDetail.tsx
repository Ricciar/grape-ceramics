import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import useCart from "../components/Cart/UseCart";

// Typ för produktdata som hämtas från API:t
interface Product {
   id: number;
   name: string;
   images: string[]; // Array av bild-URL:er
   description: string;
   regular_price: string | null;
   sale_price: string | null;
   price: string;
   stock_quantity: string;
   stock_status: string;
}

const ProductPageDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>(); // Hämta ID från URL
   const [product, setProduct] = useState<Product | null>(null);
   const { addToCart } = useCart(); // useCart-hooken för att komma åt addToCart
   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const response = await axios.get(`/api/products/${id}`); // Använd id från useParams
            console.log("Fetched product:", response.data);
            setProduct(response.data);
         } catch (error) {
            console.error("Error fetching product:", error);
         }
      };

      fetchProduct();
   }, [id]);

   if (!product) return <p>Loading...</p>;

   const handleImageClick = (index: number) => {
      setCurrentImageIndex(index);
   };

   const handleAddToCart = () => {
      if (product) {
         console.log("Adding to cart:", product.name);
         addToCart(
            {
               id: product.id,
               name: product.name,
               price: product.price,
               imageUrl: product.images[0] || "",
               quantity: 1,
               description: product.description,
            },
            1 // Detta är quantityChange
         );
         console.log("Product added to cart:", product.name);
      }
   };

   return (
      <div className="flex flex-col items-center mx-auto min-w-[319px] max-w-md pl-[1px] pr-[1px] pt-0">
         {/* Produktbild */}
         <div
            className="relative w-full h-[450px] overflow-hidden"
            style={{ marginLeft: "1px", marginRight: "1px" }}>
            <img
               src={product.images[currentImageIndex]}
               alt={product.name}
               className="w-full h-full object-cover"
            />
         </div>

         {/* Bildgalleri */}
         <div className="flex mt-[1px] self-start space-x-[1px]">
            {product.images.map((image, index) => (
               <div
                  key={index}
                  className="relative w-11 h-11 cursor-pointer"
                  onClick={() => handleImageClick(index)}>
                  <img
                     src={image}
                     alt={`Thumbnail ${index + 1}`}
                     className={`w-full h-full object-cover ${
                        currentImageIndex === index ? "opacity-50" : ""
                     }`}
                  />
                  {currentImageIndex === index && (
                     <div className="absolute inset-0 bg-white opacity-50"></div>
                  )}
               </div>
            ))}
         </div>

         {/* Produktnamn och beskrivning */}
         <div className="flex flex-col items-center w-full max-w-[290px] font-light tracking-[2.85px]">
            <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mt-5">
               {product.name}
            </h1>
            <p className="text-[16px] mt-[5px] whitespace-pre-line">
               {product.description || "Ingen beskrivning tillgänglig."}
            </p>

            {/* Pris och lagerstatus */}
            <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
               {/* Lagerstatus - Vänsterjusterad */}
               <div className="flex items-center">
                  {product.stock_status === "instock" ? (
                     <span className="">
                        I lager {product.stock_quantity}st
                     </span>
                  ) : (
                     <div className="flex self-end items-center justify-center">
                        <span className="">Slut i lager</span>
                        <span className="ml-2 w-3 h-3 bg-[#C65757] rounded-full"></span>
                     </div>
                  )}
               </div>

               {/* Pris - Högerjusterad */}
               <div className="text-right">
                  {product.sale_price ? (
                     <>
                        <span className="text-sm line-through text-gray-400">
                           {product.regular_price} SEK
                        </span>
                        <br />
                        <span className="text-sm ml-2">
                           {product.price} SEK
                        </span>
                     </>
                  ) : (
                     <span className="text-[16px]">{product.price} SEK</span>
                  )}
               </div>
            </div>
            {/* Knapp för "LÄGG I VARUKORG"eller "ORDERFÖRFRÅGAN" */}
            {product.stock_status === "instock" ? (
               <Button
                  text="LÄGG I VARUKORG"
                  className="w-[292px] h-[55px] mb-5"
                  onClick={handleAddToCart}
               />
            ) : (
               <Button
                  text="ORDERFÖRFRÅGAN"
                  className="w-[292px] h-[55px] mb-5"
                  onClick={() => console.log("Orderförfrågan klickad")}
               />
            )}
         </div>
      </div>
   );
};

export default ProductPageDetail;
