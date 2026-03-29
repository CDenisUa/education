'use client'

// Core
import { useState } from 'react'

const animations = [
  {
    name: 'spin',
    label: 'Спиннер',
    css: 'animate-spin',
    description: 'animation: spin 1s linear infinite',
  },
  {
    name: 'pulse',
    label: 'Пульс',
    css: 'animate-pulse',
    description: 'animation: pulse 2s ease-in-out infinite',
  },
  {
    name: 'bounce',
    label: 'Прыжок',
    css: 'animate-bounce',
    description: 'animation: bounce 1s infinite',
  },
  {
    name: 'ping',
    label: 'Ping',
    css: 'animate-ping',
    description: 'animation: ping 1s cubic-bezier(0,0,0.2,1) infinite',
  },
]

export function AnimationsDemo() {
  const [active, setActive] = useState<string[]>([])
  const [transition, setTransition] = useState({
    duration: 300,
    easing: 'ease',
    property: 'transform',
  })

  const toggle = (name: string) => {
    setActive(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <div className="space-y-6">
      {/* Keyframe Animations */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          @keyframes анимации
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {animations.map(anim => (
            <button
              key={anim.name}
              onClick={() => toggle(anim.name)}
              className={`p-4 rounded-xl border transition-all text-center
                ${active.includes(anim.name)
                  ? 'border-indigo-500/40 bg-indigo-500/10'
                  : 'border-white/10 bg-slate-800/40 hover:border-white/20'}`}
            >
              <div className={`w-10 h-10 rounded-full bg-indigo-500 mx-auto mb-3
                ${active.includes(anim.name) ? anim.css : ''}`}
              />
              <div className="text-xs font-medium text-white">{anim.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {active.includes(anim.name) ? '🔴 стоп' : '▶ запуск'}
              </div>
            </button>
          ))}
        </div>
        {active.length > 0 && (
          <div className="mt-2 p-2 rounded-lg bg-slate-800/40 border border-white/8">
            {animations
              .filter(a => active.includes(a.name))
              .map(a => (
                <div key={a.name} className="text-xs font-mono text-indigo-300">{a.description}</div>
              ))}
          </div>
        )}
      </div>

      {/* Transitions */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Transitions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>duration</span>
                <span className="font-mono">{transition.duration}ms</span>
              </div>
              <input type="range" min="50" max="2000" step="50" value={transition.duration}
                onChange={e => setTransition(p => ({ ...p, duration: +e.target.value }))}
                className="w-full accent-indigo-500" />
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1.5">easing</p>
              <div className="flex flex-wrap gap-1">
                {['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'].map(e => (
                  <button key={e} onClick={() => setTransition(p => ({ ...p, easing: e }))}
                    className={`px-2 py-1 rounded text-xs transition-all
                      ${transition.easing === e
                        ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-800/60 text-slate-500 border border-white/8 hover:text-white'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center
                text-white text-xs cursor-pointer select-none"
              style={{ transition: `all ${transition.duration}ms ${transition.easing}` }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'scale(1.3) rotate(10deg)'
                el.style.background = '#ec4899'
                el.style.borderRadius = '50%'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = ''
                el.style.background = ''
                el.style.borderRadius = ''
              }}
            >
              hover
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
