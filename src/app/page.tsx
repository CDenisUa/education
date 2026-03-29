// Core
import Link from 'next/link'
// Data
import { topics } from '@/data'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="text-center mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Next.js 15 · React 19 · App Router
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            WebMechanics
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Интерактивный справочник по веб-разработке.<br />
            Теория, примеры кода и живые демо в одном месте.
          </p>
        </div>

        {/* Topics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full max-w-5xl">
          {topics.map(topic => (
            <Link
              key={topic.id}
              href={`/${topic.id}/${topic.sections[0].id}`}
              className="group p-5 rounded-xl border border-white/10 bg-slate-900/60
                hover:border-white/20 hover:bg-slate-800/60
                transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{topic.icon}</div>
              <h2 className="text-base font-semibold text-white mb-1">
                {topic.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {topic.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-slate-600
                group-hover:text-indigo-400 transition-colors">
                <span>{topic.sections.length} тем</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 flex gap-8 text-sm text-slate-600">
          {[
            { value: topics.reduce((n, t) => n + t.sections.length, 0), label: 'тем' },
            { value: topics.reduce((n, t) => n + t.sections.reduce((m, s) => m + s.examples.length, 0), 0), label: 'примеров кода' },
            { value: topics.reduce((n, t) => n + t.sections.filter(s => s.demoComponent).length, 0), label: 'интерактивных демо' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-slate-400">{value}+</div>
              <div className="text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer credit strip */}
      <div className="bg-black/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex justify-end">
          <a href="https://chepio.tech" target="_blank" rel="noopener noreferrer"
            className="opacity-25 hover:opacity-100 transition-all duration-300"
            aria-label="Developed by Chepio">
            <img src="/images/icons/logo_designed.svg" alt="chepio.tech"
              className="h-7 w-auto brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300" />
          </a>
        </div>
      </div>
    </div>
  )
}
