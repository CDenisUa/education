// Core
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
// Components
import { TopicView } from '@/components/layout/TopicView'
// Data
import { getTopic, getSection } from '@/data'
import { getQuestions } from '@/data/questions'

interface Props {
  params: Promise<{ topicId: string; sectionId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId, sectionId } = await params
  const section = getSection(topicId, sectionId)
  const topic = getTopic(topicId)
  return {
    title: section ? `${section.title} — ${topic?.title}` : 'Not Found',
  }
}

export default async function SectionPage({ params }: Props) {
  const { topicId, sectionId } = await params
  const topic = getTopic(topicId)
  const section = getSection(topicId, sectionId)

  if (!topic || !section) notFound()

  const interviewQuestions = section.interviewQuestionIds
    ? getQuestions(section.interviewQuestionIds)
    : []

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <TopicView
        section={section}
        topicId={topicId}
        topicTitle={topic.title}
        topicIcon={topic.icon}
        interviewQuestions={interviewQuestions}
      />
    </div>
  )
}
