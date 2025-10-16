import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from '../MainPage/types';
import { SkeletonContactPage } from './SkeletonContactPage';

const WP_CONTACT_ENDPOINT =
  'https://www.grapeceramics.se/wp-json/grape/v1/contact';

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

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Hämta *Kontakt* sidan från WP (slug: kontakt)
        const response = await axios.get(`/api/pages?slug=kontakt`);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setPageData(response.data[0]);
        } else if (response.data && response.data.kontakt) {
          setPageData(response.data.kontakt);
        } else {
          throw new Error('Unexpected response format');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Kunde inte hämta kontaktinformationen. Försök igen senare.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Grundvalidering
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Fyll i namn, e-post och meddelande.');
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(WP_CONTACT_ENDPOINT, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: 'kontakt',
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      console.error('Kontaktformulär – fel vid skick:', err);
      const apiMsg =
        err?.response?.data?.error ||
        'Kunde inte skicka just nu. Försök igen om en stund.';
      setSubmitError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SkeletonContactPage />;

  if (error) {
    return (
      <div className="error-container font-sans font-light px-4 py-8 max-w-3xl mx-auto">
        <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mb-6">
          OM MIG
        </h1>
        <p className="text-[#1C1B1F]">{error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="no-data-container font-sans font-light px-4 py-8 max-w-3xl mx-auto">
        <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mb-6">
          OM MIG
        </h1>
        <p>Ingen kontaktinformation tillgänglig just nu.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center font-sans font-light">
      <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Rubrik – samma som produkt/kurs */}
        <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mb-6">
          {pageData.title?.rendered || 'OM MIG'}
        </h1>

        {/* Text från WordPress */}
        {pageData.content?.rendered && (
          <div
            className="prose prose-sm sm:prose-base max-w-none mb-8 sm:mb-12"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(pageData.content.rendered),
            }}
          />
        )}

        {/* Formulär */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Namn & E-post (obligatoriska) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Namn *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
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
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
              />
            </div>
          </div>

          {/* Telefon (valfri) */}
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
              className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
            />
          </div>

          {/* Meddelande (obligatoriskt) */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Meddelande *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
            />
          </div>

          {/* Skickaknapp */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 font-sans font-light"
            >
              {submitting ? 'Skickar…' : 'Skicka'}
            </button>

            {submitted && (
              <p className="text-green-600">
                Tack! Ditt meddelande har skickats.
              </p>
            )}
            {submitError && (
              <p className="text-red-600">
                {submitError}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
