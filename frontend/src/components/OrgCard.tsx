'use client';

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, ChevronDown, ChevronUp, Calendar, Phone } from "lucide-react"
import { cn } from "@/components/ui/utils"
import { MarioPickBadge, SavingsBadge, MarioPointsBadge, MPSBadge } from "@/components/ui/mario-badges"

interface Provider {
    provider_id: string;
    provider_name: string;
    specialty?: string;
    price?: string | number;
}

interface OrgCardProps {
    orgName: string;
    procedureName: string;
    price: number;
    originalPrice?: number;
    savingsPercentage?: number;
    distance?: string | number;
    inNetwork?: boolean;
    rating?: number;
    reviewCount?: number;
    mariosPick?: boolean;
    marioPoints?: number;
    mpsScore?: number;
    address?: string;
    description?: string;
    providers?: Provider[];
    onBook?: () => void;
    onCall?: () => void;
    onClick?: () => void;
}

export function OrgCard({
    orgName,
    procedureName,
    price,
    originalPrice,
    savingsPercentage,
    distance,
    inNetwork = true,
    rating = 4.8,
    reviewCount = 124,
    mariosPick = false,
    marioPoints = 100,
    mpsScore,
    address,
    description = "State-of-the-art facility featuring expert clinicians and high-quality results.",
    providers = [],
    onBook,
    onCall,
    onClick,
}: OrgCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const formatPrice = (p: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(p);
    };

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-200 hover:shadow-md border-0 shadow-sm p-5 cursor-pointer",
                mariosPick ? "ring-1 ring-[#79D7BE]/30" : ""
            )}
            onClick={onClick}
        >
            {mariosPick && (
                <div className="absolute top-4 left-4 z-10">
                    <MarioPickBadge />
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className={cn("flex-1 min-w-0", mariosPick && "mt-8")}>
                        <h3 className="text-xl font-bold text-[#2E5077] truncate">{orgName}</h3>
                        <p className="text-[#4DA1A9] font-medium text-sm">{procedureName}</p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#2E5077]">{formatPrice(price)}</span>
                            {originalPrice && (
                                <span className="text-sm text-gray-300 line-through">{formatPrice(originalPrice)}</span>
                            )}
                        </div>
                        {savingsPercentage && (
                            <SavingsBadge percentage={savingsPercentage} className="mt-1" />
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#4DA1A9]" />
                        <span>{distance ? `${distance} mi` : "1.4 mi"}</span>
                    </div>
                    <Badge variant="secondary" className="bg-[#E9F6F5] text-[#2E5077] hover:bg-[#E9F6F5] border-0 text-[10px] font-bold h-6 px-2">
                        {inNetwork ? "In-Network" : "Out-of-Network"}
                    </Badge>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-[#2E5077]">{rating}</span>
                        <span className="text-gray-400">({reviewCount})</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <MarioPointsBadge points={marioPoints} />
                    {mpsScore && <MPSBadge score={mpsScore} />}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {description}
                </p>

                <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        className="flex-1 text-[#4DA1A9] hover:text-[#2E5077] hover:bg-gray-50 h-11 font-bold tracking-tight"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? (
                            <>Hide providers <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>View {providers.length || 1} providers <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                    <div className="flex-[1.5] flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 border-[#4DA1A9] text-[#4DA1A9] hover:bg-[#E9F6F5] h-11 font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCall?.();
                            }}
                        >
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                        </Button>
                        <Button
                            className="flex-[2] bg-[#2E5077] hover:bg-[#1A3A5A] text-white h-11 font-bold shadow-sm rounded-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                onBook?.();
                            }}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Book Online
                        </Button>
                    </div>
                </div>

                {isExpanded && providers.length > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {providers.map((p) => (
                            <div
                                key={p.provider_id}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-[#4DA1A9]/30 hover:bg-gray-50/50 transition-all group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#2E5077]">{p.provider_name}</span>
                                    <span className="text-xs text-gray-400">{p.specialty || 'Specialist'}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-black text-[#2E5077]">
                                        {typeof p.price === 'number' ? formatPrice(p.price) : p.price}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs text-[#4DA1A9] hover:text-[#2E5077] p-0 font-bold"
                                    >
                                        Select →
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    )
}
