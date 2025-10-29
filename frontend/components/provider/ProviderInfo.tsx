'use client';

import { useState } from 'react';
import { Provider } from '@/lib/mockData';
import { CheckCircle2, XCircle } from 'lucide-react';

type Tab = 'about' | 'insurance' | 'details';

export default function ProviderInfo({ provider }: { provider: Provider }) {
    const [activeTab, setActiveTab] = useState<Tab>('about');

    const tabs: { id: Tab; label: string }[] = [
        { id: 'about', label: 'About' },
        { id: 'insurance', label: 'Insurance' },
        { id: 'details', label: 'Details' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b bg-gray-50">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex-1 min-w-[120px] px-8 py-4 font-semibold text-sm uppercase tracking-wide
                transition-all duration-200 border-b-3 whitespace-nowrap
                ${activeTab === tab.id
                                    ? 'text-[#00BFA6] border-[#00BFA6] bg-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 border-transparent hover:bg-white/50'
                                }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                    <div className="space-y-6">
                        {/* About */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">About This Provider</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {provider.about || 'No description available.'}
                            </p>
                        </div>

                        {/* Specialties */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {provider.specialties?.length ? (
                                    provider.specialties.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                        >
                                            {specialty}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No specialties listed</span>
                                )}
                            </div>
                        </div>

                        {/* Languages */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Languages Spoken</h3>
                            <div className="flex flex-wrap gap-2">
                                {provider.languages?.length ? (
                                    provider.languages.map((language) => (
                                        <span
                                            key={language}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {language}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No languages listed</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* INSURANCE TAB */}
                {activeTab === 'insurance' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Accepted Insurance Plans</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {provider.acceptedInsurance?.length ? (
                                provider.acceptedInsurance.map((insurance) => (
                                    <div
                                        key={insurance}
                                        className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-700">{insurance}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">
                                    No insurance information available
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                    <div className="space-y-4">
                        {/* Boolean flags */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InfoItem
                                label="Parking Available"
                                value={!!provider.parkingAvailable}
                            />
                            <InfoItem
                                label="Wheelchair Accessible"
                                value={!!provider.wheelchairAccessible}
                            />
                            <InfoItem
                                label="Accepting New Patients"
                                value={!!provider.newPatientAccepted}
                            />
                            <InfoItem
                                label="Referral Required"
                                value={!!provider.requiresReferral}
                            />
                        </div>

                        {/* Address */}
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-2">Address</h4>
                            {provider.address ? (
                                <p className="text-gray-700 whitespace-pre-line">
                                    {typeof provider.address === 'string'
                                        ? provider.address
                                        : `${provider.address.street}
${provider.address.city}, ${provider.address.state} ${provider.address.zip}`}
                                </p>
                            ) : (
                                <p className="text-gray-500 text-sm">Address not available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ------------------------------
   REUSABLE SUBCOMPONENT
--------------------------------*/
function InfoItem({ label, value }: { label: string; value: boolean }) {
    return (
        <div className="flex items-center gap-2">
            {value ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
            )}
            <span className={value ? 'text-gray-700' : 'text-gray-400'}>
                {label}
            </span>
        </div>
    );
}
