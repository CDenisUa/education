'use client'

// Core
import { useEffect, useRef, useState } from 'react'

interface Item {
  id: number
  color: string
  visible: boolean
}

const COLORS = ['indigo', 'purple', 'cyan', 'emerald', 'amber', 'rose', 'blue', 'pink']

export function IntersectionDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [items] = useState<Item[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      visible: false,
    }))
  )
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set())
  const [threshold, setThreshold] = useState(0.3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds(prev => {
          const next = new Set(prev)
          entries.forEach(entry => {
            const id = Number((entry.target as HTMLElement).dataset.id)
            if (entry.isIntersecting) {
              next.add(id)
            } else {
              next.delete(id)
            }
          })
          return next
        })
      },
      {
        root: containerRef.current,
        threshold,
        rootMargin: '0px',
      }
    )

    const container = containerRef.current
    if (!container) return

    container.querySelectorAll('[data-id]').forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [threshold])

  const colorClass: Record<string, string> = {
    indigo: 'bg-indigo-500/20 border-indigo-500/40',
    purple: 'bg-purple-500/20 border-purple-500/40',
    cyan: 'bg-cyan-500/20 border-cyan-500/40',
    emerald: 'bg-emerald-500/20 border-emerald-500/40',
    amber: 'bg-amber-500/20 border-amber-500/40',
    rose: 'bg-rose-500/20 border-rose-500/40',
    blue: 'bg-blue-500/20 border-blue-500/40',
    pink: 'bg-pink-500/20 border-pink-500/40',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>threshold (порог видимости)</span>
            <span className="font-mono">{threshold} ({Math.round(threshold * 100)}%)</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={threshold}
            onChange={e => setThreshold(+e.target.value)}
            className="w-48 accent-indigo-500" />
        </div>
        <div className="text-xs text-slate-400">
          Видно: <span className="text-indigo-300 font-bold">{visibleIds.size}</span> из {items.length}
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="h-60 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
      >
        {items.map(item => (
          <div
            key={item.id}
            data-id={item.id}
            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-500 flex items-center justify-between
              ${visibleIds.has(item.id)
                ? `${colorClass[item.color]} opacity-100 translate-x-0`
                : 'bg-slate-800/30 border-white/8 text-slate-600 opacity-40'}`}
          >
            <span>Элемент #{item.id + 1}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full transition-all
              ${visibleIds.has(item.id)
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-700/60 text-slate-600'}`}>
              {visibleIds.has(item.id) ? '✓ visible' : 'hidden'}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
        <p className="text-xs text-indigo-300/80">
          💡 Прокручивайте список выше — IntersectionObserver отслеживает
          какие элементы видны в контейнере. threshold={threshold} означает,
          что {Math.round(threshold * 100)}% элемента должно быть видно.
        </p>
      </div>
    </div>
  )
}
