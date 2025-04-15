import React, { useState, useEffect, useMemo } from 'react';
import { Category, FilterMenuProps } from './types';
import CategoryList from './CatergoryList';
import CategorySkeleton from './CategorySkeleton';

const FilterMenu: React.FC<FilterMenuProps> = ({
  isOpen = false,
  onClose,
  products = [],
  onFilterProducts,
}) => {
  const extractCategories = useMemo(() => {
    return Array.from(
      products
        .flatMap((product) => product.categories || [])
        .reduce((map, category) => map.set(category.id, category), new Map())
        .values()
    );
  }, [products]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(products.length === 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      setCategories(extractCategories);
      setLoading(false);
    }
  }, [products, extractCategories]);
  // Ladda tidigare valda kategorier från localStorage när komponenten monteras
  useEffect(() => {
    // Ladda sparade kategorival från localStorage
    try {
      const savedCategories = localStorage.getItem('selectedCategories');
      if (savedCategories) {
        setSelectedCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Fel vid laddning av sparade kategorier:', error);
      // Vid fel, fortsätt utan sparade kategorier
    }
  }, []);

  // Memoizera filtrerade produkter för prestandaoptimering
  console.log('Filtrerar produkter...');
  console.log('produkter:', products);
  console.log('valda kategorier:', selectedCategories);
  const filteredProducts = useMemo(() => {
    if (products && selectedCategories.length > 0) {
      // Filtrera produkter baserat på valda kategori-IDs
      // En produkt visas om den tillhör NÅGON av de valda kategorierna
      return products.filter(
        (product) =>
          product.categories &&
          product.categories.some((cat) => selectedCategories.includes(cat.id))
      );
    } else {
      // Om inga kategorier är valda, visa alla produkter
      return products;
    }
  }, [products, selectedCategories]);

  // Beräkna antalet produkter som kommer att visas (också memoizerad)
  const filteredProductsCount = filteredProducts.length;

  // Beräkna antalet produkter per kategori (för att visa i gränssnittet)
  const productCountByCategory = useMemo(() => {
    const countMap: Record<number, number> = {};

    // Om inga produkter finns, returnera en tom map
    if (!products || products.length === 0) return countMap;

    // För varje produkt, räkna den till varje kategori den tillhör
    products.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((category) => {
          if (!countMap[category.id]) {
            countMap[category.id] = 0;
          }
          countMap[category.id]++;
        });
      }
    });

    return countMap;
  }, [products]);

  // Funktion för att hantera kategori-klick
  const handleCategoryClick = (categoryName: string) => {
    const selectedCategory = categories.find(
      (cat) => cat.name === categoryName
    );

    if (selectedCategory) {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(selectedCategory.id)) {
          return prevSelected.filter((id) => id !== selectedCategory.id);
        } else {
          return [...prevSelected, selectedCategory.id];
        }
      });
    }
  };

  // Funktion för att tillämpa filter när "Visa produkter" klickas
  const applyFilters = () => {
    // Skicka filtrerade produkter till förälder
    if (onFilterProducts) {
      onFilterProducts(filteredProducts);
    }

    // Spara valda kategorier i localStorage för att bevara dem mellan sessioner
    localStorage.setItem(
      'selectedCategories',
      JSON.stringify(selectedCategories)
    );

    // Stäng filtermenyn
    if (onClose) {
      onClose();
    }
  };

  // Funktion för att rensa alla filter
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // Hantera öppning och stängning av filtermenyn
  useEffect(() => {
    if (isOpen) {
      // Steg 1: Visa elementet
      setIsAnimating(true);
      setIsVisible(false);

      // Steg 2: Kort fördröjning för att säkerställa att DOM har uppdaterats
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      return () => clearTimeout(showTimer);
    } else if (isAnimating) {
      // Steg 1: Starta utgångsanimation
      setIsVisible(false);

      // Steg 2: Vänta tills animationen är klar
      const hideTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      return () => clearTimeout(hideTimer);
    }
  }, [isOpen, isAnimating]);

  if (!isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
    >
      {/* Bakgrundsöverlappning */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{ opacity: isVisible ? 0.5 : 0 }}
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      ></div>

      {/* Filtermenyn */}
      <div
        className="relative w-full bg-white shadow-lg transform"
        style={{
          maxHeight: '85vh',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.6s cubic-bezier(0.61, 1, 0.88, 1)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        {/* Drag indicator */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Innehåll */}
        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: 'calc(85vh - 40px)' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              id="filter-title"
              className="text-lg font-light tracking-[2.85px]"
            >
              FILTER
            </h2>
            <button
              className="p-2 text-2xl"
              onClick={onClose}
              aria-label="Stäng filtermenyn"
            >
              ×
            </button>
          </div>

          {/* Filterkategorier med skeleton loader */}
          {loading ? (
            <CategorySkeleton count={categories.length || 3} />
          ) : (
            <CategoryList
              categories={categories}
              selectedCategoryIds={selectedCategories}
              onCategoryClick={handleCategoryClick}
              productCountByCategory={productCountByCategory}
            />
          )}

          {/* Knappar för att hantera filter */}
          <div className="mt-6 flex flex-col gap-3">
            {selectedCategories.length > 0 && (
              <button
                className="w-full border border-black text-black py-2 font-light tracking-[2.85px]"
                onClick={clearFilters}
              >
                Rensa filter
              </button>
            )}

            <button
              className="w-full bg-black text-white py-2 font-light tracking-[2.85px]"
              onClick={applyFilters}
              aria-live="polite"
              aria-atomic="true"
            >
              {selectedCategories.length > 0
                ? `Visa ${filteredProductsCount} produkter`
                : 'Visa alla produkter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
