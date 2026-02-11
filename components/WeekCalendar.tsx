"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeekCalendar({ onSlotSelect }: { onSlotSelect?: (date: Date, time: string) => void }) {
    const [selectedSlots, setSelectedSlots] = useState<Array<{ date: string; time: string }>>([]);
    const [bookedSlots, setBookedSlots] = useState<Array<{ date: string; time: string }>>([]);
    const [weekOffset, setWeekOffset] = useState(0);

    // Load booked slots from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('bookedSlots');
        if (stored) {
            try {
                setBookedSlots(JSON.parse(stored));
            } catch (error) {
                console.error('Error loading booked slots:', error);
            }
        }
    }, []);

    // Get current date
    const today = new Date();

    // Calculate week start (Sunday)
    const getWeekStart = (offset: number) => {
        const date = new Date(today);
        date.setDate(date.getDate() - date.getDay() + (offset * 7));
        return date;
    };

    const weekStart = getWeekStart(weekOffset);

    // Generate 7 days for the week
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return date;
    });

    // Sample time slots
    const timeSlots = [
        "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm",
        "1:00pm", "2:00pm", "4:00pm", "5:00pm", "9:00pm"
    ];

    const goToPreviousWeek = () => setWeekOffset(weekOffset - 1);
    const goToNextWeek = () => setWeekOffset(weekOffset + 1);
    const goToToday = () => setWeekOffset(0);

    const isSlotBooked = (day: Date, time: string) => {
        const dateStr = day.toISOString().split('T')[0];
        return bookedSlots.some(slot => slot.date === dateStr && slot.time === time);
    };

    const handleSlotClick = (day: Date, time: string) => {
        // Don't allow selecting booked slots
        if (isSlotBooked(day, time)) {
            alert("This slot is already booked!");
            return;
        }

        const dateStr = day.toISOString().split('T')[0];
        const slotKey = `${dateStr}-${time}`;

        // Check if slot is already selected
        const isSelected = selectedSlots.some(slot => slot.date === dateStr && slot.time === time);

        if (isSelected) {
            // Remove slot from selection
            setSelectedSlots(selectedSlots.filter(slot => !(slot.date === dateStr && slot.time === time)));
        } else {
            // Add slot to selection
            setSelectedSlots([...selectedSlots, { date: dateStr, time }]);
        }
        // The onSlotSelect callback is designed for a single slot.
        // If multi-selection needs to trigger a callback, its signature would need to change.
        // For now, we'll omit calling it with the new multi-select behavior.
    };

    const isSlotSelected = (day: Date, time: string) => {
        const dateStr = day.toISOString().split('T')[0];
        return selectedSlots.some(slot => slot.date === dateStr && slot.time === time);
    };

    const isToday = (day: Date) => {
        return day.toDateString() === today.toDateString();
    };

    const isPastDate = (day: Date) => {
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        return dayStart < todayStart;
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatDayName = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    };

    const formatDayNumber = (date: Date) => {
        return date.getDate();
    };

    const formatMonthShort = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    };

    return (
        <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
                {/* Header with Month and Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {formatMonth(weekStart)}
                        </h3>
                        {selectedSlots.length > 0 && (
                            <Badge className="bg-primary text-white">
                                {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToToday}
                            className="text-primary border-primary/30 hover:bg-primary/5"
                        >
                            Back to Today
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPreviousWeek}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextWeek}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day, index) => {
                        const todayFlag = isToday(day);
                        const past = isPastDate(day);

                        return (
                            <div
                                key={index}
                                className={`text-center pb-3 border-b-2 relative ${todayFlag
                                    ? "border-primary"
                                    : past
                                        ? "border-gray-200"
                                        : "border-gray-300"
                                    }`}
                            >


                                <div
                                    className={`text-xs font-medium uppercase mb-1 ${past ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    {formatDayName(day)}
                                </div>
                                <div
                                    className={`text-2xl font-bold ${todayFlag
                                        ? "text-primary"
                                        : past
                                            ? "text-gray-400"
                                            : "text-gray-900"
                                        }`}
                                >
                                    {formatDayNumber(day)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, dayIndex) => {
                        const past = isPastDate(day);

                        return (
                            <div key={dayIndex} className="space-y-2">
                                {timeSlots.map((time, timeIndex) => {
                                    const selected = isSlotSelected(day, time);
                                    const booked = isSlotBooked(day, time);

                                    return (
                                        <button
                                            key={timeIndex}
                                            onClick={() => !past && !booked && handleSlotClick(day, time)}
                                            disabled={past || booked}
                                            className={`w-full py-2 px-1 text-sm rounded-lg transition-all ${selected
                                                ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold border-2 border-yellow-600"
                                                : booked
                                                    ? "bg-red-100 text-red-600 cursor-not-allowed border border-red-300 line-through"
                                                    : past
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-blue-50 text-gray-900 hover:bg-blue-100 border border-blue-200 hover:border-blue-400"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Slot Legend */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-600"></div>
                        <span className="text-sm text-gray-700">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-50 border border-blue-200"></div>
                        <span className="text-sm text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-red-100 border border-red-300"></div>
                        <span className="text-sm text-gray-700">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-100"></div>
                        <span className="text-sm text-gray-700">Past</span>
                    </div>
                </div>

                {/* Next Button */}
                <div className="mt-6 flex justify-end">
                    {selectedSlots.length > 0 ? (
                        <Link
                            href={`/venue?slots=${encodeURIComponent(JSON.stringify(selectedSlots))}`}
                            onClick={() => {
                                // Save selected slots as booked (Mock behavior - maybe remove this if integrating with real backend?)
                                // actually, let's NOT save to localStorage as booked, because the booking hasn't happened yet.
                                // The real booking happens in VenuePage via Razorpay.
                                // So we remove the localStorage setBookedSlots logic here to avoid "fake" interactions.
                            }}
                        >
                            <Button
                                size="lg"
                                className="gradient-primary text-white border-0 hover:opacity-90 px-12"
                            >
                                NEXT ({selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''})
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            size="lg"
                            onClick={() => alert("Please select at least one time slot")}
                            className="gradient-primary text-white border-0 hover:opacity-90 px-12"
                        >
                            NEXT
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
