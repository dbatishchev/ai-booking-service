import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  title: "Restaurant Booking",
  description: "Find and book restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <NuqsAdapter>
          <html lang="en">
            <head>
              <script
                async
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
              />
            </head>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <NavBar />
              <main>{children}</main>
            </body>
          </html>
        </NuqsAdapter>
    </ClerkProvider>
  );
}
