"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function BookingConfirmationPage() {
    const searchParams = useSearchParams();
    const slotsParam = searchParams.get("slots");

    let slots: Array<{ date: string; time: string }> = [];

    try {
        if (slotsParam) {
            slots = JSON.parse(decodeURIComponent(slotsParam));
        }
    } catch (error) {
        console.error("Error parsing slots:", error);
    }

    const pricePerSlot = 1500;
    const totalSlots = slots.length;
    const totalAmount = pricePerSlot * totalSlots;

    // Group slots by date for better display
    const slotsByDate = slots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot.time);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="glass-effect border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gradient">CricketTurf</h1>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto">
                    {/* Success Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
                            <CheckCircle2 className="w-16 h-16 text-green-600" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Booking Confirmed!
                        </h2>
                        <p className="text-xl text-gray-600">
                            {totalSlots === 1
                                ? "Your cricket turf slot has been successfully reserved"
                                : `${totalSlots} cricket turf slots have been successfully reserved`
                            }
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg mb-6">
                        <CardHeader>
                            <CardTitle className="text-2xl">Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Selected Slots */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Selected Time Slots</h3>
                                <div className="space-y-4">
                                    {Object.entries(slotsByDate).map(([date, times]) => (
                                        <div key={date} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <p className="font-bold text-gray-900">
                                                    {new Date(date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 ml-8">
                                                {times.map((time, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-primary/20">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span className="font-medium text-gray-700">{time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Venue Info */}
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-lg mb-4">Venue Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span className="text-gray-700">Bangalore, Karnataka, India</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <span className="text-gray-700">+91 98765 43210</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <span className="text-gray-700">info@cricketturf.com</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Number of slots</span>
                                    <span className="font-semibold">{totalSlots}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Price per slot</span>
                                    <span className="font-semibold">₹{pricePerSlot.toLocaleString()}</span>
                                </div>
                                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold">Total Amount</span>
                                    <span className="text-2xl font-bold text-gradient">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Information */}
                    <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg mb-6">
                        <CardHeader>
                            <CardTitle>Important Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Please arrive 15 minutes before your scheduled time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Bring your own cricket equipment</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Changing rooms and refreshments are available</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Free parking available on premises</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                                Back to Home
                            </Button>
                        </Link>
                        <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 w-full sm:w-auto px-8">
                            Download Confirmation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
