import OrgDetailClient from './OrgDetailClient';

export const dynamicParams = true;

export async function generateStaticParams() {
  // Return placeholder for Firebase static export compatibility
  // Real org IDs will be handled dynamically at runtime
  return [{ id: 'placeholder' }];
}

export default function OrgDetailPage() {
  return <OrgDetailClient />;
}

