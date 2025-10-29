"use client";

import { useState, useEffect } from "react";
import { Provider } from "@/lib/mockData";
import ProviderDetailHeader from "@/components/provider/ProviderDetailHeader";
import ProviderGallery from "@/components/provider/ProviderGallery";
import ProviderInfo from "@/components/provider/ProviderInfo";
import ProviderReviews from "@/components/provider/ProviderReviews";
import BookingSection from "@/components/booking/BookingSection";
import { SkeletonProviderDetail } from "@/components/ui/SkeletonCard";

interface ProviderDetailProps {
    providerId: string;
}

export default function ProviderDetail({ providerId }: ProviderDetailProps) {
    const [provider, setProvider] = useState<Provider | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchProvider = async () => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // In real app, this would be an API call
                // const response = await fetch(`/api/providers/${providerId}`);
                // const data = await response.json();

                // For now, use mock data
                const mockProviders = await import("@/lib/mockData").then(m => m.mockProviders);
                const foundProvider = mockProviders.find((p) => p.id === providerId);

                if (!foundProvider) {
                    throw new Error("Provider not found");
                }

                setProvider(foundProvider);
            } catch (error) {
                console.error("Failed to fetch provider:", error);
                // Handle error - could redirect to 404 or show error state
            } finally {
                setIsLoading(false);
            }
        };

        fetchProvider();
    }, [providerId]);

    if (isLoading) {
        return <SkeletonProviderDetail />;
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
                    <p className="text-gray-600 mb-6">The provider you're looking for doesn't exist.</p>
                    <a
                        href="/search"
                        className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Back to Search
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ProviderDetailHeader provider={provider} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <ProviderGallery images={provider.images || []} />
                        <ProviderInfo provider={provider} />
                        <ProviderReviews reviews={provider.reviews || []} rating={provider.rating} />
                    </div>

                    {/* Right Column - Booking */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            <BookingSection provider={provider} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
