"use client";

import { useEffect, useRef, useState } from 'react';

interface LazyLoadProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
    className?: string;
}

export function LazyLoad({
    children,
    fallback = null,
    threshold = 0.1,
    rootMargin = '50px',
    className = ''
}: LazyLoadProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasLoaded) {
                    setIsVisible(true);
                    setHasLoaded(true);
                    observer.disconnect();
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, hasLoaded]);

    return (
        <div ref={elementRef} className={className}>
            {isVisible ? children : fallback}
        </div>
    );
}
