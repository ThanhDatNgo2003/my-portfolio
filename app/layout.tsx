import type { Metadata } from 'next'
import { Space_Mono, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import WarningSuppressor from '@/components/warning-suppressor'

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'Nguyen Thanh Dat | Full-Stack Developer & DevOps Engineer',
  description: 'I build fast, secure, and scalable web systems. Full-Stack Developer & DevOps Engineer specializing in Next.js, React, Docker, and cloud infrastructure.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceMono.variable} ${inter.variable} font-sans antialiased`}>
        <WarningSuppressor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
