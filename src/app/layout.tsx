import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GPT-News | Truth-First Global Intelligence",
  description: "AI-powered news aggregation platform with fact-checking, source verification, and real-time global news analysis",
  keywords: ["news", "AI", "GPT", "OpenAI", "fact-checking", "global news"],
  authors: [{ name: "GPT-News Team" }],
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
