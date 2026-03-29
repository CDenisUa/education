'use client'

// Core
import { useState, useRef } from 'react'

interface DOMItem {
  id: string
  text: string
  color: string
}

const COLORS = ['indigo', 'purple', 'cyan', 'emerald', 'amber', 'rose']

export function DOMDemo() {
  const [items, setItems] = useState<DOMItem[]>([
    { id: '1', text: 'Первый элемент', color: 'indigo' },
    { id: '2', text: 'Второй элемент', color: 'purple' },
    { id: '3', text: 'Третий элемент', color: 'cyan' },
  ])
  const [log, setLog] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8))
  }

  const addItem = () => {
    const text = inputRef.current?.value?.trim()
    if (!text) return
    const newItem: DOMItem = {
      id: crypto.randomUUID(),
      text,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
    setItems(prev => [...prev, newItem])
    addLog(`createElement + append: "${text}"`)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeItem = (id: string, text: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    addLog(`removeChild: "${text}"`)
  }

  const prependItem = () => {
    const text = `Элемент #${Date.now().toString().slice(-4)}`
    const newItem: DOMItem = {
      id: crypto.randomUUID(),
      text,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
    setItems(prev => [newItem, ...prev])
    addLog(`prepend: "${text}"`)
  }

  const clearAll = () => {
    setItems([])
    addLog('innerHTML = "" / clear all nodes')
  }

  const colorBg: Record<string, string> = {
    indigo: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    purple: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    rose: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <input
          ref={inputRef}
          type="text"
          placeholder="Текст элемента..."
          onKeyDown={e => e.key === 'Enter' && addItem()}
          className="flex-1 min-w-0 px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg
            text-sm text-white placeholder:text-slate-600
            focus:outline-none focus:border-indigo-500/60"
        />
        <button onClick={addItem}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-lg transition-colors">
          append()
        </button>
        <button onClick={prependItem}
          className="px-3 py-2 bg-purple-600/80 hover:bg-purple-500/80 text-xs text-white rounded-lg transition-colors">
          prepend()
        </button>
        <button onClick={clearAll} disabled={items.length === 0}
          className="px-3 py-2 bg-red-600/80 hover:bg-red-500/80 disabled:opacity-40
            text-xs text-white rounded-lg transition-colors">
          clear()
        </button>
      </div>

      {/* DOM tree visual */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
        <div className="text-xs font-mono text-slate-600 mb-2">
          &lt;ul#demo-list&gt; <span className="text-slate-500">({items.length} children)</span>
        </div>
        <div className="space-y-1.5 pl-4 border-l border-white/8">
          {items.length === 0 && (
            <p className="text-xs text-slate-600 italic">пусто</p>
          )}
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs
                transition-all duration-200 ${colorBg[item.color]}`}
            >
              <span className="font-mono text-slate-500 mr-2">[{i}]</span>
              <span className="flex-1">{item.text}</span>
              <button
                onClick={() => removeItem(item.id, item.text)}
                className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="rounded-xl bg-slate-950/80 border border-white/8 p-3 font-mono">
        <div className="text-xs text-slate-600 mb-1.5">Лог операций</div>
        {log.length === 0 ? (
          <div className="text-xs text-slate-700">// операции появятся здесь</div>
        ) : (
          log.map((entry, i) => (
            <div key={i} className={`text-xs ${i === 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
