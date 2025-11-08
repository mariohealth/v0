'use client';

import { useState } from 'react';
import { ProviderImage } from '@/lib/mockData';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ProviderGallery({ images }: { images: ProviderImage[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Fallback images if none provided
    const displayImages = images.length > 0 ? images : [
        {
            id: 'placeholder1',
            url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format',
            alt: 'Hospital Facility',
            type: 'facility' as const
        }
    ];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    };

    const previousImage = () => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Main Image Display */}
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={displayImages[currentIndex].url}
                        alt={displayImages[currentIndex].alt}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                    />

                    {/* Navigation Buttons */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                onClick={previousImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-800" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-800" />
                            </button>
                        </>
                    )}

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentIndex + 1} / {displayImages.length}
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2 rounded-lg shadow-lg transition-all text-sm font-medium"
                    >
                        View Fullscreen
                    </button>
                </div>

                {/* Thumbnail Strip */}
                {displayImages.length > 1 && (
                    <div className="p-4 bg-gray-50">
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {displayImages.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-3 transition-all ${index === currentIndex
                                        ? 'border-[#00BFA6] shadow-lg scale-105'
                                        : 'border-gray-200 hover:border-[#00BFA6]/50 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8 text-white" />
                    </button>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={displayImages[currentIndex].url}
                        alt={displayImages[currentIndex].alt}
                        className="max-w-full max-h-full object-contain"
                    />

                    {displayImages.length > 1 && (
                        <>
                            <button
                                onClick={previousImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}