"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, Trophy, ArrowLeft, CheckCircle2, IndianRupee } from "lucide-react";
import { generateTimeSlots, calculateTotalAmount, formatPrice, TimeSlot } from "@/lib/booking-utils";
import dayjs from "dayjs";
import BookingCalendar from "@/components/BookingCalendar";
import BookingSteps from "@/components/BookingSteps";
import QuickDateSelector from "@/components/QuickDateSelector";
import AvailabilityLegend from "@/components/AvailabilityLegend";
import EnhancedTimeSlotGrid from "@/components/EnhancedTimeSlotGrid";
import BookingSummaryCard from "@/components/BookingSummaryCard";
import BookingConfirmationView from "@/components/BookingConfirmationView";
import { SlotGridSkeleton } from "@/components/LoadingSkeleton";
import { celebrateBooking } from "@/lib/confetti";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const dynamic = 'force-dynamic';

export default function VenuePage() {
    const session = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const status = session?.status || 'loading';

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        loadSlots();
    }, [selectedDate]);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const loadSlots = async () => {
        setIsLoadingSlots(true);
        try {
            const response = await fetch(
                `/api/slots?date=${selectedDate.toISOString()}`
            );
            const data = await response.json();

            const bookedSlots = data.bookings.map((b: any) => ({
                startTimeUtc: new Date(b.startTimeUtc),
                endTimeUtc: new Date(b.endTimeUtc),
            }));

            const slots = generateTimeSlots(selectedDate, bookedSlots);
            setAvailableSlots(slots);
            setSelectedSlots([]);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load available slots",
                variant: "destructive",
            });
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const toggleSlot = (slot: TimeSlot) => {
        if (slot.isBooked) return;

        const isSelected = selectedSlots.some(
            (s) => s.startTimeUtc.getTime() === slot.startTimeUtc.getTime()
        );

        if (isSelected) {
            setSelectedSlots(
                selectedSlots.filter(
                    (s) => s.startTimeUtc.getTime() !== slot.startTimeUtc.getTime()
                )
            );
        } else {
            setSelectedSlots([...selectedSlots, slot].sort((a, b) =>
                a.startTimeUtc.getTime() - b.startTimeUtc.getTime()
            ));
        }
    };

    const handleProceedToReview = () => {
        if (selectedSlots.length === 0) {
            toast({
                title: "No slots selected",
                description: "Please select at least one slot",
                variant: "destructive",
            });
            return;
        }
        setShowConfirmation(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBooking = async () => {
        // Validation now happens in handleProceedToReview for the first step
        // But we keep this check for safety
        if (selectedSlots.length === 0) {
            toast({
                title: "No slots selected",
                description: "Please select at least one slot",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const totalAmount = calculateTotalAmount(selectedSlots);

            // Create Razorpay order
            const orderResponse = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amountPaise: totalAmount }),
            });

            const { order } = await orderResponse.json();

            const bookingData = {
                date: selectedDate.toISOString(),
                startTimeUtc: selectedSlots[0].startTimeUtc.toISOString(),
                endTimeUtc: selectedSlots[selectedSlots.length - 1].endTimeUtc.toISOString(),
                slotsCount: selectedSlots.length,
                amountPaise: totalAmount,
            };

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "CricketTurf",
                description: "Turf Booking",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingData,
                            }),
                        });

                        const result = await verifyResponse.json();

                        if (result.success) {
                            celebrateBooking();
                            toast({
                                title: "Success!",
                                description: "Booking confirmed successfully",
                            });
                            // Delay redirect slightly to show confetti
                            setTimeout(() => {
                                router.push("/dashboard");
                            }, 2000);
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (error: any) {
                        toast({
                            title: "Payment verification failed",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                },
                prefill: {
                    name: session?.data?.user?.name,
                    email: session?.data?.user?.email,
                },
                theme: {
                    color: "#6366f1",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initiate payment",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const totalAmount = calculateTotalAmount(selectedSlots);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="glass-effect border-b sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gradient">CricketTurf</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => router.push("/")} variant="ghost" className="hover:bg-primary/10">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        <Button onClick={() => router.push("/dashboard")} className="gradient-primary text-white border-0 hover:opacity-90">
                            My Bookings
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Booking Progress Steps */}
                <BookingSteps currentStep={showConfirmation ? 3 : (selectedSlots.length > 0 ? 2 : 1)} />

                {showConfirmation ? (
                    <BookingConfirmationView
                        selectedDate={selectedDate}
                        selectedSlots={selectedSlots}
                        onConfirm={handleBooking}
                        onBack={() => setShowConfirmation(false)}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Venue Info */}
                            <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold">
                                        Premium <span className="text-gradient">Cricket Turf</span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-base">
                                        <MapPin className="w-4 h-4" />
                                        Bangalore, Karnataka
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge className="gradient-primary text-white border-0">Professional Grade</Badge>
                                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">Floodlights</Badge>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Changing Rooms</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <span className="font-medium text-gray-700">Operating Hours: 7:00 AM - 2:00 AM</span>
                                        </div>
                                        <div className="p-4 rounded-lg gradient-primary text-white">
                                            <p className="font-semibold mb-1">Pricing</p>
                                            <p className="text-sm">₹1,500/hour (7 AM - 10 PM) | ₹1,600/hour (10 PM - 2 AM)</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                            {/* Date Selector with Calendar */}
                            <div className="space-y-4">
                                <QuickDateSelector onDateSelect={setSelectedDate} />
                                <BookingCalendar
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                />
                            </div>

                            {/* Slot Status Legend */}
                            <AvailabilityLegend />

                            {/* Time Slots */}
                            <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary" />
                                            Select Time Slots
                                        </CardTitle>
                                        {!isLoadingSlots && availableSlots.length > 0 && (
                                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                                {availableSlots.filter(s => !s.isBooked).length} of {availableSlots.length} available
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Select one or more time slots. Slots are grouped by time of day for your convenience.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingSlots ? (
                                        <SlotGridSkeleton />
                                    ) : (
                                        <EnhancedTimeSlotGrid
                                            slots={availableSlots}
                                            selectedSlots={selectedSlots}
                                            onSlotToggle={toggleSlot}
                                            isLoading={isLoadingSlots}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Booking Summary */}
                        <div className="lg:col-span-1">
                            <BookingSummaryCard
                                selectedDate={selectedDate}
                                selectedSlots={selectedSlots}
                                onProceedToPayment={handleProceedToReview}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Action Bar - Hide if on confirmation screen */}
            {!showConfirmation && (
                <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 transform ${selectedSlots.length > 0 ? "translate-y-0" : "translate-y-full"}`}>
                    <div className="bg-white/95 backdrop-blur-md border-t border-primary/10 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between gap-4 max-w-sm mx-auto">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Selected {selectedSlots.length} slots</p>
                                <p className="text-lg font-bold text-primary flex items-center">
                                    <IndianRupee className="w-4 h-4" />
                                    {formatPrice(totalAmount)}
                                </p>
                            </div>
                            <Button
                                onClick={handleProceedToReview}
                                disabled={isLoading}
                                className="flex-[1.5] gradient-primary text-white border-0 py-6 font-bold shadow-lg active:scale-95 transition-transform"
                            >
                                {isLoading ? "Processing..." : "Review Booking →"}
                            </Button>
                        </div>
                    </div>
                    <div className="h-safe-area-inset-bottom bg-white/95"></div>
                </div>
            )}
        </div>
    );
}
