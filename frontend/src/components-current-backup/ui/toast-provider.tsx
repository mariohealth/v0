'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
}

interface ToastContextType {
    toast: (toast: Omit<Toast, 'id'>) => string;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((toastData: Omit<Toast, 'id'>) => {
        const id = `toast-${toastId++}`;
        const newToast: Toast = {
            id,
            duration: 5000,
            ...toastData,
        };

        setToasts((prev) => [...prev, newToast]);

        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, newToast.duration);
        }

        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3 min-w-[300px]"
                        >
                            <div className="flex-1">
                                {toast.title && (
                                    <h4 className="font-semibold text-gray-900 mb-1">{toast.title}</h4>
                                )}
                                {toast.description && (
                                    <p className="text-sm text-gray-600">{toast.description}</p>
                                )}
                                {toast.action && <div className="mt-2">{toast.action}</div>}
                            </div>
                            <button
                                onClick={() => dismiss(toast.id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

