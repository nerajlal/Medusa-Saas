import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raley's Market | Fresh Groceries & Same-day Delivery",
  description: "Shop for fresh produce, dairy, bakery and more from Raley's Market. Same-day delivery right to your door.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { CartProvider } from "./components/CartProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans selection:bg-primary/10 overflow-x-hidden">
        <CartProvider>
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}


