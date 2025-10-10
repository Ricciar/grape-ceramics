import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { isAbort } from "../../utils/abort";
import { sanitizeWP } from "../../utils/sanitizeWP";
import { getVideoPartsFromWP } from "../../utils/wordpress";
import { WPPage } from "./types";
import { Product, FeaturedProducts } from "../shopgrid/types";
import DOMPurify from "dompurify";
import { SkeletonMainPage } from "./SkeletonMainPage";

const capitalizeFirstLetter = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const isCourse = (p: Product): boolean =>
  (p.categories || []).some(
    (c: any) =>
      c.slug?.toLowerCase() === "kurser" || c.name?.toLowerCase() === "kurser"
  );

/** Kort (portrait 4:5) – inga meta-rader under på startsidan */
const FeaturedProductCard = ({ product }: { product: Product }) => {
  const mainImage = product.images?.[0];
  const imageUrl = mainImage?.src || "";
  const alt = mainImage?.alt || product.name || "Produkt";
  const soldOut = product.stock_status === "outofstock";
  const href = isCourse(product) ? `/kurs/${product.id}` : `/product/${product.id}`;

  return (
    <a href={href} className="block group">
      {/* PORTRAIT 4:5 */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden"
        aria-label={alt}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Overlay alltid synlig för kurser */}
        {isCourse(product) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 bg-black/30">
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
        )}

        {soldOut && (
          <div className="absolute bottom-3 left-3 bg-custom-gray text-white px-2 py-1 text-sm font-light z-20 tracking-[0.06em]">
            Slutsåld
          </div>
        )}
      </div>
      {/* Ingen meta-rad under kortet på startsidan */}
    </a>
  );
};

const MainPage: React.FC = () => {
  const [homePage, setHomePage] = useState<WPPage | null>(null);
  const [infoSection, setInfoSection] = useState<WPPage | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProducts>({
    one: null, two: null, three: null, four: null, five: null, six: null,
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
          axios.get(`/api/pages`, { params: { slug: "startsida" }, signal: controller.signal }),
          axios.get(`/api/pages`, { params: { slug: "info" }, signal: controller.signal }),
          axios.get(`/api/products`, { params: { per_page: 100, includeCourses: true }, signal: controller.signal }),
        ]);

        if (!mounted) return;

        const allProducts: Product[] = allProductsRes.data.products || [];
        const tags = [
          "featured-one","featured-two","featured-three",
          "featured-four","featured-five","featured-six",
        ];
        const keys = ["one","two","three","four","five","six"] as const;
        const next: FeaturedProducts = { one:null,two:null,three:null,four:null,five:null,six:null };

        keys.forEach((key, i) => {
          const prod = allProducts.find((p) => p.tags?.some((t) => t.slug === tags[i])) ?? null;
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
    return getVideoPartsFromWP(homePage.content.rendered, window.location.origin).src;
  }, [homePage]);

  const featured = [
    featuredProducts.one, featuredProducts.two, featuredProducts.three,
    featuredProducts.four, featuredProducts.five, featuredProducts.six,
  ].filter((p): p is Product => !!p);

  if (loading) return <SkeletonMainPage />;
  if (error) return <div className="text-center p-8">{error}</div>;

  return (
    <div className="p-[1px] max-w-6xl mx-auto">
      {/* Video */}
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

      {/* 1:a raden – mobil */}
      <div className="grid grid-cols-2 gap-[2px] px-[2px] mt-[2px] md:hidden">
        {featured.slice(0, 2).map((p, i) => (
          <FeaturedProductCard key={`m-top-${i}`} product={p} />
        ))}
      </div>

      {/* 1:a raden – desktop */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] px-[2px] md:mt-[2px]">
        {featured.slice(0, 3).map((p, i) => (
          <FeaturedProductCard key={`d-top-${i}`} product={p} />
        ))}
      </div>

      {/* INFO-SEKTION – exakt bredd som grid, brödtextstil (Rubik 300) */}
      {infoSection?.content?.rendered && (
        <section className="my-[2px] px-[2px]">
          <div
            className="bg-[#DFCABB] text-[#1C1B1F] py-12 text-center font-[300] font-['Rubik'] tracking-normal leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeWP(infoSection.content.rendered) }}
          />
        </section>
      )}

      {/* 2:a raden – mobil */}
      <div className="grid grid-cols-2 gap-[2px] px-[2px] mb-[2px] md:hidden">
        {featured.slice(2, 6).map((p, i) => (
          <FeaturedProductCard key={`m-bot-${i}`} product={p} />
        ))}
      </div>

      {/* 2:a raden – desktop */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] px-[2px] md:mb-[2px]">
        {featured.slice(3, 6).map((p, i) => (
          <FeaturedProductCard key={`d-bot-${i}`} product={p} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
