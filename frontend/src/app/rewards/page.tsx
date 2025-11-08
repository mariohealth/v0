'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Gift, Trophy, Star, Award } from 'lucide-react';
import { getTotalPoints, getRewardHistory, type RewardEvent } from '@/lib/rewards';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function RewardsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState<RewardEvent[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            setPoints(getTotalPoints());
            setHistory(getRewardHistory());
        }
    }, [user]);

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

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards</h1>
                    <p className="text-gray-600">Earn MarioPoints for using Mario Health</p>
                </div>

                {/* Points Summary Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 mb-2">Total MarioPoints</p>
                            <p className="text-5xl font-bold">{points}</p>
                        </div>
                        <Gift className="h-16 w-16 text-blue-200" />
                    </div>
                </div>

                {/* Rewards Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Book Concierge</h3>
                        <p className="text-sm text-gray-600">+50 points</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <Star className="h-8 w-8 text-blue-500 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Use MarioAI Pick</h3>
                        <p className="text-sm text-gray-600">+25 points</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <Award className="h-8 w-8 text-green-500 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Complete Profile</h3>
                        <p className="text-sm text-gray-600">+100 points</p>
                    </div>
                </div>

                {/* Reward History */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="divide-y">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No rewards yet. Start using Mario Health to earn points!</p>
                            </div>
                        ) : (
                            history.map((event, idx) => (
                                <div key={idx} className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{event.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(event.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-lg font-semibold text-green-600">
                                        +{event.points}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <BottomNav />
        </main>
    );
}

