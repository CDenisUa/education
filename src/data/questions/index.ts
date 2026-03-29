// Types
import type { InterviewQuestion } from '@/types'
// Data
import {
  backendAwarenessQuestions,
  domainEnterpriseQuestions,
  englishBehavioralQuestions,
  leadArchitectQuestions,
  platformDeliveryQuestions,
  playwrightOpenApiQuestions,
  scenarioQuestions,
  typescriptQuestions,
} from './interview'
import { reactQuestions } from './react'

export const questions: InterviewQuestion[] = [
  ...reactQuestions,
  ...typescriptQuestions,
  ...playwrightOpenApiQuestions,
  ...backendAwarenessQuestions,
  ...leadArchitectQuestions,
  ...domainEnterpriseQuestions,
  ...platformDeliveryQuestions,
  ...scenarioQuestions,
  ...englishBehavioralQuestions,
]

const questionsById = new Map(questions.map(question => [question.id, question]))

export function getQuestion(id: string): InterviewQuestion | undefined {
  return questionsById.get(id)
}

export function getQuestions(ids: string[]): InterviewQuestion[] {
  return ids
    .map(id => questionsById.get(id))
    .filter((question): question is InterviewQuestion => Boolean(question))
}
