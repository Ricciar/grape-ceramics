import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Product } from "../shopgrid/types";
import { Link } from "react-router-dom";
import { getCached, setCached } from "../../utils/cache";

const SCROLL_KEY = "scroll:courses";

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatPrice = (price: string | null): string => {
  if (!price) return "0";
  const num = Number(price);
  if (isNaN(num)) return price;
  return Math.round(num).toString();
};

const CourseProductCard = ({
  product,
  isSoldOut = false,
}: {
  product: Product;
  isSoldOut?: boolean;
}) => {
  const mainImage = product.images?.[0];
  const imageUrl = mainImage?.src || "";
  const alt = mainImage?.alt || product.name || "Kurs";

  const handleClick = () => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  };

  return (
    <div className="flex flex-col w-full">
      <div className={`group relative w-full aspect-[4/5] overflow-hidden ${isSoldOut ? "opacity-70" : ""}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-xs font-light tracking-wide">
              Ingen bild
            </span>
          </div>
        )}

        {isSoldOut && (
          <div className="absolute bottom-3 left-3 bg-custom-gray text-white px-2 py-1 text-sm font-light z-20 tracking-[0.06em]">
            Slutsåld
          </div>
        )}

        <Link
          to={`/kurs/${product.id}`}
          className="block absolute inset-0 focus:outline-none"
          aria-label={`Visa kurs: ${product.name}`}
          onClick={handleClick}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30">
            <div className="text-white font-light font-sans tracking-[0.04em] text-center">
              <h3 className="text-[22px] md:text-[31px] tracking-widest mb-2">
                {capitalizeFirstLetter(product.name)}
              </h3>
              {product.short_description && (
                <div
                  className="text-sm font-[300] font-['Rubik']"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.short_description),
                  }}
                />
              )}
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-2 ml-3 mb-2 flex flex-row justify-between md:mt-4 md:mb-4 mr-3">
        <h3 className="text-xs font-sans font-light tracking-[0.04em]">
          {capitalizeFirstLetter(product.name)}
        </h3>
        {product.price && (
          <p
            className={`font-sans font-light text-xs tracking-[0.04em] ${
              isSoldOut ? "line-through text-gray-500" : ""
            }`}
          >
            {formatPrice(product.price)} SEK
          </p>
        )}
      </div>
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const [courseProducts, setCourseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseProducts = async () => {
      try {
        setLoading(true);

        // cache först (5 min)
        const cached = getCached<Product[]>("courses:list", 5 * 60_000);
        if (cached) setCourseProducts(cached);

        const response = await axios.get("/api/courses", { params: { per_page: 100 } });
        const onlyCourses: Product[] = response.data.products || [];
        setCourseProducts(onlyCourses);
        setCached("courses:list", onlyCourses);
      } catch (err) {
        console.error("Fel vid hämtning av kurser:", err);
        setError("Det gick inte att hämta kurserna.");
      } finally {
        setLoading(false);

        // Återställ scroll
        const saved = sessionStorage.getItem(SCROLL_KEY);
        if (saved) {
          const y = Number(saved);
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });
          });
          sessionStorage.removeItem(SCROLL_KEY);
        }
      }
    };

    fetchCourseProducts();
  }, []);

  if (error) {
    return (
      <div className="text-center p-8">
        <p>{error}</p>
      </div>
    );
  }

  if (loading && courseProducts.length === 0) {
    return <p className="text-center p-8">Laddar kurser...</p>;
  }

  return (
    <div className="p-[1px] max-w-6xl mx-auto">
      {/* Mobil */}
      <div className="grid grid-cols-1 gap-[2px] px-[2px] md:hidden">
        {courseProducts.length > 0 ? (
          courseProducts.map((product) => (
            <CourseProductCard
              key={`product-mobile-${product.id}`}
              product={product}
              isSoldOut={product.stock_status === "outofstock"}
            />
          ))
        ) : (
          <p className="text-center col-span-1">Inga kurser tillgängliga.</p>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] px-[2px]">
        {courseProducts.length > 0 ? (
          courseProducts.map((product) => (
            <CourseProductCard
              key={`product-desktop-${product.id}`}
              product={product}
              isSoldOut={product.stock_status === "outofstock"}
            />
          ))
        ) : (
          <p className="text-center col-span-3">Inga kurser tillgängliga.</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
