import React, { useState, useEffect } from 'react';
import { Category } from './types';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryIds: number[];
  onCategoryClick: (categoryName: string) => void;
  productCountByCategory?: Record<number, number>;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryIds,
  onCategoryClick,
  productCountByCategory = {},
}) => {
  // State för att animera produkträknaren
  const [countDisplay, setCountDisplay] = useState<Record<number, number>>({});

  // Uppdatera räknaren med animation när produkträknaren ändras
  useEffect(() => {
    // Skapa ett timeout för varje kategori för att animera räknaren
    const timeouts: NodeJS.Timeout[] = [];

    categories.forEach((category) => {
      const targetCount = productCountByCategory[category.id] || 0;
      const currentCount = countDisplay[category.id] || 0;

      if (targetCount !== currentCount) {
        // Animera räknaren genom att gradvis uppdatera värdet
        const step = targetCount > currentCount ? 1 : -1;
        let current = currentCount;

        const animateCount = () => {
          current += step;
          setCountDisplay((prev) => ({
            ...prev,
            [category.id]: current,
          }));

          if (
            (step > 0 && current < targetCount) ||
            (step < 0 && current > targetCount)
          ) {
            // Fortsätt animera tills vi når målvärdet
            timeouts.push(setTimeout(animateCount, 20));
          } else {
            // Se till att vi landar exakt på målvärdet
            setCountDisplay((prev) => ({
              ...prev,
              [category.id]: targetCount,
            }));
          }
        };

        // Starta animationen
        timeouts.push(setTimeout(animateCount, 10));
      }
    });

    // Städa upp timeouts när komponenten avmonteras
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [productCountByCategory, categories, countDisplay]);

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isSelected = selectedCategoryIds.includes(category.id);
        const productCount = productCountByCategory[category.id] || 0;
        const displayCount =
          countDisplay[category.id] !== undefined
            ? countDisplay[category.id]
            : productCount;

        return (
          <div key={category.id} className="py-2">
            <button
              className={`w-full text-left flex justify-between items-center p-2 border-b ${
                isSelected ? 'font-bold' : 'font-light'
              }`}
              onClick={() => onCategoryClick(category.name)}
              aria-pressed={isSelected}
            >
              <span>{category.name}</span>
              <div className="flex items-center">
                {isSelected && (
                  <span
                    className="w-2 h-2 bg-black rounded-full mr-2"
                    aria-hidden="true"
                  ></span>
                )}
                <span
                  className={`text-gray-600 min-w-[3rem] text-right ${
                    isSelected ? 'font-bold' : ''
                  }`}
                >
                  ({displayCount})
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
