'use client';

import { useState, useCallback } from 'react';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
}

let toastId = 0;

export function useToast() {
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

    return {
        toast,
        dismiss,
        toasts,
    };
}

