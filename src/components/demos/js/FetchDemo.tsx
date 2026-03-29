'use client'

// Core
import { useState } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
  userId: number
}

export function FetchDemo() {
  const [data, setData] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState(1)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const fetchTodo = async () => {
    if (abortController) abortController.abort()
    const controller = new AbortController()
    setAbortController(controller)
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        { signal: controller.signal }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        setError('Запрос отменён')
      } else {
        setError((e as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }

  const abort = () => {
    abortController?.abort()
    setAbortController(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono">Todo ID:</label>
          <input
            type="number" min="1" max="200" value={id}
            onChange={e => setId(+e.target.value)}
            className="w-20 px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg text-sm text-white
              focus:outline-none focus:border-indigo-500/60 [appearance:textfield]"
          />
        </div>
        <button onClick={fetchTodo} disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-xs text-white rounded-lg transition-colors flex items-center gap-1.5">
          {loading ? <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Загрузка...</> : 'fetch()'}
        </button>
        {loading && (
          <button onClick={abort}
            className="px-3 py-2 bg-red-600/80 hover:bg-red-500/80 text-xs text-white rounded-lg transition-colors">
            abort()
          </button>
        )}
      </div>

      <div className="font-mono text-xs">
        <div className="text-slate-600 mb-1">// Request</div>
        <div className="text-blue-400">fetch(<span className="text-green-400">&apos;https://jsonplaceholder.typicode.com/todos/{id}&apos;</span>,</div>
        <div className="pl-4 text-slate-300">{`{ signal: controller.signal }`}</div>
        <div className="text-blue-400">)</div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
          ✕ {error}
        </div>
      )}

      {data && (
        <div className="rounded-xl bg-slate-900/80 border border-white/10 overflow-hidden">
          <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
            <span>✓ 200 OK</span>
          </div>
          <pre className="p-4 text-xs text-slate-300 font-mono overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
