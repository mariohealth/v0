import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Mario Health',
  description: 'Know what care costs. Choose smart. Save with Mario.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
