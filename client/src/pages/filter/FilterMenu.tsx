import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem('selectedCategories');
      if (savedCategories) setSelectedCategories(JSON.parse(savedCategories));
    } catch {}
  }, []);

  const filteredProducts = useMemo(() => {
    if (products && selectedCategories.length > 0) {
      return products.filter(
        (product) =>
          product.categories &&
          product.categories.some((cat) => selectedCategories.includes(cat.id))
      );
    }
    return products;
  }, [products, selectedCategories]);

  const filteredProductsCount = filteredProducts.length;

  const productCountByCategory = useMemo(() => {
    const countMap: Record<number, number> = {};
    if (!products || products.length === 0) return countMap;
    products.forEach((product) => {
      product.categories?.forEach((category) => {
        if (!countMap[category.id]) countMap[category.id] = 0;
        countMap[category.id]++;
      });
    });
    return countMap;
  }, [products]);

  const handleCategoryClick = useCallback((categoryName: string) => {
    const selectedCategory = categories.find((cat) => cat.name === categoryName);
    if (!selectedCategory) return;
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(selectedCategory.id)
        ? prevSelected.filter((id) => id !== selectedCategory.id)
        : [...prevSelected, selectedCategory.id]
    );
  }, [categories]);

  const applyFilters = useCallback(() => {
    onFilterProducts?.(filteredProducts);
    try {
      localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    } catch {}
    onClose?.();
  }, [filteredProducts, onFilterProducts, selectedCategories, onClose]);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setIsVisible(false);
      const showTimer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(showTimer);
    } else if (isAnimating) {
      setIsVisible(false);
      const hideTimer = setTimeout(() => setIsAnimating(false), 600);
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
      {/* Bakgrund */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{ opacity: isVisible ? 0.5 : 0 }}
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      ></div>

      {/* Panel */}
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
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 40px)' }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 id="filter-title" className="text-lg font-light tracking-[2.85px]">
              FILTER
            </h2>
            <button className="p-2 text-2xl" onClick={onClose} aria-label="Stäng filtermenyn">
              ×
            </button>
          </div>

          {/* Kategorier */}
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

          {/* Knappar */}
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

export default React.memo(FilterMenu);
