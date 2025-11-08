import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast-provider";
import { GlobalNav } from "@/components/navigation/GlobalNav";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mario Health - Healthcare Price Comparison",
  description: "Compare healthcare prices and find affordable providers, procedures, and medications. Save money on your healthcare costs.",
  keywords: ["healthcare", "price comparison", "medical procedures", "providers", "affordable healthcare"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
