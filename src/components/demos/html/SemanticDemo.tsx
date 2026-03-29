'use client'

// Core
import { useState } from 'react'

export function SemanticDemo() {
  const [view, setView] = useState<'semantic' | 'div'>('semantic')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-1 bg-slate-800/60 rounded-lg w-fit border border-white/10">
        <button
          onClick={() => setView('semantic')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all
            ${view === 'semantic' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
        >
          ✅ Семантический HTML
        </button>
        <button
          onClick={() => setView('div')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all
            ${view === 'div' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}
        >
          ❌ Div-суп
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
        {view === 'semantic' ? (
          <div className="p-4 font-mono text-xs leading-6">
            <div className="text-blue-400">&lt;<span className="text-cyan-300">header</span>&gt;</div>
            <div className="pl-4 text-blue-400">&lt;<span className="text-cyan-300">nav</span>&gt;</div>
            <div className="pl-8 text-slate-400">— навигация по сайту</div>
            <div className="pl-4 text-blue-400">&lt;/<span className="text-cyan-300">nav</span>&gt;</div>
            <div className="text-blue-400">&lt;/<span className="text-cyan-300">header</span>&gt;</div>
            <div className="text-blue-400">&lt;<span className="text-cyan-300">main</span>&gt;</div>
            <div className="pl-4 text-blue-400">&lt;<span className="text-cyan-300">article</span>&gt;</div>
            <div className="pl-8 text-blue-400">&lt;<span className="text-cyan-300">h1</span>&gt;<span className="text-slate-300">Заголовок</span>&lt;/<span className="text-cyan-300">h1</span>&gt;</div>
            <div className="pl-8 text-blue-400">&lt;<span className="text-cyan-300">section</span>&gt;</div>
            <div className="pl-12 text-slate-400">— раздел статьи</div>
            <div className="pl-8 text-blue-400">&lt;/<span className="text-cyan-300">section</span>&gt;</div>
            <div className="pl-4 text-blue-400">&lt;/<span className="text-cyan-300">article</span>&gt;</div>
            <div className="pl-4 text-blue-400">&lt;<span className="text-cyan-300">aside</span>&gt;</div>
            <div className="pl-8 text-slate-400">— боковая панель</div>
            <div className="pl-4 text-blue-400">&lt;/<span className="text-cyan-300">aside</span>&gt;</div>
            <div className="text-blue-400">&lt;/<span className="text-cyan-300">main</span>&gt;</div>
            <div className="text-blue-400">&lt;<span className="text-cyan-300">footer</span>&gt;</div>
            <div className="pl-4 text-slate-400">— подвал сайта</div>
            <div className="text-blue-400">&lt;/<span className="text-cyan-300">footer</span>&gt;</div>
          </div>
        ) : (
          <div className="p-4 font-mono text-xs leading-6">
            <div className="text-slate-400">&lt;<span className="text-red-400">div</span> <span className="text-yellow-400">class</span>=&quot;header&quot;&gt;</div>
            <div className="pl-4 text-slate-400">&lt;<span className="text-red-400">div</span> <span className="text-yellow-400">class</span>=&quot;nav&quot;&gt;</div>
            <div className="pl-8 text-slate-500">— что это? nav? list? menu?</div>
            <div className="pl-4 text-slate-400">&lt;/<span className="text-red-400">div</span>&gt;</div>
            <div className="text-slate-400">&lt;/<span className="text-red-400">div</span>&gt;</div>
            <div className="text-slate-400">&lt;<span className="text-red-400">div</span> <span className="text-yellow-400">class</span>=&quot;main-content&quot;&gt;</div>
            <div className="pl-4 text-slate-400">&lt;<span className="text-red-400">div</span> <span className="text-yellow-400">class</span>=&quot;article-box&quot;&gt;</div>
            <div className="pl-8 text-slate-400">&lt;<span className="text-red-400">div</span> <span className="text-yellow-400">class</span>=&quot;title&quot;&gt;Заголовок?&lt;/<span className="text-red-400">div</span>&gt;</div>
            <div className="pl-8 text-slate-400">&lt;<span className="text-red-400">div</span>&gt;</div>
            <div className="pl-12 text-slate-500">— зачем этот div?</div>
            <div className="pl-8 text-slate-400">&lt;/<span className="text-red-400">div</span>&gt;</div>
            <div className="pl-4 text-slate-400">&lt;/<span className="text-red-400">div</span>&gt;</div>
            <div className="text-slate-400">&lt;/<span className="text-red-400">div</span>&gt;</div>
            <div className="text-slate-400">&lt;<span className="text-red-400">div</span> <span className="text-yellow-400">class</span>=&quot;footer-wrapper&quot;&gt;&lt;/<span className="text-red-400">div</span>&gt;</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔍', label: 'SEO', desc: view === 'semantic' ? 'Поисковики понимают структуру' : 'Нет семантики — хуже индексация' },
          { icon: '♿', label: 'Доступность', desc: view === 'semantic' ? 'Скринридеры читают правильно' : 'Скринридеры теряются в div-ах' },
          { icon: '📝', label: 'Читаемость', desc: view === 'semantic' ? 'Код самодокументируется' : 'Нужно читать классы' },
        ].map(item => (
          <div
            key={item.label}
            className={`p-3 rounded-lg border text-center
              ${view === 'semantic'
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'}`}
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-xs font-semibold text-white mb-1">{item.label}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
