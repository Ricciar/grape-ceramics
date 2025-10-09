import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { isAbort } from "../../utils/abort";
import { sanitizeWP } from "../../utils/sanitizeWP";
import { getVideoPartsFromWP } from "../../utils/wordpress";
import { WPPage } from "./types";
import { Product, FeaturedProducts } from "../shopgrid/types";
import DOMPurify from "dompurify";
import { SkeletonMainPage } from "./SkeletonMainPage";
import Container from "../../components/Container";

const capitalizeFirstLetter = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const formatPrice = (price: string | null): string => {
  if (!price) return "";
  const num = Number(price);
  if (isNaN(num)) return price;
  return `${Math.round(num)} SEK`;
};

const isCourse = (p: Product): boolean => {
  return (p.categories || []).some(
    (c: any) =>
      c.slug?.toLowerCase() === "kurser" || c.name?.toLowerCase() === "kurser"
  );
};

/**
 * Produktkort för startsidan — hanterar både vanliga produkter och kurser.
 * Kurser visar textöverlägg hela tiden.
 */
const FeaturedProductCard = ({ product }: { product: Product }) => {
  const mainImage = product.images?.[0];
  const imageUrl = mainImage?.src || "";
  const alt = mainImage?.alt || product.name || "Produkt";
  const soldOut = product.stock_status === "outofstock";

  const CourseCard = () => (
    <div className="flex flex-col w-full">
      <div
        className={`relative w-full h-[390px] md:h-[321px] overflow-hidden group ${
          soldOut ? "opacity-70" : ""
        }`}
        aria-label={alt}
      >
        {/* Bild som kan skala på hover */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-xs font-light -tracking-custom-wide-xs">
              Ingen bild
            </span>
          </div>
        )}

        {/* Slutsåld-badge */}
        {soldOut && (
          <div className="absolute bottom-3 left-3 bg-custom-gray text-white px-2 py-1 text-sm font-light z-20 tracking-custom-wide-2">
            Slutsåld
          </div>
        )}

        {/* Länk + alltid synlig textoverlay */}
        <a href={`/kurs/${product.id}`} className="block absolute inset-0 focus:outline-none">
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30">
            <div className="text-white font-light font-sans tracking-custom-wide-xs text-center">
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
        </a>
      </div>

      <div className="mt-2 ml-3 mb-2 flex flex-row justify-between md:mt-4 md:mb-4 mr-3">
        <h3 className="text-xs font-sans font-light tracking-custom-wide-xs">
          {capitalizeFirstLetter(product.name)}
        </h3>
        {product.price && (
          <p
            className={`font-sans font-light text-xs tracking-custom-wide-xs ${
              soldOut ? "line-through text-gray-500" : ""
            }`}
          >
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </div>
  );

  // Kurskort
  if (isCourse(product)) return <CourseCard />;

  // Vanliga produkter – zoom på hover + klipp kanter
  return (
    <div
      className="relative cursor-pointer group overflow-hidden"
      onClick={() => (window.location.href = `/product/${product.id}`)}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-[390px] md:h-[321px] object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
};


const MainPage: React.FC = () => {
  const [homePage, setHomePage] = useState<WPPage | null>(null);
  const [infoSection, setInfoSection] = useState<WPPage | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProducts>({
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [homeRes, infoRes, allProductsRes] = await Promise.all([
          axios.get(`/api/pages`, {
            params: { slug: "startsida" },
            signal: controller.signal,
          }),
          axios.get(`/api/pages`, {
            params: { slug: "info" },
            signal: controller.signal,
          }),
          axios.get(`/api/products`, {
            params: { per_page: 100, includeCourses: true },
            signal: controller.signal,
          }),
        ]);

        if (!mounted) return;

        const allProducts: Product[] = allProductsRes.data.products || [];
        const tags = [
          "featured-one",
          "featured-two",
          "featured-three",
          "featured-four",
          "featured-five",
          "featured-six",
        ];
        const keys = ["one", "two", "three", "four", "five", "six"] as const;
        const next: FeaturedProducts = {
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
        };

        keys.forEach((key, i) => {
          const prod =
            allProducts.find((p) => p.tags?.some((t) => t.slug === tags[i])) ??
            null;
          next[key] = prod;
        });

        if (homeRes.data.length > 0) setHomePage(homeRes.data[0]);
        if (infoRes.data.length > 0) setInfoSection(infoRes.data[0]);
        setFeaturedProducts(next);
      } catch (err) {
        if (!isAbort(err)) setError("Kunde inte hämta innehållet.");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const videoSrc = useMemo(() => {
    if (!homePage?.content?.rendered) return "";
    return getVideoPartsFromWP(
      homePage.content.rendered,
      window.location.origin
    ).src;
  }, [homePage]);

  const featured = [
    featuredProducts.one,
    featuredProducts.two,
    featuredProducts.three,
    featuredProducts.four,
    featuredProducts.five,
    featuredProducts.six,
  ].filter((p): p is Product => !!p);

  if (loading) return <SkeletonMainPage />;
  if (error) return <div className="text-center p-8">{error}</div>;

  return (
    // 🟢 Samma yttre container som butiken
     <Container className="p-[1px]">
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-[320px] md:h-[380px] lg:h-[420px] object-cover"
        />
      )}

      {/* 🔹 Första raden – samma grid-gaps/padding som butiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mt-[2px]">
        {featured.slice(0, 3).map((p, i) => (
          <FeaturedProductCard key={i} product={p} />
        ))}
      </div>

      {/* 🔹 Info-sektion – behåll men lägg kvar inom container */}
      {infoSection?.content?.rendered && (
        <div
          className="w-full text-center px-8 py-12 bg-[#DFCABB] text-[#1C1B1F] font-light tracking-[2.28px] my-[2px]"
          dangerouslySetInnerHTML={{
            __html: sanitizeWP(infoSection.content.rendered),
          }}
        />
      )}

      {/* 🔹 Andra raden */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-[2px]">
        {featured.slice(3, 6).map((p, i) => (
          <FeaturedProductCard key={i + 3} product={p} />
        ))}
      </div>
    </Container>
  );
};

export default MainPage;
