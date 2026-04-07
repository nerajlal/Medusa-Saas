import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Minimal Store — Clean & Curated",
  description: "Discover our carefully curated collection of premium products.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="header">
          <div className="container">
            <a href="/" className="logo">MINIMAL</a>
            <nav className="nav">
              <a href="/">Shop</a>
              <a href="/about">About</a>
              <a href="/cart">Cart (0)</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <p>© 2026 Minimal Store. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
