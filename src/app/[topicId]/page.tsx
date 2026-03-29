// Core
import { notFound, redirect } from 'next/navigation'
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

  redirect(`/${topicId}/${topic.sections[0].id}`)
}
