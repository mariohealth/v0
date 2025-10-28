'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            duration: 5000, // Default 5 seconds
            ...toast,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, newToast.duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Convenience hooks for different toast types
export function useErrorToast() {
    const { addToast } = useToast();
    return useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'error', title, message, action });
    }, [addToast]);
}

export function useSuccessToast() {
    const { addToast } = useToast();
    return useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'success', title, message, action });
    }, [addToast]);
}

export function useWarningToast() {
    const { addToast } = useToast();
    return useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'warning', title, message, action });
    }, [addToast]);
}

export function useInfoToast() {
    const { addToast } = useToast();
    return useCallback((title: string, message?: string, action?: Toast['action']) => {
        addToast({ type: 'info', title, message, action });
    }, [addToast]);
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getTextColor = () => {
        switch (toast.type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-gray-800';
        }
    };

    return (
        <div
            className={`
                ${getBackgroundColor()} border rounded-lg p-4 shadow-lg
                transform transition-all duration-300 ease-in-out
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${getTextColor()}`}>
                        {toast.title}
                    </h4>
                    {toast.message && (
                        <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
                            {toast.message}
                        </p>
                    )}
                    {toast.action && (
                        <button
                            onClick={toast.action.onClick}
                            className={`mt-2 text-sm font-medium underline ${getTextColor()} hover:opacity-80`}
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className={`flex-shrink-0 ${getTextColor()} hover:opacity-70`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
