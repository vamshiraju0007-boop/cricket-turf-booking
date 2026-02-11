"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, IndianRupee, Sparkles } from "lucide-react";
import { formatDate, formatTime, formatPrice, calculateTotalAmount, TimeSlot } from "@/lib/booking-utils";

interface BookingSummaryCardProps {
    selectedDate: Date;
    selectedSlots: TimeSlot[];
    onProceedToPayment: () => void;
    isLoading?: boolean;
}

export default function BookingSummaryCard({
    selectedDate,
    selectedSlots,
    onProceedToPayment,
    isLoading = false,
}: BookingSummaryCardProps) {
    const totalAmount = calculateTotalAmount(selectedSlots);
    const hasSlots = selectedSlots.length > 0;

    if (!hasSlots) {
        return (
            <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg sticky top-24">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Select Your Slots
                    </h3>
                    <p className="text-sm text-gray-600">
                        Choose one or more time slots to get started
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg sticky top-24">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Booking Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-600">Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(selectedDate)}</p>
                    </div>
                </div>

                {/* Selected Slots */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">Selected Slots</p>
                        <Badge className="gradient-primary text-white border-0">
                            {selectedSlots.length} {selectedSlots.length === 1 ? "slot" : "slots"}
                        </Badge>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                        {selectedSlots.map((slot, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatTime(slot.startTimeUtc)}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {formatPrice(slot.pricePerHour)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total Amount */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                            <IndianRupee className="w-6 h-6" />
                            <span>{formatPrice(totalAmount)}</span>
                        </div>
                    </div>

                    <Button
                        onClick={onProceedToPayment}
                        disabled={isLoading}
                        className="w-full gradient-primary text-white border-0 hover:opacity-90 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : (
                            "Review Booking →"
                        )}
                    </Button>
                </div>

                {/* Info Text */}
                <p className="text-xs text-center text-gray-500">
                    Secure payment powered by Razorpay
                </p>
            </CardContent>
        </Card>
    );
}
