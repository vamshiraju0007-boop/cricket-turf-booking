"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, Calendar, X, Edit, ExternalLink } from "lucide-react";
import { formatDate, formatTime } from "@/lib/booking-utils";
import { useRouter } from "next/navigation";

export default function ManageBookingsDropdown() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadBookings = async () => {
        if (!session) return;

        setLoading(true);
        try {
            const response = await fetch("/api/bookings");
            if (response.ok) {
                const data = await response.json();
                // Get only upcoming confirmed bookings, limit to 3
                const upcoming = data.bookings
                    .filter((b: any) =>
                        b.status === "CONFIRMED" &&
                        new Date(b.startTimeUtc) > new Date()
                    )
                    .slice(0, 3);
                setBookings(upcoming);
            }
        } catch (error) {
            console.error("Failed to load bookings:", error);
        } finally {
            setLoading(false);
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

    const handleEdit = (booking: any) => {
        router.push(`/venue?edit=${booking.id}&date=${booking.date}`);
    };

    // If not logged in, show login button
    if (status === "unauthenticated") {
        return (
            <Button
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 hover:border-primary hidden sm:flex"
                onClick={() => router.push("/login")}
            >
                <CalendarDays className="w-4 h-4 mr-2" />
                Manage Bookings
            </Button>
        );
    }

    return (
        <DropdownMenu onOpenChange={(open) => open && loadBookings()}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/5 hover:border-primary hidden sm:flex"
                >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Manage Bookings
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Your Upcoming Bookings</span>
                    {bookings.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {bookings.length}
                        </Badge>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {loading ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        Loading...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-4 text-center">
                        <p className="text-sm text-gray-500 mb-3">No upcoming bookings</p>
                        <Button
                            size="sm"
                            className="gradient-primary text-white"
                            onClick={() => router.push("/venue")}
                        >
                            Book Now
                        </Button>
                    </div>
                ) : (
                    <>
                        {bookings.map((booking) => (
                            <div key={booking.id} className="p-3 border-b last:border-b-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-3 h-3 text-primary" />
                                            <span className="text-sm font-semibold">
                                                {formatDate(new Date(booking.date))}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {formatTime(new Date(booking.startTimeUtc))} - {formatTime(new Date(booking.endTimeUtc))}
                                        </p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                        {booking.status}
                                    </Badge>
                                </div>

                                <div className="flex gap-1 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-7 text-xs border-primary/30 hover:bg-primary/5"
                                        onClick={() => handleEdit(booking)}
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Change
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-7 text-xs border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleCancel(booking.id)}
                                    >
                                        <X className="w-3 h-3 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push("/dashboard")}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View All Bookings
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
