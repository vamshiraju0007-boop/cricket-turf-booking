"use client";

export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>

            {/* Card Skeletons */}
            <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SlotGridSkeleton() {
    return (
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
    );
}

export function CalendarSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto"></div>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    );
}
