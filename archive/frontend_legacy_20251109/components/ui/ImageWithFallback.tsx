import { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    fallback?: string;
    className?: string;
    width?: number;
    height?: number;
}

export function ImageWithFallback({
    src,
    alt,
    fallback = '/placeholder-image.jpg',
    className = '',
    width,
    height
}: ImageWithFallbackProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setLoading(false);
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
    };

    return (
        <div className={`relative ${className}`}>
            {loading && (
                <div
                    className="animate-pulse bg-gray-200 absolute inset-0 flex items-center justify-center"
                    style={{ width, height }}
                >
                    <div className="text-gray-400 text-sm">Loading...</div>
                </div>
            )}
            <img
                src={error ? fallback : src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                style={{ width, height }}
            />
        </div>
    );
}
