/**
 * Mario Health Provider Detail - V2 (AI Concierge Design)
 * 
 * This is the CURRENT provider detail page design using AI Concierge booking.
 * All new provider pages should follow this pattern.
 * 
 * Design System: Mario Health V2
 * - Primary Blue: #2E5077
 * - Accent Teal: #4DA1A9
 * - Support Green: #79D7BE
 * - Font: Inter
 * 
 * Key Features:
 * - Hero section with provider + hospital context
 * - Overview/Costs/Location tabs
 * - AI Concierge booking (no time slot grids)
 * - Sticky "Book with Concierge" footer
 * - Hospital location integration
 * 
 * V1 (Archived): archive-v1-mario-provider-detail-compact.tsx
 * 
 * Date Updated: October 30, 2025
 * Standard For: All Cardiology, Specialty, and Provider Pages
 */

import { MarioProviderHospitalDetail } from './mario-provider-hospital-detail';
import { MarioProvider } from '@/lib/data/mario-provider-data';
import { ProviderHospitalPairing } from '@/lib/data/mario-doctors-data';

interface MarioProviderDetailProps {
  provider: MarioProvider;
  onBack: () => void;
  onBookAppointment: () => void;
}

/**
 * Convert old MarioProvider format to new ProviderHospitalPairing format
 * This ensures backward compatibility while using the V2 design
 */
function convertToProviderHospitalPairing(provider: MarioProvider): ProviderHospitalPairing {
  return {
    id: `provider-${provider.name.toLowerCase().replace(/\s+/g, '-')}`,
    doctorName: provider.name,
    specialty: provider.specialty,
    hospital: 'Medical Center', // Default hospital name
    hospitalId: 'default',
    distance: '2.3 mi', // Default distance
    rating: parseFloat(provider.rating),
    reviewCount: parseInt(provider.reviews),
    network: provider.network === 'In-Network' ? 'In-Network' : 'Out-of-Network',
    price: provider.appointmentCosts[0]?.cost || '$150',
    savings: '15%', // Default savings
    points: parseInt(provider.rewards.points.replace(/[^0-9]/g, '')) || 150,
    isMarioPick: provider.marioPick || false,
    
    // V2 specific fields
    bio: provider.bio,
    education: provider.specialty,
    experience: '10+ years',
    languagesSpoken: ['English'],
    
    // Costs from old format
    costs: {
      consultation: provider.appointmentCosts.find(c => c.label.includes('New'))?.cost || '$150',
      followUp: provider.appointmentCosts.find(c => c.label.includes('Follow'))?.cost || '$90',
      procedures: {}
    },
    
    // Insurance from old format
    insuranceAccepted: provider.insuranceAccepted || []
  };
}

/**
 * V2 Provider Detail Component
 * Uses the modern AI Concierge booking flow
 */
export function MarioProviderDetailCompact({ 
  provider, 
  onBack, 
  onBookAppointment 
}: MarioProviderDetailProps) {
  // Convert old format to new format
  const pairing = convertToProviderHospitalPairing(provider);
  
  return (
    <MarioProviderHospitalDetail
      pairing={pairing}
      onBack={onBack}
      onBookConcierge={onBookAppointment}
    />
  );
}
