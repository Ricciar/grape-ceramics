import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { WPPage } from "../MainPage/types";

/** WordPress-endpointen som Om mig-sidan använder */
const WP_CONTACT_ENDPOINT =
  "https://www.grapeceramics.se/wp-json/grape/v1/contact";

/** Skelett – samma känsla som OM MIG */
const BestallningSkeleton: React.FC = () => (
  <div className="w-full flex justify-center font-sans font-light">
    <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
      </div>
    </div>
  </div>
);

const BestallningPage: React.FC = () => {
  const [pageData, setPageData] = useState<WPPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    quantity: "",
    size: "",
    glaze: "",
    message: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await axios.get(`/api/pages?slug=bestallning`);
        if (Array.isArray(resp.data) && resp.data.length > 0) {
          setPageData(resp.data[0]);
        } else if (resp.data?.bestallning) {
          setPageData(resp.data.bestallning);
        } else {
          throw new Error("No page content");
        }
      } catch (e) {
        console.error(e);
        setError("Kunde inte hämta innehållet.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // <-- DU SAKNADE DENNA FUNKTION, därför errors
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitted(false);
    setIsSending(true);

    // Samma grundvalidering som på Om mig
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError("Fyll i namn, e-post och meddelande.");
      setIsSending(false);
      return;
    }

    try {
      await axios.post(WP_CONTACT_ENDPOINT, {
        // fält lika namngivna som på Om mig
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,

        // extra fält för beställning
        product: formData.product,
        quantity: formData.quantity,
        size: formData.size,
        glaze: formData.glaze,

        source: "bestallning",
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        product: "",
        quantity: "",
        size: "",
        glaze: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Beställningsformulär – fel vid skick:", err);
      const apiMsg =
        err?.response?.data?.error ||
        "Kunde inte skicka meddelandet just nu. Försök igen om en stund.";
      setSubmitError(apiMsg);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <BestallningSkeleton />;

  if (error) {
    return (
      <div className="w-full flex justify-center font-sans font-light">
        <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mb-6">
            BESTÄLLNING
          </h1>
          <p className="text-[#1C1B1F]">{error}</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="w-full flex justify-center font-sans font-light">
        <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mb-6">
            BESTÄLLNING
          </h1>
          <p>Innehållet saknas just nu.</p>
        </div>
      </div>
    );
  }

  const safeHtml = DOMPurify.sanitize(pageData.content?.rendered || "");

  return (
    <div className="w-full flex justify-center font-sans font-light">
      <div className="w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Rubrik – identisk med OM MIG */}
        <h1 className="font-sans text-[24px] font-light tracking-[4.56px] mb-6">
          {pageData.title?.rendered || "BESTÄLLNING"}
        </h1>

        {/* Brödtext – identisk med OM MIG */}
        {safeHtml && (
          <div
            className="prose prose-sm sm:prose-base max-w-none mb-8 sm:mb-12"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        )}

        {/* Formulär */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Namn *
              </label>
              <input
                required
                id="name"
                name="name"
                type="text"
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
                required
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Telefonnummer
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="product">
                Val av produkt (ex. Skål, Kopp, Vas)
              </label>
              <input
                id="product"
                name="product"
                type="text"
                value={formData.product}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="quantity">
                Antal
              </label>
              <input
                id="quantity"
                name="quantity"
                type="text"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="size">
                Ungefärlig storlek (om relevant)
              </label>
              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="glaze">
                Glasyr och lera
              </label>
              <input
                id="glaze"
                name="glaze"
                type="text"
                value={formData.glaze}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Meddelande *
            </label>
            <textarea
              required
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 font-sans font-light"
            />
          </div>

          {/* Skicka */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSending}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed font-sans font-light"
            >
              {isSending ? "Skickar…" : "Skicka"}
            </button>
            {submitted && (
              <span className="text-green-600">Tack! Din förfrågan är skickad.</span>
            )}
            {submitError && <span className="text-red-600">{submitError}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BestallningPage;
