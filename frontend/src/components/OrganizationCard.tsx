'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, MapPin, Award, Users, Star, Gift } from 'lucide-react';
import { cn } from './ui/utils';

interface Provider {
    provider_id: string;
    provider_name: string;
    specialty?: string;
    price?: string | number;
    distance_miles?: string | number;
    rating?: number;
    review_count?: number;
    [key: string]: any;
}

interface OrganizationCardProps {
    orgName: string;
    procedureName: string;
    priceRange: { min: number; max: number };
    providerCount: number;
    distance?: string;
    address?: string;
    inNetwork?: boolean;
    mariosPick?: boolean;
    rating?: number;
    reviewCount?: number;
    marioPoints?: number;
    avgPrice?: number;
    providers: Provider[];
    onBookProvider?: (provider: Provider) => void;
}

export function OrganizationCard({
    orgName,
    procedureName,
    priceRange,
    providerCount,
    distance,
    address,
    inNetwork = true,
    mariosPick = false,
    rating = 4.8,
    reviewCount = 124,
    marioPoints = 100,
    avgPrice = 1400,
    providers,
    onBookProvider
}: OrganizationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    const displayPrice = priceRange.min === priceRange.max || priceRange.max === -Infinity || priceRange.max === 0
        ? formatPrice(priceRange.min === Infinity ? 0 : priceRange.min)
        : `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`;

    const savingsPercent = avgPrice > 0 && priceRange.min > 0
        ? Math.round(((avgPrice - priceRange.min) / avgPrice) * 100)
        : 0;

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-200 hover:shadow-md border-0 shadow-sm",
            mariosPick ? "ring-1 ring-[#79D7BE]/30" : ""
        )}>
            {mariosPick && (
                <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-[#79D7BE] text-[#2E5077] hover:bg-[#79D7BE] border-0 flex items-center gap-1 py-1 px-3">
                        <Award className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase">Mario's Pick</span>
                    </Badge>
                </div>
            )}

            <div className="p-6 text-left">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <h3 className={cn(
                            "text-xl font-bold text-[#2E5077] leading-tight mb-1",
                            mariosPick && "mt-8"
                        )}>
                            {orgName}
                        </h3>
                        <p className="text-[#4DA1A9] font-medium text-sm mb-4">
                            {procedureName}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-[#4DA1A9]" />
                                <span>{distance || "1.4 mi"}</span>
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

                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-[#2E5077]">{formatPrice(priceRange.min === Infinity ? 850 : priceRange.min)}</span>
                                    <span className="text-sm text-gray-300 line-through">{formatPrice(avgPrice)}</span>
                                </div>
                            </div>
                            {savingsPercent > 0 && (
                                <Badge className="bg-[#E9F6F5] text-[#4DA1A9] hover:bg-[#E9F6F5] border-0 font-bold text-[11px] h-6">
                                    {savingsPercent}% below avg
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <p className="text-[#4DA1A9] font-bold text-sm">Earn +{marioPoints} MarioPoints</p>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            State-of-the-art facility featuring expert clinicians and high-quality results.
                            Search from {providerCount} available providers.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        className="flex-1 text-[#4DA1A9] hover:text-[#2E5077] hover:bg-gray-50 h-11 font-bold tracking-tight"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <>Hide providers <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>View {providerCount} providers <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                    <Button className="flex-[1.5] bg-[#2E5077] hover:bg-[#1A3A5A] text-white h-11 font-bold shadow-sm rounded-lg">
                        Book Appointment
                    </Button>
                </div>

                {isExpanded && (
                    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {providers.map((provider) => (
                            <div
                                key={provider.provider_id}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-[#4DA1A9]/30 hover:bg-gray-50/50 transition-all group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#2E5077]">{provider.provider_name}</span>
                                    <span className="text-xs text-gray-400">{provider.specialty || 'Specialist'}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-black text-[#2E5077]">
                                        {provider.price ? (typeof provider.price === 'number' ? formatPrice(provider.price) : (provider.price.toString().startsWith('$') ? provider.price : `$${provider.price}`)) : '$850'}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs text-[#4DA1A9] hover:text-[#2E5077] p-0 font-bold"
                                        onClick={() => onBookProvider?.(provider)}
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
    );
}
