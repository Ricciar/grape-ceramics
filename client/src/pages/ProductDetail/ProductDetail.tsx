import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductSkeleton from './ProductSkeleton';
import ImageGallery from './ImageGallery';
import Button from '../../components/Button';
import useCart from '../../components/Cart/UseCart';
import { Product, ProductDetailProps } from '../shopgrid/types';
import OrderRequestModal from './OrderRequestModal';

interface ExtendedProductDetailProps extends ProductDetailProps {
  isCourse?: boolean;
}

const ProductDetail: React.FC<ExtendedProductDetailProps> = ({ onLoadingChange, isCourse = false }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrderRequestModalOpen, setIsOrderRequestModalOpen] = useState(false);

  const isMounted = useRef(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (onLoadingChange) onLoadingChange(true);

        const response = await axios.get(`/api/products/${id}`, {
          signal: abortController.signal,
        });

        if (isMounted.current) {
          setProduct(response.data);
        }
      } catch (error) {
        if (!axios.isCancel(error) && isMounted.current) {
          setError(true);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      isMounted.current = false;
      abortController.abort('Component unmounted');
    };
  }, [id, onLoadingChange]);

  useEffect(() => {
    if (product && product.name) {
      document.title = `${product.name} | Grape Ceramics`;
    } else if (isCourse) {
      document.title = `Kurs | Grape Ceramics`;
    }

    return () => {
      document.title = 'Grape Ceramics';
    };
  }, [product, isCourse]);

  if (loading || !product) return <ProductSkeleton />;
  if (error) return <p>Error fetching product</p>;

  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images[currentImageIndex] : null;

  return (
    <>
      <div className="flex flex-col items-center lg:flex-row lg:justify-around lg:gap-[11rem] mb-[1px]">
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="relative w-full lg:w-[600px] h-[450px] lg:h-[645px] overflow-hidden">
            {currentImage ? (
              <img
                src={currentImage.src}
                alt={currentImage.alt || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span>No image available</span>
              </div>
            )}
          </div>

          {hasImages && (
            <ImageGallery
              images={product.images.map((img) => img.src)}
              currentIndex={currentImageIndex}
              onImageClick={setCurrentImageIndex}
            />
          )}
        </div>

        <div className="flex flex-col items-center w-full lg:w-1/2 lg:items-start max-w-[290px] lg:max-w-none font-light tracking-[2.85px]">
          <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mt-5">
            {product.name}
          </h1>

          <p className="text-[16px] mt-[5px] whitespace-pre-line">
            {product.description || 'Ingen beskrivning tillgänglig.'}
          </p>

          <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
            <div className="flex items-center">
              {product.stock_status === 'instock' ? (
                <span>
                  I lager {product.stock_quantity !== null ? `${product.stock_quantity}` : ''} st
                </span>
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

          <Button
            text={
              product.stock_status === 'instock'
                ? addedToCart
                  ? 'TILLAGD I VARUKORG'
                  : 'LÄGG I VARUKORG'
                : 'ORDERFÖRFRÅGAN'
            }
            className="w-[292px] h-[55px] mb-5"
            onClick={() => {
              if (product.stock_status === 'instock') {
                const primaryImage = product.images.length > 0 ? product.images[0].src : '';
                addToCart(
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: primaryImage,
                    quantity: 1,
                    description: product.description,
                  },
                  1
                );
                setAddedToCart(true);
                setTimeout(() => {
                  if (isMounted.current) setAddedToCart(false);
                }, 2000);
              } else {
                setIsOrderRequestModalOpen(true);
              }
            }}
          />
        </div>
      </div>

      <OrderRequestModal
        isOpen={isOrderRequestModalOpen}
        onClose={() => setIsOrderRequestModalOpen(false)}
      />
    </>
  );
};

export default ProductDetail;
