'use client'

// Core
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Components
import { ThemeToggle } from '@/components/theme/ThemeToggle'
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

function getTopicHref(topic?: NavItem) {
  if (!topic?.children?.[0]) {
    return null
  }

  return `/${topic.id}/${topic.children[0].id}`
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

  const activeTopicIndex = nav.findIndex(item => pathname.startsWith(`/${item.id}`))
  const activeTopic = activeTopicIndex >= 0 ? nav[activeTopicIndex] : undefined
  const activeSection = activeTopic?.children?.find(
    section => pathname === `/${activeTopic.id}/${section.id}`,
  )
  const previousTopic = activeTopicIndex > 0 ? nav[activeTopicIndex - 1] : undefined
  const nextTopic = activeTopicIndex >= 0 && activeTopicIndex < nav.length - 1
    ? nav[activeTopicIndex + 1]
    : undefined
  const defaultTopicHref = getTopicHref(nav[0]) ?? '/'
  const previousTopicHref = getTopicHref(previousTopic)
  const nextTopicHref = getTopicHref(nextTopic)

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <div className="mobile-nav-shell border-b border-white/8 bg-slate-950/92 backdrop-blur-xl md:hidden">
        <div className="flex h-full items-center justify-between gap-3 px-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-sm font-bold text-white">
              E
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                {activeTopic?.title ?? 'education'}
              </div>
              <div className="truncate text-sm font-semibold text-white">
                {activeSection?.title ?? activeTopic?.title ?? 'Навигация'}
              </div>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle variant="icon" />

            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-200 transition-colors hover:border-white/20 hover:bg-slate-800/80"
              aria-label="Открыть навигацию"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mobile-panel-shell fixed inset-x-0 bottom-0 z-50 md:hidden ${isMobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isMobileOpen}
      >
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className={`absolute inset-0 bg-slate-950/72 backdrop-blur-sm transition-opacity duration-200 ${isMobileOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Закрыть навигацию"
        />

        <div
          className={`absolute inset-0 flex flex-col bg-slate-950/98 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                Разделы
              </div>
              <div className="truncate text-base font-semibold text-white">
                {activeTopic?.title ?? 'education'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-300 transition-colors hover:border-white/20 hover:bg-slate-800/80"
                aria-label="Главная"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5.5 9.5V20h13V9.5" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-300 transition-colors hover:border-white/20 hover:bg-slate-800/80"
                aria-label="Закрыть меню"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/8 px-4 py-3">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                Дерево знаний
              </div>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {nav.map(topic => {
                const isTopicActive = pathname.startsWith(`/${topic.id}`)
                const isOpen = openSections[topic.id]
                const colorClass = TOPIC_COLORS[topic.id] ?? 'text-slate-300'

                return (
                  <div key={topic.id} className="mb-2">
                    <button
                      type="button"
                      onClick={() => toggleSection(topic.id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-colors ${isTopicActive ? 'bg-white/8 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
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
                              className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? `${TOPIC_ACTIVE_BG[topic.id] ?? 'bg-indigo-500/10 text-indigo-300'} font-medium` : 'text-slate-500 hover:bg-white/4 hover:text-slate-300'}`}
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

          {(previousTopicHref || nextTopicHref) && (
            <div className="mobile-panel-footer shrink-0 border-t border-white/8 px-4">
              <div className="flex gap-2">
                {previousTopicHref && previousTopic && (
                  <Link
                    href={previousTopicHref}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/4 px-3 py-2 transition-colors hover:bg-white/5"
                  >
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Предыдущая
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-white">
                      <span>←</span>
                      <span className="ml-1">{previousTopic.title}</span>
                    </div>
                  </Link>
                )}

                {nextTopicHref && nextTopic && (
                  <Link
                    href={nextTopicHref}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/4 px-3 py-2 transition-colors hover:bg-white/5"
                  >
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Следующая
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-white">
                      <span>{nextTopic.title}</span>
                      <span className="ml-1">→</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-white/8 bg-slate-950/80 backdrop-blur-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 md:sticky md:top-0 md:flex md:flex-col">
        <div className="border-b border-white/8 px-4 py-5">
          <Link href={defaultTopicHref} className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold transition-colors group-hover:bg-indigo-500">
              E
            </div>
            <div>
              <div className="text-sm font-semibold text-white">education</div>
              <div className="text-xs text-slate-500">Интерактивный справочник</div>
            </div>
          </Link>
        </div>

        <nav className="px-2 py-3">
          {nav.map(topic => {
            const isTopicActive = pathname.startsWith(`/${topic.id}`)
            const isOpen = openSections[topic.id]
            const colorClass = TOPIC_COLORS[topic.id] ?? 'text-slate-300'

            return (
              <div key={topic.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleSection(topic.id)}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${isTopicActive ? 'bg-white/8 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{topic.icon}</span>
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
                  <div className="ml-2 mt-0.5 border-l border-white/8 pl-3">
                    {topic.children.map(section => {
                      const href = `/${topic.id}/${section.id}`
                      const isActive = pathname === href

                      return (
                        <Link
                          key={section.id}
                          href={href}
                          className={`mb-0.5 block rounded-md px-2 py-1.5 text-xs transition-colors ${isActive ? `${TOPIC_ACTIVE_BG[topic.id] ?? 'bg-indigo-500/10 text-indigo-300'} font-medium` : 'text-slate-500 hover:bg-white/4 hover:text-slate-300'}`}
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

        <div className="mt-2 border-t border-white/8 px-4 py-3">
          <p className="text-xs text-slate-600">Next.js App Router · React 19</p>
        </div>
      </aside>
    </>
  )
}
