// Data
import { htmlTopic } from './topics/html'
import { cssTopic } from './topics/css'
import { javascriptTopic } from './topics/javascript'
import { reactTopic } from './topics/react'
import { nextjsTopic } from './topics/nextjs'
// Types
import type { Topic, NavItem } from '@/types'

export const topics: Topic[] = [
  htmlTopic,
  cssTopic,
  javascriptTopic,
  reactTopic,
  nextjsTopic,
]

export const navTree: NavItem[] = topics.map(topic => ({
  id: topic.id,
  title: topic.title,
  icon: topic.icon,
  children: topic.sections.map(section => ({
    id: section.id,
    title: section.title,
    icon: '',
  })),
}))

export function getTopic(id: string): Topic | undefined {
  return topics.find(t => t.id === id)
}

export function getSection(topicId: string, sectionId: string) {
  const topic = getTopic(topicId)
  return topic?.sections.find(s => s.id === sectionId)
}
