import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClaimMiner — Government Contract Intelligence",
  description: "AI-powered RFP discovery for government contractors. Find and win federal, state, and local contracts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <main className="min-h-screen bg-slate-50">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
