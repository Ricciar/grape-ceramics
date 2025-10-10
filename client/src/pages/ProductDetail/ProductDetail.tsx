// client/src/pages/ProductDetail/ProductDetail.tsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ProductSkeleton from "./ProductSkeleton";
import Button from "../../components/Button";
import useCart from "../../components/Cart/UseCart";
import { Product, ProductDetailProps } from "../shopgrid/types";
import OrderRequestModal from "./OrderRequestModal";

interface ExtendedProductDetailProps extends ProductDetailProps {
  isCourse?: boolean;
}

const SWIPE_THRESHOLD = 50;

const ProductDetail: React.FC<ExtendedProductDetailProps> = ({ onLoadingChange }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isOrderRequestModalOpen, setIsOrderRequestModalOpen] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isMounted = useRef(true);
  const { addToCart } = useCart();
  const [isCourse, setIsCourse] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        onLoadingChange?.(true);

        const response = await axios.get(`/api/products/${id}`, {
          signal: abortController.signal,
        });

        if (isMounted.current) {
          const fetchedProduct = response.data;
          setProduct(fetchedProduct);
          setCurrentImageIndex(0);

          const hasCourseCategory = (fetchedProduct.categories || []).some(
            (cat: any) =>
              cat.slug?.toLowerCase() === "kurser" ||
              cat.name?.toLowerCase() === "kurser"
          );
          setIsCourse(hasCourseCategory);
        }
      } catch (err) {
        if (!axios.isCancel(err) && isMounted.current) setError(true);
      } finally {
        if (isMounted.current) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    };

    if (id) fetchProduct();

    return () => {
      isMounted.current = false;
      abortController.abort("Component unmounted");
    };
  }, [id, onLoadingChange]);

  useEffect(() => {
    if (product?.name) document.title = `${product.name} | Grape Ceramics`;
    return () => {
      document.title = "Grape Ceramics";
    };
  }, [product]);

  if (loading || !product) return <ProductSkeleton />;
  if (error) return <p>Error fetching product</p>;

  const hasImages = product.images && product.images.length > 0;
  const multipleImages = hasImages && product.images.length > 1;

  const nextImage = () => {
    if (!multipleImages) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!multipleImages) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!multipleImages || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) prevImage();
    else if (deltaX < -SWIPE_THRESHOLD) nextImage();
    touchStartX.current = null;
  };

  return (
    <div className="p-[1px] max-w-6xl mx-auto px-[2px] mb-10">
      {/* Back-länk – behåll nuvarande stil */}
      <div className="pt-6 pb-2 md:pt-8 md:pb-2 z-10 relative">
        <Link
          to={isCourse ? "/kurser" : "/butik"}
          className="inline-block text-[#575757] hover:text-gray-900 transition-colors font-light tracking-[2.85px]"
        >
          ← {isCourse ? "Tillbaka till kurser" : "Tillbaka till butiken"}
        </Link>
      </div>

      <div className="mt-0 flex flex-col items-center lg:flex-row lg:items-start lg:justify-between lg:gap-16 mb-10">
        {/* ---------- BILDER ---------- */}
        <div className="w-full lg:max-w-[600px] flex flex-col mt-0">
          {hasImages ? (
            <>
              <div
                className="relative w-full h-[450px] lg:h-[645px] overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={product.images[currentImageIndex].src}
                  alt={product.images[currentImageIndex].alt || product.name}
                  className="w-full h-full object-cover"
                />

                {multipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white px-3 py-2"
                      aria-label="Föregående bild"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white px-3 py-2"
                      aria-label="Nästa bild"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex mt-4 space-x-2 overflow-x-auto mb-10">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.src}
                      alt={img.alt || `Image ${idx + 1}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 object-cover cursor-pointer border ${
                        currentImageIndex === idx
                          ? "border-gray-600"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[450px] lg:h-[645px] bg-gray-200 flex items-center justify-center">
              <span>No image available</span>
            </div>
          )}
        </div>

        {/* ---------- INFO ---------- */}
        <div className="flex flex-col items-center w-full lg:max-w-[600px] lg:items-start font-light">
          {/* Rubrik – behåll samma look som idag */}
          <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mt-5">
            {product.name}
          </h1>

          {/* Brödtext – Rubik 300 */}
          <p className="text-[16px] mt-[5px] whitespace-pre-line font-[300] font-['Rubik'] tracking-normal leading-relaxed">
            {product.description || "Ingen beskrivning tillgänglig."}
          </p>

          <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
            <div className="flex items-center">
              {product.stock_status === "instock" ? (
                <span>
                  I lager{" "}
                  {product.stock_quantity !== null
                    ? `${product.stock_quantity}`
                    : ""}{" "}
                  st
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
              product.stock_status === "instock"
                ? addedToCart
                  ? "TILLAGD I VARUKORG"
                  : "LÄGG I VARUKORG"
                : "ORDERFÖRFRÅGAN"
            }
            className="w-[292px] h-[55px] mb-5"
            onClick={() => {
              if (product.stock_status === "instock") {
                const primaryImage =
                  product.images.length > 0 ? product.images[0].src : "";
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
    </div>
  );
};

export default ProductDetail;
