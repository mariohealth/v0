'use client';

import type { Category } from '../lib/transforms';

interface CategoryCardProps {
    category: Category;
    onClick?: () => void;
    className?: string;
}

/**
 * CategoryCard component displays a category with emoji, name, description, and procedure count.
 * Includes hover effects, shadow, and rounded corners.
 */
export function CategoryCard({ category, onClick, className = '' }: CategoryCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
        bg-white rounded-lg border border-gray-200 p-6
        shadow-sm hover:shadow-md
        transition-all duration-200
        cursor-pointer
        hover:border-blue-300 hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {/* Emoji and Name */}
            <div className="flex items-start gap-4 mb-3">
                <div className="text-4xl flex-shrink-0">
                    {category.emoji || '📋'}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {category.name}
                    </h3>
                    {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Procedure Count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {category.familyCount === 1 ? '1 family' : `${category.familyCount} families`}
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                        View →
                    </span>
                </div>
            </div>
        </div>
    );
}

