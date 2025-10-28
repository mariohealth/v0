import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
// import { ErrorTest } from '@/src/components/error-test'; // Temporarily uncomment to test error boundary

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
          {/* Temporarily uncomment to test error boundary */}
          {/* {process.env.NODE_ENV === 'development' && <ErrorTest />} */}
        </ErrorBoundary>
      </body>
    </html>
  );
}
