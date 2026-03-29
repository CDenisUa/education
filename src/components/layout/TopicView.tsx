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

type Tab = 'explanation' | 'examples' | 'demo'

export function TopicView({ section, topicId, topicTitle, topicIcon }: TopicViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('explanation')
  const [activeExample, setActiveExample] = useState(0)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'explanation', label: 'Теория', icon: '📖' },
    { id: 'examples', label: 'Примеры', icon: '💡' },
    ...(section.demoComponent ? [{ id: 'demo' as Tab, label: 'Интерактив', icon: '🎮' }] : []),
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span>{topicIcon}</span>
          <span>{topicTitle}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{section.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{section.title}</h1>
        <p className="text-slate-400 text-sm leading-relaxed">{section.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-8 pt-4 pb-0 border-b border-white/8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
              rounded-t-lg transition-all duration-150 -mb-px
              ${activeTab === tab.id
                ? 'bg-slate-800 text-white border border-white/10 border-b-slate-800'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/4 border border-transparent'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Explanation Tab */}
        {activeTab === 'explanation' && (
          <div className="px-8 py-6">
            <MarkdownContent content={section.explanation} />
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="flex h-full">
            {/* Example selector */}
            {section.examples.length > 1 && (
              <div className="w-48 shrink-0 border-r border-white/8 py-3 px-2">
                {section.examples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveExample(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs mb-0.5
                      transition-colors
                      ${activeExample === i
                        ? 'bg-indigo-500/15 text-indigo-300 font-medium'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/4'
                      }`}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
            )}

            {/* Code */}
            <div className="flex-1 p-6 overflow-auto">
              {section.examples[activeExample] && (
                <CodeBlock
                  code={section.examples[activeExample].code}
                  language={section.examples[activeExample].language}
                  title={section.examples[activeExample].title}
                />
              )}
            </div>
          </div>
        )}

        {/* Demo Tab */}
        {activeTab === 'demo' && section.demoComponent && (
          <div className="p-6">
            <DemoRenderer
              component={section.demoComponent}
              topicId={topicId}
              sectionId={section.id}
            />
          </div>
        )}
      </div>
    </div>
  )
}
