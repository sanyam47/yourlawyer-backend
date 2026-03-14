import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata = {
  title: "AI Lawyer",
  description: "AI-powered legal intelligence platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${spaceGrotesk.variable}
          antialiased
          bg-black
          text-white
          min-h-screen
        `}
      >
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  )
}