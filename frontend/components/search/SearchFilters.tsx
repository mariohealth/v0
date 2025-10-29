"use client";

import { useState } from "react";
import { Sliders, ChevronDown, ChevronUp } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  types: string[];
  minRating: number;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const providerTypes = [
    { value: "hospital", label: "Hospital" },
    { value: "clinic", label: "Clinic" },
    { value: "imaging_center", label: "Imaging Center" },
    { value: "lab", label: "Laboratory" },
  ];

  const ratingOptions = [
    { value: 0, label: "All Ratings" },
    { value: 4.0, label: "4.0+ Stars" },
    { value: 4.5, label: "4.5+ Stars" },
  ];

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    applyFilters(priceRange, newTypes, minRating);
  };

  const handlePriceChange = (value: number, index: 0 | 1) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
    applyFilters(newRange, selectedTypes, minRating);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    applyFilters(priceRange, selectedTypes, rating);
  };

  const applyFilters = (
    price: [number, number],
    types: string[],
    rating: number
  ) => {
    onFilterChange({
      priceRange: price,
      types,
      minRating: rating,
    });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedTypes([]);
    setMinRating(0);
    applyFilters([0, 2000], [], 0);
  };

  const hasActiveFilters =
    selectedTypes.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 2000;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
                  className="w-full accent-emerald-500"
                />
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Provider Type */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Provider Type</h4>
            <div className="space-y-2">
              {providerTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={() => handleTypeToggle(type.value)}
                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === option.value}
                    onChange={() => handleRatingChange(option.value)}
                    className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Insurance (for future) */}
          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                disabled
              />
              <span className="text-sm text-gray-400">
                Accepts my insurance (coming soon)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}