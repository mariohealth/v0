'use client';

import { useRouter } from 'next/navigation';
import { MarioBrowseProcedures } from '@/components/mario-browse-procedures';
import { GlobalNav } from '@/components/navigation/GlobalNav';

export default function ProceduresPage() {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    // Navigate to procedures page with category filter
    router.push(`/procedures?category=${encodeURIComponent(categoryId)}`);
  };

  const handleBack = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalNav />
      <div className="flex-1">
        <MarioBrowseProcedures
          onCategorySelect={handleCategorySelect}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}


