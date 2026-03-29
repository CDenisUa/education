'use client'

// Core
import { useState } from 'react'

export function FormsDemo() {
  const [formData, setFormData] = useState({
    email: '',
    age: '',
    volume: '50',
    date: '',
    color: '#6366f1',
    search: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
        <p className="text-xs text-indigo-300">
          💡 Все поля используют нативную HTML5 валидацию. Попробуйте отправить форму с неверными данными.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="demo-email" className="block text-xs font-medium text-slate-400">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="demo-email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg
                text-sm text-white placeholder:text-slate-600
                focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30
                invalid:border-red-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="demo-age" className="block text-xs font-medium text-slate-400">
              Возраст (18–100)
            </label>
            <input
              type="number"
              id="demo-age"
              name="age"
              min="18"
              max="100"
              value={formData.age}
              onChange={handleChange}
              placeholder="25"
              className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg
                text-sm text-white placeholder:text-slate-600
                focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="demo-volume" className="block text-xs font-medium text-slate-400">
            Громкость: <span className="text-white font-mono">{formData.volume}%</span>
          </label>
          <input
            type="range"
            id="demo-volume"
            name="volume"
            min="0"
            max="100"
            value={formData.volume}
            onChange={handleChange}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="demo-date" className="block text-xs font-medium text-slate-400">
              Дата
            </label>
            <input
              type="date"
              id="demo-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg
                text-sm text-white focus:outline-none focus:border-indigo-500/60
                [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="demo-color" className="block text-xs font-medium text-slate-400">
              Цвет
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="demo-color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent"
              />
              <span className="text-sm font-mono text-slate-400">{formData.color}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="demo-search" className="block text-xs font-medium text-slate-400">
              Поиск
            </label>
            <input
              type="search"
              id="demo-search"
              name="search"
              value={formData.search}
              onChange={handleChange}
              placeholder="Введите запрос..."
              className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg
                text-sm text-white placeholder:text-slate-600
                focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm
            font-medium rounded-lg transition-colors"
        >
          {submitted ? '✓ Отправлено!' : 'Отправить форму'}
        </button>
      </form>
    </div>
  )
}
