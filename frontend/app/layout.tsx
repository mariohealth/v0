import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { ErrorTestButton } from '@/src/components/error-test-button';
import { Navbar } from '@/src/components/navbar';

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
          <Navbar />
          {children}
          {/* Temporarily added for error boundary testing - remove after verification */}
          {process.env.NODE_ENV === 'development' && <ErrorTestButton />}
        </ErrorBoundary>
      </body>
    </html>
  );
}
