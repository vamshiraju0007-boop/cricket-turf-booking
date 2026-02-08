"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

interface QuickDateSelectorProps {
    onDateSelect: (date: Date) => void;
}

export default function QuickDateSelector({ onDateSelect }: QuickDateSelectorProps) {
    const getToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    };

    const getThisWeekend = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
        const saturday = new Date();
        saturday.setDate(today.getDate() + daysUntilSaturday);
        saturday.setHours(0, 0, 0, 0);
        return saturday;
    };

    const quickOptions = [
        { label: "Today", icon: Calendar, getDate: getToday },
        { label: "Tomorrow", icon: Calendar, getDate: getTomorrow },
        { label: "This Weekend", icon: Clock, getDate: getThisWeekend },
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
                Quick Select:
            </span>
            {quickOptions.map((option) => (
                <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    onClick={() => onDateSelect(option.getDate())}
                    className="border-primary/30 hover:border-primary hover:bg-primary/5"
                >
                    <option.icon className="w-4 h-4 mr-1" />
                    {option.label}
                </Button>
            ))}
        </div>
    );
}
