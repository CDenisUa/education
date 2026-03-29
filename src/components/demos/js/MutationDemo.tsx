'use client'

// Core
import { useEffect, useRef, useState } from 'react'

interface MutationLog {
  id: number
  type: string
  detail: string
  time: string
}

export function MutationDemo() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [logs, setLogs] = useState<MutationLog[]>([])
  const [text, setText] = useState('Наблюдаемый элемент')
  const [cssClass, setCssClass] = useState('')
  const idRef = useRef(0)

  useEffect(() => {
    if (!targetRef.current) return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        setLogs(prev => [{
          id: idRef.current++,
          type: mutation.type,
          detail: mutation.type === 'childList'
            ? `added: ${mutation.addedNodes.length}, removed: ${mutation.removedNodes.length}`
            : mutation.type === 'attributes'
            ? `${mutation.attributeName}: "${mutation.oldValue}" → "${(mutation.target as Element).getAttribute(mutation.attributeName ?? '')}"` 
            : `"${mutation.oldValue}" → "${(mutation.target as Text).textContent}"`,
          time: new Date().toLocaleTimeString('ru', { hour12: false }),
        }, ...prev].slice(0, 8))
      })
    })

    observer.observe(targetRef.current, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    })

    return () => observer.disconnect()
  }, [])

  const addChild = () => {
    if (!targetRef.current) return
    const span = document.createElement('span')
    span.textContent = ` [+${Date.now().toString().slice(-4)}]`
    span.className = 'text-emerald-400 text-xs'
    targetRef.current.appendChild(span)
  }

  const removeChild = () => {
    if (!targetRef.current || targetRef.current.lastChild?.nodeName === 'P') return
    targetRef.current.lastChild && targetRef.current.removeChild(targetRef.current.lastChild)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={addChild}
          className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-500/80 text-xs text-white rounded-lg transition-colors">
          + appendChild()
        </button>
        <button onClick={removeChild}
          className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500/80 text-xs text-white rounded-lg transition-colors">
          − removeChild()
        </button>
        <button onClick={() => setCssClass(c => c ? '' : 'text-indigo-400')}
          className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500/80 text-xs text-white rounded-lg transition-colors">
          Toggle class
        </button>
      </div>

      <div ref={targetRef}
        className={`p-4 rounded-xl border-2 border-dashed border-white/20 bg-slate-800/30 min-h-12 ${cssClass}`}>
        <p className="text-sm text-slate-400">{text} (наблюдается MutationObserver)</p>
      </div>

      <div className="rounded-xl bg-slate-950/80 border border-white/8 p-3 min-h-20">
        <div className="text-xs text-slate-600 mb-1.5 font-mono">MutationObserver log</div>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-700">// изменяйте элемент выше</p>
        ) : (
          logs.map((log, i) => (
            <div key={log.id} className={`text-xs flex gap-2 font-mono ${i === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="text-slate-700">{log.time}</span>
              <span className={log.type === 'childList' ? 'text-emerald-400' : log.type === 'attributes' ? 'text-yellow-400' : 'text-blue-400'}>{log.type}</span>
              <span>{log.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
