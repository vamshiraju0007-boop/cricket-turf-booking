"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatTime, formatPrice, canCancelBooking } from "@/lib/booking-utils";
import { Calendar, Clock, LogOut, Trophy, Home } from "lucide-react";
import dayjs from "dayjs";
import EmptyBookingsState from "@/components/EmptyBookingsState";
import DashboardStats from "@/components/DashboardStats";
import EnhancedBookingCard from "@/components/EnhancedBookingCard";

export const dynamic = 'force-dynamic';

interface Booking {
    id: string;
    date: string;
    startTimeUtc: string;
    endTimeUtc: string;
    slotsCount: number;
    amountPaise: number;
    status: string;
    createdAt: string;
    payment: {
        razorpayPaymentId: string;
        status: string;
    } | null;
}

export default function DashboardPage() {
    const session = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const status = session?.status || 'loading';

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            loadBookings();
        }
    }, [status, router]);

    const loadBookings = async () => {
        try {
            const response = await fetch("/api/bookings");
            const data = await response.json();
            setBookings(data.bookings);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load bookings",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            toast({
                title: "Success",
                description: "Booking cancelled successfully",
            });
            loadBookings();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to cancel booking",
                variant: "destructive",
            });
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    const upcomingBookings = bookings.filter(
        (b) => b.status === "CONFIRMED" && dayjs(b.startTimeUtc).isAfter(dayjs())
    );

    const pastBookings = bookings.filter(
        (b) => b.status === "CONFIRMED" && dayjs(b.startTimeUtc).isBefore(dayjs())
    );

    const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

    // Calculate stats
    const totalHoursBooked = bookings
        .filter(b => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + b.slotsCount, 0);
    const totalSpent = bookings
        .filter(b => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + b.amountPaise, 0) / 100;


    const renderBookingCard = (booking: Booking, showCancel: boolean = false) => (
        <Card key={booking.id} className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg card-hover">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {formatDate(new Date(booking.date))}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(new Date(booking.startTimeUtc))} -{" "}
                            {formatTime(new Date(booking.endTimeUtc))}
                        </CardDescription>
                    </div>
                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                        {booking.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Slots:</span>
                        <span className="font-medium">{booking.slotsCount} hour(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-primary">
                            {formatPrice(booking.amountPaise)}
                        </span>
                    </div>
                    {booking.payment && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment:</span>
                            <span className="font-medium">{booking.payment.status}</span>
                        </div>
                    )}
                    {showCancel && canCancelBooking(new Date(booking.startTimeUtc)) && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => handleCancelBooking(booking.id)}
                        >
                            Cancel Booking
                        </Button>
                    )}
                    {showCancel && !canCancelBooking(new Date(booking.startTimeUtc)) && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Cannot cancel (less than 2 hours before start)
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="glass-effect border-b sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gradient">My Dashboard</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => router.push("/")} variant="ghost" className="hover:bg-primary/10">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        <Button onClick={() => router.push("/venue")} className="gradient-primary text-white border-0 hover:opacity-90">
                            Book Turf
                        </Button>
                        {session?.data?.user?.role === "OWNER" && (
                            <Button onClick={() => router.push("/owner")} variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                                Owner Dashboard
                            </Button>
                        )}
                        <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost" className="hover:bg-red-50 hover:text-red-600">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome, <span className="text-gradient">{session?.data?.user?.name || "User"}</span>!
                    </h1>
                    <p className="text-gray-600">Manage your bookings and track your cricket sessions</p>
                </div>

                {/* Dashboard Stats */}
                <DashboardStats
                    totalBookings={bookings.length}
                    upcomingBookings={upcomingBookings.length}
                    totalHoursBooked={totalHoursBooked}
                    totalSpent={totalSpent}
                />

                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="upcoming">
                            Upcoming ({upcomingBookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
                        <TabsTrigger value="cancelled">
                            Cancelled ({cancelledBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        {upcomingBookings.length === 0 ? (
                            <EmptyBookingsState />
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {upcomingBookings.map((booking) => (
                                    <EnhancedBookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={handleCancelBooking}
                                        showActions={true}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        {pastBookings.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-gray-500">No past bookings</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {pastBookings.map((booking) => (
                                    <EnhancedBookingCard
                                        key={booking.id}
                                        booking={booking}
                                        showActions={false}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="space-y-4">
                        {cancelledBookings.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-gray-500">No cancelled bookings</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {cancelledBookings.map((booking) => (
                                    <EnhancedBookingCard
                                        key={booking.id}
                                        booking={booking}
                                        showActions={false}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
