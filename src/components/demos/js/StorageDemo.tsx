'use client'

// Core
import { useState, useEffect } from 'react'

export function StorageDemo() {
  const [key, setKey] = useState('demo-key')
  const [value, setValue] = useState('{"name":"Alice","age":30}')
  const [storageItems, setStorageItems] = useState<[string, string][]>([])
  const [activeTab, setActiveTab] = useState<'local' | 'session'>('local')

  const refreshItems = () => {
    const storage = activeTab === 'local' ? localStorage : sessionStorage
    const items: [string, string][] = []
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i)
      if (k) items.push([k, storage.getItem(k) ?? ''])
    }
    setStorageItems(items)
  }

  useEffect(() => {
    refreshItems()
  }, [activeTab])

  const setItem = () => {
    const storage = activeTab === 'local' ? localStorage : sessionStorage
    storage.setItem(key, value)
    refreshItems()
  }

  const removeItem = (k: string) => {
    const storage = activeTab === 'local' ? localStorage : sessionStorage
    storage.removeItem(k)
    refreshItems()
  }

  const clearAll = () => {
    const storage = activeTab === 'local' ? localStorage : sessionStorage
    storage.clear()
    refreshItems()
  }

  const getSize = () => {
    let size = 0
    const storage = activeTab === 'local' ? localStorage : sessionStorage
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i)
      if (k) size += k.length + (storage.getItem(k)?.length ?? 0)
    }
    return size
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/60 rounded-lg w-fit border border-white/10">
        {(['local', 'session'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm transition-all
              ${activeTab === tab
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'}`}
          >
            {tab}Storage
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-3 text-xs text-center">
        {[
          { label: 'Хранилище', value: activeTab === 'local' ? 'localStorage' : 'sessionStorage' },
          { label: 'Записей', value: storageItems.length },
          { label: 'Занято', value: `~${getSize()} символов` },
        ].map(({ label, value }) => (
          <div key={label} className="p-2.5 rounded-lg bg-slate-800/40 border border-white/10">
            <div className="font-mono font-bold text-white">{value}</div>
            <div className="text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Write */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Запись</p>
        <div className="flex gap-2">
          <input
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="key"
            className="w-32 px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg text-sm
              text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60"
          />
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="value"
            className="flex-1 px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg text-sm
              text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60"
          />
          <button onClick={setItem}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-lg transition-colors">
            setItem()
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Содержимое</p>
          {storageItems.length > 0 && (
            <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Очистить всё
            </button>
          )}
        </div>
        {storageItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-white/8 text-xs text-slate-600 text-center">
            Хранилище пусто
          </div>
        ) : (
          storageItems.map(([k, v]) => (
            <div key={k}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-white/8">
              <span className="font-mono text-xs text-yellow-300 shrink-0">{k}</span>
              <span className="text-slate-600 text-xs">→</span>
              <span className="font-mono text-xs text-slate-300 truncate flex-1">{v}</span>
              <button onClick={() => removeItem(k)}
                className="text-xs text-slate-600 hover:text-red-400 transition-colors shrink-0">
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {activeTab === 'session' && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-amber-300/80">
            ⚠️ sessionStorage очищается при закрытии вкладки. Данные не сохраняются между сессиями.
          </p>
        </div>
      )}
    </div>
  )
}
