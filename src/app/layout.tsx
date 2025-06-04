import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from './provider'
import './globals.css';
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Event Hive",
  description: "Discover and experience unforgettable events",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          {/* <body className={inter.className}>{children}</body> */}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
