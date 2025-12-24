'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Heart,
    Star,
    CheckCircle2,
    MapPin,
    Phone,
    Clock,
    Copy,
    Navigation,
    User
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProviderDetail, type ProviderDetail } from '@/lib/api';
import { MarioAIBookingChat } from '@/components/mario-ai-booking-chat';
import { BottomNav } from '@/components/navigation/BottomNav';

function ProviderDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const providerId = params.id as string;
    const procedureSlug = searchParams.get('procedure') || searchParams.get('from_procedure');
    const { user, loading: authLoading } = useAuth();
    const [provider, setProvider] = useState<ProviderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBookingChat, setShowBookingChat] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSaved, setIsSaved] = useState(false);


    useEffect(() => {
        const fetchProvider = async () => {
            if (!providerId) {
                console.warn('[ProviderDetail] No providerId found in params');
                return;
            }
            
            if (providerId === 'placeholder') {
                console.log('[ProviderDetail] Placeholder ID detected, waiting for hydration...');
                return;
            }

            console.log('[ProviderDetail] Fetching data for provider:', providerId);
            setLoading(true);
            setError(null);
            try {
                const data = await getProviderDetail(providerId);
                console.log('[ProviderDetail] Data fetched successfully:', data.provider_name);
                setProvider(data);
            } catch (err) {
                console.error('[ProviderDetail] Error fetching provider:', err);
                if (err instanceof Error) {
                    if (err.message.includes('404') || err.message.includes('not found')) {
                        setError('Provider not found in our database.');
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
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const hospitalLocations: Record<string, {
        address: string;
        phone: string;
        hours: string;
        lat: number;
        lng: number;
    }> = {
        default: {
            address: provider.address || '505 Parnassus Ave, San Francisco, CA 94143',
            phone: provider.phone || '(415) 476-1000',
            hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
            lat: 37.7626,
            lng: -122.4574
        }
    };

    const costComparisonData = [
        { name: 'This Provider', cost: 225, color: '#2E5077' },
        { name: 'Dr. Park (UCSF)', cost: 235, color: '#E5E7EB' },
        { name: 'Dr. Chen (CPMC)', cost: 240, color: '#E5E7EB' },
        { name: 'Dr. Wong (Stanford)', cost: 245, color: '#E5E7EB' }
    ];

    const location = hospitalLocations.default;
    const hospitalName = provider.address
        ? `${provider.address}${provider.city ? `, ${provider.city}` : ''}${provider.state ? `, ${provider.state}` : ''}`
        : 'Medical Center';
    const distance = '2.3 mi';
    const specialty = 'General Practice';

    const firstProcedure = provider.procedures && provider.procedures.length > 0
        ? provider.procedures[0]
        : null;
    const price = firstProcedure?.price || '$200';
    const currentCost = parseInt(price.replace(/[^0-9]/g, ''));
    const maxCost = Math.max(...costComparisonData.map(d => d.cost));
    const savingsPercent = 10;

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(location.address);
            console.log('Address copied to clipboard');
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    const handleGetDirections = () => {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
        window.open(mapsUrl, '_blank');
    };

    const handleCall = () => {
        window.location.href = `tel:${location.phone}`;
    };

    return (
        <>
            <div className="min-h-screen bg-[#F9FAFB] pb-32 md:pb-8">
                <div
                    className="bg-white sticky top-0 z-20"
                    style={{
                        borderBottom: '1px solid #E5E7EB',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={handleBack}
                                className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
                                style={{ minWidth: '44px', minHeight: '44px' }}
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
                            </button>

                            <h1
                                className="flex-1 truncate text-center"
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#2E5077'
                                }}
                            >
                                {provider.provider_name}
                            </h1>

                            <button
                                onClick={() => setIsSaved(!isSaved)}
                                className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
                                style={{ minWidth: '44px', minHeight: '44px' }}
                                aria-label={isSaved ? 'Remove from saved' : 'Save provider'}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                                    style={{ color: isSaved ? '#EF4444' : '#6B7280' }}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="flex flex-col items-center text-center">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    border: '3px solid #2E5077'
                                }}
                            >
                                <User className="w-10 h-10" style={{ color: '#2E5077' }} />
                            </div>

                            <h2
                                style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#2E5077',
                                    marginBottom: '4px'
                                }}
                            >
                                {provider.provider_name}
                            </h2>
                            <p
                                style={{
                                    fontSize: '16px',
                                    color: '#6B7280',
                                    marginBottom: '8px'
                                }}
                            >
                                {specialty}
                            </p>

                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-4 h-4" style={{ color: '#4DA1A9' }} />
                                <p
                                    style={{
                                        fontSize: '15px',
                                        color: '#2E5077',
                                        fontWeight: '500'
                                    }}
                                >
                                    {hospitalName}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-current" style={{ color: '#FBBF24' }} />
                                    <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                                        4.5
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#6B7280' }}>
                                        (0 reviews)
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" style={{ color: '#79D7BE' }} />
                                    <span style={{ fontSize: '14px', color: '#79D7BE', fontWeight: '500' }}>
                                        In-Network
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white" style={{ borderTop: '1px solid #E5E7EB' }}>
                    <div className="max-w-4xl mx-auto">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList
                                className="w-full grid grid-cols-3 h-auto bg-transparent p-0"
                                style={{ borderRadius: 0 }}
                            >
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-transparent rounded-none h-12"
                                    style={{
                                        borderBottom: activeTab === 'overview' ? '3px solid #2E5077' : '3px solid transparent',
                                        color: activeTab === 'overview' ? '#2E5077' : '#6B7280',
                                        fontWeight: activeTab === 'overview' ? '600' : '400',
                                        fontSize: '15px'
                                    }}
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="costs"
                                    className="data-[state=active]:bg-transparent rounded-none h-12"
                                    style={{
                                        borderBottom: activeTab === 'costs' ? '3px solid #2E5077' : '3px solid transparent',
                                        color: activeTab === 'costs' ? '#2E5077' : '#6B7280',
                                        fontWeight: activeTab === 'costs' ? '600' : '400',
                                        fontSize: '15px'
                                    }}
                                >
                                    Costs
                                </TabsTrigger>
                                <TabsTrigger
                                    value="location"
                                    className="data-[state=active]:bg-transparent rounded-none h-12"
                                    style={{
                                        borderBottom: activeTab === 'location' ? '3px solid #2E5077' : '3px solid transparent',
                                        color: activeTab === 'location' ? '#2E5077' : '#6B7280',
                                        fontWeight: activeTab === 'location' ? '600' : '400',
                                        fontSize: '15px'
                                    }}
                                >
                                    Location
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="px-4 py-6 space-y-4">
                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        Contact Information
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#2E5077' }} />
                                            <div>
                                                <p style={{ fontSize: '15px', color: '#374151' }}>
                                                    {location.address}
                                                </p>
                                                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                                                    {distance} away
                                                </p>
                                            </div>
                                        </div>

                                        {location.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                                                <a
                                                    href={`tel:${location.phone}`}
                                                    style={{ fontSize: '15px', color: '#2E5077', fontWeight: '500' }}
                                                >
                                                    {location.phone}
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                                            <p style={{ fontSize: '15px', color: '#374151' }}>
                                                {location.hours}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        About {provider.provider_name.split(' ')[0]}. {provider.provider_name.split(' ').slice(-1)[0]}
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Experience</span>
                                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>10+ years</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Accepting New Patients</span>
                                            <span style={{ fontSize: '14px', color: '#79D7BE', fontWeight: '500' }}>Yes</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Languages</span>
                                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>English</span>
                                        </div>

                                        <div style={{ paddingTop: '8px', borderTop: '1px solid #E5E7EB' }}>
                                            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                                                {provider.provider_name.split(' ')[0]}. {provider.provider_name.split(' ').slice(-1)[0]} is a board-certified {specialty.toLowerCase()} physician with extensive experience in comprehensive patient care. Specializes in evidence-based treatment approaches and prioritizes clear communication with patients.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="costs" className="px-4 py-6 space-y-4">
                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        Price Comparison
                                    </h3>

                                    <div className="space-y-3">
                                        {costComparisonData.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span style={{ fontSize: '14px', color: index === 0 ? '#2E5077' : '#6B7280', fontWeight: index === 0 ? '600' : '400' }}>
                                                        {index === 0 ? provider.provider_name : item.name}
                                                    </span>
                                                    <span style={{ fontSize: '14px', color: index === 0 ? '#2E5077' : '#374151', fontWeight: index === 0 ? '600' : '500' }}>
                                                        ${index === 0 ? currentCost : item.cost}
                                                    </span>
                                                </div>
                                                <div
                                                    className="h-2 rounded-full"
                                                    style={{
                                                        backgroundColor: '#F3F4F6',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: `${((index === 0 ? currentCost : item.cost) / maxCost) * 100}%`,
                                                            height: '100%',
                                                            backgroundColor: item.color,
                                                            borderRadius: '9999px'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        className="mt-4 p-3 rounded-lg"
                                        style={{ backgroundColor: '#F0F9FF' }}
                                    >
                                        <p style={{ fontSize: '13px', color: '#2E5077', fontWeight: '500' }}>
                                            💰 Save {savingsPercent}% with this provider
                                        </p>
                                    </div>
                                </Card>

                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        Service Pricing
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Initial Consultation</span>
                                            <span style={{ fontSize: '14px', color: '#2E5077', fontWeight: '600' }}>{price}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Follow-up Visit</span>
                                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>$180</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Telehealth Consultation</span>
                                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>$150</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        Insurance Accepted
                                    </h3>

                                    <div className="space-y-2">
                                        {['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Medicare'].map((insurance, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" style={{ color: '#79D7BE' }} />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>{insurance}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="location" className="px-4 py-6 space-y-4">
                                <div className="relative">
                                    <div
                                        className="w-full overflow-hidden bg-gray-200"
                                        style={{
                                            height: '200px',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: '#E5E7EB',
                                                backgroundImage: 'linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB), linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB)',
                                                backgroundSize: '20px 20px',
                                                backgroundPosition: '0 0, 10px 10px'
                                            }}
                                        >
                                            <div className="relative">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: '#2E5077',
                                                        border: '3px solid white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <MapPin className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button
                                            className="mario-transition hover:opacity-90"
                                            style={{
                                                backgroundColor: 'white',
                                                color: '#2E5077',
                                                border: '2px solid #2E5077',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                padding: '8px 16px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                            }}
                                        >
                                            View Full Map
                                        </Button>
                                    </div>
                                </div>

                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#2E5077' }} />
                                        <div className="flex-1">
                                            <p style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                                                {location.address}
                                            </p>
                                            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                                                {distance} away
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={handleCopyAddress}
                                            variant="outline"
                                            className="mario-transition hover:bg-gray-50"
                                            style={{
                                                borderRadius: '8px',
                                                border: '1px solid #E5E7EB',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#374151',
                                                minHeight: '44px'
                                            }}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Address
                                        </Button>
                                        <Button
                                            onClick={handleGetDirections}
                                            className="mario-transition hover:opacity-90"
                                            style={{
                                                backgroundColor: '#2E5077',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                minHeight: '44px'
                                            }}
                                        >
                                            <Navigation className="w-4 h-4 mr-2" />
                                            Directions
                                        </Button>
                                    </div>
                                </Card>

                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        Contact & Hours
                                    </h3>

                                    <div className="space-y-3">
                                        {location.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                                                <a
                                                    href={`tel:${location.phone}`}
                                                    style={{ fontSize: '15px', color: '#2E5077', fontWeight: '500' }}
                                                >
                                                    {location.phone}
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                                            <p style={{ fontSize: '15px', color: '#374151' }}>
                                                {location.hours}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card
                                    className="p-4"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                                        Accessibility
                                    </h3>

                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#79D7BE' }} />
                                            <span style={{ fontSize: '14px', color: '#374151' }}>
                                                Street parking and nearby parking garage available
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#79D7BE' }} />
                                            <span style={{ fontSize: '14px', color: '#374151' }}>
                                                Accessible via public transportation
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#79D7BE' }} />
                                            <span style={{ fontSize: '14px', color: '#374151' }}>
                                                Wheelchair accessible entrance on main floor
                                            </span>
                                        </li>
                                    </ul>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <div
                    className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white z-10 px-4 py-3"
                    style={{
                        borderTop: '1px solid #E5E7EB',
                        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                            onClick={() => setShowBookingChat(true)}
                            className="mario-transition hover:opacity-90 active:scale-98"
                            style={{
                                backgroundColor: '#2E5077',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                minHeight: '48px',
                                order: 1
                            }}
                        >
                            Book with Concierge
                        </Button>

                        {location.phone && (
                            <Button
                                onClick={handleCall}
                                variant="outline"
                                className="mario-transition hover:bg-gray-50"
                                style={{
                                    borderRadius: '8px',
                                    border: '2px solid #2E5077',
                                    color: '#2E5077',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    minHeight: '48px',
                                    order: 2
                                }}
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Call {location.phone}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <BottomNav />
            <MarioAIBookingChat
                isOpen={showBookingChat}
                onClose={() => setShowBookingChat(false)}
                doctorName={provider.provider_name}
                hospital={hospitalName}
                specialty={specialty}
                onComplete={() => { }}
                isDesktop={isDesktop}
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
