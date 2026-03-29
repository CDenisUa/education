export interface CodeExample {
  title: string
  code: string
  language: string
}

export interface InterviewTerm {
  en: string
  ru: string
  description: string
}

export interface InterviewQuestion {
  id: string
  question: string
  category: string
  level: 'junior' | 'middle' | 'senior'
  terms: InterviewTerm[]
  shortAnswer: string
  fullAnswer: string
  visual?: string
  examples?: CodeExample[]
}

export interface TopicSection {
  id: string
  title: string
  description: string
  explanation: string
  examples: CodeExample[]
  demoComponent?: string
  interviewQuestionIds?: string[]
}

export interface Topic {
  id: string
  title: string
  icon: string
  description: string
  sections: TopicSection[]
}

export interface NavItem {
  id: string
  title: string
  icon: string
  children?: NavItem[]
}

export type SectionId =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'nextjs'
  | 'patterns'
  | 'algorithms'
  | 'architecture'
  | 'interview'
