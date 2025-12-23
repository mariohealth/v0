'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, User, MapPin, Star } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { marioDoctorsData } from '@/lib/data/mario-doctors-data';

import { Suspense } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const QUICK_FILTERS = ['All', 'Primary Care', 'Dermatology', 'Cardiology', 'Imaging', 'Blood Test'];

function DoctorsPageContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const specialtyParam = searchParams.get('specialty');
    const procedureParam = searchParams.get('procedure');
    const [searchQuery, setSearchQuery] = useState(specialtyParam || '');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        // If a procedure is provided, we should redirect to the procedure pricing page
        // as per the requirement: Procedure search -> Fetch procedure-prices
        if (procedureParam) {
            router.push(`/search?q=${encodeURIComponent(procedureParam)}`);
        }
    }, [user, loading, router, procedureParam]);

    useEffect(() => {
        if (specialtyParam) {
            setSearchQuery(specialtyParam);
        }
    }, [specialtyParam]);

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const filteredDoctors = marioDoctorsData.filter((doc) =>
        searchQuery.toLowerCase() === 'all' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFilterClick = (filter: string) => {
        setSearchQuery(filter === 'All' ? '' : filter);
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
                    <p className="text-gray-600">Search by specialty and location</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search doctors or specialties..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#2E5077] focus:outline-none focus:ring-2 focus:ring-[#2E5077]"
                        />
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {QUICK_FILTERS.map((filter) => (
                        <Button
                            key={filter}
                            variant={searchQuery === filter || (filter === 'All' && searchQuery === '') ? 'default' : 'outline'}
                            onClick={() => handleFilterClick(filter)}
                            className="rounded-full whitespace-nowrap"
                            size="sm"
                        >
                            {filter}
                        </Button>
                    ))}
                </div>

                {/* Doctors List */}
                <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                        <Card
                            key={doctor.id}
                            onClick={() => router.push(`/providers/${doctor.id}`)}
                            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-[#2E5077] flex items-center justify-center flex-shrink-0">
                                    <User className="h-6 w-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">{doctor.name}</h3>
                                            <p className="text-sm text-[#4DA1A9] font-medium">{doctor.specialty}</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-[#2E5077]">{doctor.price}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs font-bold">{doctor.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>{doctor.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">•</span>
                                            <span>{doctor.distance}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.success(`Calling ${doctor.name}...`);
                                            }}
                                        >
                                            <Phone className="h-4 w-4" />
                                            Call
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 gap-2 bg-[#2E5077] hover:bg-[#1a3a5a]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info("Booking coming soon!");
                                            }}
                                        >
                                            <Calendar className="h-4 w-4" />
                                            Book
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No doctors found. Try a different search term.</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </main>
    );
}

export default function DoctorsPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        }>
            <DoctorsPageContent />
        </Suspense>
    );
}

