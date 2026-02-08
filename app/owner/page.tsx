"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatTime, formatPrice } from "@/lib/booking-utils";
import { Download, LogOut, Users } from "lucide-react";
import dayjs from "dayjs";

export const dynamic = 'force-dynamic';

interface Booking {
    id: string;
    date: string;
    startTimeUtc: string;
    endTimeUtc: string;
    slotsCount: number;
    amountPaise: number;
    status: string;
    user: {
        name: string;
        email: string;
        phone: string | null;
    };
    payment: {
        razorpayPaymentId: string;
        status: string;
    } | null;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
    _count: {
        bookings: number;
    };
}

export default function OwnerDashboard() {
    const session = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        status: 'ALL',
    });

    const status = session?.status || 'loading';

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if (session?.data?.user?.role !== "OWNER") {
                router.push("/dashboard");
            } else {
                loadBookings();
                loadUsers();
            }
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.data?.user?.role === "OWNER") {
            loadBookings();
        }
    }, [filters]);

    const loadBookings = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: filters.startDate,
                endDate: filters.endDate,
                status: filters.status,
            });

            const response = await fetch(`/api/owner/bookings?${params}`);
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

    const loadUsers = async () => {
        try {
            const response = await fetch("/api/owner/users");
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive",
            });
        }
    };

    const handleExport = async () => {
        try {
            const params = new URLSearchParams({
                startDate: filters.startDate,
                endDate: filters.endDate,
                status: filters.status,
            });

            const response = await fetch(`/api/owner/export?${params}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Success",
                description: "Bookings exported successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export bookings",
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">Owner Dashboard</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => router.push("/dashboard")} variant="outline">
                            My Bookings
                        </Button>
                        <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">Welcome, {session?.data?.user?.name}!</h2>
                    <p className="text-gray-600">Manage all bookings and users</p>
                </div>

                <Tabs defaultValue="bookings" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-6">
                        {/* Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) =>
                                                setFilters({ ...filters, startDate: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) =>
                                                setFilters({ ...filters, endDate: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={filters.status}
                                            onChange={(e) =>
                                                setFilters({ ...filters, status: e.target.value })
                                            }
                                        >
                                            <option value="ALL">All</option>
                                            <option value="CONFIRMED">Confirmed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                            <option value="PENDING">Pending</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={handleExport} className="w-full">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export CSV
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bookings Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bookings ({bookings.length})</CardTitle>
                                <CardDescription>
                                    All bookings from {formatDate(new Date(filters.startDate))} to{" "}
                                    {formatDate(new Date(filters.endDate))}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Time</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Slots</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Payment</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8">
                                                        No bookings found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                bookings.map((booking) => (
                                                    <TableRow key={booking.id}>
                                                        <TableCell>
                                                            {formatDate(new Date(booking.date))}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            {formatTime(new Date(booking.startTimeUtc))} -{" "}
                                                            {formatTime(new Date(booking.endTimeUtc))}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">{booking.user.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {booking.user.email}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{booking.slotsCount}</TableCell>
                                                        <TableCell className="font-semibold">
                                                            {formatPrice(booking.amountPaise)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    booking.status === "CONFIRMED"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {booking.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {booking.payment ? (
                                                                <div className="text-xs">
                                                                    <Badge variant="outline">
                                                                        {booking.payment.status}
                                                                    </Badge>
                                                                    <p className="text-gray-500 mt-1">
                                                                        {booking.payment.razorpayPaymentId}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">N/A</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    All Users ({users.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Bookings</TableHead>
                                                <TableHead>Joined</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phone || "N/A"}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={user.role === "OWNER" ? "default" : "secondary"}>
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{user._count.bookings}</TableCell>
                                                    <TableCell>
                                                        {formatDate(new Date(user.createdAt))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
