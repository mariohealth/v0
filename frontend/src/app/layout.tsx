import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast-provider';
import { GlobalNav } from '@/components/navigation/GlobalNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mario Health',
  description: 'Healthcare price transparency platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <GlobalNav />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

