import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import useCart from '../components/Cart/UseCart';

// Typ för produktdata som hämtas från API:et
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

// Props för bildgalleriet
interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onImageClick: (index: number) => void;
}

// const ProductSkeleton: React.FC = () => (
//    <div className="animate-pulse flex flex-col items-center mx-auto min-w-[319px] max-w-md pl-[1px] pr-[1px] pt-0">
//       {/* Huvudbild skeleton */}
//       <div className="w-full h-[450px] bg-gray-200" />

//       {/* Miniatyrbilder skeleton */}
//       <div className="flex mt-1 self-start space-x-1">
//          {[1, 2, 3].map((i) => (
//             <div key={i} className="w-11 h-11 bg-gray-200" />
//          ))}
//       </div>

//       {/* Produktinfo skeleton */}
//       <div className="flex flex-col items-center w-full max-w-[290px] mt-5">
//          {/* Titel skeleton */}
//          <div className="w-3/4 h-6 bg-gray-200 mb-4" />

//          {/* Beskrivning skeleton */}
//          <div className="w-full h-20 bg-gray-200" />

//          {/* Pris och lager skeleton */}
//          <div className="w-full h-[65px] flex justify-between mt-4">
//             <div className="w-1/3 h-4 bg-gray-200" />
//             <div className="w-1/4 h-4 bg-gray-200" />
//          </div>

//          {/* Knapp skeleton */}
//          <div className="w-[292px] h-[55px] bg-gray-200 mt-4 mb-5" />
//       </div>
//    </div>
// );

// Bildgalleri-komponent

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
  const { id } = useParams<{ id: string }>(); // Hämta ID från URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Använd useCart-hooken för att komma åt addToCart
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
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

  // Hantera tillägg i varukorgen
  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0] || '',
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
      {/* Huvudbild */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bildgalleri */}
      <ImageGallery
        images={product.images}
        currentIndex={currentImageIndex}
        onImageClick={setCurrentImageIndex}
      />

      {/* Produktinformation */}
      <div className="flex flex-col items-center w-full max-w-[290px] font-light tracking-[2.85px]">
        <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mt-5">
          {product.name}
        </h1>

        <p className="text-[16px] mt-[5px] whitespace-pre-line">
          {product.description || 'Ingen beskrivning tillgänglig.'}
        </p>

        {/* Lagerstatus och pris */}
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

        {/* Handlingsknapp */}
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
