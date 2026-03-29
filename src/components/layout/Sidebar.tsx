'use client'

// Core
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Types
import type { NavItem } from '@/types'

interface SidebarProps {
  nav: NavItem[]
}

const TOPIC_COLORS: Record<string, string> = {
  html: 'text-orange-400',
  css: 'text-blue-400',
  javascript: 'text-yellow-400',
  typescript: 'text-indigo-300',
  react: 'text-cyan-400',
  nextjs: 'text-white',
  patterns: 'text-rose-300',
  algorithms: 'text-amber-300',
  architecture: 'text-sky-200',
  interview: 'text-emerald-300',
}

const TOPIC_ACTIVE_BG: Record<string, string> = {
  html: 'bg-orange-500/10 text-orange-300',
  css: 'bg-blue-500/10 text-blue-300',
  javascript: 'bg-yellow-500/10 text-yellow-300',
  typescript: 'bg-indigo-500/10 text-indigo-300',
  react: 'bg-cyan-500/10 text-cyan-300',
  nextjs: 'bg-white/10 text-white',
  patterns: 'bg-rose-500/10 text-rose-300',
  algorithms: 'bg-amber-500/10 text-amber-300',
  architecture: 'bg-sky-500/10 text-sky-200',
  interview: 'bg-emerald-500/10 text-emerald-300',
}

export function Sidebar({ nav }: SidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    nav.forEach(item => {
      initial[item.id] = pathname.startsWith(`/${item.id}`)
    })
    return initial
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const activeTopic = nav.find(item => pathname.startsWith(`/${item.id}`))
  const activeSection = activeTopic?.children?.find(
    section => pathname === `/${activeTopic.id}/${section.id}`,
  )

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <div className="mobile-nav-safe lg:hidden border-b border-white/8 bg-slate-950/88 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 pb-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl
              border border-white/10 bg-slate-900/80 text-sm font-bold text-white">
              W
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                  education
              </div>
              <div className="truncate text-sm font-semibold text-white">
                {activeSection?.title ?? activeTopic?.title ?? 'Навигация'}
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
              border border-white/10 bg-slate-900/80 text-slate-200 transition-colors
              hover:border-white/20 hover:bg-slate-800/80"
            aria-label="Открыть навигацию"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isMobileOpen}
      >
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className={`absolute inset-0 bg-slate-950/72 backdrop-blur-sm transition-opacity duration-200
            ${isMobileOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Закрыть навигацию"
        />

        <div
          className={`mobile-drawer-safe absolute inset-x-3 rounded-[28px] border border-white/10
            bg-slate-950/96 shadow-2xl shadow-slate-950/40 transition-all duration-200
            ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
              <div className="min-w-0">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                  Разделы
                </div>
                <div className="truncate text-base font-semibold text-white">
                  {activeTopic?.title ?? 'education'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl
                  border border-white/10 bg-slate-900/80 text-slate-300 transition-colors
                  hover:border-white/20 hover:bg-slate-800/80"
                aria-label="Закрыть меню"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
              <Link
                href="/"
                className="mb-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-3 py-3
                  text-sm text-slate-200 transition-colors hover:bg-white/5"
              >
                <span className="text-lg">🏠</span>
                <span>Главная</span>
              </Link>

              {nav.map(topic => {
                const isTopicActive = pathname.startsWith(`/${topic.id}`)
                const isOpen = openSections[topic.id]
                const colorClass = TOPIC_COLORS[topic.id] ?? 'text-slate-300'

                return (
                  <div key={topic.id} className="mb-2">
                    <button
                      type="button"
                      onClick={() => toggleSection(topic.id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-colors
                        ${isTopicActive
                          ? 'bg-white/8 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{topic.icon}</span>
                        <span className={isTopicActive ? 'text-white' : colorClass}>{topic.title}</span>
                      </span>
                      <svg
                        className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {isOpen && topic.children && (
                      <div className="mt-2 space-y-1 pl-3">
                        {topic.children.map(section => {
                          const href = `/${topic.id}/${section.id}`
                          const isActive = pathname === href

                          return (
                            <Link
                              key={section.id}
                              href={href}
                              className={`block rounded-xl px-3 py-2.5 text-sm transition-colors
                                ${isActive
                                  ? `${TOPIC_ACTIVE_BG[topic.id] ?? 'bg-indigo-500/10 text-indigo-300'} font-medium`
                                  : 'text-slate-500 hover:bg-white/4 hover:text-slate-300'
                                }`}
                            >
                              {section.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      <aside className="hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-white/8 bg-slate-950/80 backdrop-blur-sm
        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 lg:sticky lg:top-0 lg:flex lg:flex-col">

        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center
              text-sm font-bold group-hover:bg-indigo-500 transition-colors">
              W
            </div>
            <div>
              <div className="text-sm font-semibold text-white">education</div>
              <div className="text-xs text-slate-500">Интерактивный справочник</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-3 px-2">
          {nav.map(topic => {
            const isTopicActive = pathname.startsWith(`/${topic.id}`)
            const isOpen = openSections[topic.id]
            const colorClass = TOPIC_COLORS[topic.id] ?? 'text-slate-300'

            return (
              <div key={topic.id} className="mb-1">
                <button
                  onClick={() => toggleSection(topic.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg
                    text-sm font-medium transition-all duration-150 group
                    ${isTopicActive
                      ? 'bg-white/8 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{topic.icon}</span>
                    <span className={isTopicActive ? 'text-white' : colorClass}>
                      {topic.title}
                    </span>
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200
                      ${isOpen ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {isOpen && topic.children && (
                  <div className="mt-0.5 ml-2 pl-3 border-l border-white/8">
                    {topic.children.map(section => {
                      const href = `/${topic.id}/${section.id}`
                      const isActive = pathname === href

                      return (
                        <Link
                          key={section.id}
                          href={href}
                          className={`block px-2 py-1.5 rounded-md text-xs transition-colors mb-0.5
                            ${isActive
                              ? `${TOPIC_ACTIVE_BG[topic.id] ?? 'bg-indigo-500/10 text-indigo-300'} font-medium`
                              : 'text-slate-500 hover:text-slate-300 hover:bg-white/4'
                            }`}
                        >
                          {section.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/8 mt-2">
          <p className="text-xs text-slate-600">Next.js App Router · React 19</p>
        </div>
      </aside>
    </>
  )
}
