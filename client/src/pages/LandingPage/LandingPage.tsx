import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WpPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

const LandingPage: React.FC = () => {
  const [page, setPage] = useState<WpPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://grapeceramics.se/wp-json/wp/v2/pages?slug=startsida'
        );
        console.log(response.data);
        if (response.data.length > 0) {
          setPage(response.data[0]);
        } else {
          setError('No data found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      {/* Renderar HTML-innehållet (inkl. ev. video-block) */}
      <div
        dangerouslySetInnerHTML={{ __html: page?.content?.rendered || '' }}
      />

      {/* Visa även sidans titel som backup */}
      <h1>{page?.title?.rendered}</h1>
    </section>
  );
};

export default LandingPage;
