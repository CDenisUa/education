'use client'

// Core
import { useState } from 'react'
// Components
import { hasQuestionDiagram, QuestionDiagram } from '@/components/interview/QuestionDiagram'
import { emphasizeInterviewText } from '@/components/interview/interviewText'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { MarkdownContent } from '@/components/ui/MarkdownContent'
// Types
import type { InterviewQuestion } from '@/types'

interface QuestionViewProps {
  question: InterviewQuestion
  variant?: 'page' | 'embedded'
}

const levelLabel: Record<InterviewQuestion['level'], { label: string; className: string }> = {
  junior: { label: 'Junior', className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  middle: { label: 'Middle', className: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
  senior: { label: 'Senior', className: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
}

function QuestionBody({ question, variant }: { question: InterviewQuestion; variant: 'page' | 'embedded' }) {
  const [activeExample, setActiveExample] = useState(0)
  const level = levelLabel[question.level]
  const hasExamples = Boolean(question.examples?.length)
  const isEmbedded = variant === 'embedded'
  const wrapperClassName = isEmbedded ? 'space-y-5 px-0 py-4 md:space-y-6 md:p-6' : 'space-y-10'
  const sectionInsetClass = isEmbedded ? 'px-4 md:px-0' : ''
  const standardBlockClass = isEmbedded
    ? 'rounded-none border-y border-white/8 bg-slate-900/30 px-4 py-5 md:rounded-2xl md:border md:bg-slate-900/40 md:px-6'
    : 'rounded-2xl border border-white/8 bg-slate-900/40 p-6'
  const highlightedBlockClass = isEmbedded
    ? 'rounded-none border-y border-indigo-500/20 bg-indigo-500/5 px-4 py-5 md:rounded-xl md:border md:px-5'
    : 'rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5'
  const emphasizedShortAnswer = emphasizeInterviewText(question.shortAnswer, question)
  const emphasizedFullAnswer = emphasizeInterviewText(question.fullAnswer, question)
  const hasCanvasDiagram = hasQuestionDiagram(question.id)

  return (
    <div className={wrapperClassName}>
      <section className={sectionInsetClass}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${level.className}`}>
            {level.label}
          </span>
          <span className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-slate-400">
            {question.category}
          </span>
        </div>
        <h1 className={`${isEmbedded ? 'text-xl sm:text-2xl' : 'text-2xl'} font-bold leading-snug text-white`}>
          {question.question}
        </h1>
      </section>

      {question.terms.length > 0 && (
        <section className={sectionInsetClass}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Понятия, которые нужно знать
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {question.terms.map(term => (
              <div
                key={term.en}
                className="rounded-2xl border border-white/8 bg-slate-900/50 p-4"
              >
                <div className="mb-1.5 flex items-baseline gap-2">
                  <span className="font-mono text-sm font-semibold text-indigo-300">{term.en}</span>
                  <span className="text-xs text-slate-500">/</span>
                  <span className="text-sm text-slate-300">{term.ru}</span>
                </div>
                <MarkdownContent
                  content={emphasizeInterviewText(term.description, question)}
                  className="prose-p:my-0 prose-p:text-xs prose-p:leading-relaxed"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {question.visual && (
        <section>
          <h2 className={`${sectionInsetClass} mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500`}>
            Как это работает визуально
          </h2>
          {hasCanvasDiagram ? (
            <QuestionDiagram questionId={question.id} description={question.visual} />
          ) : (
            <div className={standardBlockClass}>
              <MarkdownContent content={emphasizeInterviewText(question.visual, question)} />
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className={`${sectionInsetClass} mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500`}>
          Короткий ответ
        </h2>
        <div className={highlightedBlockClass}>
          <MarkdownContent
            content={emphasizedShortAnswer}
            className="prose-p:my-0 prose-p:text-sm prose-p:leading-7"
          />
        </div>
      </section>

      <section>
        <h2 className={`${sectionInsetClass} mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500`}>
          Подробный разбор
        </h2>
        <div className={standardBlockClass}>
          <MarkdownContent content={emphasizedFullAnswer} />
        </div>
      </section>

      {hasExamples && (
        <section>
          <h2 className={`${sectionInsetClass} mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500`}>
            Примеры кода
          </h2>
          {question.examples!.length > 1 && (
            <div className={`${isEmbedded ? 'border-y border-white/8 px-4 py-3 md:rounded-t-2xl md:border md:border-b-0 md:bg-slate-900/40' : 'rounded-t-2xl border border-b-0 border-white/8 bg-slate-900/40 px-4 py-3'}`}>
              <div className="flex flex-wrap gap-2">
                {question.examples!.map((example, i) => (
                  <button
                    key={example.title}
                    type="button"
                    onClick={() => setActiveExample(i)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${activeExample === i ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300' : 'border-white/8 text-slate-500 hover:bg-white/4 hover:text-slate-300'}`}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <CodeBlock
            code={question.examples![activeExample].code}
            language={question.examples![activeExample].language}
            title={question.examples![activeExample].title}
            variant={isEmbedded ? 'edge-to-edge-mobile' : 'default'}
            className={question.examples!.length > 1 ? 'md:rounded-t-none md:border-t-0' : ''}
          />
        </section>
      )}
    </div>
  )
}

export function QuestionView({ question, variant = 'page' }: QuestionViewProps) {
  if (variant === 'embedded') {
    return <QuestionBody question={question} variant={variant} />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="sticky top-0 z-10 border-b border-white/8 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <button
            onClick={() => window.close()}
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Закрыть
          </button>
          <span className="text-xs text-slate-600">Interview — {question.category}</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <QuestionBody question={question} variant={variant} />
      </main>
    </div>
  )
}
