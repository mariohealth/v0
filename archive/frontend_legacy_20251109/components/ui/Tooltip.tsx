'use client';

/**
 * Tooltip Component
 * 
 * Provides accessible tooltips with:
 * - Mouse hover and keyboard focus
 * - Position customization
 * - Mobile-friendly touch interactions
 */

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
    content: string | React.ReactNode;
    children?: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    triggerIcon?: boolean;
}

export function Tooltip({
    content,
    children,
    position = 'bottom',
    className = '',
    triggerIcon = false
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const showTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(true);
    };

    const hideTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 100);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-border',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-border',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-border',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-border',
    };

    const triggerElement = triggerIcon ? (
        <button
            type="button"
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
            aria-label="More information"
        >
            <Info className="w-3 h-3" />
        </button>
    ) : children;

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {triggerElement}
            </div>

            {isVisible && (
                <div
                    className={`absolute z-50 px-3 py-2 text-sm text-foreground bg-popover border border-border rounded-lg shadow-lg max-w-xs ${positionClasses[position]}`}
                    role="tooltip"
                >
                    <div className="relative">
                        {typeof content === 'string' ? (
                            <p className="whitespace-normal">{content}</p>
                        ) : (
                            content
                        )}
                        {/* Arrow */}
                        <div
                            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

