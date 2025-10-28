import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="animate-pulse bg-card border rounded-lg p-6">
            <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="pt-4 border-t">
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse bg-card border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

