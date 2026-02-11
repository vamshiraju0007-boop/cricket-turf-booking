"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, IndianRupee, MapPin, ShieldCheck, User, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { formatDate, formatTime, formatPrice, TimeSlot, calculateTotalAmount } from "@/lib/booking-utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface BookingConfirmationViewProps {
    selectedDate: Date;
    selectedSlots: TimeSlot[];
    onConfirm: () => void;
    onBack: () => void;
    isLoading?: boolean;
}

export default function BookingConfirmationView({
    selectedDate,
    selectedSlots,
    onConfirm,
    onBack,
    isLoading = false,
}: BookingConfirmationViewProps) {
    const { data: session } = useSession();
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const totalAmount = calculateTotalAmount(selectedSlots);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-primary/10 -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Slots
                </Button>
            </div>

            <Card className="border-primary/10 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                        Review Your Booking
                    </CardTitle>
                    <CardDescription>
                        Please review the details below before proceeding to payment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Two Column Layout */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Booking Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Date & Time
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{formatDate(selectedDate)}</p>
                                            <p className="text-sm text-gray-500">Selected Date</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {selectedSlots.map((slot, index) => (
                                            <Badge key={index} variant="secondary" className="bg-white border border-slate-200 text-slate-700 py-1 px-2">
                                                <Clock className="w-3 h-3 mr-1 text-primary" />
                                                {formatTime(slot.startTimeUtc)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Venue Details
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 shrink-0">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Premium Cricket Turf</p>
                                        <p className="text-sm text-gray-500">Bangalore, Karnataka (Professional Grade)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Your Information
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700 font-medium">{session?.user?.name || "Guest User"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{session?.user?.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment & Terms */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Payment Summary
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                                    <div className="space-y-3 mb-4 border-b border-slate-200 pb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Rate per hour</span>
                                            <span className="font-medium">₹1,500</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Total Hours</span>
                                            <span className="font-medium">{selectedSlots.length} hrs</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Service Fee</span>
                                            <span className="font-medium text-green-600">Free</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-900">Total Payable</span>
                                        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                                            <IndianRupee className="w-6 h-6" />
                                            <span>{formatPrice(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Terms & Cancellation
                                </h3>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-900 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <p>Cancellations made less than 24 hours before the slot time are non-refundable.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <p>Please arrive at least 15 minutes before your scheduled time.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 pt-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the terms and conditions
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        By clicking confirm, you agree to our venue rules and cancellation policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex items-center justify-end gap-4">
                        <div className="text-right mr-4 hidden sm:block">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">{formatPrice(totalAmount)}</p>
                        </div>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading || !agreedToTerms}
                            size="lg"
                            className="gradient-primary text-white border-0 hover:opacity-90 min-w-[200px] shadow-lg hover:shadow-xl transition-all"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (
                                "Confirm & Pay"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
