import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AppLayout } from '@/components/layout/navigation';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import "@/styles/design-system.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VATANA - VAT Analysis Engine",
  description: "Intelligent VAT compliance and error detection system with advanced analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00D9B4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VATANA" />
      </head>
      <body 
        className={`${
          geistSans.variable
        } ${geistMono.variable} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
