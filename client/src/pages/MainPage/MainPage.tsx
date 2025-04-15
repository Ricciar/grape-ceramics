import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from './types';
import { Product, FeaturedProducts } from '../shopgrid/types';
import { extractVideoBlock } from '../../utils/extractVideoBlock';

const MainPage: React.FC = () => {
  // State för innehåll
  const [homePage, setHomePage] = useState<WPPage | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProducts>({
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
  });

  // State for info section
  const [infoSection, setInfoSection] = useState<WPPage | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const featuredTags = [
          'featured-one',
          'featured-two',
          'featured-three',
          'featured-four',
          'featured-five',
          'featured-six',
        ];

        // Hämta startsidan för videoblocket
        const homePageRequest = axios.get(`/api/pages?slug=startsida`);

        // Hämta infosidan eller använd startsidan som fallback
        const infoPageRequest = axios.get(`/api/pages?slug=info`);

        // Hämta ALLA produkter i ett enda anrop
        const allProductsRequest = axios.get(`/api/products`, {
          params: {
            per_page: 100, // Hämtar upp till 100 produkter
          },
        });

        // Vänta på alla anrop parallellt
        const [homeResponse, infoPageResponse, allProductsResponse] =
          await Promise.all([
            homePageRequest,
            infoPageRequest,
            allProductsRequest,
          ]);

        // Logga svar för inspektion
        console.log('Home page response:', homeResponse.data);
        console.log('All products response:', allProductsResponse.data);
        console.log('Info section response:', infoPageResponse.data);

        // Extrahera produkterna från svaret
        const allProducts = allProductsResponse.data.products || [];
        console.log('All products:', allProducts);

        // Skapa ett objekt med featured produkter baserat på taggar
        const featuredProductsObj: FeaturedProducts = {
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
        };

        type PositionKey = keyof FeaturedProducts;

        // För varje tag, hitta matchande produkt
        featuredTags.forEach((tagSlug, index) => {
          const positions: PositionKey[] = [
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
          ];
          const position = positions[index];

          // Hitta första produkten som har denna tagg
          const product = allProducts.find(
            (p: Product) => p.tags && p.tags.some((t) => t.slug === tagSlug)
          );

          if (product) {
            console.log(`Found product with tag ${tagSlug}:`, product.name);
            featuredProductsObj[position] = product;
          } else {
            console.log(`No product found with tag ${tagSlug}`);
          }
        });

        // Sätt states
        if (homeResponse.data.length > 0) {
          setHomePage(homeResponse.data[0]);
        }

        setFeaturedProducts(featuredProductsObj);
        console.log('Featured products object:', featuredProductsObj);

        if (infoPageResponse.data.length > 0) {
          setInfoSection(infoPageResponse.data[0]);
        } else if (homeResponse.data.length > 0) {
          // Fallback om ingen infosida finns
          setInfoSection(homeResponse.data[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Det gick inte att hämta innehållet.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Försök igen
        </button>
      </div>
    );
  }

  // Extrahera videoinnehåll från startsidan
  const videoContent = homePage?.content?.rendered
    ? extractVideoBlock(homePage.content.rendered)
    : null;

  const featuredProductsArray = [
    featuredProducts.one,
    featuredProducts.two,
    featuredProducts.three,
    featuredProducts.four,
    featuredProducts.five,
    featuredProducts.six,
  ].filter((product) => product !== null);

  // Hjälpfunktion för att få alt-text från en produkt
  const getAltText = (product: Product): string => {
    if (product.images.length > 0) {
      return product.images[0].alt || product.name;
    }

    // Fallback till produktnamnet
    return `Bild av ${product.name}`;
  };

  return (
    <div className="w-full">
      {/* Video Section */}
      <section className="w-full relative">
        {videoContent ? (
          <div
            className="w-full h-auto aspect-[16/9]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(videoContent),
            }}
          />
        ) : (
          <div className="w-full bg-gray-200 flex items-center justify-center aspect-[16/9]">
            <p>Ingen video tillgänglig</p>
          </div>
        )}
      </section>

      {/* Features Grid Section */}
      {featuredProductsArray.length > 0 && (
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Första featured produkten (större) */}
          {featuredProductsArray[0] && (
            <div
              className="md:col-span-2 relative aspect-square"
              style={{
                backgroundImage:
                  featuredProductsArray[0].images.length > 0
                    ? `url(${featuredProductsArray[0].images[0].src})`
                    : 'none',
                backgroundColor:
                  featuredProductsArray[0].images.length > 0
                    ? 'transparent'
                    : '#f0f0f0',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-label={getAltText(featuredProductsArray[0])}
            >
              {featuredProductsArray[0].images.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Ingen bild tillgänglig</span>
                </div>
              )}

              <a
                href={`/product/${featuredProductsArray[0].id}`}
                className="block absolute inset-0"
              >
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-black bg-opacity-20">
                  <div className="text-white text-center max-w-md">
                    <h3 className="text-xl uppercase tracking-widest mb-3">
                      {featuredProductsArray[0].name}
                    </h3>
                    {featuredProductsArray[0].short_description && (
                      <div className="text-sm">
                        {featuredProductsArray[0].short_description}
                      </div>
                    )}
                    <div className="mt-2">
                      {featuredProductsArray[0].sale_price ? (
                        <>
                          <span className="line-through mr-2">
                            {featuredProductsArray[0].regular_price} kr
                          </span>
                          <span className="font-bold">
                            {featuredProductsArray[0].sale_price} kr
                          </span>
                        </>
                      ) : (
                        <span>{featuredProductsArray[0].regular_price} kr</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Andra featured produkten */}
          {featuredProductsArray[1] && (
            <div
              className="relative aspect-square"
              style={{
                backgroundImage:
                  featuredProductsArray[1].images.length > 0
                    ? `url(${featuredProductsArray[1].images[0].src})`
                    : 'none',
                backgroundColor:
                  featuredProductsArray[1].images.length > 0
                    ? 'transparent'
                    : '#f0f0f0',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-label={getAltText(featuredProductsArray[1])}
            >
              {featuredProductsArray[1].images.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Ingen bild tillgänglig</span>
                </div>
              )}

              <a
                href={`/product/${featuredProductsArray[1].id}`}
                className="block absolute inset-0"
              >
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20">
                  <div className="text-white text-center">
                    <h3 className="text-lg uppercase tracking-widest mb-1">
                      {featuredProductsArray[1].name}
                    </h3>
                    {featuredProductsArray[1].short_description && (
                      <div className="text-xs">
                        {featuredProductsArray[1].short_description}
                      </div>
                    )}
                    <div className="mt-2">
                      {featuredProductsArray[1].sale_price ? (
                        <>
                          <span className="line-through mr-2">
                            {featuredProductsArray[1].regular_price} kr
                          </span>
                          <span className="font-bold">
                            {featuredProductsArray[1].sale_price} kr
                          </span>
                        </>
                      ) : (
                        <span>{featuredProductsArray[1].regular_price} kr</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}
        </section>
      )}

      {/* Resterande featured produkter */}
      {featuredProductsArray.length > 2 && (
        <section className="w-full grid grid-cols-1 md:grid-cols-4 gap-0">
          {featuredProductsArray.slice(2).map((product) => (
            <div
              key={product.id}
              className="relative aspect-square"
              style={{
                backgroundImage:
                  product.images.length > 0
                    ? `url(${product.images[0].src})`
                    : 'none',
                backgroundColor:
                  product.images.length > 0 ? 'transparent' : '#f0f0f0',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-label={getAltText(product)}
            >
              {product.images.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Ingen bild tillgänglig</span>
                </div>
              )}

              <a
                href={`/product/${product.id}`}
                className="block absolute inset-0"
              >
                <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20">
                  <div className="text-white text-center">
                    <h3 className="text-lg uppercase tracking-widest mb-1">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <div className="text-xs">{product.short_description}</div>
                    )}
                    <div className="mt-2">
                      {product.sale_price ? (
                        <>
                          <span className="line-through mr-2">
                            {product.regular_price} kr
                          </span>
                          <span className="font-bold">
                            {product.sale_price} kr
                          </span>
                        </>
                      ) : (
                        <span>{product.regular_price} kr</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </section>
      )}

      {/* Market Info Section */}
      {infoSection && (
        <section className="w-full bg-[#f8e8d8] py-8 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl uppercase tracking-widest text-gray-700 mb-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(infoSection.title.rendered),
              }}
            />
            <div
              className="text-gray-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(infoSection.content.rendered),
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default MainPage;
