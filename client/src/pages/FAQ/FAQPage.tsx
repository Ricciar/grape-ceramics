import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from '../../pages/MainPage/types'; // Adjust the import path as needed
import FAQSkeleton from './FAQSkeleton';

/**
 * FAQPage component that displays an interactive FAQ with expandable/collapsible sections
 * fetched from WordPress page with slug 'faq'
 */
const FAQPage: React.FC = () => {
  const [pageData, setPageData] = useState<WPPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [faqItems, setFaqItems] = useState<
    Array<{ id: number; question: string; answer: string }>
  >([]);
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const response = await axios.get('/api/pages?slug=faq');

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setPageData(response.data[0]);
          console.log('Fetched FAQ content:', response.data[0]);

          // Set the page title from WordPress title field
          const wpTitle =
            response.data[0].title?.rendered || 'Frequently Asked Questions';
          setPageTitle(wpTitle);

          // Process the HTML content to extract FAQ items
          if (response.data[0].content?.rendered) {
            processContent(response.data[0].content.rendered);
          }
        } else {
          console.warn('FAQ data not in expected format:', response.data);
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching FAQ content:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  /**
   * Process the HTML content to extract FAQ items
   * @param htmlContent The HTML content from WordPress
   */
  const processContent = (htmlContent: string) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);

    // Create a DOM parser to extract content
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedHtml, 'text/html');

    // Extract question and answer pairs
    // We'll assume questions are in h2-h6 tags (or h1 if used for questions), and answers are the content until the next heading
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedItems: Array<{
      id: number;
      question: string;
      answer: string;
    }> = [];

    headings.forEach((heading, index) => {
      const question = heading.textContent || '';
      let answer = '';

      // Get all elements until the next heading or end of content
      let currentNode = heading.nextElementSibling;
      const answerNodes: Element[] = [];

      while (currentNode && !currentNode.matches('h2, h3, h4, h5, h6')) {
        answerNodes.push(currentNode.cloneNode(true) as Element);
        currentNode = currentNode.nextElementSibling;
      }

      // Create a temporary div to hold the answer HTML
      const tempDiv = document.createElement('div');
      answerNodes.forEach((node) => tempDiv.appendChild(node));
      answer = tempDiv.innerHTML;

      if (question) {
        extractedItems.push({
          id: index,
          question,
          answer,
        });
      }
    });

    setFaqItems(extractedItems);

    // Automatically expand the first item
    if (extractedItems.length > 0) {
      setExpandedItems(new Set([extractedItems[0].id]));
    }
  };

  /**
   * Toggle the expanded state of an FAQ item
   * @param id The ID of the FAQ item to toggle
   */
  const toggleItem = (id: number) => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = new Set(prevExpandedItems);
      if (newExpandedItems.has(id)) {
        newExpandedItems.delete(id);
      } else {
        newExpandedItems.add(id);
      }
      return newExpandedItems;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(id);
    }
  };

  // Show loading skeleton while content is being fetched
  if (isLoading) {
    return <FAQSkeleton />;
  }

  // Handle case when no data is available
  if (error || !pageData || faqItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-base font-sans font-light tracking-custom-wide text-center mb-8">
          FAQ
        </h1>

        {/* Error message - only shown if there's an error */}
        <div
          className="p-4 font-base font-sans font-light tracking-custom-wide"
          role="alert"
          aria-live="assertive"
        >
          <p>Det gick inte att ladda innehållet. Vänligen försök senare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-base font-sans font-light tracking-custom-wide text-center mb-8">
        {pageTitle}
      </h1>

      <div className="space-y-4">
        {faqItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);

          return (
            <div
              key={item.id}
              className="border-t border-[#9B9B9B] overflow-hidden"
            >
              {/* Question button that toggles the answer visibility */}
              <button
                className="w-full px-6 py-4 text-left hover:bg-[#F8F4EC] transition-colors flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                aria-expanded={isExpanded}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span className="font-base font-sans font-light tracking-custom-wide text-custom-gray">
                  {item.question}
                </span>
                <span
                  className={`text-xl ml-2 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                >
                  <span aria-hidden="true">▶</span>
                </span>
              </button>

              {/* Answer content - visible when expanded */}
              <div
                id={`faq-answer-${item.id}`}
                className={`text-base font-sans font-light tracking-custom-wide-xs px-6 py-4 bg-white transition-all duration-300 ${
                  isExpanded ? 'block' : 'hidden'
                }`}
                aria-hidden={!isExpanded}
              >
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQPage;
