import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Award, Sparkles } from "lucide-react"
import { cn } from "@/components/ui/utils"

export function MarioPickBadge({ className }: { className?: string }) {
    return (
        <Badge
            className={cn(
                "bg-[#79D7BE] text-[#2E5077] hover:bg-[#79D7BE] border-0 flex items-center gap-1 py-1 px-3 rounded-full",
                className
            )}
        >
            <Award className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Mario&apos;s Pick</span>
        </Badge>
    )
}

export function SavingsBadge({ percentage, className }: { percentage: number; className?: string }) {
    if (percentage <= 0) return null;

    return (
        <Badge
            className={cn(
                "bg-[#E9F6F5] text-[#4DA1A9] hover:bg-[#E9F6F5] border-0 font-bold text-[11px] h-6 rounded-md px-2",
                className
            )}
        >
            {percentage}% below avg
        </Badge>
    )
}

export function MarioPointsBadge({ points, className }: { points: number; className?: string }) {
    return (
        <div className={cn("flex items-center gap-1.5 text-[#4DA1A9] font-bold text-sm", className)}>
            <span>Earn +{points} MarioPoints</span>
        </div>
    )
}

export function MPSBadge({ score, className }: { score: number; className?: string }) {
    const getColors = (s: number) => {
        if (s >= 85) return "bg-green-50 text-green-700 border-green-200";
        if (s >= 70) return "bg-blue-50 text-blue-700 border-blue-200";
        if (s >= 50) return "bg-orange-50 text-orange-700 border-orange-200";
        return "bg-red-50 text-red-700 border-red-200";
    }

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-bold leading-none",
            getColors(score),
            className
        )}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>MPS: {score}</span>
        </div>
    )
}
