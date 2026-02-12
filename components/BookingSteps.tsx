"use client";

import { Check } from "lucide-react";

interface BookingStepsProps {
    currentStep: number;
}

const steps = [
    { number: 1, label: "Select Date & Time" },
    { number: 2, label: "Review & Pay" },
];

export default function BookingSteps({ currentStep }: BookingStepsProps) {
    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${currentStep > step.number
                                    ? "bg-green-500 text-white"
                                    : currentStep === step.number
                                        ? "gradient-primary text-white ring-4 ring-primary/20"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {currentStep > step.number ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium ${currentStep >= step.number
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-4 relative top-[-20px]">
                                <div
                                    className={`h-full rounded transition-all ${currentStep > step.number
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
