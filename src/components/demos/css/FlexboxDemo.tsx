'use client'

// Core
import { useState } from 'react'

type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export function FlexboxDemo() {
  const [direction, setDirection] = useState<FlexDirection>('row')
  const [justify, setJustify] = useState<JustifyContent>('flex-start')
  const [align, setAlign] = useState<AlignItems>('flex-start')
  const [wrap, setWrap] = useState<FlexWrap>('nowrap')
  const [gap, setGap] = useState(12)
  const [itemCount, setItemCount] = useState(4)

  const items = Array.from({ length: itemCount }, (_, i) => i + 1)
  const sizes = [40, 60, 48, 56, 44, 52]

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className="min-h-40 rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300"
        style={{
          display: 'flex',
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap,
          gap: `${gap}px`,
        }}
      >
        {items.map(i => (
          <div
            key={i}
            className="bg-indigo-500/30 border border-indigo-500/50 rounded-lg
              flex items-center justify-center text-indigo-300 text-sm font-mono
              font-bold shrink-0"
            style={{ width: `${sizes[(i-1) % sizes.length]}px`, height: `${sizes[(i-1) % sizes.length]}px` }}
          >
            {i}
          </div>
        ))}
      </div>

      {/* Generated CSS */}
      <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10 font-mono text-xs text-slate-300">
        <span className="text-blue-400">.container</span> {`{`}<br />
        <span className="pl-4 text-yellow-400">display</span>: <span className="text-green-400">flex</span>;<br />
        <span className="pl-4 text-yellow-400">flex-direction</span>: <span className="text-green-400">{direction}</span>;<br />
        <span className="pl-4 text-yellow-400">justify-content</span>: <span className="text-green-400">{justify}</span>;<br />
        <span className="pl-4 text-yellow-400">align-items</span>: <span className="text-green-400">{align}</span>;<br />
        <span className="pl-4 text-yellow-400">flex-wrap</span>: <span className="text-green-400">{wrap}</span>;<br />
        <span className="pl-4 text-yellow-400">gap</span>: <span className="text-green-400">{gap}px</span>;<br />
        {`}`}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <Control label="flex-direction" value={direction} options={['row','row-reverse','column','column-reverse']}
          onChange={v => setDirection(v as FlexDirection)} />
        <Control label="justify-content" value={justify}
          options={['flex-start','flex-end','center','space-between','space-around','space-evenly']}
          onChange={v => setJustify(v as JustifyContent)} />
        <Control label="align-items" value={align}
          options={['flex-start','flex-end','center','stretch','baseline']}
          onChange={v => setAlign(v as AlignItems)} />
        <Control label="flex-wrap" value={wrap} options={['nowrap','wrap','wrap-reverse']}
          onChange={v => setWrap(v as FlexWrap)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>gap</span><span className="font-mono">{gap}px</span>
          </div>
          <input type="range" min="0" max="40" value={gap}
            onChange={e => setGap(+e.target.value)} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Элементов</span><span className="font-mono">{itemCount}</span>
          </div>
          <input type="range" min="1" max="8" value={itemCount}
            onChange={e => setItemCount(+e.target.value)} className="w-full accent-purple-500" />
        </div>
      </div>
    </div>
  )
}

function Control({ label, value, options, onChange }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1.5 font-mono">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2 py-1 rounded text-xs transition-all
              ${value === opt
                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800/60 text-slate-500 hover:text-white border border-white/8'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
