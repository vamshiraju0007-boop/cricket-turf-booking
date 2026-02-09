"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: "Login failed",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Logged in successfully",
                });
                router.push("/venue");
                router.refresh();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 gradient-overlay opacity-30"></div>
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-4 hover:bg-white/50">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>

                <Card className="border-primary/10 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-3 text-center pb-6">
                        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-2">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold">
                            Welcome <span className="text-gradient">Back</span>
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to your account to book turf slots
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-12 border-primary/20 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="h-12 border-primary/20 focus:border-primary"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base gradient-primary text-white border-0 hover:opacity-90 shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In →"}
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-primary hover:underline font-semibold">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>

                {/* Demo credentials */}
                <Card className="mt-4 border-primary/10 bg-white/60 backdrop-blur-sm">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Demo Accounts:</p>
                        <div className="space-y-1 text-xs text-gray-600">
                            <p>Owner: owner@turf.com / Owner@1234</p>
                            <p>User: user@example.com / User@1234</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
