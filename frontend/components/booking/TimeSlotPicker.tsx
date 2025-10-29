'use client';

import { TimeSlot } from '@/lib/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface TimeSlotPickerProps {
    availableSlots: TimeSlot[];
    selectedDate: string;
    selectedTime: string;
    onDateSelect: (date: string) => void;
    onTimeSelect: (time: string) => void;
}

export default function TimeSlotPicker({
    availableSlots,
    selectedDate,
    selectedTime,
    onDateSelect,
    onTimeSelect,
}: TimeSlotPickerProps) {
    const [weekOffset, setWeekOffset] = useState(0);

    // Group slots by date
    const slotsByDate = useMemo(() => {
        const grouped: Record<string, TimeSlot[]> = {};
        availableSlots.forEach(slot => {
            if (!grouped[slot.date]) {
                grouped[slot.date] = [];
            }
            grouped[slot.date].push(slot);
        });
        return grouped;
    }, [availableSlots]);

    // Get unique dates
    const allDates = Object.keys(slotsByDate).sort();

    // Show 7 days at a time
    const visibleDates = allDates.slice(weekOffset * 7, (weekOffset + 1) * 7);

    const handleDateClick = (date: string) => {
        onDateSelect(date);
        onTimeSelect(''); // Reset time when date changes
    };

    const slotsForSelectedDate = selectedDate ? slotsByDate[selectedDate] || [] : [];

    return (
        <div className="space-y-4">
            {/* Date Selector */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Select Date</h4>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                            disabled={weekOffset === 0}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setWeekOffset(weekOffset + 1)}
                            disabled={(weekOffset + 1) * 7 >= allDates.length}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {visibleDates.map(date => {
                        const dateObj = new Date(date);
                        const isSelected = selectedDate === date;
                        const hasSlots = slotsByDate[date]?.some(s => s.available);

                        return (
                            <button
                                key={date}
                                onClick={() => hasSlots && handleDateClick(date)}
                                disabled={!hasSlots}
                                className={`p-2 rounded-lg text-center transition-all ${isSelected
                                        ? 'bg-[#00BFA6] text-white shadow-md'
                                        : hasSlots
                                            ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                <div className="text-xs font-medium">
                                    {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className="text-lg font-bold">
                                    {dateObj.getDate()}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selector */}
            {selectedDate && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Select Time</h4>

                    {slotsForSelectedDate.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                            No available slots for this date
                        </p>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                            {slotsForSelectedDate.map(slot => {
                                const isSelected = selectedTime === slot.time;
                                const isAvailable = slot.available;

                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => isAvailable && onTimeSelect(slot.time)}
                                        disabled={!isAvailable}
                                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                                ? 'bg-[#00BFA6] text-white shadow-md'
                                                : isAvailable
                                                    ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'
                                                    : 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                            }`}
                                    >
                                        {slot.time}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
