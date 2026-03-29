'use client'

// Core
import { useState } from 'react'

export function AccessibilityDemo() {
  const [expanded, setExpanded] = useState(false)
  const [progress, setProgress] = useState(35)
  const [announcement, setAnnouncement] = useState('')

  const announce = (msg: string) => {
    setAnnouncement(msg)
    setTimeout(() => setAnnouncement(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* aria-live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`p-3 rounded-lg border text-sm transition-all duration-300
          ${announcement
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-800/40 border-white/10 text-slate-500'}`}
      >
        {announcement || '← Живая область (aria-live="polite"). Объявления появятся здесь.'}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Accordion */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            aria-expanded
          </h3>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <button
              aria-expanded={expanded}
              aria-controls="aria-section"
              onClick={() => {
                setExpanded(e => !e)
                announce(expanded ? 'Секция свёрнута' : 'Секция развёрнута')
              }}
              className="w-full flex items-center justify-between px-4 py-3
                bg-slate-800/60 hover:bg-slate-700/60 transition-colors text-left"
            >
              <span className="text-sm text-white">Что такое ARIA?</span>
              <span className="text-xs font-mono text-slate-500">
                aria-expanded=&quot;{String(expanded)}&quot;
              </span>
            </button>
            <div
              id="aria-section"
              hidden={!expanded}
              className="px-4 py-3 bg-slate-800/30 text-sm text-slate-300"
            >
              ARIA (Accessible Rich Internet Applications) — набор атрибутов,
              которые помогают скринридерам понять динамический контент.
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            role=&quot;progressbar&quot;
          </h3>
          <div className="space-y-3">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Прогресс загрузки"
              className="w-full bg-slate-700 rounded-full h-3 overflow-hidden"
            >
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full
                  transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setProgress(p => Math.max(0, p - 10)); announce(`Прогресс: ${Math.max(0, progress - 10)}%`) }}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors"
              >−10%</button>
              <button
                onClick={() => { setProgress(p => Math.min(100, p + 10)); announce(`Прогресс: ${Math.min(100, progress + 10)}%`) }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white transition-colors"
              >+10%</button>
              <span className="text-sm text-slate-400 self-center ml-1">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-300/80">
          ⌨️ Попробуйте навигацию с клавиатуры: Tab для перемещения, Enter/Space для активации.
          Все интерактивные элементы выше доступны с клавиатуры.
        </p>
      </div>

      {/* Focus visible demo */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          :focus-visible — видимый фокус
        </h3>
        <div className="flex gap-3 flex-wrap">
          {['Кнопка 1', 'Кнопка 2', 'Кнопка 3'].map(label => (
            <button
              key={label}
              onClick={() => announce(`Нажато: ${label}`)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-white
                rounded-lg transition-colors
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-indigo-500"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
