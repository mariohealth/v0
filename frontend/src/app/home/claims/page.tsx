'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MarioAIModal } from '@/components/mario-ai-modal';
import Link from 'next/link';

interface Claim {
    id: string;
    procedureName: string;
    providerName: string;
    amount: string;
    date: string;
    status: 'pending' | 'approved' | 'denied' | 'processing';
}

export default function ClaimsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [showAIModal, setShowAIModal] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Load from localStorage (placeholder until backend connection)
        const stored = localStorage.getItem('marioClaims');
        if (stored) {
            try {
                setClaims(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing claims:', e);
            }
        }
    }, []);

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-50';
            case 'denied':
                return 'text-red-600 bg-red-50';
            case 'processing':
                return 'text-blue-600 bg-blue-50';
            case 'pending':
                return 'text-yellow-600 bg-yellow-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'denied':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims</h1>
                        <p className="text-gray-600">View and manage your insurance claims</p>
                    </div>
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="rounded-md bg-[#2E5077] px-4 py-2 text-white hover:bg-[#1e3a5a] transition-colors text-sm"
                    >
                        Dispute Claim
                    </button>
                </div>

                {/* Claims List */}
                {claims.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Claims Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Claims will appear here after you book appointments and procedures.
                        </p>
                        <Link
                            href="/search"
                            className="inline-block rounded-md bg-[#2E5077] px-6 py-3 text-white hover:bg-[#1e3a5a] transition-colors"
                        >
                            Find Procedures
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div
                                key={claim.id}
                                className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {claim.procedureName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{claim.providerName}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                <span className="font-semibold text-gray-900">{claim.amount}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{new Date(claim.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            claim.status
                                        )}`}
                                    >
                                        {getStatusIcon(claim.status)}
                                        <span className="capitalize">{claim.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
            <MarioAIModal
                open={showAIModal}
                onClose={() => setShowAIModal(false)}
                mode="claims"
            />
        </main>
    );
}

