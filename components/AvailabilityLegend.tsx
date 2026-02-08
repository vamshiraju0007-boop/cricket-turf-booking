"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

export default function AvailabilityLegend() {
    const legendItems = [
        {
            icon: CheckCircle2,
            label: "Available",
            color: "text-green-500",
            bgColor: "bg-green-50",
        },
        {
            icon: Circle,
            label: "Selected",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            icon: XCircle,
            label: "Booked",
            color: "text-red-500",
            bgColor: "bg-red-50",
        },
    ];

    return (
        <Card className="border-primary/10 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-4 pb-4">
                <div className="flex flex-wrap gap-4 justify-center">
                    {legendItems.map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${item.bgColor}`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
