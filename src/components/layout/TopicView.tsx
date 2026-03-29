'use client'

// Core
import { useState } from 'react'
// Components
import { CodeBlock } from '@/components/ui/CodeBlock'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
import { DemoRenderer } from '@/components/demos/DemoRenderer'
// Types
import type { TopicSection } from '@/types'

interface TopicViewProps {
  section: TopicSection
  topicId: string
  topicTitle: string
  topicIcon: string
}

export function TopicView({ section, topicId, topicTitle, topicIcon }: TopicViewProps) {
  const [activeExample, setActiveExample] = useState(0)
  const hasExamples = section.examples.length > 0
  const hasDemo = Boolean(section.demoComponent)
  const activeCodeExample = section.examples[activeExample]
  const panelClassName = 'rounded-2xl border border-white/10 bg-slate-900/40 shadow-sm shadow-slate-950/10'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/8 px-4 py-3 sm:px-6 sm:py-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="text-slate-300">{topicIcon}</span>
          <span>{topicTitle}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{section.title}</span>
        </div>
        <h1 className="text-lg font-semibold leading-tight text-white sm:text-xl">{section.title}</h1>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
        {hasExamples ? (
          <div className="grid h-full min-h-0 gap-4 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.95fr)] xl:grid-rows-1 xl:gap-5">
            <section className={`${panelClassName} flex min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5`}>
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2">
                <MarkdownContent content={section.explanation} />
              </div>
            </section>

            {activeCodeExample && (
              <aside className={`min-h-0 min-w-0 ${hasDemo ? 'grid h-full min-h-0 gap-4 grid-rows-[minmax(0,1.1fr)_minmax(220px,0.9fr)] xl:gap-5' : 'flex h-full min-h-0 flex-col'}`}>
                <section className={`${panelClassName} flex min-h-0 flex-col overflow-hidden`}>
                  {section.examples.length > 1 && (
                    <div className="shrink-0 border-b border-white/8 px-3 py-3 sm:px-4">
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {section.examples.map((example, i) => (
                          <button
                            key={example.title}
                            onClick={() => setActiveExample(i)}
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors
                              ${activeExample === i
                                ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300'
                                : 'border-white/8 text-slate-500 hover:text-slate-300 hover:bg-white/4'
                              }`}
                          >
                            {example.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="min-h-0 flex-1 p-3 sm:p-4">
                    <CodeBlock
                      code={activeCodeExample.code}
                      language={activeCodeExample.language}
                      title={activeCodeExample.title}
                      className="h-full"
                    />
                  </div>
                </section>

                {section.demoComponent && (
                  <section className={`${panelClassName} flex min-h-0 flex-col overflow-hidden p-4 sm:p-5`}>
                    <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                      <DemoRenderer
                        component={section.demoComponent!}
                        topicId={topicId}
                        sectionId={section.id}
                      />
                    </div>
                  </section>
                )}
              </aside>
            )}
          </div>
        ) : hasDemo ? (
          <div className="grid h-full min-h-0 gap-4 grid-rows-[minmax(0,1fr)_minmax(220px,0.9fr)] xl:gap-5">
            <section className={`${panelClassName} flex min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5`}>
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2">
                <MarkdownContent content={section.explanation} />
              </div>
            </section>

            <section className={`${panelClassName} flex min-h-0 flex-col overflow-hidden p-4 sm:p-5`}>
              <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                <DemoRenderer
                  component={section.demoComponent!}
                  topicId={topicId}
                  sectionId={section.id}
                />
              </div>
            </section>
          </div>
        ) : (
          <section className={`${panelClassName} flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5`}>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2">
              <MarkdownContent content={section.explanation} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
