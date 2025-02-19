import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductSkeleton from './ProductSkeleton';
import ImageGallery from './ImageGallery';
import Button from '../../components/Button';
import useCart from '../../components/Cart/UseCart';
import { Product } from './types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        console.log('Product fetched:', response.data);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(true);
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

  if (loading || !product) return <ProductSkeleton />;
  if (error) return <p>Error fetching product</p>;

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

export default ProductDetail;
