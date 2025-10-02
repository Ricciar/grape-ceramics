import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from '../MainPage/types';
import { SkeletonContactPage } from './SkeletonContactPage';

const ContactPage: React.FC = () => {
  const [pageData, setPageData] = useState<WPPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/pages?slug=kontakt`);

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
        setError('Kunde inte hämta kontaktinformationen. Försök igen senare.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulär skickat:', formData);
    setSubmitted(true);
    // TODO: koppla till backend/mailservice
  };

  if (loading) return <SkeletonContactPage />;

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
        <p>Ingen kontaktinformation tillgänglig just nu.</p>
      </div>
    );
  }

    return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-6 py-12 font-sans">
        <h1 className="text-3xl font-normal text-center mb-8">
          {pageData.title?.rendered || 'Kontakt'}
        </h1>

        {pageData.content?.rendered && (
          <div
            className="prose max-w-none mb-12 text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(pageData.content.rendered),
            }}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Namn
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                E-post *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Telefonnummer
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Meddelande
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Skicka
          </button>

          {submitted && (
            <p className="text-green-600 mt-2">
              Tack för ditt meddelande! Vi återkommer så snart vi kan.
            </p>
          )}
        </form>
      </div>
    </div>
  );

};

export default ContactPage;
