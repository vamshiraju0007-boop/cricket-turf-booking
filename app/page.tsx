"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Wifi, Car, Coffee, Star, Sparkles, Trophy, Shield } from "lucide-react";
import WeekCalendar from "@/components/WeekCalendar";
import BookingManager from "@/components/BookingManager";

export default function HomePage() {

    const amenities = [
        { icon: Wifi, label: "Free WiFi", color: "text-blue-500" },
        { icon: Car, label: "Parking", color: "text-purple-500" },
        { icon: Coffee, label: "Refreshments", color: "text-indigo-500" },
        { icon: Users, label: "Changing Rooms", color: "text-violet-500" },
    ];

    const features = [
        { icon: Trophy, title: "Professional Grade", desc: "International standard turf" },
        { icon: Shield, title: "Safe & Secure", desc: "24/7 security & CCTV" },
        { icon: Sparkles, title: "Premium Facilities", desc: "Best-in-class amenities" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="glass-effect border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gradient">CricketTurf</h1>
                    </div>
                    <div className="space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" className="hover:bg-primary/10">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="gradient-primary text-white border-0 hover:opacity-90">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-overlay opacity-50"></div>
                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Premium Cricket Experience</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                            Book Your Perfect
                            <span className="block text-gradient mt-2">Cricket Turf Slot</span>
                        </h2>

                        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Experience world-class cricket facilities with seamless online booking.
                            Available from 7:00 AM to 2:00 AM daily.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link href="/venue">
                                <Button size="lg" className="text-lg px-10 py-6 gradient-primary text-white border-0 hover:opacity-90 shadow-lg hover:shadow-xl transition-all">
                                    Book Now →
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5">
                                    View My Bookings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className="card-hover border-primary/10 bg-white/80 backdrop-blur-sm">
                            <CardContent className="pt-8 pb-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Turf Details */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
                    {/* Image */}
                    <div className="relative group">
                        <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl h-96 flex items-center justify-center shadow-2xl">
                            <div className="text-white text-center p-8">
                                <Trophy className="w-20 h-20 mx-auto mb-4 opacity-90" />
                                <p className="text-2xl font-bold mb-2">Premium Cricket Turf</p>
                                <p className="text-lg opacity-90">Professional-grade playing surface</p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-4xl font-bold mb-6 text-gray-900">
                                About Our <span className="text-gradient">Turf</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-primary/10">
                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Location</p>
                                        <p className="text-gray-600">Bangalore, Karnataka, India</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-primary/10">
                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Operating Hours</p>
                                        <p className="text-gray-600">7:00 AM - 2:00 AM (Next Day)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-primary/10">
                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Capacity</p>
                                        <p className="text-gray-600">22 players (Full team matches)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl gradient-primary text-white">
                            <h4 className="font-semibold text-xl mb-4">Pricing</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/90">7:00 AM to 10:00 PM</span>
                                    <span className="font-bold text-2xl">₹1,500/hour</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/90">10:00 PM to 2:00 AM</span>
                                    <span className="font-bold text-2xl">₹1,600/hour</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities */}
            <section className="container mx-auto px-4 py-20 bg-white/40 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-4xl font-bold text-center mb-12">
                        World-Class <span className="text-gradient">Amenities</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {amenities.map((amenity, index) => (
                            <Card key={index} className="card-hover text-center border-primary/10 bg-white/80 backdrop-blur-sm">
                                <CardContent className="pt-8 pb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <amenity.icon className={`w-8 h-8 ${amenity.color}`} />
                                    </div>
                                    <p className="font-semibold text-gray-900">{amenity.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-4xl font-bold text-center mb-12">
                        What <span className="text-gradient">Players Say</span>
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="card-hover border-primary/10 bg-white/80 backdrop-blur-sm">
                                <CardContent className="pt-8 pb-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        "Excellent turf quality and seamless booking process. The facilities are top-notch!"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                            P{i}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Player {i}</p>
                                            <p className="text-sm text-gray-500">Regular Customer</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Book Your Slot Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <h3 className="text-4xl font-bold">
                                Book Your <span className="text-gradient">Perfect Slot</span>
                            </h3>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <p className="text-xl text-gray-600">
                                Select your preferred date and time
                            </p>
                            <BookingManager />
                        </div>
                    </div>
                    <div className="pt-12">
                        <WeekCalendar />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center gradient-primary rounded-3xl p-12 md:p-16 shadow-2xl">
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Play?
                    </h3>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Book your slot now and experience the best cricket turf in Bangalore
                    </p>
                    <Link href="/venue">
                        <Button size="lg" className="text-lg px-12 py-6 bg-white text-primary hover:bg-gray-100 shadow-xl">
                            Book Your Slot →
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">CricketTurf</span>
                    </div>
                    <p className="text-gray-400">&copy; 2026 CricketTurf. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
