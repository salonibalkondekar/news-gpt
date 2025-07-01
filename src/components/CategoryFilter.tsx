'use client';

import { NEWS_CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', title: 'All', icon: '🌐' },
    ...Object.values(NEWS_CATEGORIES)
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Mobile-first responsive category navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-medium text-sm 
                transition-all duration-200 whitespace-nowrap min-h-[44px] min-w-[44px]
                ${activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }
              `}
            >
              <span className="text-base sm:text-lg">{category.icon}</span>
              <span className="text-xs sm:text-sm font-medium">{category.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
