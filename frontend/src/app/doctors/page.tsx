'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, User, MapPin, Star } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { marioDoctorsData } from '@/lib/data/mario-doctors-data';

export default function DoctorsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

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
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            onClick={() => router.push(`/providers/${doctor.id}`)}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-full bg-[#2E5077] flex items-center justify-center">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                            <p className="text-sm text-[#4DA1A9] mb-2">{doctor.specialty}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                <MapPin className="h-4 w-4" />
                                <span>{doctor.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Price</p>
                                    <p className="text-lg font-bold text-[#2E5077]">{doctor.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Distance</p>
                                    <p className="text-sm font-medium text-gray-900">{doctor.distance}</p>
                                </div>
                            </div>
                        </div>
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

