'use client'

// Core
import { useState } from 'react'
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
  react: 'text-cyan-400',
  nextjs: 'text-white',
}

const TOPIC_ACTIVE_BG: Record<string, string> = {
  html: 'bg-orange-500/10 text-orange-300',
  css: 'bg-blue-500/10 text-blue-300',
  javascript: 'bg-yellow-500/10 text-yellow-300',
  react: 'bg-cyan-500/10 text-cyan-300',
  nextjs: 'bg-white/10 text-white',
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

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 overflow-y-auto
      border-r border-white/8 bg-slate-950/80 backdrop-blur-sm
      scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center
            text-sm font-bold group-hover:bg-indigo-500 transition-colors">
            W
          </div>
          <div>
            <div className="text-sm font-semibold text-white">WebMechanics</div>
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
              {/* Topic header */}
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

              {/* Section list */}
              {isOpen && topic.children && (
                <div className="mt-0.5 ml-2 pl-3 border-l border-white/8">
                  {/* "Все темы" ссылка */}
                  <Link
                    href={`/${topic.id}`}
                    className={`block px-2 py-1.5 rounded-md text-xs transition-colors mb-0.5
                      ${pathname === `/${topic.id}`
                        ? `${TOPIC_ACTIVE_BG[topic.id] ?? 'bg-indigo-500/10 text-indigo-300'} font-medium`
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/4'
                      }`}
                  >
                    Обзор
                  </Link>
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

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/8 mt-2">
        <p className="text-xs text-slate-600">Next.js App Router · React 19</p>
      </div>
    </aside>
  )
}
