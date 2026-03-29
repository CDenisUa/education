'use client'

// Core
import { useState } from 'react'

export function UseStateDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [items, setItems] = useState<string[]>(['Apple', 'Banana'])
  const [inputVal, setInputVal] = useState('')

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const addItem = () => {
    if (!inputVal.trim()) return
    setItems(prev => [...prev, inputVal.trim()])
    setInputVal('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Счётчик — функциональное обновление</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setCount(prev => prev - 1)} className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold transition-colors">−</button>
          <div className="text-4xl font-bold font-mono text-white w-16 text-center">{count}</div>
          <button onClick={() => setCount(prev => prev + 1)} className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold transition-colors">+</button>
          <button onClick={() => setCount(0)} className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors">reset</button>
        </div>
        <p className="mt-2 font-mono text-xs text-slate-600">setCount(prev =&gt; prev + 1) // functional update</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Derived State — вычисляется при рендере</h3>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Введите текст..." rows={3}
          className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 resize-none focus:outline-none focus:border-indigo-500/60" />
        <div className="flex gap-4 mt-2 text-xs text-slate-500">
          <span>Символов: <strong className="text-white">{charCount}</strong></span>
          <span>Слов: <strong className="text-white">{wordCount}</strong></span>
          <span className="text-slate-700 italic">// не useState</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Массив в state — иммутабельность</h3>
        <div className="flex gap-2 mb-3">
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Новый элемент..."
            className="flex-1 px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60" />
          <button onClick={addItem} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-lg transition-colors">+ Добавить</button>
        </div>
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 border border-white/8 text-sm">
              <span className="text-slate-300">{item}</span>
              <button onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-400 transition-colors text-xs">x</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
