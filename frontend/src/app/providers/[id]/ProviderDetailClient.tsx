'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProviderDetail, type ProviderDetail } from '@/lib/api';
import { MarioProviderHospitalDetail } from '@/components/mario-provider-hospital-detail';
import { MarioAIBookingChat } from '@/components/mario-ai-booking-chat';
import { BottomNav } from '@/components/navigation/BottomNav';
import type { ProviderHospitalPairing } from '@/lib/data/mario-doctors-data';

function ProviderDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const providerId = params.id as string;
    // Support both 'procedure' and 'from_procedure' for compatibility
    const procedureSlug = searchParams.get('procedure') || searchParams.get('from_procedure');
    const { user, loading: authLoading } = useAuth();
    const [provider, setProvider] = useState<ProviderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBookingChat, setShowBookingChat] = useState(false);

    useEffect(() => {
        const fetchProvider = async () => {
            if (!providerId) return;

            setLoading(true);
            setError(null);

            try {
                const data = await getProviderDetail(providerId);
                setProvider(data);
            } catch (err) {
                console.error('Error fetching provider:', err);
                if (err instanceof Error) {
                    if (err.message.includes('404') || err.message.includes('not found')) {
                        setError('Provider not found.');
                    } else {
                        setError(`Failed to load provider details: ${err.message}`);
                    }
                } else {
                    setError('Failed to load provider details. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (providerId) {
            fetchProvider();
        }
    }, [providerId]);

    if (authLoading || loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-4 text-center">
                    <h1 className="text-3xl font-bold">Provider Details</h1>
                    <p className="text-gray-600">Please log in to view provider details.</p>
                    <Link
                        href="/login"
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Go to Login
                    </Link>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
                        {error}
                    </div>
                    <Link
                        href="/procedures"
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Procedures
                    </Link>
                </div>
            </main>
        );
    }

    if (!provider) {
        return (
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-md bg-gray-50 p-8 text-center">
                        <p className="text-gray-600">Provider not found.</p>
                        <button
                            onClick={() => router.push('/procedures')}
                            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                        >
                            ← Back to Procedures
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const handleBack = () => {
        if (procedureSlug) {
            router.push(`/home?procedure=${encodeURIComponent(procedureSlug)}`);
        } else {
            router.push('/home');
        }
    };

    // Convert ProviderDetail to ProviderHospitalPairing format
    const convertToPairing = (provider: ProviderDetail): ProviderHospitalPairing => {
        // Extract price from procedures if available, otherwise use default
        const firstProcedure = provider.procedures && provider.procedures.length > 0 
            ? provider.procedures[0] 
            : null;
        const price = firstProcedure?.price || '$200';

        // Determine hospital ID from address or use default
        let hospitalId = 'ucsf'; // default
        if (provider.address) {
            const addressLower = provider.address.toLowerCase();
            if (addressLower.includes('stanford')) hospitalId = 'stanford';
            else if (addressLower.includes('kaiser')) hospitalId = 'kaiser_mission_bay';
            else if (addressLower.includes('cpmc') || addressLower.includes('sutter')) hospitalId = 'cpmc_van_ness';
        }

        return {
            id: provider.provider_id,
            doctorId: provider.provider_id,
            doctorName: provider.provider_name,
            specialty: 'General Practice', // Default since API doesn't provide specialty
            hospital: provider.address 
                ? `${provider.address}${provider.city ? `, ${provider.city}` : ''}${provider.state ? `, ${provider.state}` : ''}`
                : 'Medical Center',
            hospitalId: hospitalId,
            price: price,
            savings: '10% below average', // Default
            rating: '4.5', // Default
            reviews: '0', // Default
            distance: '2.5 mi', // Default
            network: 'In-Network', // Default
            marioPick: false,
            yearsExperience: 10, // Default
            acceptingNewPatients: true, // Default
            nextAvailable: 'Available soon', // Default
            marioPoints: 100 // Default
        };
    };

    const pairing = convertToPairing(provider);

    return (
        <>
            <MarioProviderHospitalDetail
                pairing={pairing}
                onBookConcierge={() => setShowBookingChat(true)}
                onBack={handleBack}
            />
            <BottomNav />
            <MarioAIBookingChat
                open={showBookingChat}
                onClose={() => setShowBookingChat(false)}
                providerName={provider.provider_name}
            />
        </>
    );
}

export default function ProviderDetailClient() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        }>
            <ProviderDetailContent />
        </Suspense>
    );
}

