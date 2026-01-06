'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Pill } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { marioMedicationsData } from '@/lib/data/mario-medications-data';

export default function MedicationsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');



    const filteredMedications = marioMedicationsData.filter((med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Medications</h1>
                    <p className="text-gray-600">Compare prescription prices</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search medications..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#2E5077] focus:outline-none focus:ring-2 focus:ring-[#2E5077]"
                        />
                    </div>
                </div>

                {/* Medications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMedications.map((medication) => (
                        <div
                            key={medication.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <Pill className="h-8 w-8 text-[#79D7BE] flex-shrink-0" />
                                {medication.genericName && (
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                        Generic
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{medication.name}</h3>
                            {medication.genericName && (
                                <p className="text-sm text-gray-600 mb-4">{medication.genericName}</p>
                            )}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Price Range</p>
                                    <p className="text-lg font-bold text-[#2E5077]">{medication.priceRange}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Pharmacies</p>
                                    <p className="text-sm font-medium text-gray-900">{medication.pharmacyCount}+</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMedications.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No medications found. Try a different search term.</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </main>
    );
}

