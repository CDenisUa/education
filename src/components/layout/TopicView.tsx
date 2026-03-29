'use client'

// Core
import { useEffect, useState } from 'react'
// Components
import { DemoRenderer } from '@/components/demos/DemoRenderer'
import { InterviewSectionView } from '@/components/interview/InterviewSectionView'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
// Types
import type { InterviewQuestion, TopicSection } from '@/types'

interface TopicViewProps {
  section: TopicSection
  topicId: string
  topicTitle: string
  topicIcon: string
  interviewQuestions?: InterviewQuestion[]
}

type MobilePanelTab = 'code' | 'demo'

export function TopicView({
  section,
  topicId,
  topicTitle,
  topicIcon,
  interviewQuestions = [],
}: TopicViewProps) {
  const [activeExample, setActiveExample] = useState(0)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)
  const [mobilePanelTab, setMobilePanelTab] = useState<MobilePanelTab>(
    section.examples.length > 0 ? 'code' : 'demo',
  )

  const hasExamples = section.examples.length > 0
  const hasDemo = Boolean(section.demoComponent)
  const hasPracticePanel = hasExamples || hasDemo
  const activeCodeExample = section.examples[activeExample]
  const panelClassName = 'rounded-2xl border border-white/10 bg-slate-900/40 shadow-sm shadow-slate-950/10'

  useEffect(() => {
    setActiveExample(0)
    setIsMobilePanelOpen(false)
    setMobilePanelTab(section.examples.length > 0 ? 'code' : 'demo')
  }, [section.id, section.examples.length])

  if (interviewQuestions.length > 0) {
    return (
      <InterviewSectionView
        section={section}
        questions={interviewQuestions}
      />
    )
  }

  const renderExampleTabs = (className: string) => (
    <div className={className}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {section.examples.map((example, i) => (
          <button
            key={example.title}
            type="button"
            onClick={() => setActiveExample(i)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${activeExample === i ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300' : 'border-white/8 text-slate-500 hover:bg-white/4 hover:text-slate-300'}`}
          >
            {example.title}
          </button>
        ))}
      </div>
    </div>
  )

  const renderDesktopExamples = () => {
    if (!activeCodeExample) {
      return null
    }

    return (
      <aside className={`min-h-0 min-w-0 ${hasDemo ? 'grid h-full min-h-0 gap-4 grid-rows-[minmax(0,1.1fr)_minmax(220px,0.9fr)] xl:gap-5' : 'flex h-full min-h-0 flex-col'}`}>
        <section className={`${panelClassName} flex min-h-0 flex-col overflow-hidden`}>
          {section.examples.length > 1 && renderExampleTabs('shrink-0 border-b border-white/8 px-3 py-3 sm:px-4')}

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
                component={section.demoComponent}
                topicId={topicId}
                sectionId={section.id}
              />
            </div>
          </section>
        )}
      </aside>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="hidden border-b border-white/8 px-4 py-3 sm:px-6 sm:py-4 md:block">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="text-slate-300">{topicIcon}</span>
          <span>{topicTitle}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{section.title}</span>
        </div>
        <h1 className="text-lg font-semibold leading-tight text-white sm:text-xl">{section.title}</h1>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden px-0 py-0 md:px-6 md:py-5">
        <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden md:hidden">
          <div className={`min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-4 ${hasPracticePanel ? 'pb-24' : ''}`}>
            <MarkdownContent content={section.explanation} />
          </div>
        </section>

        {hasExamples ? (
          <div className="hidden h-full min-h-0 gap-4 md:grid md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:grid-rows-1 xl:gap-5">
            <section className={`${panelClassName} flex min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5`}>
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2">
                <MarkdownContent content={section.explanation} />
              </div>
            </section>

            {renderDesktopExamples()}
          </div>
        ) : hasDemo ? (
          <div className="hidden h-full min-h-0 gap-4 md:grid md:grid-rows-[minmax(0,1fr)_minmax(220px,0.9fr)] xl:gap-5">
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
          <section className={`${panelClassName} hidden h-full min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5 md:flex`}>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2">
              <MarkdownContent content={section.explanation} />
            </div>
          </section>
        )}

        {hasPracticePanel && (
          <>
            <button
              type="button"
              onClick={() => setIsMobilePanelOpen(true)}
              className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-20 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/30 transition-colors hover:bg-indigo-400 md:hidden"
              aria-label={hasExamples ? 'Открыть примеры' : 'Открыть практику'}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 7 4 12l4 5" />
                <path d="m16 7 4 5-4 5" />
                <path d="m14 5-4 14" />
              </svg>
              <span>{hasExamples ? 'Примеры' : 'Практика'}</span>
            </button>

            <div className={`absolute inset-0 z-30 md:hidden ${isMobilePanelOpen ? '' : 'pointer-events-none'}`}>
              <div
                className={`absolute inset-0 bg-slate-950/72 backdrop-blur-sm transition-opacity duration-200 ${isMobilePanelOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsMobilePanelOpen(false)}
              />

              <aside
                className={`absolute inset-0 flex flex-col bg-slate-950 transition-transform duration-300 ${isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                      {hasExamples ? 'Примеры и код' : 'Практика'}
                    </div>
                    <div className="truncate text-sm font-semibold text-white">
                      {mobilePanelTab === 'code'
                        ? activeCodeExample?.title ?? section.title
                        : 'Интерактивное демо'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobilePanelOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-300 transition-colors hover:border-white/20 hover:bg-slate-800/80"
                    aria-label="Закрыть панель примеров"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12" />
                      <path d="M18 6l-12 12" />
                    </svg>
                  </button>
                </div>

                {hasExamples && hasDemo && (
                  <div className="border-b border-white/8 px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMobilePanelTab('code')}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${mobilePanelTab === 'code' ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300' : 'border-white/8 text-slate-500 hover:bg-white/4 hover:text-slate-300'}`}
                      >
                        Код
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobilePanelTab('demo')}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${mobilePanelTab === 'demo' ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300' : 'border-white/8 text-slate-500 hover:bg-white/4 hover:text-slate-300'}`}
                      >
                        Демо
                      </button>
                    </div>
                  </div>
                )}

                {mobilePanelTab === 'code' && activeCodeExample && (
                  <>
                    {section.examples.length > 1 && renderExampleTabs('shrink-0 border-b border-white/8 px-4 py-3')}

                    <CodeBlock
                      code={activeCodeExample.code}
                      language={activeCodeExample.language}
                      title={activeCodeExample.title}
                      className={`min-h-0 flex-1 ${section.examples.length > 1 ? 'border-t-0' : ''}`}
                      variant="edge-to-edge-mobile"
                    />
                  </>
                )}

                {mobilePanelTab === 'demo' && section.demoComponent && (
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                    <DemoRenderer
                      component={section.demoComponent}
                      topicId={topicId}
                      sectionId={section.id}
                    />
                  </div>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
