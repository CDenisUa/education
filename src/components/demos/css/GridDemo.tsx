'use client'

// Core
import { useState } from 'react'

export function GridDemo() {
  const [cols, setCols] = useState(3)
  const [rows, setRows] = useState(3)
  const [colGap, setColGap] = useState(12)
  const [rowGap, setRowGap] = useState(12)
  const [mode, setMode] = useState<'equal' | 'areas'>('equal')

  const items = Array.from({ length: cols * rows }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-800/60 rounded-lg w-fit border border-white/10">
        {(['equal', 'areas'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-md text-sm transition-all
              ${mode === m
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'}`}
          >
            {m === 'equal' ? 'Равные колонки' : 'Template areas'}
          </button>
        ))}
      </div>

      {mode === 'equal' ? (
        <>
          <div
            className="min-h-40 rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              columnGap: `${colGap}px`,
              rowGap: `${rowGap}px`,
            }}
          >
            {items.map(i => (
              <div key={i}
                className="bg-indigo-500/20 border border-indigo-500/40 rounded-lg
                  flex items-center justify-center text-indigo-300 text-sm font-bold
                  min-h-10 transition-all duration-300"
              >
                {i}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10 font-mono text-xs text-slate-300">
            <span className="text-yellow-400">grid-template-columns</span>: <span className="text-green-400">repeat({cols}, 1fr)</span>;<br />
            <span className="text-yellow-400">grid-template-rows</span>: <span className="text-green-400">repeat({rows}, 1fr)</span>;<br />
            <span className="text-yellow-400">column-gap</span>: <span className="text-green-400">{colGap}px</span>;<br />
            <span className="text-yellow-400">row-gap</span>: <span className="text-green-400">{rowGap}px</span>;
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Колонки', value: cols, setValue: setCols, min: 1, max: 6 },
              { label: 'Строки', value: rows, setValue: setRows, min: 1, max: 5 },
              { label: 'Column gap', value: colGap, setValue: setColGap, min: 0, max: 32 },
              { label: 'Row gap', value: rowGap, setValue: setRowGap, min: 0, max: 32 },
            ].map(({ label, value, setValue, min, max }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{label}</span><span className="font-mono">{value}</span>
                </div>
                <input type="range" min={min} max={max} value={value}
                  onChange={e => setValue(+e.target.value)} className="w-full accent-indigo-500" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div
            className="rounded-xl border border-white/10 overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr 160px',
              gridTemplateRows: '56px 200px 48px',
              gridTemplateAreas: '"header header header" "sidebar main aside" "footer footer footer"',
              gap: '2px',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          >
            {[
              { area: 'header', label: 'header', color: 'bg-indigo-500/30 border-indigo-500/50' },
              { area: 'sidebar', label: 'sidebar', color: 'bg-purple-500/30 border-purple-500/50' },
              { area: 'main', label: 'main', color: 'bg-emerald-500/30 border-emerald-500/50' },
              { area: 'aside', label: 'aside', color: 'bg-amber-500/30 border-amber-500/50' },
              { area: 'footer', label: 'footer', color: 'bg-rose-500/30 border-rose-500/50' },
            ].map(({ area, label, color }) => (
              <div
                key={area}
                style={{ gridArea: area }}
                className={`${color} border flex items-center justify-center text-sm font-mono font-bold`}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10 font-mono text-xs text-slate-300 leading-5">
            <span className="text-yellow-400">grid-template-areas</span>:<br />
            <span className="pl-4 text-green-400">&quot;header  header  header&quot;</span><br />
            <span className="pl-4 text-green-400">&quot;sidebar main    aside&quot;</span><br />
            <span className="pl-4 text-green-400">&quot;footer  footer  footer&quot;</span>;
          </div>
        </div>
      )}
    </div>
  )
}
