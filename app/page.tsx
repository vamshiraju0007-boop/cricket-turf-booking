"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin, Clock, Users, Wifi, Car, Coffee, Star, Sparkles, Trophy, Shield,
    CheckCircle, Calendar, CreditCard, Zap, TrendingUp, Award, Target, CalendarDays
} from "lucide-react";
import WeekCalendar from "@/components/WeekCalendar";
import ManageBookingsModal from "@/components/ManageBookingsModal";

export default function HomePage() {
    const [isManageBookingsOpen, setIsManageBookingsOpen] = useState(false);

    const features = [
        {
            icon: Trophy,
            title: "Professional Grade Turf",
            desc: "International standard playing surface with premium quality",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Shield,
            title: "Safe & Secure",
            desc: "24/7 security, CCTV monitoring, and safe environment",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Sparkles,
            title: "Premium Facilities",
            desc: "Best-in-class amenities and modern infrastructure",
            color: "from-indigo-500 to-indigo-600"
        },
        {
            icon: Zap,
            title: "Instant Booking",
            desc: "Book your slot in seconds with our seamless system",
            color: "from-orange-500 to-orange-600"
        },
    ];

    const amenities = [
        { icon: Wifi, label: "Free WiFi", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: Car, label: "Free Parking", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: Coffee, label: "Refreshments", color: "text-indigo-500", bg: "bg-indigo-50" },
        { icon: Users, label: "Changing Rooms", color: "text-violet-500", bg: "bg-violet-50" },
        { icon: Trophy, label: "Equipment", color: "text-green-500", bg: "bg-green-50" },
        { icon: Award, label: "Coaching", color: "text-orange-500", bg: "bg-orange-50" },
    ];

    const bookingSteps = [
        { icon: Calendar, title: "Choose Date & Time", desc: "Select your preferred slot from our calendar" },
        { icon: CheckCircle, title: "Confirm Booking", desc: "Review your selection and confirm details" },
        { icon: CreditCard, title: "Secure Payment", desc: "Pay securely via Razorpay" },
        { icon: Target, title: "Play Cricket!", desc: "Show up and enjoy your game" },
    ];

    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "Cricket Enthusiast",
            rating: 5,
            text: "Best cricket turf in Bangalore! The booking process is super smooth and the facilities are top-notch. Highly recommended!",
            avatar: "RK"
        },
        {
            name: "Priya Sharma",
            role: "Team Captain",
            rating: 5,
            text: "We book this turf every weekend for our team practice. The quality is consistent and the staff is very professional.",
            avatar: "PS"
        },
        {
            name: "Amit Patel",
            role: "Regular Player",
            rating: 5,
            text: "Excellent turf quality and great amenities. The online booking system makes it so convenient. Worth every rupee!",
            avatar: "AP"
        },
    ];

    const stats = [
        { value: "500+", label: "Happy Players" },
        { value: "1000+", label: "Bookings" },
        { value: "4.9", label: "Rating" },
        { value: "24/7", label: "Support" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="glass-effect border-b sticky top-0 z-50 shadow-sm animate-slide-up">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gradient">CricketTurf</h1>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
                        <a href="#amenities" className="text-gray-700 hover:text-primary transition-colors">Amenities</a>
                        <a href="#pricing" className="text-gray-700 hover:text-primary transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors">Reviews</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-primary/30 hover:bg-primary/5 hover:border-primary hidden sm:flex"
                            onClick={() => setIsManageBookingsOpen(true)}
                        >
                            <CalendarDays className="w-4 h-4 mr-2" />
                            Manage Bookings
                        </Button>
                        <Link href="/login">
                            <Button variant="ghost" className="hover:bg-primary/10">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="gradient-primary text-white border-0 hover:opacity-90">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <ManageBookingsModal
                open={isManageBookingsOpen}
                onOpenChange={setIsManageBookingsOpen}
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-sm font-medium text-primary">Bangalore's #1 Cricket Turf</span>
                        </div>

                        {/* Main Heading */}
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                            Book Your Perfect
                            <span className="block text-gradient mt-2 animate-slide-up">Cricket Turf Slot</span>
                        </h2>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Experience world-class cricket facilities with seamless online booking.
                            <span className="block mt-2 font-semibold text-primary">Open 7:00 AM to 2:00 AM Daily</span>
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/10 hover:shadow-lg transition-all hover:scale-105">
                                    <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Link href="/venue">
                                <Button size="lg" className="text-lg px-12 py-7 gradient-primary text-white border-0 hover:opacity-90 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                                    Book Now →
                                </Button>
                            </Link>
                            <Link href="#how-it-works">
                                <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all">
                                    How It Works
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h3 className="text-4xl md:text-5xl font-bold mb-4">
                        Why Choose <span className="text-gradient">CricketTurf</span>?
                    </h3>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We provide the best cricket experience with premium facilities and seamless booking
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className="card-hover border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                            <div className={`h-2 w-full bg-gradient-to-r ${feature.color}`}></div>
                            <CardContent className="pt-8 pb-6 text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:rotate-3`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">{feature.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-white/40 backdrop-blur-sm py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl md:text-5xl font-bold mb-4">
                            How It <span className="text-gradient">Works</span>
                        </h3>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Book your slot in 4 simple steps
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {bookingSteps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <step.icon className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h4>
                                    <p className="text-gray-600">{step.desc}</p>
                                </div>
                                {index < bookingSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -ml-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Turf Details with Pricing */}
            <section id="pricing" className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Details */}
                    <div className="space-y-8 text-center">
                        <div className="space-y-4">
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900">
                                About Our <span className="text-gradient">Turf</span>
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Located in the heart of Bangalore, our cricket turf offers a professional-grade playing experience with state-of-the-art facilities.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-all">
                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">Location</p>
                                    <p className="text-sm text-gray-600">Bangalore, KA</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-all">
                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">Hours</p>
                                    <p className="text-sm text-gray-600">7 AM - 2 AM</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-all">
                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">Capacity</p>
                                    <p className="text-sm text-gray-600">22 Players</p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="p-8 rounded-3xl gradient-primary text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                            <h4 className="font-bold text-3xl mb-6 flex items-center justify-center gap-2">
                                <TrendingUp className="w-8 h-8" />
                                Competitive Pricing
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                                    <p className="text-white/80 text-sm mb-1 uppercase tracking-wider">Day Slots</p>
                                    <p className="text-white/70 text-xs mb-2">7:00 AM - 10:00 PM</p>
                                    <p className="font-bold text-3xl">₹1,500<span className="text-base font-normal opacity-70">/hr</span></p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                                    <p className="text-white/80 text-sm mb-1 uppercase tracking-wider">Night Slots</p>
                                    <p className="text-white/70 text-xs mb-2">10:00 PM - 2:00 AM</p>
                                    <p className="font-bold text-3xl">₹1,600<span className="text-base font-normal opacity-70">/hr</span></p>
                                </div>
                            </div>
                            <Link href="/venue" className="block mt-8">
                                <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                                    Reserve Your Slot Now →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="bg-white/40 backdrop-blur-sm py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl md:text-5xl font-bold mb-4">
                                World-Class <span className="text-gradient">Amenities</span>
                            </h3>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Everything you need for the perfect cricket experience
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {amenities.map((amenity, index) => (
                                <Card key={index} className="card-hover text-center border-0 bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                    <CardContent className="pt-8 pb-6">
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${amenity.bg} flex items-center justify-center`}>
                                            <amenity.icon className={`w-8 h-8 ${amenity.color}`} />
                                        </div>
                                        <p className="font-semibold text-gray-900">{amenity.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Booking Calendar Section */}
            <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 px-4 py-2 bg-primary text-white">
                            <Calendar className="w-4 h-4 mr-2 inline" />
                            Live Availability
                        </Badge>
                        <h3 className="text-4xl md:text-5xl font-bold mb-4">
                            Check <span className="text-gradient">Available Slots</span>
                        </h3>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Select your preferred date and time. Book instantly with just a few clicks!
                        </p>
                    </div>

                    {/* Calendar Component */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-primary/10">
                        <WeekCalendar />
                    </div>

                    {/* Quick Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                            <CardContent className="pt-6 pb-6 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                <h4 className="font-bold text-gray-900 mb-2">Instant Confirmation</h4>
                                <p className="text-sm text-gray-600">Get confirmed booking immediately</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                            <CardContent className="pt-6 pb-6 text-center">
                                <CreditCard className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                                <h4 className="font-bold text-gray-900 mb-2">Secure Payment</h4>
                                <p className="text-sm text-gray-600">Pay safely via Razorpay</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg">
                            <CardContent className="pt-6 pb-6 text-center">
                                <Zap className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                                <h4 className="font-bold text-gray-900 mb-2">Quick Booking</h4>
                                <p className="text-sm text-gray-600">Complete in under 2 minutes</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="container mx-auto px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl md:text-5xl font-bold mb-4">
                            What <span className="text-gradient">Players Say</span>
                        </h3>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Don't just take our word for it - hear from our happy customers
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="card-hover border-0 bg-white shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                                <CardContent className="pt-8 pb-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">CricketTurf</span>
                            </div>
                            <p className="text-gray-400">
                                Bangalore's premier cricket turf booking platform
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#amenities" className="hover:text-white transition-colors">Amenities</a></li>
                                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Account</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                                <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>Bangalore, Karnataka</li>
                                <li>India</li>
                                <li>support@cricketturf.com</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 CricketTurf. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Floating Action Button (Mobile) */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Link href="/venue">
                    <Button
                        size="lg"
                        className="rounded-full w-16 h-16 shadow-2xl gradient-primary border-0 p-0 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
                    >
                        <CalendarDays className="w-8 h-8 text-white" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// Add these animations to your global CSS if not present
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
//   50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
// }
// .animate-bounce-slow { animation: bounce-slow 3s infinite; }
