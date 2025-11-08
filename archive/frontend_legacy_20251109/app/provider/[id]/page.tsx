import { notFound } from 'next/navigation';
import { mockProviders } from '@/lib/mockData';
import ProviderDetailHeader from '@/components/provider/ProviderDetailHeader';
import ProviderGallery from '@/components/provider/ProviderGallery';
import ProviderInfo from '@/components/provider/ProviderInfo';
import ProviderReviews from '@/components/provider/ProviderReviews';
import BookingSection from '@/components/booking/BookingSection';

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log('ProviderDetailPage - params.id:', id);
    console.log('ProviderDetailPage - mockProviders count:', mockProviders.length);

    const provider = mockProviders.find((p) => p.id === id);
    console.log('ProviderDetailPage - found provider:', provider?.name || 'NOT FOUND');

    if (!provider) {
        console.log('ProviderDetailPage - Provider not found, calling notFound()');
        notFound();
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
