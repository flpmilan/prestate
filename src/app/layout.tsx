import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fraunces } from "./sites/[tenant]/fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prestate",
  description: "Önkiszolgáló értékesítési weboldal ingatlanfejlesztőknek.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FAF7F2]" style={{ fontFamily: "var(--font-geist-sans)" }}>
        {children}
      </body>
    </html>
  );
}
