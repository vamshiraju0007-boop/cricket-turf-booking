"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Trophy } from "lucide-react";

interface DashboardStatsProps {
    totalBookings: number;
    upcomingBookings: number;
    totalHoursBooked: number;
    totalSpent: number;
}

export default function DashboardStats({
    totalBookings,
    upcomingBookings,
    totalHoursBooked,
    totalSpent,
}: DashboardStatsProps) {
    const stats = [
        {
            title: "Total Bookings",
            value: totalBookings,
            icon: Calendar,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            title: "Upcoming",
            value: upcomingBookings,
            icon: Clock,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            title: "Hours Played",
            value: totalHoursBooked,
            icon: Trophy,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            title: "Total Spent",
            value: `₹${totalSpent.toLocaleString()}`,
            icon: TrendingUp,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={index}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-full`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            <div className={`h-1 w-full bg-gradient-to-r ${stat.color} rounded-full mt-4`}></div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
