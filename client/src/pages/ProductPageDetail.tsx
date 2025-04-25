import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import useCart from '../components/Cart/UseCart';
import { Product, ProductImages } from '../pages/shopgrid/types';

// Define the structure of an image from the API
// interface ProductImage {
//   id: number;
//   src: string; // The actual image URL
//   alt?: string;
//   name?: string;
// }

// Type for product data from the API
// interface Product {
//   id: number;
//   name: string;
//   images: ProductImage[]; // Array of image objects
//   description: string;
//   regular_price: string | null;
//   sale_price: string | null;
//   price: string;
//   stock_quantity: number | string;
//   stock_status: string;
//   short_description?: string;
//}

// Props for the image gallery - expecting string URLs
interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onImageClick: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentIndex,
  onImageClick,
}) => (
  <div className="flex mt-1 self-start space-x-1 overflow-x-auto">
    {images.map((image, index) => (
      <div
        key={index}
        className="relative min-w-[44px] h-11 cursor-pointer"
        onClick={() => onImageClick(index)}
      >
        <img
          src={image}
          alt={`Miniatyrbild ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {currentIndex === index && (
          <div className="absolute inset-0 bg-white opacity-50" />
        )}
      </div>
    ))}
  </div>
);

const ProductPageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Separate state for extracted image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    console.log('Current state of product:', product);
    console.log('Current state of imageUrls:', imageUrls);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);

        // Log the actual response for debugging
        console.log('Product fetched:', response.data);

        // Save the product data
        setProduct(response.data);

        if (response.data && Array.isArray(response.data.images)) {
          const urls = response.data.images.map(
            (img: ProductImages) => img.src
          );
          console.log('Extracted image URLs:', urls);
          setImageUrls(urls);
        }
      } catch (error) {
        console.error('Fel vid hämtning av produkt:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.images.length > 0) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0].src,
          quantity: 1,
          description: product.description,
        },
        1
      );
    }
  };

  if (loading || !product) return <p>Laddar...</p>;

  return (
    <div className="flex flex-col items-center mx-auto min-w-[319px] max-w-md pl-[1px] pr-[1px] pt-0">
      {/* Main image */}
      <div className="relative w-full h-[450px] overflow-hidden">
        {product.images.length > 0 && (
          <img
            src={product.images[currentImageIndex].src}
            alt={product.images[currentImageIndex].alt || product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Image gallery */}
      {imageUrls.length > 0 && (
        <ImageGallery
          images={imageUrls}
          currentIndex={currentImageIndex}
          onImageClick={setCurrentImageIndex}
        />
      )}

      {/* Product information */}
      <div className="flex flex-col items-center w-full max-w-[290px] font-light tracking-[2.85px]">
        <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mt-5">
          {product.name}
        </h1>

        <p className="text-[16px] mt-[5px] whitespace-pre-line">
          {product.description || 'Ingen beskrivning tillgänglig.'}
        </p>

        {/* Stock status and price */}
        <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
          <div className="flex items-center">
            {product.stock_status === 'instock' ? (
              <span>I lager {product.stock_quantity}st</span>
            ) : (
              <div className="flex self-end items-center justify-center">
                <span>Slut i lager</span>
                <span className="ml-2 w-3 h-3 bg-[#C65757] rounded-full"></span>
              </div>
            )}
          </div>

          <div className="text-right">
            {product.sale_price ? (
              <>
                <span className="text-sm line-through text-gray-400">
                  {product.regular_price} SEK
                </span>
                <br />
                <span className="text-sm ml-2">{product.price} SEK</span>
              </>
            ) : (
              <span className="text-[16px]">{product.price} SEK</span>
            )}
          </div>
        </div>

        {/* Action button */}
        <Button
          text={
            product.stock_status === 'instock'
              ? 'LÄGG I VARUKORG'
              : 'ORDERFÖRFRÅGAN'
          }
          className="w-[292px] h-[55px] mb-5"
          onClick={
            product.stock_status === 'instock'
              ? handleAddToCart
              : () => console.log('Orderförfrågan klickad')
          }
        />
      </div>
    </div>
  );
};

export default ProductPageDetail;
