import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from '../../pages/MainPage/types';
import FooterSkeleton from './FooterSkeleton';

/**
 * Footer component that displays contact information and social media links
 * fetched from WordPress page with slug 'sidfot'
 */
const Footer: React.FC = () => {
  const [pageData, setPageData] = useState<WPPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const response = await axios.get('/api/pages?slug=sidfot');

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setPageData(response.data[0]);
          console.log('Fetched footer content:', response.data[0]);
        } else {
          console.warn('Footer data not in expected format:', response.data);
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching footer content:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Process HTML content to enhance accessibility and styling
  const processHtml = (html: string) => {
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'rel', 'aria-label', 'style'],
    });

    // Create a DOM parser to modify the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedHtml, 'text/html');

    // Find all links and enhance them for accessibility
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      if (
        link.href &&
        (link.href.startsWith('http') || link.href.startsWith('mailto:'))
      ) {
        if (link.href.startsWith('http')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }

        // Add descriptive aria-labels if missing
        if (!link.getAttribute('aria-label')) {
          if (link.href.startsWith('mailto:')) {
            link.setAttribute(
              'aria-label',
              `Skicka e-mail till ${link.textContent}`
            );
          } else if (link.textContent) {
            link.setAttribute('aria-label', `Besök ${link.textContent}`);
          }
        }
      }

      // Add focus styling class and hover effect
      link.classList.add(
        'focus:outline-none',
        'transition-colors',
        'hover:text-gray-900'
      );
    });

    // Style all paragraphs
    const paragraphs = doc.querySelectorAll('p');
    paragraphs.forEach((p) => {
      p.classList.add(
        'font-sans',
        'text-[16px]',
        'font-light',
        'tracking-custom-wide',
        'custom-gray',
        'mb-3'
      );
    });

    // Style email specifically - find email link
    const emailLink = doc.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      emailLink.classList.add('text-[16px]', 'mb-1', 'hover:underline');
    }

    // Instagram handle styling - find links that might be Instagram
    const instagramLink = Array.from(doc.querySelectorAll('a')).find(
      (link) =>
        link.textContent?.includes('@') || link.href.includes('instagram')
    );

    if (instagramLink) {
      instagramLink.classList.add('mb-5');
    }

    // Find the figure element containing the Instagram icon
    const figure = doc.querySelector('figure');
    if (figure) {
      // Remove WordPress classes
      figure.className = '';

      // Find the Instagram icon and apply proper styling
      const instagramIcon = figure.querySelector('img') as HTMLImageElement;
      if (instagramIcon) {
        // Clean up all attributes and styling
        instagramIcon.className = '';
        instagramIcon.style.cssText = '';
        instagramIcon.setAttribute('style', 'width: 24px; height: 24px;');

        // Set explicit inline styles for more reliable sizing
        instagramIcon.style.width = '24px';
        instagramIcon.style.height = '24px';

        // Add classes for additional styling
        instagramIcon.classList.add(
          'inline-block',
          'hover:opacity-80',
          'transition-all',
          'duration-300'
        );

        // Remove all the WordPress-generated attributes that could interfere
        instagramIcon.removeAttribute('width');
        instagramIcon.removeAttribute('height');
        instagramIcon.removeAttribute('srcset');
        instagramIcon.removeAttribute('sizes');
        instagramIcon.removeAttribute('loading');
        instagramIcon.removeAttribute('decoding');

        // Set proper alt text
        instagramIcon.alt = 'Instagram';

        // Style the Instagram link
        const parentLink = instagramIcon.closest('a');
        if (parentLink) {
          parentLink.className = '';
          parentLink.classList.add(
            'inline-block',
            'p-2',
            'hover:opacity-80',
            'transition-all'
          );

          parentLink.setAttribute('aria-label', 'Följ mig på Instagram');
        }
      }
    }

    // Return the serialized and enhanced HTML
    return new XMLSerializer()
      .serializeToString(doc.body)
      .replace(/<\/?body>/g, '');
  };

  // Show loading skeleton while content is being fetched
  if (isLoading) {
    return <FooterSkeleton />;
  }

  // Handle case when no data is available
  if (!pageData || !pageData.content?.rendered) {
    return (
      <footer
        className="bg-[#F8F4EC] py-10 px-4 text-center font-light text-gray-700"
        aria-label="Contact information"
      >
        <div className="container mx-auto">
          <p className="text-lg">
            No contact information available at the moment
          </p>
        </div>
      </footer>
    );
  }

  // Processed HTML with enhanced accessibility and styling
  const enhancedHtml = processHtml(pageData.content.rendered);

  return (
    <footer
      className="bg-[#F8F4EC] py-8 px-4 text-center font-light text-gray-700"
      aria-label="Contact information"
    >
      <div className="container mx-auto flex flex-col items-center max-w-md">
        {/* Render enhanced HTML content from WordPress */}
        <div
          className="content space-y-2 w-full"
          dangerouslySetInnerHTML={{ __html: enhancedHtml }}
        ></div>

        {/* Footer text - only shown if there's no error */}
        {!error && (
          <p className="mt-4 text-sm text-gray-500">
            © {new Date().getFullYear()} Grape Ceramics. All rights reserved.
          </p>
        )}

        {/* Error message - only shown if there's an error */}
        {error && (
          <div className="mt-4 p-2 bg-red-50 text-red-700 rounded" role="alert">
            <p>Det gick inte att ladda innehållet. Vänligen försök senare.</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
