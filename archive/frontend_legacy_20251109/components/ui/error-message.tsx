import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorMessage({
    title = 'Error',
    message,
    onRetry,
    className
}: ErrorMessageProps) {
    return (
        <div className={cn('bg-destructive/10 border border-destructive/20 rounded-lg p-4', className)}>
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-destructive">{title}</h3>
                    <p className="text-sm text-muted-foreground">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Connection Error</h3>
                <p className="text-muted-foreground max-w-md">
                    Unable to connect to the server. Please check your internet connection and try again.
                </p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition"
                >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </button>
            )}
        </div>
    );
}

export function EmptyState({
    title,
    message,
    action
}: {
    title: string;
    message: string;
    action?: { label: string; onClick: () => void }
}) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground max-w-md">{message}</p>
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

