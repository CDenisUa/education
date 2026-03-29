'use client'

// Core
import { useState } from 'react'

interface LogEntry {
  id: number
  text: string
  type: 'sync' | 'micro' | 'macro' | 'result'
  delay: number
}

export function AsyncDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [running, setRunning] = useState(false)
  const [promiseState, setPromiseState] = useState<'idle' | 'pending' | 'fulfilled' | 'rejected'>('idle')
  const [fetchResult, setFetchResult] = useState<string | null>(null)
  const [fetchLoading, setFetchLoading] = useState(false)

  const runEventLoop = async () => {
    if (running) return
    setRunning(true)
    setLogs([])
    let id = 0

    const addLog = (text: string, type: LogEntry['type'], delay: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          setLogs(prev => [...prev, { id: id++, text, type, delay }])
          resolve()
        }, delay)
      })
    }

    // Simulating: console.log('1 sync'), setTimeout, Promise, queueMicrotask, console.log('6 sync')
    const timings = [
      { text: "→ console.log('1 — sync')", type: 'sync' as const, delay: 0 },
      { text: "→ setTimeout(() => ..., 0) — зарегистрирован macrotask", type: 'macro' as const, delay: 200 },
      { text: "→ Promise.resolve().then(...) — зарегистрирован microtask", type: 'micro' as const, delay: 400 },
      { text: "→ queueMicrotask(...) — зарегистрирован microtask", type: 'micro' as const, delay: 600 },
      { text: "→ console.log('6 — sync') // конец синхронного кода", type: 'sync' as const, delay: 800 },
      { text: "✓ Microtask: '3 — microtask'", type: 'result' as const, delay: 1200 },
      { text: "✓ Microtask: '5 — microtask'", type: 'result' as const, delay: 1500 },
      { text: "✓ Microtask: '4 — microtask 2'", type: 'result' as const, delay: 1800 },
      { text: "✓ Macrotask: '2 — macrotask' (setTimeout)", type: 'result' as const, delay: 2200 },
    ]

    await Promise.all(timings.map(({ text, type, delay }) => addLog(text, type, delay)))
    setTimeout(() => setRunning(false), 2500)
  }

  const simulatePromise = async (shouldReject: boolean) => {
    setPromiseState('pending')
    await new Promise(resolve => setTimeout(resolve, 1500))
    setPromiseState(shouldReject ? 'rejected' : 'fulfilled')
    setTimeout(() => setPromiseState('idle'), 3000)
  }

  const fetchData = async () => {
    setFetchLoading(true)
    setFetchResult(null)
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
      const data = await res.json()
      setFetchResult(JSON.stringify(data, null, 2))
    } catch {
      setFetchResult('Ошибка загрузки')
    } finally {
      setFetchLoading(false)
    }
  }

  const typeColors: Record<string, string> = {
    sync: 'text-blue-400',
    micro: 'text-yellow-400',
    macro: 'text-orange-400',
    result: 'text-emerald-400',
  }

  const typeLabels: Record<string, string> = {
    sync: '[sync]',
    micro: '[micro]',
    macro: '[macro]',
    result: '[result]',
  }

  return (
    <div className="space-y-6">
      {/* Event Loop Visualizer */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Event Loop — порядок выполнения
          </h3>
          <button
            onClick={runEventLoop}
            disabled={running}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
              text-xs text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            {running ? (
              <>
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Запуск...
              </>
            ) : '▶ Запустить симуляцию'}
          </button>
        </div>

        <div className="rounded-xl bg-slate-900/80 border border-white/10 p-4 min-h-40 font-mono text-xs space-y-1.5">
          {logs.length === 0 && (
            <p className="text-slate-600">Нажмите &quot;Запустить симуляцию&quot; для визуализации Event Loop</p>
          )}
          {logs.map(log => (
            <div key={log.id} className={`flex items-center gap-2 animate-in fade-in duration-200 ${typeColors[log.type]}`}>
              <span className="opacity-50 w-10">{typeLabels[log.type]}</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-2 text-xs">
          {[
            { color: 'text-blue-400', label: 'Синхронный код' },
            { color: 'text-yellow-400', label: 'Microtask (Promise)' },
            { color: 'text-orange-400', label: 'Macrotask (setTimeout)' },
            { color: 'text-emerald-400', label: 'Выполнено' },
          ].map(({ color, label }) => (
            <span key={label} className={`${color} opacity-70`}>● {label}</span>
          ))}
        </div>
      </div>

      {/* Promise States */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Состояния Promise
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-500 min-w-32 text-center
            ${promiseState === 'idle' ? 'bg-slate-700/50 border-white/10 text-slate-400' :
              promiseState === 'pending' ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300 animate-pulse' :
              promiseState === 'fulfilled' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' :
              'bg-red-500/15 border-red-500/40 text-red-300'}`}
          >
            {promiseState === 'idle' ? '⬡ idle' :
              promiseState === 'pending' ? '⏳ pending...' :
              promiseState === 'fulfilled' ? '✓ fulfilled' : '✗ rejected'}
          </div>

          <div className="flex gap-2">
            <button onClick={() => simulatePromise(false)}
              disabled={promiseState === 'pending'}
              className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-500/80 disabled:opacity-40
                text-xs text-white rounded-lg transition-colors">
              ✓ resolve()
            </button>
            <button onClick={() => simulatePromise(true)}
              disabled={promiseState === 'pending'}
              className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500/80 disabled:opacity-40
                text-xs text-white rounded-lg transition-colors">
              ✗ reject()
            </button>
          </div>
        </div>
      </div>

      {/* Real Fetch */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Реальный fetch (JSONPlaceholder API)
          </h3>
          <button onClick={fetchData} disabled={fetchLoading}
            className="px-3 py-1.5 bg-cyan-600/80 hover:bg-cyan-500/80 disabled:opacity-50
              text-xs text-white rounded-lg transition-colors">
            {fetchLoading ? 'Загрузка...' : 'fetch() →'}
          </button>
        </div>
        {fetchResult && (
          <pre className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-emerald-300 font-mono overflow-auto">
            {fetchResult}
          </pre>
        )}
      </div>
    </div>
  )
}
