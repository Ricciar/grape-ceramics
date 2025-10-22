// client/src/pages/ProductDetail/ProductDetail.tsx
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ProductSkeleton from "./ProductSkeleton";
import Button from "../../components/Button";
import useCart from "../../components/Cart/UseCart";
import { Product, ProductDetailProps } from "../shopgrid/types";
import OrderRequestModal from "./OrderRequestModal";
import { getCached, setCached } from "../../utils/cache";

interface ExtendedProductDetailProps extends ProductDetailProps {
  isCourse?: boolean;
}

const SCROLL_TOP_DELAY_MS = 0;
const SWIPE_THRESHOLD = 50;
const TTL_MS = 5 * 60_000; // 5 min cache

/** Tunn, baseline-alignad externlänk-ikon (↗︎) */
const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.1}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3.75" y="8.25" width="12" height="12" rx="2" />
    <path d="M12 12 L20 4" />
    <path d="M20 4 L20 10" />
    <path d="M20 4 L14 4" />
  </svg>
);

const ProductDetail: React.FC<ExtendedProductDetailProps> = ({ onLoadingChange }) => {
  const { id } = useParams<{ id: string }>();
  const cacheKey = useMemo(() => (id ? `product:${id}` : ""), [id]);

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

  // Scrolla alltid till toppen när vi går in på en produkt/kurs
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, SCROLL_TOP_DELAY_MS);
    return () => clearTimeout(t);
  }, [id]);

  // Hämta produkt – med sessionStorage-cache (snabb first-paint), sedan uppdatera i bakgrunden
  useEffect(() => {
    if (!id) return;
    isMounted.current = true;

    const abortController = new AbortController();

    const run = async () => {
      try {
        setLoading(true);
        onLoadingChange?.(true);

        // 1) Hydrera från cache om den finns (snabbare visning vid back/forward)
        if (cacheKey) {
          const cached = getCached<Product>(cacheKey, TTL_MS);
          if (cached) {
            setProduct(cached);
            setCurrentImageIndex(0);
            const hasCourseCategory = (cached.categories || []).some(
              (cat: any) =>
                cat.slug?.toLowerCase() === "kurser" ||
                cat.name?.toLowerCase() === "kurser"
            );
            setIsCourse(hasCourseCategory);
          }
        }

        // 2) Hämta färsk data
        const response = await axios.get(`/api/products/${id}`, {
          signal: abortController.signal,
        });

        if (!isMounted.current) return;

        const fetchedProduct = response.data as Product;
        setProduct(fetchedProduct);
        setCached(cacheKey, fetchedProduct);
        setCurrentImageIndex(0);

        const hasCourseCategory = (fetchedProduct.categories || []).some(
          (cat: any) =>
            cat.slug?.toLowerCase() === "kurser" ||
            cat.name?.toLowerCase() === "kurser"
        );
        setIsCourse(hasCourseCategory);
      } catch (err) {
        if (!axios.isCancel(err) && isMounted.current) setError(true);
      } finally {
        if (isMounted.current) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    };

    run();

    return () => {
      isMounted.current = false;
      abortController.abort("Component unmounted");
    };
  }, [id, onLoadingChange, cacheKey]);

  // Dokumenttitel
  useEffect(() => {
    if (product?.name) document.title = `${product.name} | Grape Ceramics`;
    return () => {
      document.title = "Grape Ceramics";
    };
  }, [product]);

  // Bildnavigering
  const multipleImages = !!product?.images && product.images.length > 1;

  const nextImage = useCallback(() => {
    if (!product?.images || !multipleImages) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  }, [product?.images, multipleImages]);

  const prevImage = useCallback(() => {
    if (!product?.images || !multipleImages) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  }, [product?.images, multipleImages]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!multipleImages || touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (deltaX > SWIPE_THRESHOLD) prevImage();
      else if (deltaX < -SWIPE_THRESHOLD) nextImage();
      touchStartX.current = null;
    },
    [multipleImages, nextImage, prevImage]
  );

  // Lager-rad (kurs vs produkt)
  const renderStockRow = useCallback(() => {
    if (!product) return null;

    if (isCourse) {
      if (product.stock_status === "outofstock") {
        return (
          <div className="flex items-center">
            <span>Slutsåld</span>
            <span className="ml-2 w-3 h-3 bg-[#C65757] rounded-full" />
          </div>
        );
      }
      return <div />; // inget meddelande när kurs finns
    }

    if (product.stock_status === "instock") {
      const qty =
        product.stock_quantity !== null && product.stock_quantity !== undefined
          ? `${product.stock_quantity} st i lager`
          : "I lager";
      return (
        <div className="flex items-center">
          <span>{qty}</span>
          <span className="ml-2 w-3 h-3 bg-[#3CB371] rounded-full" />
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <span>Slut i lager</span>
        <span className="ml-2 w-3 h-3 bg-[#C65757] rounded-full" />
      </div>
    );
  }, [product, isCourse]);

  // Early returns
  if (loading && !product) return <ProductSkeleton />;
  if (error) return <p>Error fetching product</p>;
  if (!product) return <ProductSkeleton />;

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="p-[1px] max-w-6xl mx-auto px-[2px] mb-10">
      {/* Back-länk */}
      <div className="pt-6 pb-2 md:pt-8 md:pb-2 z-10 relative">
        <Link
          to={isCourse ? "/kurser" : "/butik"}
          className="inline-block text-[#575757] hover:text-gray-900 transition-colors font-light tracking-[2.85px]"
        >
          ← {isCourse ? "Tillbaka till kurser" : "Tillbaka till butiken"}
        </Link>
      </div>

      {/* Huvudlayout */}
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
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />

                {multipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 text-white text-3xl opacity-80 hover:opacity-100"
                      aria-label="Föregående bild"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 text-white text-3xl opacity-80 hover:opacity-100"
                      aria-label="Nästa bild"
                    >
                      ›
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
                      loading="lazy"
                      decoding="async"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 object-cover cursor-pointer border ${
                        currentImageIndex === idx ? "border-gray-600" : "border-transparent"
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
        <div className="flex flex-col items-center w-full lg:max-w-[600px] lg:items-start font-light tracking-[2.85px]">
          <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mt-5">
            {product.name}
          </h1>

          {/* brödtext – Rubik Light 300 via .desc-text (App.css) */}
          <div className="desc-text text-[16px] mt-[5px] whitespace-pre-line">
            {product.description || "Ingen beskrivning tillgänglig."}
          </div>

          <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
            <div className="flex items-center">{renderStockRow()}</div>

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

          {/* Primär knapp */}
          {isCourse ? (
            product.stock_status === "outofstock" ? (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-[292px] h-[55px] mb-5 border border-black text-black tracking-[0.2em] font-light cursor-not-allowed opacity-50"
              >
                FULLBOKAD
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  window.open(
                    "https://soulfirekeramik.studio/butik/",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="w-[292px] h-[55px] mb-5 border border-black text-black tracking-[0.2em] font-light hover:bg-black hover:text-white transition-colors inline-flex items-center justify-center gap-2"
                aria-label="Boka här (öppnas i ny flik)"
              >
                <span className="align-middle">BOKA HÄR</span>
                <ExternalLinkIcon className="w-[16px] h-[16px] align-middle relative top-[-3px]" />
              </button>
            )
          ) : (
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
          )}
        </div>
      </div>

      <OrderRequestModal
        isOpen={isOrderRequestModalOpen}
        onClose={() => setIsOrderRequestModalOpen(false)}
      />
    </div>
  );
};

export default React.memo(ProductDetail);
