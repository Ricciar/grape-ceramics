import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FooterSkeleton from './FooterSkeleton';

const Footer: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get('/api/pages?slug=sidfot');
        console.log('footercontent:', response.data);
        if (response.data && response.data.length > 0) {
          setContent(response.data[0]?.content?.rendered || '');
        }
      } catch (error) {
        console.error('Error fetching footer content:', error);
        setError(true);
        setContent(
          '<p>Det gick inte att ladda innehållet. Vänligen försök igen senare.</p>'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    <FooterSkeleton />;
  }

  return (
    <footer
      className="bg-neutral-50 py-10 px-4 text-center font-light text-gray-700"
      aria-label="Contact information"
    >
      <div>{content}</div>
      {error && (
        <div className="mt-4 p-2">
          <p>Det gick inte att ladda innehållet. Vänligen försök senare.</p>
        </div>
      )}
    </footer>
  );
};

export default Footer;
