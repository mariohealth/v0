import { Suspense } from 'react';
import DoctorsRedirectClient from './DoctorsRedirectClient';

export const dynamic = 'force-static';

export default function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsRedirectClient />
    </Suspense>
  );
}
