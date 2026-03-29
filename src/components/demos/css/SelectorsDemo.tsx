'use client'

// Core
import { useState } from 'react'

const selectorExamples = [
  {
    name: ':hover',
    desc: 'При наведении мыши',
    preview: 'hover-demo',
  },
  {
    name: ':nth-child(2n+1)',
    desc: 'Нечётные элементы',
    preview: 'nth-demo',
  },
  {
    name: ':not(.excluded)',
    desc: 'Все кроме исключённых',
    preview: 'not-demo',
  },
  {
    name: ':has(img)',
    desc: 'Родитель с изображением',
    preview: 'has-demo',
  },
]

export function SelectorsDemo() {
  const [active, setActive] = useState('hover-demo')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {selectorExamples.map(s => (
          <button
            key={s.name}
            onClick={() => setActive(s.preview)}
            className={`p-2 rounded-lg border text-left transition-all
              ${active === s.preview
                ? 'border-indigo-500/40 bg-indigo-500/10'
                : 'border-white/10 bg-slate-800/40 hover:border-white/20'}`}
          >
            <div className="font-mono text-xs text-indigo-300 mb-1">{s.name}</div>
            <div className="text-xs text-slate-500">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 min-h-32">
        {active === 'hover-demo' && (
          <div className="flex gap-2 flex-wrap">
            {['Link 1', 'Link 2', 'Link 3', 'Button', 'Item'].map(name => (
              <div
                key={name}
                className="px-4 py-2 bg-slate-700/60 rounded-lg text-sm text-slate-300
                  hover:bg-indigo-600 hover:text-white cursor-pointer transition-all duration-200"
              >
                {name}
              </div>
            ))}
            <p className="w-full mt-2 text-xs text-slate-500">Наведите на элемент</p>
          </div>
        )}

        {active === 'nth-demo' && (
          <div className="space-y-1.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg text-sm transition-all
                  ${(i + 1) % 2 !== 0
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800/40 text-slate-400 border border-white/8'}`}
              >
                li:nth-child({i + 1}) {(i + 1) % 2 !== 0 ? '← нечётный, подсвечен' : ''}
              </div>
            ))}
          </div>
        )}

        {active === 'not-demo' && (
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Обычная', excluded: false },
              { label: '.excluded', excluded: true },
              { label: 'Обычная', excluded: false },
              { label: '.excluded', excluded: true },
              { label: 'Обычная', excluded: false },
            ].map((item, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg text-sm border
                  ${item.excluded
                    ? 'bg-red-500/5 text-red-400/50 border-red-500/20 line-through'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'}`}
              >
                {item.label}
              </div>
            ))}
            <p className="w-full text-xs text-slate-500 mt-1">
              <code className="text-indigo-300">:not(.excluded)</code> — выбирает все без класса excluded
            </p>
          </div>
        )}

        {active === 'has-demo' && (
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                hasImg: true,
                label: 'Карточка с img',
              },
              {
                hasImg: false,
                label: 'Карточка без img',
              },
              {
                hasImg: true,
                label: 'Карточка с img',
              },
              {
                hasImg: false,
                label: 'Карточка без img',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs
                  ${card.hasImg
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-800/40 border-white/8 text-slate-500'}`}
              >
                {card.hasImg && (
                  <div className="w-full h-12 bg-indigo-500/20 rounded mb-2 flex items-center justify-center text-indigo-400">
                    🖼 img
                  </div>
                )}
                <p>{card.label}</p>
                {card.hasImg && (
                  <p className="text-indigo-400 mt-1">.card:has(img) — применено!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
