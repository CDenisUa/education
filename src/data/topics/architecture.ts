// Types
import type { Topic } from '@/types'

export const architectureTopic: Topic = {
  id: 'architecture',
  title: 'Architecture',
  icon: '🏛️',
  description: 'Подходы к архитектуре frontend и backend приложений, от модульности до clean/hexagonal',
  sections: [
    {
      id: 'frontend-architecture-foundations',
      title: 'Frontend Architecture Foundations',
      description: 'Layered thinking, feature boundaries, shared code и модульность большого интерфейса',
      explanation: `Архитектура frontend начинается не с модных слов, а с вопроса: **как сделать приложение понятным, изменяемым и масштабируемым для команды**.

<img src="/images/diagrams/frontend-architecture.svg" alt="Frontend architecture layers" />

## Что обычно нужно разделять
- app shell: routing, providers, auth bootstrap, layout
- pages/screens: route-level composition
- features/use cases: действия пользователя и бизнес-flow
- domain/entities: типы, правила, маппинги, статусы
- data/infra: HTTP client, cache, analytics, storage, websocket

## Почему feature-based decomposition часто выигрывает
- код ближе к бизнес-сценарию, а не к типу файла
- легче понимать ownership
- проще изолировать изменения и тесты
- меньше шанс превратить \`components/\` в свалку из 500 файлов

## Признаки хорошей frontend architecture
- границы понятны без tribal knowledge
- переиспользование идёт снизу вверх, а не наоборот
- shared слой действительно shared, а не dump для всего непонятного
- UI не знает деталей HTTP/auth/cache implementation

## Анти-patterns
- gigantic \`utils\` folder
- global state для локальных форм и modal visibility
- cross-imports между удалёнными feature-модулями
- слишком ранний микрофронтенд без необходимости`,
      examples: [
        {
          title: 'Frontend feature structure',
          language: 'text',
          code: `src/
  app/
    router/
    providers/
  pages/
    permits-page/
  features/
    permit-create/
    permit-approve/
    report-filters/
  entities/
    permit/
    report/
    user/
  shared/
    ui/
    lib/
    api/
    config/

Идея:
- page собирает экран
- feature реализует конкретный use case
- entity описывает предметную область
- shared содержит то, что не знает о домене`,
        },
        {
          title: 'API boundary во frontend',
          language: 'typescript',
          code: `type ReportDto = {
  id: string
  title: string
  approval_status: 'draft' | 'approved'
}

type Report = {
  id: string
  title: string
  status: 'draft' | 'approved'
}

function mapReport(dto: ReportDto): Report {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.approval_status,
  }
}

async function loadReports(): Promise<Report[]> {
  const response = await fetch('/api/reports')
  const data = (await response.json()) as ReportDto[]
  return data.map(mapReport)
}

// UI работает с domain model Report,
// а не с сырым transport shape.`,
        },
      ],
    },
    {
      id: 'frontend-state-and-api-boundaries',
      title: 'State and API Boundaries',
      description: 'Server state, client state, forms, derived state, BFF и contract-first thinking',
      explanation: `Большая часть хаоса во frontend возникает из-за плохих границ состояния.

## Полезная классификация state
- server state: пришёл с backend, имеет latency, cache, refetch, stale status
- client UI state: modal open, selected tab, drawer state
- form state: текущий ввод пользователя, dirty/errors/touched
- derived state: вычисляется из других данных и часто не должен храниться отдельно

## Почему это важно
- server state требует cache, invalidation и async lifecycle
- local UI state чаще должен жить рядом с компонентом
- form state имеет собственные правила синхронизации и валидации
- derived state в \`useState\` часто создаёт рассинхрон

## API layer
- transport DTO лучше отделять от domain model
- ошибки, pagination, auth refresh и retry должны жить в одном месте
- generated OpenAPI client полезен, но его часто оборачивают facade/service слоем

## BFF и contract-first
- BFF полезен, если один frontend собирает данные из нескольких backend-сервисов или сглаживает неудобный контракт
- contract-first снижает drift между командами
- на интервью сильный ответ обычно разделяет transport concerns и product logic`,
      examples: [
        {
          title: 'Что хранить, а что вычислять',
          language: 'tsx',
          code: `function ReportTable({ reports }: { reports: { id: string; status: string }[] }) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'approved'>('all')

  const visibleReports =
    selectedStatus === 'all'
      ? reports
      : reports.filter(report => report.status === selectedStatus)

  return (
    <>
      <StatusFilter value={selectedStatus} onChange={setSelectedStatus} />
      <Table reports={visibleReports} />
    </>
  )
}

// visibleReports — derived state.
// Его не нужно хранить отдельным useState.`,
        },
        {
          title: 'BFF-friendly client facade',
          language: 'typescript',
          code: `type DashboardSummary = {
  openPermits: number
  overdueReports: number
  pendingApprovals: number
}

interface DashboardApi {
  getSummary(): Promise<DashboardSummary>
}

class HttpDashboardApi implements DashboardApi {
  async getSummary() {
    const response = await fetch('/bff/dashboard/summary')
    if (!response.ok) {
      throw new Error('Failed to load dashboard summary')
    }
    return (await response.json()) as DashboardSummary
  }
}

// UI зависит от DashboardApi,
// а не от деталей того, сколько backend-сервисов стоит за BFF.`,
        },
      ],
    },
    {
      id: 'scaling-frontend',
      title: 'Scaling Frontend',
      description: 'Design systems, monorepo, microfrontends, package boundaries и автономия команд',
      explanation: `Когда frontend растёт, проблема уже не только в компонентах, а в **координации команд, release cycle и shared ownership**.

## Что обычно помогает
- design system для повторяемого UI
- package boundaries для shared logic
- monorepo, если нужна прозрачность зависимостей и единый tooling
- explicit ownership по feature/domain, а не по случайным папкам

## Microfrontends
- полезны, когда есть реально независимые product areas и команды
- дают автономные deploys и изоляцию
- но добавляют orchestration, governance, payload и infra complexity

## Когда не надо лезть в microfrontends
- одна небольшая команда
- приложение ещё не упёрлось в coordination bottleneck
- проблема скорее в плохой модульности, чем в масштабе организации

## Типичный хороший ответ на интервью
- сначала исправляю модульность и ownership внутри frontend monolith
- только потом обсуждаю microfrontends как организационный инструмент, а не как серебряную пулю`,
      examples: [
        {
          title: 'Когда monorepo полезен',
          language: 'text',
          code: `Monorepo особенно полезен, если:
- frontend, design system и shared tooling развиваются вместе
- нужны атомарные изменения в нескольких пакетах
- хочется единый lint/typecheck/test pipeline

Минусы:
- сложнее CI orchestration
- нужен порядок в зависимостях и ownership
- без дисциплины можно получить большой общий бардак`,
        },
        {
          title: 'Microfrontends: здравый минимум',
          language: 'text',
          code: `Я бы обсуждал microfrontends только если:
- есть отдельные бизнес-домены
- есть команды с end-to-end ownership
- нужен независимый release cycle
- команда готова платить за orchestration, routing, observability и shared contracts

Если этих условий нет, лучше начать с modular frontend внутри одного repo.`,
        },
      ],
    },
    {
      id: 'backend-architecture-styles',
      title: 'Backend Architecture Styles',
      description: 'Layered, modular monolith, microservices, event-driven и serverless подходы',
      explanation: `На backend архитектура выбирается не по моде, а по сочетанию **домена, масштаба команды и требований к развёртыванию**.

## Layered / N-tier
- классика: controller -> service -> repository -> db
- просто понять и начать
- хорошо работает для многих CRUD-систем
- риск: доменная логика размазывается по слоям без явных boundaries

## Modular Monolith
- один deployable unit, но внутри чёткие модули
- часто лучший дефолт для серьёзного продукта
- проще транзакции, observability и локальная разработка
- важна реальная модульность, а не "монолит с папками"

## Microservices
- независимые сервисы вокруг business capabilities
- выигрывают при масштабе организации и независимых release cycles
- добавляют сложность: network, observability, contracts, eventual consistency

## Event-driven
- полезен для background processing, интеграций, workflow orchestration
- хорошо сочетается с queues и domain events
- нужно думать про idempotency, retries и ordering

## Serverless
- хорош для bursty workloads, glue logic, cron, lightweight APIs
- не автоматически делает систему простой`,
      examples: [
        {
          title: 'Layered service',
          language: 'python',
          code: `class ReportController:
    def __init__(self, service: "ReportService") -> None:
        self.service = service

    def post(self, payload: dict) -> dict:
        return self.service.create_report(payload)


class ReportService:
    def __init__(self, repository: "ReportRepository") -> None:
        self.repository = repository

    def create_report(self, payload: dict) -> dict:
        if not payload.get("title"):
            raise ValueError("title is required")
        return self.repository.save(payload)


class ReportRepository:
    def save(self, payload: dict) -> dict:
        return {"id": "rep-1", **payload}`,
        },
        {
          title: 'Modular monolith mental model',
          language: 'text',
          code: `backend/
  modules/
    permits/
      api/
      application/
      domain/
      infrastructure/
    reports/
      api/
      application/
      domain/
      infrastructure/

Один deploy, но внутри чёткие boundaries.
Это часто проще microservices и при этом намного здоровее "общего service layer".`,
        },
      ],
    },
    {
      id: 'clean-hexagonal-and-ddd',
      title: 'Clean, Hexagonal and DDD',
      description: 'Ports and adapters, use cases, bounded contexts, repositories и CQRS',
      explanation: `Эти подходы помогают отделить **бизнес-правила от деталей инфраструктуры**.

<img src="/images/diagrams/clean-architecture.svg" alt="Clean architecture diagram" />

## Clean Architecture
- сущности и use cases в центре
- UI, DB, HTTP, broker снаружи
- зависимости смотрят внутрь

## Hexagonal / Ports and Adapters
- core общается с внешним миром через порты
- адаптеры реализуют эти порты для HTTP, SQL, S3, RabbitMQ и т.д.
- смысл не в шестиугольнике, а в изоляции core от framework details

## DDD short version
- focus на языке домена и boundaries
- bounded context помогает не смешивать разные смыслы одного слова
- entity, value object, aggregate полезны там, где доменная сложность реально велика

## CQRS
- read и write модели можно разделять, если это упрощает систему
- но CQRS не нужен в каждом CRUD-приложении
- на интервью сильнее звучит "я понимаю зачем это делать", чем "я вставляю CQRS везде"

## Когда эти подходы окупаются
- сложные правила и длинная жизнь продукта
- несколько интеграций и внешних систем
- важно тестировать бизнес-логику отдельно от инфраструктуры`,
      examples: [
        {
          title: 'Hexagonal port',
          language: 'python',
          code: `from typing import Protocol


class ReportGateway(Protocol):
    def save(self, title: str) -> dict: ...


class CreateReportUseCase:
    def __init__(self, gateway: ReportGateway) -> None:
        self.gateway = gateway

    def execute(self, title: str) -> dict:
        if not title.strip():
            raise ValueError("title is required")
        return self.gateway.save(title)


class SqlReportGateway:
    def save(self, title: str) -> dict:
        return {"id": "rep-42", "title": title}

# Use case не знает, SQL там, HTTP или message bus.`,
        },
        {
          title: 'Frontend analogue: use case over infrastructure',
          language: 'typescript',
          code: `interface SaveDraftPort {
  save(input: { reportId: string; notes: string }): Promise<void>
}

class SaveDraftUseCase {
  constructor(private port: SaveDraftPort) {}

  async execute(input: { reportId: string; notes: string }) {
    if (!input.notes.trim()) {
      throw new Error('Notes are required')
    }

    await this.port.save(input)
  }
}

// Даже на frontend такой слой полезен,
// если бизнес-правила толстые и не должны жить в кнопке onClick.`,
        },
      ],
    },
    {
      id: 'cross-cutting-concerns',
      title: 'Cross-Cutting Concerns',
      description: 'Auth, observability, retries, idempotency, queues, consistency и resilience',
      explanation: `Архитектура ломается не только на happy path. Её проверяют именно cross-cutting concerns.

## Что обычно нужно продумать
- authN/authZ
- logging, tracing, metrics
- rate limits
- retry policy и backoff
- idempotency
- transaction boundaries
- cache invalidation
- background jobs и queues

## Полезные вопросы
- что будет, если пользователь нажмёт submit дважды?
- что будет, если сеть оборвётся после побочного эффекта?
- как я пойму после релиза, что система деградировала?
- где хранится источник истины для permissions?

## Хорошая архитектурная привычка
- закладывать не только happy path, но и states: pending, partial failure, timeout, duplicate delivery, stale cache`,
      examples: [
        {
          title: 'Idempotency mindset',
          language: 'text',
          code: `Если операция может прийти повторно:
- нужен business key / idempotency key
- повторный submit не должен создавать вторую сущность
- UI должен уметь показать "уже выполняется" или "уже создано"
- backend должен быть источником истины, а не только disable-кнопка на фронте`,
        },
        {
          title: 'Observability checklist',
          language: 'text',
          code: `Минимум после deploy:
- error rate
- latency
- success/failure ratio ключевых use cases
- structured logs
- traces для межсервисных запросов
- smoke test на критический flow

Без observability rollback и incident response становятся угадайкой.`,
        },
      ],
    },
    {
      id: 'architecture-tradeoffs',
      title: 'How to Choose Architecture',
      description: 'Как выбирать подход, а не повторять чужие термины',
      explanation: `На архитектурном интервью редко побеждает тот, кто знает больше модных названий. Побеждает тот, кто умеет **выбирать подход под ограничения**.

## Что спросить сначала
- сколько команд и как они работают
- какой жизненный цикл у продукта
- насколько критичны latency, uptime, audit, compliance
- есть ли независимые release cycles
- насколько часто меняются domain rules
- сколько реально стоит operational complexity

## Practical defaults
- frontend: начать с modular feature-based architecture
- backend: начать с modular monolith, пока нет явной причины дробить
- infra: наращивать сложность только вместе с реальной потребностью

## Красные флаги в ответах
- "давайте сразу microservices и microfrontends"
- "весь state вынесем в global store"
- "добавим абстракции на будущее"
- "observability потом"

## Сильная форма ответа
- сначала ограничения
- потом базовый вариант
- потом риски и точки эволюции
- потом как проверю, что решение работает`,
      examples: [
        {
          title: 'Архитектурная рамка ответа',
          language: 'text',
          code: `1. Я уточняю контекст.
2. Предлагаю самый простой жизнеспособный вариант.
3. Называю trade-offs и почему не иду в более сложный дизайн сразу.
4. Описываю, какие сигналы подскажут, что архитектуру пора эволюционировать.

Это почти всегда звучит сильнее, чем список buzzwords.`,
        },
        {
          title: 'Пример эволюции без overengineering',
          language: 'text',
          code: `Этап 1:
- modular frontend
- modular monolith backend
- contract-first API

Этап 2:
- выделяем BFF или background workers
- усиливаем observability

Этап 3:
- только при реальном bottleneck обсуждаем microservices / microfrontends

Архитектура должна уметь расти, но не обязана начинаться с максимальной сложности.`,
        },
      ],
    },
  ],
}
