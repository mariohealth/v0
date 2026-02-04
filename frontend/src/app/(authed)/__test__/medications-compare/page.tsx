'use client';

import { MarioMedicationComparePrices } from '@/components/mario-medication-compare-prices';
import { medicationDatabase } from '@/lib/data/mario-medication-data';

export default function MedicationsCompareTestPage() {
  const medication = medicationDatabase.drugs[0];

  return (
    <MarioMedicationComparePrices
      medication={medication}
      selectedDosage={medication.dosage[0]}
      selectedQuantity={medication.quantity[0]}
      onBack={() => undefined}
    />
  );
}
