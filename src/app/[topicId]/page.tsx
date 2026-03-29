// Core
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
// Data
import { getTopic } from '@/data'

interface Props {
  params: Promise<{ topicId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId } = await params
  const topic = getTopic(topicId)
  return { title: topic?.title ?? 'Not Found' }
}

export default async function TopicOverviewPage({ params }: Props) {
  const { topicId } = await params
  const topic = getTopic(topicId)
  if (!topic) notFound()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="text-4xl mb-4">{topic.icon}</div>
        <h1 className="text-3xl font-bold text-white mb-3">{topic.title}</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-12">{topic.description}</p>

        <div className="grid gap-3">
          {topic.sections.map((section, i) => (
            <Link
              key={section.id}
              href={`/${topicId}/${section.id}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/10
                bg-slate-900/60 hover:border-white/20 hover:bg-slate-800/60
                transition-all duration-200 group"
            >
              <span className="text-slate-600 text-sm font-mono w-6 shrink-0 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1">
                  {section.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{section.description}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
                {section.demoComponent && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    demo
                  </span>
                )}
                <span className="text-slate-600 group-hover:text-slate-400 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
