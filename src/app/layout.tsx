// Core
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// Components
import { ThemeToggle } from '@/components/theme/ThemeToggle'
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
  title: { template: '%s | education', default: 'education' },
  description: 'Интерактивный справочник по HTML, CSS, JavaScript, TypeScript, React и архитектуре',
}

const themeInitScript = `
(() => {
  try {
    const storageKey = 'education-theme';
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-slate-950 text-slate-300">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        <ThemeToggle />
      </body>
    </html>
  )
}
