'use client'

// Core
import { useState } from 'react'

export function BoxModelDemo() {
  const [margin, setMargin] = useState(20)
  const [padding, setPadding] = useState(20)
  const [border, setBorder] = useState(4)
  const [boxSizing, setBoxSizing] = useState<'content-box' | 'border-box'>('border-box')

  const baseWidth = 150
  const totalWidth = boxSizing === 'content-box'
    ? baseWidth + padding * 2 + border * 2
    : baseWidth

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Visual */}
        <div className="flex items-center justify-center min-h-48 bg-slate-900/60
          rounded-xl border border-white/10 overflow-hidden">
          <div
            style={{ margin: `${margin}px`, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
            className="transition-all duration-300"
          >
            <div
              style={{
                width: `${baseWidth}px`,
                padding: `${padding}px`,
                border: `${border}px solid rgb(99, 102, 241)`,
                boxSizing,
              }}
              className="bg-indigo-900/40 transition-all duration-300"
            >
              <div className="bg-indigo-600/40 rounded text-center text-xs text-white py-2">
                content<br />
                <span className="font-mono text-indigo-300">
                  {boxSizing === 'border-box' ? baseWidth - padding*2 - border*2 : baseWidth}px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span className="text-orange-400">Margin</span>
              <span className="font-mono">{margin}px</span>
            </div>
            <input type="range" min="0" max="40" value={margin}
              onChange={e => setMargin(+e.target.value)}
              className="w-full accent-orange-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span className="text-yellow-400">Padding</span>
              <span className="font-mono">{padding}px</span>
            </div>
            <input type="range" min="0" max="40" value={padding}
              onChange={e => setPadding(+e.target.value)}
              className="w-full accent-yellow-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span className="text-indigo-400">Border</span>
              <span className="font-mono">{border}px</span>
            </div>
            <input type="range" min="0" max="16" value={border}
              onChange={e => setBorder(+e.target.value)}
              className="w-full accent-indigo-500" />
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-2">box-sizing</p>
            <div className="flex gap-2">
              {(['border-box', 'content-box'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setBoxSizing(v)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${boxSizing === v
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white border border-white/10'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="grid grid-cols-4 gap-3 text-center">
        {[
          { label: 'margin', value: `${margin}px`, color: 'text-orange-400 bg-orange-500/10' },
          { label: 'border', value: `${border}px`, color: 'text-indigo-400 bg-indigo-500/10' },
          { label: 'padding', value: `${padding}px`, color: 'text-yellow-400 bg-yellow-500/10' },
          { label: 'Итого width', value: `${totalWidth}px`, color: 'text-white bg-white/10' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`p-3 rounded-lg border border-white/10 ${color}`}>
            <div className="text-lg font-mono font-bold">{value}</div>
            <div className="text-xs opacity-70 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
