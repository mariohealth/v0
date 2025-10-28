import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorTestButton } from '@/components/error-test-button';
import { Navbar } from '@/components/navbar';
import { PreferencesProvider } from '@/lib/contexts/PreferencesContext';

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
          <PreferencesProvider>
            <Navbar />
            {children}
            {/* Temporarily added for error boundary testing - remove after verification */}
            {process.env.NODE_ENV === 'development' && <ErrorTestButton />}
          </PreferencesProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
