'use client'

// Core
import { useState } from 'react'

export function ResponsiveDemo() {
  const [width, setWidth] = useState(800)

  const breakpoint = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
  const cols = width < 640 ? 1 : width < 1024 ? 2 : 3

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Симуляция ширины вьюпорта</span>
          <span className="font-mono">{width}px
            <span className={`ml-2 px-2 py-0.5 rounded font-mono
              ${breakpoint === 'mobile' ? 'bg-red-500/20 text-red-300' :
                breakpoint === 'tablet' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-emerald-500/20 text-emerald-300'}`}>
              {breakpoint}
            </span>
          </span>
        </div>
        <input
          type="range" min="320" max="1280" value={width}
          onChange={e => setWidth(+e.target.value)}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>320px</span>
          <span className="text-red-400/60">sm: 640px</span>
          <span className="text-yellow-400/60">lg: 1024px</span>
          <span>1280px</span>
        </div>
      </div>

      {/* Preview */}
      <div
        className="mx-auto rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden transition-all duration-300"
        style={{ maxWidth: `${width}px` }}
      >
        {/* Nav */}
        <div className="px-4 py-3 bg-slate-800/60 border-b border-white/10 flex items-center justify-between">
          <div className="font-bold text-white text-sm">Logo</div>
          {width >= 640 ? (
            <div className="flex gap-4 text-xs text-slate-400">
              {['Home', 'About', 'Contact'].map(l => (
                <span key={l} className="hover:text-white cursor-pointer">{l}</span>
              ))}
            </div>
          ) : (
            <div className="w-6 h-4 flex flex-col justify-between">
              {[0,1,2].map(i => (
                <div key={i} className="h-0.5 bg-slate-400 rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="p-4"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '12px',
            transition: 'all 0.3s',
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-slate-800/60 rounded-lg p-3 border border-white/8">
              <div className="w-full h-20 bg-indigo-500/20 rounded mb-2" />
              <div className="h-3 bg-slate-600/60 rounded mb-1.5 w-3/4" />
              <div className="h-2.5 bg-slate-700/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Breakpoints info */}
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        {[
          { bp: '< 640px', label: 'Mobile', cols: '1 col', active: width < 640 },
          { bp: '640–1024px', label: 'Tablet', cols: '2 cols', active: width >= 640 && width < 1024 },
          { bp: '≥ 1024px', label: 'Desktop', cols: '3 cols', active: width >= 1024 },
        ].map(item => (
          <div
            key={item.bp}
            className={`p-2 rounded-lg border transition-all
              ${item.active
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : 'bg-slate-800/40 border-white/8 text-slate-500'}`}
          >
            <div className="font-bold mb-0.5">{item.label}</div>
            <div className="opacity-70">{item.bp}</div>
            <div className="opacity-70">{item.cols}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
