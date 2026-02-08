"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface BookingCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    availabilityData?: Record<string, number>;
}

export default function BookingCalendar({
    selectedDate,
    onDateChange,
    availabilityData = {},
}: BookingCalendarProps) {
    const today = new Date();
    const [month, setMonth] = useState(selectedDate);

    return (
        <Card className="border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    Select Date
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        if (date) {
                            onDateChange(date);
                            setMonth(date);
                        }
                    }}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={{ before: today }}
                    showOutsideDays
                    captionLayout="dropdown-buttons"
                    fromYear={2024}
                    toYear={2030}
                    classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 rounded-md",
                        day_selected: "bg-gradient-to-br from-primary to-accent text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
                        day_today: "bg-accent/10 text-accent-foreground font-bold",
                        day_outside: "text-gray-400 opacity-50",
                        day_disabled: "text-gray-300 opacity-50",
                        day_hidden: "invisible",
                    }}
                />
            </CardContent>
        </Card>
    );
}
