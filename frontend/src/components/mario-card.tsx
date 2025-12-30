'use client'
import Link from 'next/link';
import { ReactNode } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Phone, Award, Gift } from 'lucide-react';

export interface PricingDisplayProps {
  min_price: number;
  max_price: number;
  avg_price?: number;
}

export interface ProviderCardProps {
  name: string;
  specialty: string;
  /** Distance text, e.g. "2.3 mi away" or "2.3 mi" */
  distance?: string;
  /** Optional flag; kept for backward compatibility */
  inNetwork?: boolean;
  /** Legacy price text (will be ignored if pricing provided) */
  price?: string;
  /** Legacy compared text (will be ignored if pricing provided) */
  comparedToMedian?: string;
  /** New pricing object (org-level pricing) */
  pricing?: PricingDisplayProps | null;
  savingsText?: string;
  mariosPick?: boolean;
  rating?: number;
  avatar?: string;
  onBook?: () => void;
  onCall?: () => void;
  /** Optional provider detail link; if present, name becomes a link */
  linkHref?: string;
  /** Optional address block */
  addressLine?: string;
  city?: string;
  state?: string;
  zip?: string;
}

/**
 * Pricing display component.
 * - pricing null => "Pricing unavailable"
 * - min == max => single price
 * - else => range with optional avg
 */
function PricingDisplay({ pricing }: { pricing: PricingDisplayProps | null | undefined }) {
  if (!pricing) {
    return (
      <div className="text-sm text-muted-foreground">
        Pricing unavailable
      </div>
    );
  }

  const same = Number(pricing.min_price) === Number(pricing.max_price);
  const min = Number(pricing.min_price).toFixed(0);
  const max = Number(pricing.max_price).toFixed(0);
  const avg = pricing.avg_price !== undefined ? Number(pricing.avg_price).toFixed(0) : null;

  if (same) {
    return (
      <div className="space-y-1">
        <div className="text-xl font-bold text-primary">${min}</div>
        {avg && <div className="text-xs text-muted-foreground">Avg ${avg}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-1 text-right">
      <div className="text-xl font-bold text-primary">
        ${min}–${max}
      </div>
      {avg && <div className="text-xs text-muted-foreground">Avg ${avg}</div>}
    </div>
  );
}

export function ProviderCard({
  name,
  specialty,
  distance,
  inNetwork = false,
  price,
  comparedToMedian,
  pricing,
  savingsText,
  mariosPick = false,
  rating,
  avatar,
  onBook,
  onCall,
  linkHref,
  addressLine,
  city,
  state,
  zip,
}: ProviderCardProps) {
  return (
    <div className="relative bg-card rounded-lg mario-shadow-card p-4 md:p-6 mario-transition mario-hover-provider cursor-pointer">
      {mariosPick && (
        <div className="absolute -top-0 left-0 right-0 bg-accent text-accent-foreground px-3 py-1 rounded-t-lg">
          <div className="flex items-center gap-1 justify-center">
            <Award className="h-3 w-3" />
            <span className="text-xs font-medium">Mario's Pick</span>
          </div>
        </div>
      )}
      
      <div className={`${mariosPick ? 'mt-2' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="text-lg font-semibold text-muted-foreground">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            {linkHref ? (
              <Link href={linkHref} className="font-semibold text-card-foreground truncate hover:underline">
                {name}
              </Link>
            ) : (
              <h3 className="font-semibold text-card-foreground truncate">{name}</h3>
            )}
            <p className="text-sm text-muted-foreground">{specialty}</p>
            
            <div className="flex items-center gap-2 mt-1">
              {distance && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {distance}
                </div>
              )}
              <Badge variant={inNetwork ? "default" : "secondary"} className="text-xs">
                {inNetwork ? "In-Network" : "Out-of-Network"}
              </Badge>
            </div>
            {(addressLine || city || state || zip) && (
              <div className="mt-1 text-xs text-muted-foreground truncate">
                {addressLine && <span>{addressLine}, </span>}
                {(city || state || zip) && (
                  <span>
                    {city}{city && state ? ', ' : ''}{state} {zip}
                  </span>
                )}
              </div>
            )}
            
            {rating && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.floor(rating))}
                </div>
                <span className="text-xs text-muted-foreground">({rating})</span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            {pricing ? (
              <PricingDisplay pricing={pricing} />
            ) : (
              <>
                <div className="text-xl font-bold text-primary">{price}</div>
                <div className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                  {comparedToMedian}
                </div>
              </>
            )}
          </div>
        </div>
        
        {savingsText && (
          <div className="flex items-center gap-1 mt-3 text-sm text-accent">
            <Gift className="h-4 w-4" />
            {savingsText}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button onClick={onBook} className="flex-1 mario-button-scale">
            Book Appointment
          </Button>
          {onCall && (
            <Button variant="outline" size="icon" onClick={onCall} className="mario-button-scale">
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface MedicationCardProps {
  name: string;
  dosage: string;
  insurancePrice: string;
  cashPrice: string;
  savings?: string;
  mariosPick?: boolean;
  onCompare: () => void;
}

export function MedicationCard({
  name,
  dosage,
  insurancePrice,
  cashPrice,
  savings,
  mariosPick = false,
  onCompare
}: MedicationCardProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg mario-shadow-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{dosage}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Your Insurance Price</span>
            <span className="font-semibold">{insurancePrice}</span>
          </div>
        </div>
      </div>

      <div className="relative bg-card rounded-lg mario-shadow-card p-4">
        {mariosPick && (
          <div className="absolute -top-0 left-0 right-0 bg-accent text-accent-foreground px-3 py-1 rounded-t-lg">
            <div className="flex items-center gap-1 justify-center">
              <Award className="h-3 w-3" />
              <span className="text-xs font-medium">Mario's Pick</span>
            </div>
          </div>
        )}
        
        <div className={`${mariosPick ? 'mt-2' : ''}`}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cash Price</span>
              <span className="font-semibold">{cashPrice}</span>
            </div>
            {savings && (
              <div className="text-sm text-accent font-medium">
                Save {savings}
              </div>
            )}
          </div>
        </div>
      </div>

      <Button onClick={onCompare} variant="outline" className="w-full">
        Compare Prices
      </Button>
    </div>
  );
}

interface RewardCardProps {
  title: string;
  pointCost: number;
  description?: string;
  category: string;
  progress?: number;
  onRedeem: () => void;
}

export function RewardCard({
  title,
  pointCost,
  description,
  category,
  progress,
  onRedeem
}: RewardCardProps) {
  return (
    <div className="bg-card rounded-lg mario-shadow-card p-4 mario-transition mario-hover-reward cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Gift className="h-6 w-6 text-accent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            <span className="text-sm font-medium text-accent">
              {pointCost.toLocaleString()} points
            </span>
          </div>
          
          {progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full mario-transition"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% to unlock
              </span>
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          onClick={onRedeem}
          disabled={progress !== undefined && progress < 100}
          className="mario-button-scale"
        >
          Redeem
        </Button>
      </div>
    </div>
  );
}