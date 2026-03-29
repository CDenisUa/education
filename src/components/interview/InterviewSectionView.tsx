'use client'

// Core
import { useEffect, useState } from 'react'
// Components
import { emphasizeInterviewText } from '@/components/interview/interviewText'
import { QuestionView } from '@/components/interview/QuestionView'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
// Types
import type { InterviewQuestion, TopicSection } from '@/types'

interface InterviewSectionViewProps {
  section: TopicSection
  questions: InterviewQuestion[]
}

const levelClassName: Record<InterviewQuestion['level'], string> = {
  junior: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  middle: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300',
  senior: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300',
}

export function InterviewSectionView({ section, questions }: InterviewSectionViewProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  const activeQuestion = questions[activeQuestionIndex]

  useEffect(() => {
    setActiveQuestionIndex(0)
    setIsMobilePanelOpen(false)
  }, [section.id])

  if (!activeQuestion) {
    return (
      <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-4 sm:p-5">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-2">
          <MarkdownContent content={section.explanation} />
        </div>
      </section>
    )
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="hidden border-b border-white/8 px-4 py-3 sm:px-6 sm:py-4 md:block">
        <h1 className="text-lg font-semibold leading-tight text-white sm:text-xl">{section.title}</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-0 py-0 md:px-6 md:py-5">
        <div className="grid h-full min-h-0 md:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] md:gap-5">
          <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-white/8 md:rounded-2xl md:border md:bg-slate-900/40">
            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:flex md:flex-1 md:flex-col">
              <section className="flex min-h-0 flex-col overflow-hidden border-b border-white/8 md:flex-1">
                <div className="shrink-0 border-b border-white/8 px-4 py-3 sm:px-5">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Как отвечать
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                  <MarkdownContent
                    content={emphasizeInterviewText(section.explanation)}
                    className="prose-p:text-sm prose-p:leading-6 prose-li:text-sm"
                  />
                </div>
              </section>

              <section className="flex min-h-0 flex-col overflow-hidden md:flex-1">
                <div className="shrink-0 border-b border-white/8 px-4 py-3 sm:px-5">
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Вопросы
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 pb-24 md:pb-4">
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => {
                          setActiveQuestionIndex(index)
                          if (window.innerWidth < 768) {
                            setIsMobilePanelOpen(true)
                          }
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${activeQuestionIndex === index ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-white/10 bg-white/3 hover:bg-white/5'}`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${levelClassName[question.level]}`}>
                            {question.level}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            {question.category}
                          </span>
                        </div>
                        <div className="text-sm font-medium leading-6 text-white">
                          {question.question}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </aside>

          <section className="hidden min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 md:flex">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <QuestionView question={activeQuestion} variant="embedded" />
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={() => setIsMobilePanelOpen(true)}
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-20 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/30 transition-colors hover:bg-indigo-400 md:hidden"
          aria-label="Открыть ответ на вопрос"
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
          <span>Ответ</span>
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
                  Интервью вопрос
                </div>
                <div className="truncate text-sm font-semibold text-white">
                  {activeQuestion.question}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobilePanelOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-slate-300 transition-colors hover:border-white/20 hover:bg-slate-800/80"
                aria-label="Закрыть панель ответа"
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

            <div className="min-h-0 flex-1 overflow-y-auto">
              <QuestionView question={activeQuestion} variant="embedded" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
