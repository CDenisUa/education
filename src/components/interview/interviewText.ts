// Types
import type { InterviewQuestion } from '@/types'

const GLOBAL_INTERVIEW_TERMS = [
  'DOM',
  'Virtual DOM',
  'VDOM',
  'UI',
  'API',
  'SSR',
  'CSR',
  'CI',
  'CD',
  'CI/CD',
  'RBAC',
  'SQL',
  'ORM',
  'DB',
  'OpenAPI',
  'Playwright',
  'TypeScript',
  'React',
  'Fiber',
  'Kubernetes',
  'Terraform',
  'Redis',
  'Celery',
  'RabbitMQ',
  'Django',
  'PostgreSQL',
]

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function protectSegments(content: string) {
  const protectedSegments: string[] = []

  const protectedContent = content.replace(
    /```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*/g,
    (match) => {
      const index = protectedSegments.push(match) - 1
      return `@@SEGMENT_${index}@@`
    },
  )

  return {
    protectedContent,
    restoreSegments(value: string) {
      return value.replace(/@@SEGMENT_(\d+)@@/g, (_, index) => protectedSegments[Number(index)] ?? '')
    },
  }
}

function buildTerms(question?: InterviewQuestion) {
  const questionTerms = question
    ? question.terms.flatMap(term => [term.en, term.ru])
    : []

  return [...new Set([...questionTerms, ...GLOBAL_INTERVIEW_TERMS])]
    .filter(Boolean)
    .sort((left, right) => right.length - left.length)
}

function emphasizeTerms(content: string, terms: string[]) {
  return terms.reduce((current, term) => {
    const escaped = escapeRegExp(term)
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escaped})(?=$|[^\\p{L}\\p{N}_])`, 'gu')

    return current.replace(pattern, (match, prefix, keyword) => {
      if (keyword.startsWith('**') && keyword.endsWith('**')) {
        return match
      }

      return `${prefix}**${keyword}**`
    })
  }, content)
}

export function emphasizeInterviewText(content: string, question?: InterviewQuestion) {
  const { protectedContent, restoreSegments } = protectSegments(content)
  const emphasized = emphasizeTerms(protectedContent, buildTerms(question))
  return restoreSegments(emphasized)
}
