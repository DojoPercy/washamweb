import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WashAm - Professional Laundry Service",
  description: "Premium laundry and dry cleaning services with convenient pickup and delivery in Ghana.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function initMap() {
                window.googleMapsLoaded = true;
                window.dispatchEvent(new Event('google-maps-loaded'));
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
