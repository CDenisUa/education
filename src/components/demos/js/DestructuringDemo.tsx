'use client'

// Core
import { useState } from 'react'

export function DestructuringDemo() {
  const [active, setActive] = useState('obj')

  const examples = {
    obj: {
      title: 'Деструктуризация объекта',
      input: `const user = { id: 1, name: 'Alice', role: 'admin', age: 30 }`,
      ops: [
        { code: 'const { name, role } = user', result: 'name = "Alice", role = "admin"' },
        { code: 'const { name: userName } = user', result: 'userName = "Alice"' },
        { code: 'const { email = "n/a" } = user', result: 'email = "n/a" (default)' },
        { code: 'const { id, ...rest } = user', result: 'id = 1, rest = { name, role, age }' },
      ]
    },
    arr: {
      title: 'Деструктуризация массива',
      input: `const colors = ['red', 'green', 'blue', 'yellow']`,
      ops: [
        { code: 'const [first, second] = colors', result: 'first = "red", second = "green"' },
        { code: 'const [, , third] = colors', result: 'third = "blue" (пропуск)' },
        { code: 'const [head, ...tail] = colors', result: 'head = "red", tail = ["green","blue","yellow"]' },
        { code: 'const [a = "default"] = []', result: 'a = "default"' },
      ]
    },
    spread: {
      title: 'Spread / Rest',
      input: `const a = { x: 1 }; const b = { y: 2 }`,
      ops: [
        { code: '{ ...a, ...b }', result: '{ x: 1, y: 2 }' },
        { code: '{ ...a, x: 99 }', result: '{ x: 99 } (override)' },
        { code: '[...arr1, ...arr2]', result: 'объединение массивов' },
        { code: 'func(...args)', result: 'spread при вызове функции' },
      ]
    },
  }

  const current = examples[active as keyof typeof examples]

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-slate-800/60 rounded-lg w-fit border border-white/10">
        {Object.entries(examples).map(([key, val]) => (
          <button key={key} onClick={() => setActive(key)}
            className={`px-3 py-1.5 rounded-md text-sm transition-all
              ${active === key ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}>
            {val.title.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-slate-800/40 border border-white/10">
        <div className="text-xs text-slate-500 mb-1">Исходные данные:</div>
        <code className="text-xs text-yellow-300 font-mono">{current.input}</code>
      </div>

      <div className="space-y-2">
        {current.ops.map((op, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-white/8">
            <code className="text-xs text-blue-300 font-mono flex-1">{op.code}</code>
            <span className="text-slate-600 text-xs">→</span>
            <span className="text-xs text-emerald-300 flex-1">{op.result}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
