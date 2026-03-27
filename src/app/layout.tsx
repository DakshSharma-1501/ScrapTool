import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/Provider";
import { Navbar } from "@/components/ui/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataExtractor AI | Universal Web Scraper",
  description: "Extract structured JSON from any website using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-indigo-500/30">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCProvider>
            <Navbar />
            <div className="pt-16 flex-1 flex flex-col">
              {children}
            </div>
            <Toaster position="bottom-right" richColors />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
