'use client';

import * as React from 'react';
import { Calendar, MapPin } from 'lucide-react';

import { ResultCardShell } from '@/components/ResultCardShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProviderResultCardProps {
  name: string;
  facility?: string | null;
  specialtyLabel?: string;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  zip?: string | null;
  distance?: string;
  onPrimary?: () => void;
  primaryLabel?: string;
  onSecondary?: () => void;
  secondaryLabel?: string;
  onClick?: () => void;
}

function buildLocationLine(city?: string | null, state?: string | null, zip?: string | null) {
  const parts = [city, state].filter(Boolean).join(', ');
  if (!parts && zip) return zip;
  if (parts && zip) return `${parts} ${zip}`;
  return parts || zip || '';
}

export function ProviderResultCard({
  name,
  facility,
  specialtyLabel = 'Specialist',
  city,
  state,
  address,
  zip,
  distance,
  onPrimary,
  primaryLabel = 'View profile',
  onSecondary,
  secondaryLabel = 'View profile',
  onClick,
}: ProviderResultCardProps) {
  const locationLine = buildLocationLine(city, state, zip);
  const subtitle = facility?.trim() || locationLine || address || 'Location unavailable';
  const addressDetail = [address, locationLine].filter(Boolean).join(' • ');

  return (
    <ResultCardShell
      onClick={onClick}
      header={{
        title: name,
        subtitle,
        rightContent: (
          <span className="px-3 py-1 rounded-full bg-[#E9F6F5] text-[#2E5077] text-xs font-bold whitespace-nowrap">
            Pricing unavailable
          </span>
        ),
      }}
      metadata={
        <>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#4DA1A9]" />
            <span>{distance || 'Nearby'}</span>
          </div>
          <Badge
            variant="secondary"
            className="bg-[#E9F6F5] text-[#2E5077] hover:bg-[#E9F6F5] border-0 text-[10px] font-bold h-6 px-2"
          >
            {specialtyLabel}
          </Badge>
        </>
      }
      body={
        addressDetail ? (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {addressDetail}
          </p>
        ) : null
      }
      actions={
        <div className="flex flex-col md:flex-row gap-3">
          {onSecondary && (
            <Button
              variant="outline"
              className="flex-1 border-[#4DA1A9] text-[#4DA1A9] hover:bg-[#E9F6F5] h-11 font-bold"
              onClick={(e) => {
                e.stopPropagation();
                onSecondary?.();
              }}
            >
              {secondaryLabel}
            </Button>
          )}
          <Button
            className={`${onSecondary ? 'flex-[1.5]' : 'w-full'} bg-[#2E5077] hover:bg-[#1A3A5A] text-white h-11 font-bold shadow-sm rounded-lg`}
            onClick={(e) => {
              e.stopPropagation();
              onPrimary?.();
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {primaryLabel}
          </Button>
        </div>
      }
    />
  );
}
