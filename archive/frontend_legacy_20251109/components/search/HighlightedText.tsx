'use client';

/**
 * Highlighted Text Component
 * 
 * Highlights search terms in text
 */

interface HighlightedTextProps {
    text: string;
    searchTerms: string[];
}

export function HighlightedText({ text, searchTerms }: HighlightedTextProps) {
    if (searchTerms.length === 0) {
        return <>{text}</>;
    }

    // Create regex to match all search terms (case-insensitive)
    const regex = new RegExp(
        `(${searchTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
        'gi'
    );

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) => {
                const isMatch = searchTerms.some(
                    term => part.toLowerCase() === term.toLowerCase()
                );

                return isMatch ? (
                    <mark key={index} className="bg-yellow-200 text-gray-900 font-medium">
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                );
            })}
        </>
    );
}

