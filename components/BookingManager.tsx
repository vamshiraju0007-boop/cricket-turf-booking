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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, X, Edit2, Check, MoreVertical } from "lucide-react";

interface BookedSlot {
    date: string;
    time: string;
}

interface BookingManagerProps {
    onBookingsChange?: () => void;
}

export default function BookingManager({ onBookingsChange }: BookingManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
    const [editingSlot, setEditingSlot] = useState<{ original: BookedSlot; new: BookedSlot } | null>(null);

    const timeSlots = [
        "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm",
        "1:00pm", "2:00pm", "4:00pm", "5:00pm", "9:00pm"
    ];

    const loadBookings = () => {
        const stored = localStorage.getItem('bookedSlots');
        if (stored) {
            try {
                setBookedSlots(JSON.parse(stored));
            } catch (error) {
                console.error('Error loading bookings:', error);
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadBookings();
        }
    }, [isOpen]);

    const handleCancelSlot = (slotToCancel: BookedSlot) => {
        const confirmed = confirm(`Cancel booking for ${formatDate(slotToCancel.date)} at ${slotToCancel.time}?`);
        if (confirmed) {
            const updatedSlots = bookedSlots.filter(
                slot => !(slot.date === slotToCancel.date && slot.time === slotToCancel.time)
            );
            localStorage.setItem('bookedSlots', JSON.stringify(updatedSlots));
            setBookedSlots(updatedSlots);
            if (onBookingsChange) {
                onBookingsChange();
            }
        }
    };

    const handleEditSlot = (slot: BookedSlot) => {
        setEditingSlot({ original: slot, new: { ...slot } });
    };

    const handleSaveEdit = () => {
        if (!editingSlot) return;

        // Check if new slot is already booked
        const isAlreadyBooked = bookedSlots.some(
            slot => slot.date === editingSlot.new.date &&
                slot.time === editingSlot.new.time &&
                !(slot.date === editingSlot.original.date && slot.time === editingSlot.original.time)
        );

        if (isAlreadyBooked) {
            alert("This slot is already booked! Please choose a different date or time.");
            return;
        }

        // Remove old slot and add new slot
        const updatedSlots = bookedSlots.map(slot =>
            (slot.date === editingSlot.original.date && slot.time === editingSlot.original.time)
                ? editingSlot.new
                : slot
        );

        localStorage.setItem('bookedSlots', JSON.stringify(updatedSlots));
        setBookedSlots(updatedSlots);
        setEditingSlot(null);
        if (onBookingsChange) {
            onBookingsChange();
        }
    };

    const handleCancelEdit = () => {
        setEditingSlot(null);
    };

    const handleClearAll = () => {
        const confirmed = confirm('Are you sure you want to cancel ALL bookings?');
        if (confirmed) {
            localStorage.removeItem('bookedSlots');
            setBookedSlots([]);
            if (onBookingsChange) {
                onBookingsChange();
            }
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Generate next 30 days for date picker
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    // Group slots by date
    const slotsByDate = bookedSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot.time);
        return acc;
    }, {} as Record<string, string[]>);

    const isEditing = (slot: BookedSlot) => {
        return editingSlot?.original.date === slot.date && editingSlot?.original.time === slot.time;
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="border-primary/30 text-primary hover:bg-primary/5"
            >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Bookings
                {bookedSlots.length > 0 && (
                    <Badge className="ml-2 bg-primary text-white">
                        {bookedSlots.length}
                    </Badge>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Your Bookings</DialogTitle>
                        <DialogDescription>
                            View, modify, or cancel your booked time slots
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {bookedSlots.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg">No bookings yet</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Select time slots from the calendar to make a booking
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-600">
                                        Total: {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''}
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleClearAll}
                                    >
                                        Cancel All
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(slotsByDate).map(([date, times]) => (
                                        <Card key={date} className="border-primary/10">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    <h3 className="font-bold text-gray-900">
                                                        {formatDate(date)}
                                                    </h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {times.map((time, idx) => {
                                                        const slot = { date, time };
                                                        const editing = isEditing(slot);

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`p-3 rounded-lg border ${editing
                                                                    ? 'bg-yellow-50 border-yellow-300'
                                                                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-primary/10'
                                                                    }`}
                                                            >
                                                                {editing ? (
                                                                    <div className="space-y-3">
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <div>
                                                                                <label className="text-xs text-gray-600 mb-1 block">Date</label>
                                                                                <select
                                                                                    value={editingSlot?.new.date || ''}
                                                                                    onChange={(e) => editingSlot && setEditingSlot({
                                                                                        ...editingSlot,
                                                                                        new: { ...editingSlot.new, date: e.target.value }
                                                                                    })}
                                                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                                                >
                                                                                    {getAvailableDates().map(d => (
                                                                                        <option key={d} value={d}>
                                                                                            {formatDate(d)}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-xs text-gray-600 mb-1 block">Time</label>
                                                                                <select
                                                                                    value={editingSlot?.new.time || ''}
                                                                                    onChange={(e) => editingSlot && setEditingSlot({
                                                                                        ...editingSlot,
                                                                                        new: { ...editingSlot.new, time: e.target.value }
                                                                                    })}
                                                                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                                                                >
                                                                                    {timeSlots.map(t => (
                                                                                        <option key={t} value={t}>{t}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-2 justify-end">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={handleCancelEdit}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={handleSaveEdit}
                                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                                            >
                                                                                <Check className="w-4 h-4 mr-1" />
                                                                                Save
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <Clock className="w-4 h-4 text-primary" />
                                                                            <span className="font-medium text-gray-700">
                                                                                {time}
                                                                            </span>
                                                                            <Badge variant="outline" className="text-xs">
                                                                                ₹1,500
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="relative group">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                                            >
                                                                                <MoreVertical className="w-4 h-4" />
                                                                            </Button>
                                                                            <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                                                <button
                                                                                    onClick={() => handleEditSlot(slot)}
                                                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-blue-600 flex items-center gap-2"
                                                                                >
                                                                                    <Edit2 className="w-4 h-4" />
                                                                                    Change Date
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleCancelSlot(slot)}
                                                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                                                                                >
                                                                                    <X className="w-4 h-4" />
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
