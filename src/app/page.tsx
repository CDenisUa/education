'use client'

// Core
import Link from 'next/link'
import { startTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// Data
import { topics } from '@/data'

const defaultTopicHref = topics[0]
  ? `/${topics[0].id}/${topics[0].sections[0].id}`
  : '/'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const redirectOnWideScreens = () => {
      if (mediaQuery.matches) {
        startTransition(() => {
          router.replace(defaultTopicHref)
        })
      }
    }

    redirectOnWideScreens()
    mediaQuery.addEventListener('change', redirectOnWideScreens)

    return () => {
      mediaQuery.removeEventListener('change', redirectOnWideScreens)
    }
  }, [router])

  return (
    <>
      <div className="flex min-h-[100svh] flex-col bg-slate-950 md:hidden">
        <div className="home-hero-safe flex flex-1 flex-col items-center justify-start px-4 py-18 sm:px-6 sm:justify-center sm:py-24">
          <div className="mb-10 max-w-2xl text-center sm:mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Next.js 16 · React 19 · App Router
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              education
            </h1>
            <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
              <span className="block">Интерактивный справочник по веб-разработке.</span>
              <span className="block">Теория, примеры кода и живые демо в одном месте.</span>
            </p>
          </div>

          <div className="grid w-full max-w-6xl grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:gap-4">
            {topics.map(topic => (
              <Link
                key={topic.id}
                href={`/${topic.id}/${topic.sections[0].id}`}
                className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-800/60"
              >
                <div className="mb-3 text-3xl">{topic.icon}</div>
                <h2 className="mb-1 text-base font-semibold text-white">
                  {topic.title}
                </h2>
                <p className="text-xs leading-relaxed text-slate-500">
                  {topic.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 transition-colors group-hover:text-indigo-400">
                  <span>{topic.sections.length} тем</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3 text-sm text-slate-600 sm:mt-12 sm:flex sm:w-auto sm:gap-8">
            {[
              { value: topics.reduce((n, t) => n + t.sections.length, 0), label: 'тем' },
              { value: topics.reduce((n, t) => n + t.sections.reduce((m, s) => m + s.examples.length, 0), 0), label: 'примеров кода' },
              { value: topics.reduce((n, t) => n + t.sections.filter(s => s.demoComponent).length, 0), label: 'интерактивных демо' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-slate-400">{value}+</div>
                <div className="text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-credit-strip bg-black/30 border-t border-white/5">
          <div className="mx-auto flex max-w-7xl justify-end px-6 py-3 lg:px-8">
            <a
              href="https://chepio.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-25 transition-all duration-300 hover:opacity-100"
              aria-label="Developed by Chepio"
            >
              <img
                src="/images/icons/logo_designed.svg"
                alt="chepio.tech"
                className="footer-credit-logo h-7 w-auto brightness-0 invert transition-all duration-300 hover:brightness-100 hover:invert-0"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden min-h-[100svh] bg-slate-950 md:block" />
    </>
  )
}
