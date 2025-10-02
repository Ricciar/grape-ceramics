import React, { useState, useEffect } from 'react';
import { useMemo } from 'react';
import axios from 'axios';
import { isAbort } from '../../utils/abort';
import { sanitizeWP } from '../../utils/sanitizeWP';
import { getVideoPartsFromWP } from '../../utils/wordpress';
import { WPPage } from './types';
import { Product, FeaturedProducts } from '../shopgrid/types';
import { SkeletonMainPage } from './SkeletonMainPage';
import { useIsAdminMode } from '../../hooks/useIsAdminMode';

// ------------------------------------------------------------
// Presentationskomponent: VideoBlock (återanvänds mobil/desktop)
// ------------------------------------------------------------

function VideoBlock({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div className={className}>
      <video
        key={src}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto block"
      >
        Din webbläsare stödjer inte HTML5 video.
      </video>
    </div>
  );
}

// ------------------------------------------------------------
// Produktkort
// ------------------------------------------------------------

// Mobile/Tablet Product Card Component
const MobileProductCard = ({
  product,
  showDescription = false,
}: {
  product: Product;
  showDescription?: boolean;
}) => {
  const mainImage = product.images?.[0];
  const alt = mainImage?.alt || product.name || 'Produkt';

  return (
    <div className="relative w-full h-[236px] md:h-[321px] overflow-hidden">
      {mainImage ? (
        <img
          src={mainImage.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">Ingen bild tillgänglig</span>
        </div>
      )}

      <a
        href={`/product/${product.id}`}
        className="block absolute inset-0 group focus:outline-none"
        aria-label={`Visa produkt: ${product.name}`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-0 group-focus:bg-opacity-0">
          {showDescription && product.short_description ? (
            <div className="text-white font-light font-sans text-center tracking-custom-wide-2">
              <h3 className="text-[16px] uppercase tracking-widest mb-2">
                {product.name}
              </h3>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: sanitizeWP(product.short_description),
                }}
              />
            </div>
          ) : null}
        </div>
      </a>
    </div>
  );
};

// Desktop Product Card Component
const DesktopProductCard = ({
  product,
  showDescription = false,
}: {
  product: Product;
  showDescription?: boolean;
}) => {
  return (
    <MobileProductCard product={product} showDescription={showDescription} />
  );
};

// ------------------------------------------------------------
// Huvudkomponent
// ------------------------------------------------------------
const MainPage: React.FC = () => {
  const isAdminMode = useIsAdminMode();

  // Content-state
  const [homePage, setHomePage] = useState<WPPage | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProducts>({
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
  });
  const [infoSection, setInfoSection] = useState<WPPage | null>(null);

  // UI-state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true; // skyddar mot setState efter unmount

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const featuredTags = [
          'featured-one',
          'featured-two',
          'featured-three',
          'featured-four',
          'featured-five',
          'featured-six',
        ];

        // Fetch startsida for video block
        const homePageRequest = axios.get(`/api/pages`, {
          params: { slug: 'startsida' },
          signal: controller.signal,
          timeout: 15000,
        });

        // Fetch infosida
        const infoPageRequest = axios.get(`/api/pages`, {
          params: { slug: 'info' },
          signal: controller.signal,
          timeout: 15000,
        });

        // Fetch alla produkter
        const allProductsRequest = axios.get(`/api/products`, {
          params: {
            per_page: 100,
          },
          signal: controller.signal,
          timeout: 20000,
        });

        const [homeResponse, infoPageResponse, allProductsResponse] =
          await Promise.all([
            homePageRequest,
            infoPageRequest,
            allProductsRequest,
          ]);

        console.log(
          '[fetchData] homeResponse.data length:',
          homeResponse.data?.length
        );
        console.log(
          '[fetchData] infoPageResponse.data length:',
          infoPageResponse.data?.length
        );

        const first = homeResponse.data?.[0];
        console.log(
          '[fetchData] first page keys:',
          first ? Object.keys(first) : 'none'
        );
        console.log(
          '[fetchData] first.content?.rendered length:',
          first?.content?.rendered?.length ?? 0
        );
        console.log(
          '[fetchData] first.content?.rendered start:',
          first?.content?.rendered?.slice?.(0, 400) ?? ''
        );

        if (!mounted) return;

        // Produkter
        const allProducts: Product[] = allProductsResponse.data.products || [];

        // Bygg featured - undvik dubbletter
        const positions = [
          'one',
          'two',
          'three',
          'four',
          'five',
          'six',
        ] as const;
        const used = new Set<number>();
        const nextFeatured: FeaturedProducts = {
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
        };

        featuredTags.forEach((tagSlug, index) => {
          const product = allProducts.find(
            (p) => !used.has(p.id) && p.tags?.some((t) => t.slug === tagSlug)
          );
          const key = positions[index];
          nextFeatured[key] = product ?? null;
          if (product) used.add(product.id);
        });

        // Sidor
        if (homeResponse.data.length > 0) {
          setHomePage(homeResponse.data[0]);
        }
        setFeaturedProducts(nextFeatured);

        if (infoPageResponse.data.length > 0) {
          setInfoSection(infoPageResponse.data[0]);
        } else if (homeResponse.data.length > 0) {
          // Fallback if no info page exists
          setInfoSection(homeResponse.data[0]);
        }
      } catch (err) {
        if (isAbort(err)) return;
        console.error('Error fetching data:', err);
        if (mounted) setError('Det gick inte att hämta innehållet.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Derivera video-delar från startsidans HTML
  const { src: videoSrc } = useMemo(() => {
    if (!homePage?.content?.rendered) return { src: '' };
    return getVideoPartsFromWP(
      homePage.content.rendered,
      'https://www.grapeceramics.se'
    );
  }, [homePage?.content?.rendered]);

  // Konvertera featured till array för rendering
  const featuredProductsArray = useMemo(
    () =>
      [
        featuredProducts.one,
        featuredProducts.two,
        featuredProducts.three,
        featuredProducts.four,
        featuredProducts.five,
        featuredProducts.six,
      ].filter((p): p is Product => p !== null),
    [featuredProducts]
  );

  if (isAdminMode && featuredProductsArray.length < 6) {
    // Hjälpsam logg i admin-läge
    console.warn(
      `⚠️ Endast ${featuredProductsArray.length} av 6 utvalda produkter hittades.`
    );
  }

  if (loading) {
    return <SkeletonMainPage />;
  }

  if (error) {
    return <div className="text-center p-8">{error}</div>;
  }

  return (
    <div className="w-full max-w-full ml-[2px] mr-[2px] overflow-hidden">
      {/* ---- Mobile/Tablet Layout ---- */}

      <div className="flex flex-col md:hidden">
        {/* VIDEO */}
        <div className="w-full bg-gray-100 h-full mt-[2px] mb-[2px] z-0">
          {videoSrc ? (
            <VideoBlock src={videoSrc} />
          ) : isAdminMode ? (
            <div className="bg-white p-4 text-yellow-800 text-center">
              ⚠️ Videoinnehåll saknas. Lägg till ett videoblock på startsidan i
              WordPress.
            </div>
          ) : null}
        </div>

        {/* First Row of Products */}
        {featuredProductsArray.length >= 2 && (
          <div className="w-full grid grid-cols-2 gap-[1px] z-10">
            {featuredProductsArray[0] && (
              <MobileProductCard
                product={featuredProductsArray[0]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[1] && (
              <MobileProductCard
                product={featuredProductsArray[1]}
                showDescription={false}
              />
            )}
          </div>
        )}

        {/* Info Section */}
        {infoSection ? (
          <div className="w-full bg-[#DFCABB] py-8 px-4 text-center min-h-[225px] md:h-[456px] flex items-center justify-center ml-[2px] mr-[2px] z-10">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl uppercase tracking-custom-wide-2 text-gray-800 mb-6"
                dangerouslySetInnerHTML={{
                  __html: sanitizeWP(infoSection.title.rendered),
                }}
              />
              <div
                className="text-gray-700 text-sm tracking-custom-wide-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeWP(infoSection.content.rendered),
                }}
              />
            </div>
          </div>
        ) : isAdminMode ? (
          <div className="bg-white p-4 text-yellow-800 text-center">
            ⚠️ Info-sektionen saknas. Kontrollera att en sida med slug
            &quot;info&quot; finns.
          </div>
        ) : null}

        {/* Second Row of Products (only mobile) */}
        {featuredProductsArray.length >= 4 && (
          <div className="w-full grid grid-cols-2 gap-[2px] mb-[2px] z-10 md:hidden">
            {featuredProductsArray[2] && (
              <MobileProductCard
                product={featuredProductsArray[2]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[3] && (
              <MobileProductCard
                product={featuredProductsArray[3]}
                showDescription={true}
              />
            )}
          </div>
        )}

        {/* Third Row of Products (only mobile) */}
        {featuredProductsArray.length >= 6 && (
          <div className="w-full grid grid-cols-2 pl-[2px] pr-[2px] pb-[2px] gap-[2px] z-10 md:hidden">
            {featuredProductsArray[4] && (
              <MobileProductCard
                product={featuredProductsArray[4]}
                showDescription={false}
              />
            )}
            {featuredProductsArray[5] && (
              <MobileProductCard
                product={featuredProductsArray[5]}
                showDescription={false}
              />
            )}
          </div>
        )}
      </div>

      {/* ---- Desktop Layout ---- */}
      <div className="hidden md:flex md:flex-col">
        {/* Video Section */}
        <div className="w-full pt-[2px] pl-[2px] pr-[2px] z-0">
          {videoSrc && (
            <VideoBlock
              src={videoSrc}
              className="w-full max-h-[400px] overflow-hidden"
            />
          )}
        </div>

        {/* First Row of Products */}
        {featuredProductsArray.length >= 3 && (
          <div className="w-full grid grid-cols-3 p-[2px] gap-[2px] z-10">
            {featuredProductsArray[0] && (
              <DesktopProductCard
                product={featuredProductsArray[0]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[1] && (
              <DesktopProductCard
                product={featuredProductsArray[1]}
                showDescription={false}
              />
            )}
            {/* Third product shown in desktop layout row 1 but not in mobile layout row 1 */}
            {featuredProductsArray[2] && (
              <div className="hidden md:block">
                <DesktopProductCard
                  product={featuredProductsArray[2]}
                  showDescription={false}
                />
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {infoSection && (
          <div className="w-full bg-[#DFCABB] py-8 px-4 tracking-custom-wide-2 text-center text-sans min-h-[456px] flex items-center justify-center z-10">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-[18px] uppercase tracking-custom-wider-2 text-gray-800 mb-6"
                dangerouslySetInnerHTML={{
                  __html: sanitizeWP(infoSection.title.rendered),
                }}
              />
              <div
                className="text-gray-800 text-[16px] tracking-custom-wide-2 md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeWP(infoSection.content.rendered),
                }}
              />
            </div>
          </div>
        )}

        {/* Second Row of Products - Desktop only with products 3-6 in one row */}
        {featuredProductsArray.length >= 6 && (
          <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] p-[2px] z-10">
            {featuredProductsArray[3] && (
              <DesktopProductCard
                product={featuredProductsArray[3]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[4] && (
              <DesktopProductCard
                product={featuredProductsArray[4]}
                showDescription={false}
              />
            )}
            {featuredProductsArray[5] && (
              <DesktopProductCard
                product={featuredProductsArray[5]}
                showDescription={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
