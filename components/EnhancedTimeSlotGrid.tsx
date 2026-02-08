"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, IndianRupee, Calendar } from "lucide-react";
import { formatPrice, formatTime, TimeSlot } from "@/lib/booking-utils";
import { useMemo } from "react";

interface EnhancedTimeSlotGridProps {
    slots: TimeSlot[];
    selectedSlots: TimeSlot[];
    onSlotToggle: (slot: TimeSlot) => void;
    isLoading?: boolean;
}

export default function EnhancedTimeSlotGrid({
    slots,
    selectedSlots,
    onSlotToggle,
    isLoading = false,
}: EnhancedTimeSlotGridProps) {
    // Group slots by time of day
    const groupedSlots = useMemo(() => {
        const groups = {
            morning: [] as TimeSlot[],
            afternoon: [] as TimeSlot[],
            evening: [] as TimeSlot[],
            night: [] as TimeSlot[],
        };

        slots.forEach((slot) => {
            const hour = slot.startTimeUtc.getHours();
            if (hour >= 7 && hour < 12) groups.morning.push(slot);
            else if (hour >= 12 && hour < 17) groups.afternoon.push(slot);
            else if (hour >= 17 && hour < 22) groups.evening.push(slot);
            else groups.night.push(slot);
        });

        return groups;
    }, [slots]);

    const isSelected = (slot: TimeSlot) =>
        selectedSlots.some((s) => s.startTimeUtc.getTime() === slot.startTimeUtc.getTime());

    const renderSlotCard = (slot: TimeSlot) => {
        const selected = isSelected(slot);
        const disabled = slot.isBooked;

        return (
            <button
                key={slot.startTimeUtc.toISOString()}
                onClick={() => !disabled && onSlotToggle(slot)}
                disabled={disabled}
                className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 min-h-[100px]
                    ${disabled
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                        : selected
                            ? "gradient-primary border-transparent text-white shadow-lg scale-105"
                            : "bg-white border-primary/20 hover:border-primary hover:shadow-md hover:scale-102 cursor-pointer"
                    }
                `}
            >
                {/* Time */}
                <div className={`flex items-center gap-2 mb-2 ${selected ? "text-white" : "text-gray-900"}`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-lg">
                        {formatTime(slot.startTimeUtc)}
                    </span>
                </div>

                {/* Duration */}
                <div className={`text-sm mb-2 ${selected ? "text-white/90" : "text-gray-600"}`}>
                    1 hour slot
                </div>

                {/* Price */}
                <div className={`flex items-center gap-1 font-semibold ${selected ? "text-white" : "text-primary"}`}>
                    <IndianRupee className="w-4 h-4" />
                    <span>{formatPrice(slot.pricePerHour)}</span>
                </div>

                {/* Status Badge */}
                {disabled && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        Booked
                    </Badge>
                )}
                {selected && !disabled && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </button>
        );
    };

    const renderTimeGroup = (title: string, icon: string, slots: TimeSlot[]) => {
        if (slots.length === 0) return null;

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <Badge variant="outline" className="ml-2">
                        {slots.filter(s => !s.isBooked).length} available
                    </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {slots.map(renderSlotCard)}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {renderTimeGroup("Morning", "🌅", groupedSlots.morning)}
            {renderTimeGroup("Afternoon", "☀️", groupedSlots.afternoon)}
            {renderTimeGroup("Evening", "🌆", groupedSlots.evening)}
            {renderTimeGroup("Night", "🌙", groupedSlots.night)}
        </div>
    );
}
