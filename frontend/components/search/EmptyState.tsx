import { SearchX, Filter } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
    showClearFilters?: boolean;
    onClearFilters?: () => void;
}

export function EmptyState({
    message = "No results found",
    description = "Try adjusting your search terms or filters to find what you're looking for.",
    actionText,
    onAction,
    showClearFilters = false,
    onClearFilters
}: EmptyStateProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchX className="w-8 h-8 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {message}
                </h3>

                <p className="text-gray-600 mb-6">
                    {description}
                </p>

                <div className="space-y-3">
                    {actionText && onAction && (
                        <button
                            onClick={onAction}
                            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            {actionText}
                        </button>
                    )}

                    {showClearFilters && onClearFilters && (
                        <button
                            onClick={onClearFilters}
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            <Filter className="w-4 h-4" />
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
