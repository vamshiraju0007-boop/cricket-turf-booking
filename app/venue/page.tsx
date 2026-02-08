"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, Trophy, ArrowLeft, CheckCircle2 } from "lucide-react";
import { generateTimeSlots, calculateTotalAmount, formatPrice, TimeSlot } from "@/lib/booking-utils";
import dayjs from "dayjs";
import BookingCalendar from "@/components/BookingCalendar";
import BookingSteps from "@/components/BookingSteps";
import QuickDateSelector from "@/components/QuickDateSelector";
import AvailabilityLegend from "@/components/AvailabilityLegend";

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

    const handleBooking = async () => {
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
                            toast({
                                title: "Success!",
                                description: "Booking confirmed successfully",
                            });
                            router.push("/dashboard");
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
                <BookingSteps currentStep={selectedSlots.length > 0 ? 2 : 1} />

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
                                    Click on available slots to select. Selected slots will be highlighted.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingSlots ? (
                                    <p className="text-center py-8">Loading slots...</p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                        {availableSlots.map((slot, index) => {
                                            const isSelected = selectedSlots.some(
                                                (s) => s.startTimeUtc.getTime() === slot.startTimeUtc.getTime()
                                            );
                                            return (
                                                <Button
                                                    key={index}
                                                    variant={isSelected ? "default" : "outline"}
                                                    className={`relative ${slot.isBooked
                                                        ? "opacity-50 cursor-not-allowed bg-gray-100"
                                                        : isSelected
                                                            ? "gradient-primary text-white border-0 hover:opacity-90 shadow-md"
                                                            : "hover:scale-105 transition-transform hover:border-primary/50"
                                                        }`}
                                                    disabled={slot.isBooked}
                                                    onClick={() => toggleSlot(slot)}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">{slot.label}</span>
                                                        {isSelected && (
                                                            <CheckCircle2 className="w-3 h-3 absolute top-1 right-1" />
                                                        )}
                                                    </div>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-primary/10 bg-white/80 backdrop-blur-sm shadow-xl">
                            <CardHeader className="gradient-primary text-white">
                                <CardTitle>Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date</p>
                                    <p className="font-semibold">
                                        {dayjs(selectedDate).format("DD MMM YYYY")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Selected Slots</p>
                                    {selectedSlots.length === 0 ? (
                                        <p className="text-sm text-gray-400">No slots selected</p>
                                    ) : (
                                        <div className="space-y-1">
                                            {selectedSlots.map((slot, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span>{slot.label}</span>
                                                    <span className="text-gray-600">
                                                        {formatPrice(slot.pricePerHour)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                                        <span className="font-semibold text-lg">Total</span>
                                        <span className="font-bold text-3xl text-gradient">
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>

                                    <Button
                                        className="w-full gradient-primary text-white border-0 hover:opacity-90 shadow-lg"
                                        size="lg"
                                        onClick={handleBooking}
                                        disabled={selectedSlots.length === 0 || isLoading}
                                    >
                                        {isLoading ? "Processing..." : "Proceed to Payment →"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
