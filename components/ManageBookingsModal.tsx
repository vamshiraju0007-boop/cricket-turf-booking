"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, X } from "lucide-react";
import { formatDate, formatTime } from "@/lib/booking-utils";
import { useRouter } from "next/navigation";

interface ManageBookingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ManageBookingsModal({ open, onOpenChange }: ManageBookingsModalProps) {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadBookings();
        }
    }, [open]);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/bookings");
            if (response.ok) {
                const data = await response.json();
                // Get only upcoming confirmed bookings
                const upcoming = data.bookings
                    .filter((b: any) =>
                        b.status === "CONFIRMED" &&
                        new Date(b.startTimeUtc) > new Date()
                    );
                setBookings(upcoming);
            }
        } catch (error) {
            console.error("Failed to load bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAll = async () => {
        if (!confirm("Are you sure you want to cancel all bookings?")) {
            return;
        }

        try {
            const cancelPromises = bookings.map(booking =>
                fetch(`/api/bookings/${booking.id}/cancel`, { method: "POST" })
            );
            await Promise.all(cancelPromises);
            loadBookings(); // Reload bookings
        } catch (error) {
            alert("Failed to cancel all bookings");
        }
    };

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "POST",
            });

            if (response.ok) {
                loadBookings(); // Reload bookings
            } else {
                alert("Failed to cancel booking");
            }
        } catch (error) {
            alert("Failed to cancel booking");
        }
    };

    const handleChange = (booking: any) => {
        onOpenChange(false);
        router.push(`/venue?edit=${booking.id}&date=${booking.date}`);
    };

    // Group bookings by date
    const groupedBookings = bookings.reduce((acc: any, booking: any) => {
        const date = booking.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(booking);
        return acc;
    }, {});

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Manage Your Bookings</DialogTitle>
                    <DialogDescription>
                        View, modify, or cancel your booked time slots
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading bookings...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No upcoming bookings</p>
                            <Button
                                className="gradient-primary text-white"
                                onClick={() => {
                                    onOpenChange(false);
                                    router.push("/venue");
                                }}
                            >
                                Book Now
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-gray-600">
                                    Total: <span className="font-semibold">{bookings.length} slots</span>
                                </p>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleCancelAll}
                                    className="bg-orange-500 hover:bg-orange-600"
                                >
                                    Cancel All
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {Object.entries(groupedBookings).map(([date, dateBookings]: [string, any]) => (
                                    <div key={date} className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className="w-4 h-4" />
                                            <h3 className="font-semibold">
                                                {formatDate(new Date(date))}
                                            </h3>
                                        </div>

                                        <div className="space-y-2">
                                            {dateBookings.map((booking: any) => (
                                                <div
                                                    key={booking.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <span className="font-medium">
                                                            {formatTime(new Date(booking.startTimeUtc))}
                                                        </span>
                                                        <span className="text-gray-600">
                                                            ₹{booking.totalAmount || 1500}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleChange(booking)}
                                                        >
                                                            ✏️ Change
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleCancel(booking.id)}
                                                        >
                                                            <X className="w-4 h-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
