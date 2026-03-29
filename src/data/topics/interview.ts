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
} from '@/data/questions/interview'
import { reactQuestions } from '@/data/questions/react'
// Types
import type { Topic } from '@/types'

export const interviewTopic: Topic = {
  id: 'interview',
  title: 'Interview',
  icon: '🎯',
  description: 'Практический interview bank под Senior Frontend / React Full Stack собеседование',
  sections: [
    {
      id: 'step-2-react-typescript',
      title: 'Step 2: React + TypeScript',
      description: 'React internals, hooks, performance, TypeScript и practical debugging',
      explanation: `Этот этап обычно проверяет **базовую инженерную глубину**: как ты понимаешь React изнутри, насколько уверенно работаешь с TypeScript и умеешь ли объяснять баги, а не только чинить их.

Фокус ответа:
- сначала назвать core idea простыми словами
- потом дать техническую точность
- затем привести practical example или anti-pattern

Что особенно важно проговаривать уверенно:
- render vs commit
- hooks order и stale closure
- key, context, memo, transitions
- unknown vs any, union narrowing, generics
- типизация React-контрактов и production tsconfig`,
      examples: [],
      interviewQuestionIds: [
        ...reactQuestions.map(question => question.id),
        ...typescriptQuestions.map(question => question.id),
      ],
    },
    {
      id: 'step-2-playwright-openapi',
      title: 'Step 2: Playwright + OpenAPI',
      description: 'E2E stability, contract thinking, mocks, trace debugging и type-safe API work',
      explanation: `Здесь важно показать, что ты умеешь думать не только про UI, но и про **качество доставки**.

Фокус ответа:
- тестировать через пользовательские сигналы, а не через реализацию
- объяснять, как избежать flaky tests
- мыслить API как контрактом, а не набором "примерно таких" JSON-ов

Что хотят услышать:
- locators и auto-wait
- web-first assertions
- fixtures и test isolation
- route/HAR/trace viewer
- структура OpenAPI и breaking changes
- contract-first workflow между frontend и backend`,
      examples: [],
      interviewQuestionIds: playwrightOpenApiQuestions.map(question => question.id),
    },
    {
      id: 'step-2-backend-awareness',
      title: 'Step 2: Backend Awareness',
      description: 'Django, Python, SQLAlchemy, PostgreSQL, Redis, Celery и RabbitMQ для сильного frontend/fullstack',
      explanation: `Это не раунд на "сделай backend system design", а проверка: **насколько ты понимаешь платформу, с которой работаешь каждый день**.

Фокус ответа:
- объяснять backend вещи прикладным языком
- связывать поведение UI с request lifecycle, DB, cache и очередями
- явно различать source of truth, cache, queue и background jobs

Что особенно важно:
- lifecycle запроса и middleware
- session и transaction boundary
- N+1, индексы, pagination
- cache invalidation
- идемпотентность задач и retries`,
      examples: [],
      interviewQuestionIds: backendAwarenessQuestions.map(question => question.id),
    },
    {
      id: 'step-3-lead-architect',
      title: 'Step 3: Lead + Architect',
      description: 'Архитектура, ownership, modulе boundaries, permissions и независимый rollout',
      explanation: `На этом этапе уже смотрят не только на код, а на **инженерное мышление уровня системы и команды**.

Фокус ответа:
- сначала уточнить контекст и ограничения
- потом предложить базовую структуру
- затем назвать trade-offs, риски и rollout strategy

Сильный сигнал здесь:
- ты умеешь думать про ownership и boundaries
- понимаешь, как architecture живёт в squad, а не только в папках
- не обещаешь "идеал", а предлагаешь рабочее решение под ограничения`,
      examples: [],
      interviewQuestionIds: leadArchitectQuestions.map(question => question.id),
    },
    {
      id: 'step-3-domain-enterprise',
      title: 'Step 3: Domain + Enterprise SaaS',
      description: 'Safety-critical UX, RBAC, audit trail, approvals, drafts и операторские сценарии',
      explanation: `Этот блок проверяет, умеешь ли ты проектировать **enterprise workflow**, а не просто красивый экран.

Фокус ответа:
- думать состояниями процесса, а не только формой
- явно разделять current state и audit history
- строить UX, который честно показывает pending, failed, stale и conflict states

Что особенно важно:
- draft/review/approve flow
- permission model
- autosave и conflict handling
- partial failures
- безопасные destructive actions`,
      examples: [],
      interviewQuestionIds: domainEnterpriseQuestions.map(question => question.id),
    },
    {
      id: 'step-3-platform-delivery',
      title: 'Step 3: CI/CD + Platform',
      description: 'GitHub Actions, previews, Kubernetes, Terraform, rollback и post-deploy signals',
      explanation: `Здесь не ждут, что ты daily DevOps-owner. Но хотят понять, **можешь ли ты безопасно доставлять изменения вместе с платформенной командой**.

Фокус ответа:
- различать cache и artifacts
- понимать, что должно реально блокировать merge
- говорить про rollout и rollback без магии
- видеть связь между probes, compatibility и zero downtime

Что важно проговаривать спокойно и чётко:
- pipeline stages и environments
- previews и secrets
- Deployment / Pod / rolling update
- readiness vs liveness
- Terraform state, plan, drift`,
      examples: [],
      interviewQuestionIds: platformDeliveryQuestions.map(question => question.id),
    },
    {
      id: 'step-3-scenarios',
      title: 'Step 3: Scenario Questions',
      description: 'Реалистичные кейсы: perf, flaky tests, contract drift, long-running jobs и scope risk',
      explanation: `Это блок про **порядок мышления под давлением**, а не про знание терминов.

Фокус ответа:
- сначала локализовать проблему
- разделить immediate mitigation и long-term fix
- назвать, какие метрики, traces или логи нужны
- предложить последовательность действий, а не хаотичный список идей

Сильный ответ здесь почти всегда:
- структурный
- привязанный к сигналам и фактам
- без лишнего hero mode`,
      examples: [],
      interviewQuestionIds: scenarioQuestions.map(question => question.id),
    },
    {
      id: 'english-behavioral',
      title: 'English + Behavioral',
      description: 'Communication, ownership, risk handling и squad collaboration на английском',
      explanation: `Этот этап проверяет, как ты **объясняешь**, **согласовываешь** и **доводишь до результата**.

Фокус ответа:
- говорить коротко, структурно и через результат
- использовать context -> action -> outcome
- не обвинять других и не уходить в хаотичные детали

Что особенно важно:
- self-intro под эту вакансию
- trade-offs и disagreement
- ambiguous requirements
- deadline risk и escalation
- incident ownership`,
      examples: [],
      interviewQuestionIds: englishBehavioralQuestions.map(question => question.id),
    },
    {
      id: 'interview-plan',
      title: 'План подготовки на 2 этапа',
      description: 'Короткий prep-plan перед Step 2 и Step 3',
      explanation: `## За 1 день до Step 2

- проговорить вслух 8-10 React/TypeScript вопросов без подсказок
- отдельно повторить stale closure, hooks order, context re-render, transitions
- пройтись по Playwright: locators, assertions, trace viewer, mocking
- повторить OpenAPI: paths, schemas, requestBody, responses, securitySchemes
- освежить 2-3 реальные истории из своего опыта: performance bug, flaky test, incident

## За 1 день до Step 3

- подготовить 3 архитектурные рамки ответа:
  - enterprise frontend architecture
  - state boundaries
  - rollout / backward compatibility
- подготовить 2 domain stories:
  - сложный workflow
  - конфликт между UX и безопасностью процесса
- подготовить 3 behavioral истории по STAR:
  - disagreement
  - incident
  - estimate / risk escalation

## За 30 минут до звонка

- открыть этот раздел и быстро пройти только короткие ответы
- выбрать 2 сильных проекта из опыта
- выписать 3 фразы на английском про текущую роль, сильные стороны и тип продукта
- настроиться отвечать не "всё что знаю", а "самое релевантное под вопрос"`,
      examples: [
        {
          title: 'Short prep checklist',
          language: 'text',
          code: `Step 2:
- React internals
- TypeScript basics + generics
- Playwright stability
- OpenAPI contracts

Step 3:
- architecture trade-offs
- rollout / compatibility
- domain workflows
- ownership stories in English`,
        },
      ],
    },
  ],
}
