'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';

interface Appointment {
    id: string;
    providerName: string;
    procedureName: string;
    date: string;
    time: string;
    location: string;
    status: 'upcoming' | 'completed' | 'cancelled';
}

export default function AppointmentsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Load from localStorage (placeholder until backend connection)
        const stored = localStorage.getItem('marioAppointments');
        if (stored) {
            try {
                setAppointments(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing appointments:', e);
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

    const upcomingAppointments = appointments.filter((apt) => apt.status === 'upcoming');
    const pastAppointments = appointments.filter((apt) => apt.status !== 'upcoming');

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
                    <p className="text-gray-600">View and manage your appointments</p>
                </div>

                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
                        <div className="space-y-4">
                            {upcomingAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <Calendar className="h-6 w-6 text-[#4DA1A9] flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {apt.procedureName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{apt.providerName}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{apt.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Past</h2>
                        <div className="space-y-4">
                            {pastAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="bg-white rounded-lg shadow border border-gray-200 p-6 opacity-75"
                                >
                                    <div className="flex items-start gap-4">
                                        <Calendar className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {apt.procedureName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{apt.providerName}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{apt.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {appointments.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Book an appointment with a provider to see it here.
                        </p>
                        <Link
                            href="/search"
                            className="inline-block rounded-md bg-[#2E5077] px-6 py-3 text-white hover:bg-[#1e3a5a] transition-colors"
                        >
                            Find Providers
                        </Link>
                    </div>
                )}
            </div>
            <BottomNav />
        </main>
    );
}

