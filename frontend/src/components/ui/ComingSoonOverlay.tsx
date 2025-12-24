'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComingSoonOverlayProps {
    title: string;
    description: string;
    onBack?: () => void;
}

export function ComingSoonOverlay({ title, description, onBack }: ComingSoonOverlayProps) {
    return (
        <div className="relative min-h-[60vh] flex items-center justify-center p-4">
            {/* Background elements to make it feel "in situ" */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-8">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Card key={i} className="h-32 bg-gray-200 border-dashed border-2" />
                    ))}
                </div>
            </div>

            <Card className="relative z-10 max-w-md w-full p-8 text-center shadow-2xl border-2 border-[#E9F6F5]">
                <div className="w-16 h-16 bg-[#E9F6F5] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8" style={{ color: '#4DA1A9' }} />
                </div>

                <h2 className="text-2xl font-bold mb-3" style={{ color: '#2E5077' }}>
                    {title}
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {description}
                </p>

                <div className="space-y-3">
                    <div className="inline-block px-4 py-1 rounded-full bg-[#79D7BE]/20 text-[#2E5077] text-xs font-bold uppercase tracking-wider mb-4">
                        Coming Soon
                    </div>
                </div>

                {onBack && (
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="mt-4 flex items-center gap-2 mx-auto hover:bg-gray-100"
                        style={{ color: '#2E5077' }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                )}
            </Card>
        </div>
    );
}
