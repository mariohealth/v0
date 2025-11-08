'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
    trigger: boolean;
    onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (trigger) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                onComplete?.();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [trigger, onComplete]);

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => {
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        const left = Math.random() * 100;
                        const delay = Math.random() * 0.5;
                        const duration = 2 + Math.random() * 1;

                        return (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: color,
                                    left: `${left}%`,
                                    top: '-10px',
                                }}
                                initial={{ y: 0, rotate: 0, opacity: 1 }}
                                animate={{
                                    y: window.innerHeight + 100,
                                    rotate: 360,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration,
                                    delay,
                                    ease: 'easeOut',
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </AnimatePresence>
    );
}

