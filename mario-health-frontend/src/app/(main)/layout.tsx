import type { Metadata } from "next";
import { DesktopNav, BottomNav } from '@/components/mario-navigation'

export const metadata: Metadata = {
    title: "Mario Health - Healthcare Price Comparison",
    description: "Compare healthcare prices and find affordable providers",
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <DesktopNav />
            <main className="min-h-screen pb-14 md:pb-0">
                {children}
            </main>
            <BottomNav />
        </>
    );
}

