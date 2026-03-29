'use client'

export function MediaDemo() {
  return (
    <div className="space-y-6">
      {/* SVG demo */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Inline SVG</h3>
        <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10 flex items-center gap-6 flex-wrap">
          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#6366f1" strokeWidth="3" />
            <circle cx="40" cy="40" r="20" fill="#6366f1" opacity="0.3" />
            <circle cx="40" cy="40" r="8" fill="#6366f1" />
          </svg>

          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="60" height="60" rx="12" fill="url(#grad)" />
            <text x="40" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">SVG</text>
          </svg>

          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <polygon points="40,8 75,68 5,68" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="40,22 62,62 18,62" fill="#22c55e" opacity="0.2" />
            <circle cx="40" cy="48" r="4" fill="#22c55e" />
          </svg>

          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M40 10 C60 10, 70 25, 70 40 C70 60, 55 70, 40 70 C25 70, 10 60, 10 40 C10 25, 20 10, 40 10 Z"
              fill="none" stroke="#f59e0b" strokeWidth="2"
            />
            <path d="M40 10 C45 30, 55 50, 40 70" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            <path d="M40 10 C35 30, 25 50, 40 70" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            <ellipse cx="40" cy="40" rx="30" ry="8" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Details/Summary */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Details / Summary — нативный аккордеон</h3>
        <div className="space-y-2">
          {['Что такое семантический HTML?', 'Почему важна доступность?', 'Что делает тег article?'].map((q, i) => (
            <details
              key={i}
              className="rounded-lg border border-white/10 bg-slate-800/40 overflow-hidden
                [&[open]]:border-indigo-500/30"
            >
              <summary className="px-4 py-3 text-sm text-slate-300 cursor-pointer
                hover:text-white hover:bg-white/4 transition-colors list-none
                flex items-center justify-between">
                {q}
                <svg className="w-4 h-4 text-slate-500 details-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-3 pt-2 text-sm text-slate-400 border-t border-white/8">
                Нативный HTML-элемент для создания раскрывающихся секций без JavaScript.
                Работает во всех современных браузерах.
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Нативные элементы прогресса</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>progress</span><span>65%</span>
            </div>
            <progress value="65" max="100" className="w-full h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>meter (diskspace)</span><span>7GB / 10GB</span>
            </div>
            <meter value={7} min={0} max={10} low={3} high={8} optimum={2}
              className="w-full h-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
