'use client'

// Core
import { useState, useRef } from 'react'

export function WebWorkerDemo() {
  const [n, setN] = useState(35)
  const [result, setResult] = useState<number | null>(null)
  const [mainBlocked, setMainBlocked] = useState<number | null>(null)
  const [workerTime, setWorkerTime] = useState<number | null>(null)
  const [mainTime, setMainTime] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [counter, setCounter] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Animate counter to show main thread is free
  const startCounter = () => {
    intervalRef.current = setInterval(() => setCounter(c => c + 1), 50)
  }
  const stopCounter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const fib = (n: number): number => n <= 1 ? n : fib(n - 1) + fib(n - 2)

  const runOnMainThread = () => {
    setRunning(true)
    setCounter(0)
    const start = performance.now()
    const res = fib(n)
    const elapsed = Math.round(performance.now() - start)
    setResult(res)
    setMainTime(elapsed)
    setMainBlocked(elapsed)
    setRunning(false)
  }

  const runOnWorker = () => {
    setRunning(true)
    setResult(null)
    setWorkerTime(null)
    setCounter(0)
    startCounter()

    const code = `
      function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2) }
      self.onmessage = ({ data }) => {
        const start = performance.now()
        const result = fib(data)
        self.postMessage({ result, time: Math.round(performance.now() - start) })
      }
    `
    const blob = new Blob([code], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)

    worker.postMessage(n)
    worker.onmessage = ({ data }) => {
      setResult(data.result)
      setWorkerTime(data.time)
      setRunning(false)
      stopCounter()
      worker.terminate()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>fibonacci(n)</span>
          <span className="font-mono">n = {n}</span>
        </div>
        <input type="range" min="25" max="42" value={n}
          onChange={e => setN(+e.target.value)} className="w-full accent-indigo-500" />
        <div className="flex justify-between text-xs text-slate-600 mt-0.5">
          <span>25 (быстро)</span><span>42 (медленно)</span>
        </div>
      </div>

      {/* UI Responsiveness indicator */}
      <div className="p-3 rounded-xl bg-slate-800/40 border border-white/10 flex items-center justify-between">
        <span className="text-xs text-slate-400">UI отклик (счётчик обновляется каждые 50ms):</span>
        <span className="font-mono text-lg font-bold text-indigo-300">{counter}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={runOnMainThread} disabled={running}
          className="p-3 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10
            text-sm text-red-300 disabled:opacity-50 transition-colors">
          <div className="font-semibold mb-1">❌ Main Thread</div>
          <div className="text-xs text-red-400/70">UI заморозится на время расчёта</div>
          {mainTime !== null && <div className="text-xs mt-1 font-mono">Заблокировано: {mainBlocked}ms</div>}
        </button>

        <button onClick={runOnWorker} disabled={running}
          className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10
            text-sm text-emerald-300 disabled:opacity-50 transition-colors">
          <div className="font-semibold mb-1">✅ Web Worker</div>
          <div className="text-xs text-emerald-400/70">UI остаётся отзывчивым</div>
          {workerTime !== null && <div className="text-xs mt-1 font-mono">Worker время: {workerTime}ms</div>}
        </button>
      </div>

      {result !== null && (
        <div className="p-3 rounded-xl bg-slate-800/60 border border-white/10 font-mono text-sm">
          <span className="text-slate-500">fib({n}) = </span>
          <span className="text-white font-bold">{result.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}
