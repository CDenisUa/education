// Core
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// Styles
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: { template: '%s | WebMechanics', default: 'WebMechanics' },
  description: 'Интерактивный справочник по HTML, CSS, JavaScript, React и Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-300">{children}</body>
    </html>
  )
}
