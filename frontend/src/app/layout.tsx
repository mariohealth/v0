import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast-provider";
import { GlobalNav } from "@/components/navigation/GlobalNav";
import { NavigationTracker } from "@/components/navigation/NavigationTracker";
import { MarioAIFloatingButton } from "@/components/mario-ai-floating-button";
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
  title: "Mario Health",
  description: "Compare healthcare prices and find affordable providers, procedures, and medications. Save money on your healthcare costs.",
  keywords: ["healthcare", "price comparison", "medical procedures", "providers", "affordable healthcare"],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
          <NavigationTracker />
          <ToastProvider>
            {children}
            <MarioAIFloatingButton />
          </ToastProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
