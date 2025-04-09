import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage, WPPost } from './types';
import { extractVideoBlock } from '../../utils/extractVideoBlock';
import { getImageUrlFromPost } from '../../utils/extractFirstImageFromContent';
import { extractProductLink } from '../../utils/extractProductLink';

const MainPage: React.FC = () => {
  const [homePage, setHomePage] = useState<WPPage | null>(null);
  const [featuredPosts, setFeaturedPosts] = useState<WPPost[]>([]);
  const [infoSection, setInfoSection] = useState<WPPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Hämta startsidan för videoblocket
        const homeResponse = await axios.get(
          'https://grapeceramics.se/wp-json/wp/v2/pages?slug=startsida'
        );

        // Hämta de senaste inläggen med featured images
        const postsResponse = await axios.get(
          'https://grapeceramics.se/wp-json/wp/v2/posts?_embed=true&per_page=2&order=asc'
        );

        // Hämta marknadssidan eller använd startsidan som fallback
        const infoResponse = await axios.get(
          'https://grapeceramics.se/wp-json/wp/v2/pages?slug=info'
        );

        // Logga svar för inspektion
        console.log('Home page response:', homeResponse.data);
        console.log('Featured posts response:', postsResponse.data);
        console.log('Info section response:', infoResponse.data);

        if (homeResponse.data.length > 0) {
          setHomePage(homeResponse.data[0]);
        }

        if (postsResponse.data.length > 0) {
          setFeaturedPosts(postsResponse.data);
        }

        if (infoResponse.data.length > 0) {
          setInfoSection(infoResponse.data[0]);
        } else {
          // Fallback om ingen marknadssida finns
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

      {/* Features Grid Section - baserat på din design */}
      {featuredPosts.length > 0 && (
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Första featured inlägget (större) */}
          {featuredPosts[0] &&
            (() => {
              const imageData = getImageUrlFromPost(featuredPosts[0]);
              return (
                <div
                  className="md:col-span-2 relative aspect-square"
                  style={{
                    backgroundImage: imageData
                      ? `url(${imageData.url})`
                      : 'none',
                    backgroundColor: imageData ? 'transparent' : '#f0f0f0',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  aria-label={imageData?.altText || undefined}
                >
                  {!imageData && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">
                        Ingen bild tillgänglig
                      </span>
                    </div>
                  )}

                  <a
                    href={extractProductLink(
                      featuredPosts[0].content.rendered,
                      featuredPosts[0]
                    )}
                    className="block absolute inset-0"
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-6 bg-black bg-opacity-20">
                      <div className="text-white text-center max-w-md">
                        <h3
                          className="text-xl uppercase tracking-widest mb-3"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              featuredPosts[0].title.rendered
                            ),
                          }}
                        />
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              featuredPosts[0].excerpt.rendered
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </a>
                </div>
              );
            })()}

          {/* Andra featured inlägget (mindre) */}
          {featuredPosts[1] &&
            (() => {
              const imageData = getImageUrlFromPost(featuredPosts[1]);
              return (
                <div
                  className="relative aspect-square"
                  style={{
                    backgroundImage: imageData
                      ? `url(${imageData.url})`
                      : 'none',
                    backgroundColor: imageData ? 'transparent' : '#f0f0f0',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  aria-label={imageData?.altText || undefined}
                >
                  {/* Fallback om ingen bild finns */}
                  {!imageData && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">
                        Ingen bild tillgänglig
                      </span>
                    </div>
                  )}

                  {/* Här används den extraherade produkt-länken */}
                  <a
                    href={extractProductLink(
                      featuredPosts[1].content.rendered,
                      featuredPosts[1]
                    )}
                    className="block absolute inset-0"
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20">
                      <div className="text-white text-center">
                        <h3
                          className="text-lg uppercase tracking-widest mb-1"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              featuredPosts[1].title.rendered
                            ),
                          }}
                        />
                        <div
                          className="text-xs"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              featuredPosts[1].excerpt.rendered
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </a>
                </div>
              );
            })()}
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
