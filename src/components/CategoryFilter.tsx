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
    <div className="mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Horizontal scroll, Desktop: Centered */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center lg:justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm 
                transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${activeCategory === category.id
                  ? 'button-primary text-white shadow-lg'
                  : 'button-secondary hover:border-accent-primary'
                }
              `}
            >
              <span className="text-base">{category.icon}</span>
              <span className="hidden sm:inline">{category.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
