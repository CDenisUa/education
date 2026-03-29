'use client'

// Core
import { useState, useEffect, useRef } from 'react'

interface EventLog {
  id: number
  type: string
  target: string
  phase: string
  time: string
}

export function EventsDemo() {
  const [logs, setLogs] = useState<EventLog[]>([])
  const [propagationMode, setPropagationMode] = useState<'bubble' | 'capture' | 'stopped'>('bubble')
  const idRef = useRef(0)

  const addLog = (type: string, target: string, phase: string) => {
    setLogs(prev => [
      {
        id: idRef.current++,
        type,
        target,
        phase,
        time: new Date().toLocaleTimeString('ru', { hour12: false }),
      },
      ...prev,
    ].slice(0, 10))
  }

  const handleClick = (target: string, phase: string, e?: React.MouseEvent) => {
    if (propagationMode === 'stopped' && e) {
      e.stopPropagation()
    }
    addLog('click', target, phase)
  }

  const clearLogs = () => setLogs([])

  const phaseColors: Record<string, string> = {
    'capture': 'text-amber-400',
    'target': 'text-emerald-400',
    'bubble': 'text-blue-400',
    'stopped': 'text-red-400',
  }

  return (
    <div className="space-y-6">
      {/* Propagation Demo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Всплытие событий (event bubbling)
          </h3>
          <div className="flex gap-1">
            {([
              { id: 'bubble', label: 'Всплытие' },
              { id: 'capture', label: 'Захват' },
              { id: 'stopped', label: 'Остановлено' },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => setPropagationMode(m.id)}
                className={`px-2.5 py-1 rounded text-xs transition-all
                  ${propagationMode === m.id
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-500 hover:text-white border border-white/8'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nested boxes */}
        <div
          onClick={() => handleClick('grandparent', 'bubble')}
          className="p-4 rounded-xl border-2 border-blue-500/40 bg-blue-500/5 cursor-pointer
            hover:bg-blue-500/10 transition-colors"
        >
          <span className="text-xs font-mono text-blue-400">grandparent</span>
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleClick('parent', 'bubble')
              if (propagationMode !== 'stopped') {
                handleClick('grandparent', 'bubble (bubbled from parent)')
              }
            }}
            className="mt-2 p-4 rounded-lg border-2 border-purple-500/40 bg-purple-500/5
              cursor-pointer hover:bg-purple-500/10 transition-colors"
          >
            <span className="text-xs font-mono text-purple-400">parent</span>
            <div
              onClick={(e) => {
                e.stopPropagation()
                handleClick('child', 'target')
                if (propagationMode !== 'stopped') {
                  handleClick('parent', 'bubble (bubbled from child)')
                  handleClick('grandparent', 'bubble (bubbled from child)')
                }
              }}
              className="mt-2 px-4 py-3 rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5
                cursor-pointer hover:bg-emerald-500/10 transition-colors text-center"
            >
              <span className="text-xs font-mono text-emerald-400">child — нажмите здесь</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {propagationMode === 'bubble' && 'Click на child → всплывает через parent → grandparent'}
          {propagationMode === 'capture' && 'Захват: событие сначала идёт сверху вниз (capture phase)'}
          {propagationMode === 'stopped' && 'stopPropagation() — событие не всплывает выше'}
        </p>
      </div>

      {/* Event log */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Лог событий</h3>
          <button onClick={clearLogs} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Очистить
          </button>
        </div>
        <div className="rounded-xl bg-slate-950/80 border border-white/8 p-3 min-h-24 font-mono">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-700">// нажмите на элементы выше</p>
          ) : (
            logs.map((log, i) => (
              <div key={log.id} className={`text-xs flex gap-3 ${i === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
                <span className="text-slate-700 shrink-0">{log.time}</span>
                <span className="text-yellow-400/80 shrink-0">{log.type}</span>
                <span className={`shrink-0 ${phaseColors[log.phase.split(' ')[0]] ?? 'text-slate-400'}`}>
                  {log.target}
                </span>
                <span className="text-slate-600 truncate">{log.phase}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Keyboard events */}
      <KeyboardDemo />
    </div>
  )
}

function KeyboardDemo() {
  const [keys, setKeys] = useState<string[]>([])
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Keyboard Events
      </h3>
      <div
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          e.preventDefault()
          setKeys(prev => [
            `↓ ${e.key} (code: ${e.code}${e.ctrlKey ? ' + Ctrl' : ''}${e.shiftKey ? ' + Shift' : ''})`,
            ...prev,
          ].slice(0, 5))
        }}
        className={`p-4 rounded-xl border-2 transition-all text-center cursor-pointer outline-none
          ${focused
            ? 'border-indigo-500/60 bg-indigo-500/10'
            : 'border-white/10 bg-slate-800/40'}`}
      >
        <p className="text-sm text-slate-400">
          {focused ? '⌨️ Нажмите любую клавишу...' : 'Кликните здесь и нажимайте клавиши'}
        </p>
      </div>
      {keys.length > 0 && (
        <div className="mt-2 space-y-1">
          {keys.map((key, i) => (
            <div key={i} className={`text-xs font-mono px-3 py-1 rounded
              ${i === 0 ? 'text-indigo-300 bg-indigo-500/10' : 'text-slate-600'}`}>
              {key}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
