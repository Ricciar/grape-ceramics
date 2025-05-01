import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from '../MainPage/types';
import { SkeletonContactPage } from './SkeletonContactPage';

/**
 * ContactPage component fetches and displays contact information from WordPress
 */
const ContactPage: React.FC = () => {
  const [pageData, setPageData] = useState<WPPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/pages?slug=kontakt`);

        console.log('API Response:', response.data);

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setPageData(response.data[0]);
        } else if (response.data && response.data.kontakt) {
          setPageData(response.data.kontakt);
        } else {
          throw new Error('Unexpected response format');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <SkeletonContactPage />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="no-data-container">
        <p>No contact information available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="contact-page-container max-w-[700px] font-sans tracking-custom-wide-2 mt-[20px] mb-[20px] pl-[49px] pr-[49px]">
        <h1 className="text-[24px] mb-[20px]">
          {pageData.title?.rendered || 'Contact'}
        </h1>

        {/* Safely render HTML content from WordPress */}
        {pageData.content?.rendered && (
          <div
            className="content text-[16px]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(pageData.content.rendered),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContactPage;
