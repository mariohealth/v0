'use client';

import { useState } from 'react';
import { Provider } from '@/lib/mockData';
import TimeSlotPicker from './TimeSlotPicker';
import BookingModal from './BookingModal';
import { Calendar, Clock, DollarSign } from 'lucide-react';

export default function BookingSection({ provider }: { provider: Provider }) {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [showBookingModal, setShowBookingModal] = useState(false);

    const handleBooking = () => {
        if (selectedDate && selectedTime) {
            setShowBookingModal(true);
        }
    };

    const isBookingReady = selectedDate && selectedTime;

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-4">Book an Appointment</h3>

                    {/* Price Display - IMPROVED */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Your Price with Insurance</span>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-4xl font-bold text-green-600">
                                ${provider.negotiatedRate || provider.price}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                                ${provider.standardRate || provider.originalPrice}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all"
                                    style={{ width: `${provider.savingsPercent || (provider.originalPrice ? Math.round(((provider.originalPrice - provider.price) / provider.originalPrice) * 100) : 0)}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                                Save {provider.savingsPercent || (provider.originalPrice ? Math.round(((provider.originalPrice - provider.price) / provider.originalPrice) * 100) : 0)}%
                            </span>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                            You save <span className="font-bold text-green-600">${provider.savings || (provider.originalPrice ? provider.originalPrice - provider.price : 0)}</span> compared to standard rate
                        </div>
                    </div>

                    {/* Time Slot Picker */}
                    <TimeSlotPicker
                        availableSlots={provider.availableTimeSlots || []}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onDateSelect={setSelectedDate}
                        onTimeSelect={setSelectedTime}
                    />

                    {/* Selected DateTime Display */}
                    {isBookingReady && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">
                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">{selectedTime}</span>
                            </div>
                        </div>
                    )}

                    {/* Book Button */}
                    <button
                        onClick={handleBooking}
                        disabled={!isBookingReady}
                        className={`w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all ${isBookingReady
                            ? 'bg-[#00BFA6] hover:bg-[#00A896] shadow-md hover:shadow-lg'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {isBookingReady ? 'Continue to Booking' : 'Select Date & Time'}
                    </button>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Instant confirmation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Free cancellation up to 24 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Insurance verification included</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    provider={provider}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
        </>
    );
}