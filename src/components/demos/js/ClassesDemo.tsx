'use client'

// Core
import { useState, useRef } from 'react'

class EventEmitter {
  #listeners = new Map<string, Array<(...args: unknown[]) => void>>()

  on(event: string, cb: (...args: unknown[]) => void) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, [])
    this.#listeners.get(event)!.push(cb)
    return this
  }

  emit(event: string, ...args: unknown[]) {
    this.#listeners.get(event)?.forEach(cb => cb(...args))
    return this
  }

  get listenerCount() {
    let total = 0
    this.#listeners.forEach(arr => total += arr.length)
    return total
  }
}

class Counter extends EventEmitter {
  #value: number

  constructor(initial = 0) {
    super()
    this.#value = initial
  }

  get value() { return this.#value }

  increment() {
    this.#value++
    this.emit('change', this.#value)
    return this
  }

  decrement() {
    this.#value--
    this.emit('change', this.#value)
    return this
  }

  reset() {
    this.#value = 0
    this.emit('reset', this.#value)
    return this
  }
}

export function ClassesDemo() {
  const counterRef = useRef(new Counter(0))
  const [value, setValue] = useState(0)
  const [events, setEvents] = useState<string[]>([])

  const init = () => {
    counterRef.current.on('change', (v) => {
      setValue(v as number)
      setEvents(prev => [`change: ${v}`, ...prev].slice(0, 6))
    })
    counterRef.current.on('reset', (v) => {
      setValue(v as number)
      setEvents(prev => [`reset: ${v}`, ...prev].slice(0, 6))
    })
  }

  // Initialize once
  useState(init)

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10">
        <div className="text-xs text-slate-500 mb-3 font-mono">
          class Counter extends EventEmitter {'{'}
          <span className="text-indigo-300"> #value</span> = {value};
          {'}'}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => counterRef.current.decrement()}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold transition-colors">−</button>
          <div className="text-4xl font-bold font-mono text-white w-16 text-center">{value}</div>
          <button onClick={() => counterRef.current.increment()}
            className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold transition-colors">+</button>
          <button onClick={() => counterRef.current.reset()}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 rounded-lg transition-colors">
            reset()
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
        <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
          <span>EventEmitter события</span>
          <span className="font-mono">listeners: {counterRef.current.listenerCount}</span>
        </div>
        {events.length === 0 ? (
          <p className="text-xs text-slate-700 font-mono">// нажмите кнопки</p>
        ) : (
          events.map((e, i) => (
            <div key={i} className={`text-xs font-mono ${i === 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
              emit({`'${e.split(':')[0]}'`}, {e.split(': ')[1]})
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs text-center">
        {[
          { label: 'Приватные поля', value: '#value', desc: 'ES2022 — #field' },
          { label: 'Геттер', value: 'get value()', desc: 'Свойство без скобок' },
          { label: 'Наследование', value: 'extends', desc: 'Counter extends EventEmitter' },
        ].map(({ label, value, desc }) => (
          <div key={label} className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
            <div className="font-mono text-indigo-300 font-bold mb-0.5">{value}</div>
            <div className="text-slate-400">{label}</div>
            <div className="text-slate-600 mt-0.5">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
