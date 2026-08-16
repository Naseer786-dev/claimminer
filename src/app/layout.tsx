export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClaimMiner | Government Contract Intelligence",
  description: "AI-powered RFP discovery for government contractors.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950`}>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
