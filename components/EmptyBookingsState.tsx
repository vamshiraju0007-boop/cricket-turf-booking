"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EmptyBookingsState() {
    return (
        <Card className="border-primary/10 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-12 pb-12 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-white" />
                    </div>

                    {/* Heading */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            No Bookings Yet
                        </h3>
                        <p className="text-gray-600">
                            You haven't made any bookings. Start by booking your first cricket turf slot!
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <span>Book slots from 7:00 AM to 2:00 AM</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <span>Professional-grade cricket turf</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link href="/venue">
                        <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 w-full">
                            Book Your First Slot
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
