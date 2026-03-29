export interface CodeExample {
  title: string
  code: string
  language: string
}

export interface TopicSection {
  id: string
  title: string
  description: string
  explanation: string
  examples: CodeExample[]
  demoComponent?: string
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

export type SectionId = 'html' | 'css' | 'javascript' | 'react' | 'nextjs'
