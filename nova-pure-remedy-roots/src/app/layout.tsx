import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Nova Pure Herbal · Remedy Roots",
  description:
    "Ancestral herbal intelligence orchestrated by multi-agent AI for wellness, storytelling, marketing, and community connection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0f1412] text-slate-100">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-b from-[#0f1412] via-[#12191c] to-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
