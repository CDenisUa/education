'use client'

// Core
import { useState } from 'react'

export function CSSVariablesDemo() {
  const [primary, setPrimary] = useState('#6366f1')
  const [radius, setRadius] = useState(8)
  const [fontSize, setFontSize] = useState(14)
  const [spacing, setSpacing] = useState(16)

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Живой предпросмотр дизайн-токенов
        </h3>
        {/* Preview UI */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            '--color-primary': primary,
            '--radius': `${radius}px`,
            '--font-size': `${fontSize}px`,
            '--spacing': `${spacing}px`,
            borderColor: `${primary}40`,
          } as React.CSSProperties}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ background: `${primary}15`, borderBottom: `1px solid ${primary}25` }}
          >
            <span className="font-semibold text-white" style={{ fontSize: `${fontSize + 2}px` }}>
              Карточка
            </span>
            <button
              className="text-white font-medium"
              style={{
                background: primary,
                padding: `6px ${spacing / 2 + 8}px`,
                borderRadius: `${radius}px`,
                fontSize: `${fontSize - 1}px`,
              }}
            >
              Кнопка
            </button>
          </div>
          <div style={{ padding: `${spacing}px`, fontSize: `${fontSize}px`, color: '#94a3b8' }}>
            Текст адаптируется под CSS-переменные. Измените токены слева, чтобы увидеть изменения.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>--color-primary</span>
            <span className="font-mono">{primary}</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="color" value={primary} onChange={e => setPrimary(e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border border-white/10 bg-transparent" />
            <div className="flex gap-1 flex-wrap">
              {['#6366f1','#22c55e','#f59e0b','#ec4899','#06b6d4','#ef4444'].map(c => (
                <button key={c} onClick={() => setPrimary(c)}
                  className="w-6 h-6 rounded transition-transform hover:scale-110"
                  style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>

        {[
          { label: '--radius', value: radius, setValue: setRadius, min: 0, max: 24, unit: 'px' },
          { label: '--font-size', value: fontSize, setValue: setFontSize, min: 10, max: 20, unit: 'px' },
          { label: '--spacing', value: spacing, setValue: setSpacing, min: 4, max: 40, unit: 'px' },
        ].map(({ label, value, setValue, min, max, unit }) => (
          <div key={label}>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{label}</span><span className="font-mono">{value}{unit}</span>
            </div>
            <input type="range" min={min} max={max} value={value}
              onChange={e => setValue(+e.target.value)} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-slate-800/60 border border-white/10 font-mono text-xs text-slate-300">
        <span className="text-purple-400">:root</span> {`{`}<br />
        <span className="pl-4 text-yellow-400">--color-primary</span>: <span className="text-green-400">{primary}</span>;<br />
        <span className="pl-4 text-yellow-400">--radius</span>: <span className="text-green-400">{radius}px</span>;<br />
        <span className="pl-4 text-yellow-400">--font-size</span>: <span className="text-green-400">{fontSize}px</span>;<br />
        <span className="pl-4 text-yellow-400">--spacing</span>: <span className="text-green-400">{spacing}px</span>;<br />
        {`}`}
      </div>
    </div>
  )
}
