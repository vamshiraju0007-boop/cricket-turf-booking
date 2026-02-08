"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, MoreVertical, RefreshCw, X } from "lucide-react";
import { formatDate, formatTime, formatPrice } from "@/lib/booking-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedBookingCardProps {
    booking: {
        id: string;
        date: string;
        startTimeUtc: string;
        endTimeUtc: string;
        slotsCount: number;
        amountPaise: number;
        status: string;
        createdAt: string;
    };
    onCancel?: (id: string) => void;
    onRebook?: (booking: any) => void;
    showActions?: boolean;
}

export default function EnhancedBookingCard({
    booking,
    onCancel,
    onRebook,
    showActions = true,
}: EnhancedBookingCardProps) {
    const startTime = new Date(booking.startTimeUtc);
    const endTime = new Date(booking.endTimeUtc);
    const bookingDate = new Date(booking.date);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <Card className="border-primary/10 bg-white hover:shadow-lg transition-all duration-300 hover:scale-102 overflow-hidden group">
            {/* Colored top border */}
            <div className={`h-1 w-full ${booking.status.toLowerCase() === "confirmed"
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : booking.status.toLowerCase() === "cancelled"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-600"
                }`}></div>

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                                Booking #{booking.id.slice(0, 8)}
                            </span>
                        </div>
                        <CardTitle className="text-lg">Premium Cricket Turf</CardTitle>
                    </div>
                    {showActions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onRebook && (
                                    <DropdownMenuItem onClick={() => onRebook(booking)}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Rebook
                                    </DropdownMenuItem>
                                )}
                                {onCancel && booking.status.toLowerCase() === "confirmed" && (
                                    <DropdownMenuItem
                                        onClick={() => onCancel(booking.id)}
                                        className="text-red-600"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel Booking
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Date */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(bookingDate)}</p>
                    </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Time</p>
                        <p className="font-semibold text-gray-900">
                            {formatTime(startTime)} - {formatTime(endTime)}
                        </p>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">Bangalore, Karnataka</p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-primary">
                        {formatPrice(booking.amountPaise)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
