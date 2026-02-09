"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        fetch("/api/auth/new-verification", {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSuccess(data.success);
                    if (data.email) {
                        setIsRedirecting(true);
                        // Auto login after verification
                        signIn("credentials", {
                            email: data.email,
                            isAutoLogin: "true",
                            redirect: false,
                        }).then((result) => {
                            if (result?.error) {
                                setError("Auto-login failed. Please sign in manually.");
                                setIsRedirecting(false);
                            } else {
                                router.push("/venue");
                                router.refresh();
                            }
                        });
                    }
                }
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Confirming your verification</h1>

                <div className="flex items-center justify-center w-full my-8">
                    {!success && !error && (
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    )}

                    {success && (
                        <div className="space-y-4 w-full">
                            <div className="p-3 bg-emerald-100 text-emerald-500 rounded-md w-full">
                                {success}
                            </div>
                            {isRedirecting && (
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Logging you in and redirecting...
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-100 text-red-500 rounded-md w-full">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <Link href="/login">
                        <Button className="w-full" variant="outline">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
