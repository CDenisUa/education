'use client'

// Core
import { useState } from 'react'

export function ScopeDemo() {
  const [output, setOutput] = useState<string[]>([])

  const runDemo = (demo: string) => {
    const logs: string[] = []
    const log = (...args: unknown[]) => logs.push(args.join(' '))

    try {
      switch (demo) {
        case 'var-loop':
          for (var i = 0; i < 3; i++) {
            setTimeout((() => {
              const captured = i
              return () => log(`var: ${captured}`)
            })(), 0)
          }
          log('var i after loop:', i)
          break

        case 'let-loop':
          for (let j = 0; j < 3; j++) {
            const captured = j
            log(`let j = ${captured}`)
          }
          break

        case 'closure':
          function createCounter() {
            let count = 0
            return {
              inc: () => ++count,
              get: () => count,
            }
          }
          const c = createCounter()
          log('increment:', c.inc())
          log('increment:', c.inc())
          log('increment:', c.inc())
          log('value:', c.get())
          break

        case 'hoisting':
          log('typeof x before:', typeof (window as unknown as Record<string, unknown>).x_demo || 'undefined')
          var x_demo = 'hello'
          log('x_demo after:', x_demo)
          break
      }
    } catch (e) {
      logs.push('Error: ' + (e as Error).message)
    }

    setOutput(logs)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'var-loop', label: 'var в цикле' },
          { id: 'let-loop', label: 'let в цикле' },
          { id: 'closure', label: 'Замыкание' },
          { id: 'hoisting', label: 'Hoisting' },
        ].map(demo => (
          <button key={demo.id} onClick={() => runDemo(demo.id)}
            className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500/80 text-xs text-white rounded-lg transition-colors">
            {demo.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-slate-950/80 border border-white/10 p-4 min-h-24 font-mono">
        {output.length === 0 ? (
          <p className="text-xs text-slate-700">// выберите демо выше</p>
        ) : (
          output.map((line, i) => (
            <div key={i} className={`text-sm ${i === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {`> ${line}`}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
