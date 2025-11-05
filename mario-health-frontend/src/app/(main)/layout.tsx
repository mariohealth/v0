'use client'

import { DesktopNav, BottomNav } from '@/components/mario-navigation'
import { MarioPointsProvider } from '@/lib/contexts/mario-points-context'
import { Toaster } from 'sonner'

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MarioPointsProvider>
            <DesktopNav />
            <main className="min-h-screen pb-14 md:pb-0 md:pt-16">
                {children}
            </main>
            <BottomNav />
            <Toaster position="bottom-center" richColors />
        </MarioPointsProvider>
    );
}

