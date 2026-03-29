// Types
import type { Topic } from '@/types'

export const interviewTopic: Topic = {
  id: 'interview',
  title: 'Interview',
  icon: '🎯',
  description: 'Вопросы и ответные рамки под Senior Frontend / React Full Stack interview, адаптированные под эту вакансию',
  sections: [
    {
      id: 'step-2-react-typescript',
      title: 'Step 2: React + TypeScript',
      description: 'Основной технический экран по React, TypeScript, архитектуре UI и debugging',
      explanation: `Этот этап по описанию вакансии почти наверняка будет **React-heavy**. Ниже не "случайные вопросы из интернета", а собранный список тем, которые логично следуют из вакансии и официальных docs React/TypeScript.

## Что почти точно спросят по React
- Что такое render и commit, и почему re-render не означает полный redraw DOM?
- Чем \`useEffect\` отличается от \`useLayoutEffect\`?
- Почему hooks нельзя вызывать в условиях?
- Что такое stale closure и как ты его исправляешь?
- Когда \`React.memo\` не помогает?
- Как работает \`key\` и почему \`index\` в динамическом списке опасен?
- Что происходит при изменении context value?
- Когда нужен \`useReducer\`, а когда достаточно \`useState\`?
- Что такое concurrent rendering простыми словами?
- Разница \`useTransition\` и \`useDeferredValue\`?
- Для чего в React 19 нужен \`useEffectEvent\`?
- Как объяснить Fiber, current tree и workInProgress без лишнего академизма?

## Что почти точно спросят по TypeScript
- Чем \`unknown\` лучше \`any\`?
- Что такое narrowing и как работает discriminated union?
- Зачем нужны generics и \`keyof\`?
- Когда выбрать \`interface\`, а когда \`type\`?
- Какие utility types ты реально используешь каждый день?
- Как типизировать props, callbacks, refs и DOM events в React?
- Как типизировать ответ API и ошибки?
- Что в \`tsconfig\` ты считаешь обязательным для production-проекта?
- Как писать declaration files и зачем \`.d.ts\`?
- Как не сломать типы при работе с OpenAPI-generated client?

## Вопросы уровня Senior
- Как бы ты объяснил, почему компонент неожиданно ре-рендерится?
- Как бы ты дебажил просадку производительности в таблице на 5 000 строк?
- Что бы ты сделал, если backend прислал слишком "широкий" union без дискриминатора?
- Как ты определяешь границы клиентского состояния, серверного состояния и derived state?
- Где ты используешь composition, а где custom hooks?
- Как бы ты объяснил junior-разработчику разницу между "держать в state" и "вычислять в render"?

## Что важно не просто знать, а уметь быстро проговорить
- render должен быть чистым
- state — это snapshot на конкретный render
- effect нужен для синхронизации с внешней системой, а не для любой логики
- transitions не для input value, а для тяжёлого UI рядом
- memo помогает только при стабильных ссылках и измеримой проблеме`,
      examples: [
        {
          title: 'Короткие ответы Senior-уровня',
          language: 'text',
          code: `1. Почему hooks нельзя в условиях?
Потому что React хранит hooks по порядку вызовов. Если порядок меняется, React сопоставляет состояние не тем hook-вызовам.

2. Что такое stale closure?
Это когда callback внутри interval / listener / effect видит старое значение из прошлого render.

3. Чем useTransition отличается от useDeferredValue?
useTransition откладывает state update. useDeferredValue откладывает потребление уже существующего значения в медленном поддереве.

4. Когда React.memo не помогает?
Когда в props на каждый render прилетают новые объекты, массивы или inline-функции.

5. Почему key важен?
Это identity элемента. Смена key = новый экземпляр компонента и сброс локального state.

6. Когда useReducer лучше useState?
Когда состояние имеет много переходов и удобнее мыслить action-ами, а не отдельными setState.`,
        },
        {
          title: 'Типичный live-coding фрагмент',
          language: 'tsx',
          code: `type User = {
  id: string
  name: string
}

type RequestState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: User[] }
  | { kind: 'error'; message: string }

function UsersPanel() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<RequestState>({ kind: 'idle' })
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setState({ kind: 'loading' })
      try {
        const response = await fetch(\`/api/users?q=\${encodeURIComponent(deferredQuery)}\`)
        const data = (await response.json()) as User[]
        if (!cancelled) {
          setState({ kind: 'success', data })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            kind: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }

    loadUsers()
    return () => { cancelled = true }
  }, [deferredQuery])

  return <SearchResults query={query} state={state} onQueryChange={setQuery} />
}`,
        },
      ],
    },
    {
      id: 'step-2-playwright-openapi',
      title: 'Step 2: Playwright + OpenAPI',
      description: 'Вопросы по e2e, API contracts, schema thinking и test architecture',
      explanation: `Это второй крупный пласт именно для этой вакансии. В тексте вакансии отдельно выделены **OpenAPI** и **Playwright**, поэтому их могут спросить даже у кандидата с сильным React-фокусом.

## Что почти точно спросят по Playwright
- Почему Playwright обычно стабильнее Selenium-подходов?
- Что такое locators и почему \`getByRole\` лучше длинного CSS selector?
- Что Playwright auto-waits перед \`click()\` и \`fill()\`?
- Что такое web-first assertions?
- Как устроены fixtures и зачем они нужны?
- Как ты организуешь Page Object или test helpers?
- Как мокать HTTP и когда лучше route, а когда HAR?
- Как дебажить flaky test через trace viewer?
- Как запускать тесты параллельно и что ломает параллелизм?
- Что делать, если тест зависит от общей базы или общего аккаунта?
- Как ты выбираешь, что проверять на e2e, а что на integration/component level?

## Что почти точно спросят по OpenAPI
- Из чего состоит OpenAPI 3 spec: \`paths\`, \`components\`, \`schemas\`, \`parameters\`, \`requestBody\`, \`responses\`, \`securitySchemes\`?
- Чем path/query/header/cookie parameters отличаются друг от друга?
- Что изменилось между OpenAPI 2 и 3 вокруг \`requestBody\` и \`securitySchemes\`?
- Для чего нужны \`oneOf\`, \`anyOf\`, \`allOf\`, \`$ref\`?
- Как генерировать type-safe client и что делать с breaking changes?
- Какие API-изменения безопасны, а какие ломают клиентов?
- Где лучше хранить pagination, filters, auth и error schema?
- Как frontend договаривается с backend об enum, nullable, defaults и examples?

## Senior-вопросы на стыке тестов и контрактов
- Как ты строишь e2e так, чтобы тесты не падали от лишней анимации и микрофлаков?
- Что лучше: мокать всё API или гонять smoke against real backend?
- Как ты проверяешь, что generated client не отстал от спецификации?
- Как бы ты организовал contract-first workflow между frontend и backend командами?

## Что стоит проговорить вслух
- в Playwright важно тестировать через пользовательские сигналы, а не через внутреннюю реализацию
- traces нужно включать хотя бы on-first-retry в CI
- в OpenAPI path params всегда required
- auth в OAS 3 описывается через \`securitySchemes\` и \`security\`, а не через ручной \`Authorization\` header parameter`,
      examples: [
        {
          title: 'Playwright: стабильный e2e тест',
          language: 'ts',
          code: `import { test, expect } from '@playwright/test'

test('user can create a permit draft', async ({ page }) => {
  await page.goto('/permits')

  await page.getByRole('button', { name: 'Create permit' }).click()
  await page.getByLabel('Title').fill('Tank inspection')
  await page.getByRole('button', { name: 'Save draft' }).click()

  await expect(
    page.getByRole('status').getByText('Draft saved')
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { name: 'Tank inspection' })
  ).toBeVisible()
})

// Что здесь хорошо:
// - user-facing locators
// - нет sleep / waitForTimeout
// - утверждения на видимый результат, а не на внутренний state`,
        },
        {
          title: 'OpenAPI: на что смотреть на интервью',
          language: 'yaml',
          code: `openapi: 3.0.3
paths:
  /users/{userId}:
    get:
      parameters:
        - in: path
          name: userId
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      required: [id, name]
      properties:
        id:
          type: string
        name:
          type: string
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

// На интервью важно объяснить:
// - почему userId не должен быть optional
// - как эта schema превратится в типы на frontend
// - что будет breaking change для клиента`,
        },
      ],
    },
    {
      id: 'step-2-backend-awareness',
      title: 'Step 2: Backend Awareness',
      description: 'Python, Django, SQLAlchemy, PostgreSQL, Redis, Celery и RabbitMQ на уровне сильного frontend/fullstack',
      explanation: `Даже если роль frontend-heavy, на internal tech interview часто проверяют, насколько ты понимаешь backend, чтобы нормально работать в squad с backend engineers.

## Вопросы по Python и Django
- Как устроен request/response lifecycle в Django?
- Что делает middleware и где его место в цепочке?
- Чем sync и async код в Python-сервисе practically отличаются для веб-приложения?
- Как ты бы структурировал API layer, services и background tasks?

## Вопросы по SQLAlchemy и PostgreSQL
- Что такое Session в SQLAlchemy и почему её нельзя тащить как глобальную singleton-переменную?
- Что такое transaction boundary?
- Что такое N+1 query problem?
- Когда нужна eager loading strategy?
- Чем \`READ COMMITTED\` отличается от \`SERIALIZABLE\` в PostgreSQL?
- Какие индексы ты ожидаешь увидеть на фильтрах, сортировках и foreign keys?
- Почему offset pagination может быть плохой на больших таблицах?

## Вопросы по Redis
- Где Redis использовать разумно: cache, rate limit, ephemeral state, distributed locks?
- Почему Redis не равен "основной БД"?
- Как объяснить cache invalidation и stale data простыми словами?

## Вопросы по Celery и RabbitMQ
- Что такое task queue и зачем выносить работу в background?
- Что значит idempotent task и почему это важно?
- Чем retry отличается от blind requeue?
- Что означает \`acks_late\` и когда оно опасно?
- Что такое dead-letter exchange?
- Что такое exchange, queue, routing key?
- Что произойдёт, если worker упадёт посреди long-running job?

## Что хороший frontend-кандидат должен уметь проговорить
- Я не обязан проектировать весь backend, но должен понимать contract, consistency, retries, queues и limits системы
- Я умею обсуждать payload shape, pagination, error model, auth, observability и rollout вместе с backend
- Я не путаю "в ответе удобно frontend" с "это масштабируется и безопасно на backend"`,
      examples: [
        {
          title: 'SQLAlchemy / PostgreSQL: краткая ответная рамка',
          language: 'text',
          code: `1. Что такое Session?
Это unit of work вокруг набора ORM-операций и транзакции. Её держат ограниченно по scope запроса или job, а не глобально.

2. Что такое N+1?
Когда мы сначала грузим список сущностей, а потом отдельными запросами дочитываем связанные данные для каждой записи.

3. Почему Read Committed важен?
Это default isolation в PostgreSQL. Каждая команда видит committed snapshot на момент старта этой команды.

4. Что бы ты спросил у backend по pagination?
- общий объём данных
- сортировка
- требования к стабильности порядка
- offset vs cursor
- какие фильтры должны индексироваться`,
        },
        {
          title: 'Celery / RabbitMQ: что хотят услышать',
          language: 'python',
          code: `from celery import shared_task

@shared_task(
  bind=True,
  autoretry_for=(ConnectionError,),
  retry_backoff=True,
  retry_jitter=True,
  max_retries=5,
  acks_late=True,
)
def send_report(self, report_id: str) -> None:
  report = load_report(report_id)

  # Идемпотентность важна:
  # если worker упадёт после побочного эффекта,
  # задача может быть доставлена повторно.
  if report.status == 'sent':
    return

  deliver_report(report)
  mark_report_as_sent(report_id)

# На интервью стоит проговорить:
# - почему task должна быть идемпотентной
# - почему blind retry может устроить storm
# - зачем нужен DLQ / DLX для poison messages`,
        },
      ],
    },
    {
      id: 'step-3-lead-architect',
      title: 'Step 3: Lead + Architect',
      description: 'Архитектурные, delivery и squad-level вопросы под финальный технический этап',
      explanation: `Этот этап в описании вакансии прямо назван интервью с **team leader и architect**, значит там почти точно будут не "что делает useEffect", а вопросы уровня ownership, trade-offs и системного мышления.

## Что почти точно спросят
- Как бы ты спроектировал frontend для enterprise SaaS с несколькими модулями и ролями?
- Как бы ты делил приложение на bounded contexts или feature slices?
- Как бы ты организовал дизайн API между frontend и backend squads?
- Где хранить server state, local UI state, derived state и form state?
- Как ты принимаешь решение между Context, custom hooks, React Query-подобным слоем и state manager?
- Как бы ты строил permission/RBAC model на frontend?
- Что делаешь, если product просит быстро ship, а архитектура не готова?
- Как ты определяешь минимально достаточный e2e coverage?
- Как бы ты организовал observability для frontend: logs, traces, metrics, user-visible errors?
- Как ты предотвращаешь breaking changes при развёртывании frontend и backend независимо?
- Как бы ты проектировал rollout, feature flags, backward compatibility и migration path?

## На что смотрят в ответе
- умеешь ли ты сначала уточнять контекст, а не сразу рисовать решение
- видишь ли ты ограничения: сроки, команда, legacy, регуляторика, безопасность, качество данных
- умеешь ли говорить trade-offs, а не только "идеальную" архитектуру
- понимаешь ли, как решение будет жить через 6-12 месяцев

## Технические вопросы, которые могут внезапно всплыть
- Чем artifact отличается от cache в GitHub Actions?
- Что ты ожидаешь от CI pipeline для frontend monorepo?
- Как readiness и rolling update влияют на безопасный rollout SPA / API?
- Зачем Terraform state, и почему его нельзя править вручную как обычный JSON?
- Как бы ты объяснил, что такое deployment strategy в Kubernetes на человеческом языке?

## Как отвечать лучше
Структура ответа:
1. Сначала уточняю контекст и ограничения
2. Дальше предлагаю базовую архитектуру
3. Потом проговариваю риски и альтернативы
4. В конце называю, как проверю, что решение работает`,
      examples: [
        {
          title: 'Шаблон ответа на system design вопрос',
          language: 'text',
          code: `Вопрос: "Как бы ты спроектировал frontend для enterprise SaaS?"

Хорошая структура:
1. Уточнить:
   - один продукт или multi-tenant платформа?
   - сколько модулей и команд?
   - SSR нужен или нет?
   - насколько критичны latency и offline?

2. Предложить основу:
   - feature-oriented structure
   - contract-first API
   - server state отдельно от local UI state
   - shared design system / component library

3. Обсудить риски:
   - разрастание shared layer
   - слишком толстый global context
   - дрейф контрактов между squads
   - flaky e2e и дорогие pipelines

4. Закрыть проверкой:
   - performance budgets
   - test pyramid
   - telemetry
   - ADR и ownership`,
        },
        {
          title: 'Архитектурный вопрос про rollout и CI/CD',
          language: 'text',
          code: `Что хочет услышать architect:

- Frontend и backend должны деплоиться независимо.
- Контракты должны быть backward-compatible на период rollout.
- В CI нужны:
  * typecheck
  * unit/integration
  * e2e smoke
  * artifact upload
  * trace/screenshots on failure

- GitHub Actions cache != artifacts:
  cache ускоряет повторные прогоны зависимостей,
  artifacts хранят результат конкретного workflow run.

- В Kubernetes rollout безопаснее, когда есть readiness probes,
  rolling updates и возможность быстро откатиться.`,
        },
      ],
    },
    {
      id: 'step-3-domain-enterprise',
      title: 'Step 3: Domain + Enterprise SaaS',
      description: 'Вопросы под safety-critical и enterprise SaaS домен: RBAC, audit trail, approvals, drafts и отказоустойчивый UX',
      explanation: `По вакансии и описанию компании здесь важен не только стек, но и **контекст продукта**: safety, health, high-risk industries, enterprise workflows, несколько ролей и чувствительные бизнес-процессы. На финальном этапе это часто превращается в отдельные вопросы.

## Что могут спросить по доменной модели
- Как бы ты спроектировал workflow с draft -> review -> approve -> complete?
- Где ты бы держал immutable audit log, а где редактируемое текущее состояние?
- Как проектировать UI, если разные роли видят разные поля и действия?
- Как не размазать permission logic по всему frontend?
- Что делать, если форма очень большая, а пользователь может потерять сеть или закрыть вкладку?
- Как ты проектируешь autosave, optimistic UI и conflict handling для enterprise-форм?

## Что могут спросить по enterprise UX
- Как строить сложные таблицы, фильтры и bulk actions без деградации производительности?
- Что делать, если один экран зависит от нескольких долгих API?
- Как показывать частичные ошибки, не ломая весь flow?
- Как проектировать loading / retry / stale-state UX для операторов, которым нужно работать быстро?
- Как бы ты объяснил продукту разницу между "удобно прямо сейчас" и "безопасно для критического процесса"?

## Что могут спросить по compliance и traceability
- Как бы ты обеспечил понятную историю изменений записи?
- Что должно логироваться на frontend, а что только на backend?
- Как проектировать idempotent UI-действия для операций, которые нельзя случайно выполнить дважды?
- Что делать с подтверждением опасных действий: delete, approve, submit final report?
- Как бы ты проектировал экспорт, attachments, generated documents и их статусы?

## Что сильный ответ должен содержать
- разделение draft state, server state и audit events
- явные permission boundaries, а не десятки inline if по роли
- graceful degradation при плохой сети или медленных background processes
- UX, который не скрывает важные system states: pending, failed, partially saved, locked by another user`,
      examples: [
        {
          title: 'RBAC + approval workflow: ответная рамка',
          language: 'text',
          code: `1. Как проектировать approval flow?
Я бы разделил:
- editable draft
- server-side validation
- role-based transitions
- audit history отдельных событий

2. Где жить permission logic?
Не в разрозненных if по компонентам, а в явной policy/model layer:
- capability map
- route guards
- action guards
- сервер как финальный источник истины

3. Что важно для критичного UX?
- draft save
- recoverable errors
- понятный status model
- защита от double submit
- явные destructive confirmations`,
        },
        {
          title: 'Domain scenario: плохая сеть и длинный workflow',
          language: 'text',
          code: `Сильный ответ:

- сначала определить, какие шаги можно сохранить как draft локально или на сервере
- отделить "данные введены" от "операция подтверждена системой"
- показывать sync state явно: saved, saving, failed, retrying
- делать операции идемпотентными там, где возможен повторный submit
- предусмотреть конфликт, если запись уже изменилась другим пользователем
- договориться с backend о versioning / revision / updatedAt semantics`,
        },
      ],
    },
    {
      id: 'step-3-platform-delivery',
      title: 'Step 3: CI/CD + Platform',
      description: 'GitHub Actions, Azure Pipelines, Kubernetes, Terraform и безопасный delivery под разговор с лидом и архитектором',
      explanation: `По стеку вакансии это явный хвост **третьего этапа**. Даже если ты не daily owner инфраструктуры, team lead и architect часто проверяют, понимаешь ли ты безопасный delivery и platform boundaries.

## Что могут спросить по GitHub Actions и Azure Pipelines
- Из чего состоит pipeline: stages, jobs, steps, dependencies?
- Чем cache отличается от artifacts?
- Когда использовать matrix build?
- Какие шаги обязательны для frontend CI: install, typecheck, lint, test, build, e2e smoke?
- Что должно быть blocking, а что informational?
- Как ты публикуешь screenshots, videos, traces и coverage?
- Как организовать secrets, environments и approvals?
- Как избежать "works on my machine" в CI?
- Что бы ты вынес в reusable workflow или pipeline template?
- Когда self-hosted runner оправдан, а когда лучше hosted?

## Что могут спросить по Kubernetes
- Чем Deployment отличается от Pod?
- Что такое rolling update простыми словами?
- Зачем readiness probe и чем она отличается от liveness?
- Что произойдёт, если новый pod стартует медленно?
- Где хранить config, secrets и feature flags?
- Как frontend или BFF переживает rollout backend новой версии?
- Что значит zero-downtime deployment и какие условия нужны на практике?

## Что могут спросить по Terraform
- Зачем Terraform state и почему его нельзя править вручную как обычный JSON?
- Что такое remote backend и зачем locking?
- Чем plan отличается от apply?
- Что такое drift и как его замечать?
- Когда использовать modules?
- Почему важно держать one-to-one mapping между config и real resources?

## Что могут спросить по cloud delivery в целом
- Как ты организуешь preview environments для PR?
- Как катить frontend и backend независимо без breaking window?
- Что делать, если rollout уже пошёл и метрики ухудшились?
- Какие сигналы ты смотришь после deploy: error rate, latency, logs, synthetic smoke?
- Как бы ты объяснил rollback policy не-инфраструктурному человеку?

## Что полезно проговорить
- cache ускоряет будущие прогоны, artifact переносит результат конкретного job/run
- readiness защищает трафик от "ещё не готового" экземпляра
- Terraform state нужен не только для id ресурсов, но и для зависимостей и корректного плана
- безопасный delivery почти всегда держится на backward compatibility, observability и быстром rollback`,
      examples: [
        {
          title: 'CI/CD: короткая ответная рамка',
          language: 'text',
          code: `1. Что должно быть в frontend pipeline?
- install dependencies
- typecheck
- lint
- unit/integration tests
- build
- e2e smoke на критическом happy path

2. Cache vs artifacts?
Cache нужен, чтобы ускорять будущие pipeline runs, например reuse npm cache.
Artifact нужен, чтобы сохранить результат конкретного run: build output, trace, screenshot, coverage report.

3. Что должно блокировать merge?
То, что даёт высокий signal-to-noise и реально защищает main:
- typecheck
- build
- стабильные tests
- минимальный smoke

4. Что делать при flaky checks?
Сначала локализовать причину, потом временно понизить вес нестабильного check, но не делать вид, что проблемы нет.`,
        },
        {
          title: 'Kubernetes + Terraform: что хотят услышать',
          language: 'text',
          code: `1. Rolling update
Это поэтапная замена старых pod-ов новыми, чтобы не ронять сервис целиком.

2. Readiness vs liveness
Readiness отвечает на вопрос "можно ли уже слать трафик?".
Liveness отвечает на вопрос "процесс вообще жив или его пора перезапустить?".

3. Зачем Terraform state?
Он связывает код с реальными ресурсами, хранит метаданные и помогает Terraform понимать,
что нужно создать, обновить или удалить.

4. Почему remote state и locking важны?
Чтобы команда не применяла изменения одновременно и не ломала соответствие между config и инфраструктурой.

5. Какой принцип rollout самый важный для full stack команды?
Frontend и backend должны быть совместимы в переходный период, иначе даже идеальный deploy процесс не спасёт от contract break.`,
        },
      ],
    },
    {
      id: 'step-3-scenarios',
      title: 'Step 3: Scenario Questions',
      description: 'Реалистичные кейсы, которые любят давать лиды и архитекторы вместо прямой теории',
      explanation: `Финальный этап часто идёт не по списку терминов, а через ситуации. Ниже самые правдоподобные сценарии именно под эту вакансию.

## Сценарии про frontend
- После релиза форма стала медленной на больших datasets. Как ищешь bottleneck?
- Таблица на 10 000 строк тормозит при фильтрации. Что делаешь первым?
- Дизайнеры требуют сложные анимации, а e2e стали flaky. Как решаешь конфликт?
- Product хочет "быстрый фикс", но он ломает типовую модель и API boundary. Как поступишь?

## Сценарии про backend / contracts
- Backend внезапно меняет enum и frontend падает. Как страхуешься от такого заранее?
- API возвращает частично несовместимые payloads в зависимости от роли. Как организуешь типы и guards?
- Очередь прислала duplicate message и UI получил двойную запись. Где искать защиту?
- Репорт генерируется 10 минут. Как бы ты спроектировал UX, polling / push и retry-поведение?

## Сценарии про delivery
- В squad два фронтендера, один backend, сроки жёсткие. Как режешь scope?
- Ты видишь, что задача недооценена вдвое. Когда и как эскалируешь?
- E2E нестабильны, а релиз завтра. Что убираешь, а что оставляешь обязательно?
- Несколько команд меняют shared UI-kit одновременно. Как управляешь риском?

## Что обычно отличает сильный ответ
- ты разделяешь immediate mitigation и long-term fix
- называешь, какие метрики или логи тебе нужны
- умеешь сузить проблему до гипотез
- не обещаешь "починить всё", а ставишь порядок действий`,
      examples: [
        {
          title: 'Инцидент: flaky Playwright tests',
          language: 'text',
          code: `Хороший ответ:

1. Проверяю, flaky ли это действительно UI timing issue, а не env / data problem.
2. Смотрю traces, screenshots, network и console с first retry.
3. Убираю sleep и перехожу на user-facing locators + web-first assertions.
4. Проверяю test isolation: shared account, shared DB state, race between tests.
5. Отдельно решаю, какой coverage должен блокировать release, а какой может идти как non-blocking signal.`,
        },
        {
          title: 'Сценарий: backend contract drift',
          language: 'text',
          code: `Вопрос: "Backend меняет ответ, frontend сломался. Что делаешь?"

Сильный ответ:
- сначала локализую blast radius
- включаю graceful fallback / feature flag, если возможно
- подтверждаю, что это именно contract drift, а не parsing bug
- добавляю contract tests / schema diff / generated client validation
- договариваюсь о backward-compatible rollout policy
- фиксирую правило через ADR или squad agreement`,
        },
      ],
    },
    {
      id: 'english-behavioral',
      title: 'English + Behavioral',
      description: 'Вопросы на коммуникацию, ownership, squad work и delivery на английском',
      explanation: `В вакансии отдельно акцентированы **strong English communication**, cross-functional squads, accountability и follow-through. Это значит, что даже технический лидерский этап легко уйдёт в коммуникационные кейсы.

## Что могут спросить на английском
- Tell me about yourself and your recent React-heavy project.
- Describe a difficult technical decision you made and the trade-off behind it.
- Tell me about a time when you disagreed with a backend engineer or product manager.
- How do you handle ambiguous requirements?
- How do you make sure a feature is delivered on time?
- Tell me about a bug or incident that was your responsibility.
- How do you mentor less experienced engineers?
- How do you decide what to test on unit, integration and e2e levels?
- How do you work in a cross-functional squad with product and design?
- What do you do when you realize the original estimate was wrong?

## Что хотят услышать
- ownership без hero syndrome
- ясную коммуникацию, а не поток деталей
- умение признавать риск рано
- способность спорить по делу и не ломать collaboration
- привычку доводить задачу до shipped-result, а не только до "код написан"

## Хорошая рамка ответа
- Situation
- Task
- Action
- Result
- What you learned

## Что лучше не делать
- не винить других команд
- не отвечать слишком абстрактно
- не уходить в 10 минут технических деталей без результата
- не говорить "I always..." и "I never..." там, где важен контекст`,
      examples: [
        {
          title: '60-second self-intro',
          language: 'text',
          code: `I am a senior frontend engineer with a strong React and TypeScript background.
In the last few years I worked mostly on complex product interfaces where performance,
state management, API integration, and delivery quality were critical.

I am most useful when a team needs someone who can both implement and structure:
break down features, clarify contracts with backend, improve test reliability,
and help ship changes without creating long-term chaos.

I also enjoy working in cross-functional squads because a lot of product quality
comes from good collaboration, not only from good code.`,
        },
        {
          title: 'STAR answer skeleton',
          language: 'text',
          code: `Question: "Tell me about a time you had a disagreement in the team."

S — We were building a new workflow and frontend and backend had different assumptions about the API contract.
T — My responsibility was to help the team converge without blocking delivery.
A — I wrote down the conflicting assumptions, proposed two contract options, explained the impact on rollout and testability, and aligned with backend and product on the safer option.
R — We avoided a breaking release, shipped on time, and added a clearer API contract review step for future work.
Learned — Early clarification is much cheaper than late debugging.`,
        },
      ],
    },
    {
      id: 'interview-plan',
      title: 'План подготовки на 2 этапа',
      description: 'Как быстро разложить подготовку именно под Step 2 и Step 3',
      explanation: `Ниже не теория, а **практический prep-plan** под это интервью.

## За 1 день до Step 2
- проговорить вслух React render/commit, hooks order, stale closure, context, transitions
- повторить TypeScript generics, narrowing, utility types, typing API responses
- открыть 2-3 своих реальных примера Playwright тестов и объяснить, почему они стабильны или нестабильны
- повторить OpenAPI основы: paths, schemas, requestBody, responses, auth
- быть готовым объяснить один реальный performance bug и один testing bug

## За 1 день до Step 3
- подготовить 2 system design stories из своего опыта
- подготовить 2 delivery stories: когда сроки были плохими и когда требования были мутными
- подготовить 1 conflict-resolution story и 1 mentoring story
- продумать, как ты объяснишь архитектуру frontend для enterprise SaaS
- продумать, как ты работаешь с rollout, CI/CD, feature flags и backward compatibility

## Что повторить в последнюю очередь
- свои реальные проекты
- trade-offs, а не определения
- английские ответы на 6-8 типовых вопросов

## Что повышает шанс пройти
- короткие и структурные ответы
- явные trade-offs
- конкретные примеры из практики
- спокойное признание границ знания: "I have not owned that layer directly, but this is how I would reason about it."`,
      examples: [
        {
          title: 'Step 2: чек-лист за 30 минут',
          language: 'text',
          code: `1. React render/commit/Fiber/key
2. useEffect / useLayoutEffect / useEffectEvent
3. useTransition / useDeferredValue
4. TypeScript generics / unions / utility types
5. Playwright locators / auto-wait / traces / fixtures
6. OpenAPI paths / schemas / auth / breaking changes
7. Один real-world bug story
8. Один performance story`,
        },
        {
          title: 'Step 3: чек-лист за 30 минут',
          language: 'text',
          code: `1. Как проектировать frontend для enterprise SaaS
2. Как резать scope и управлять риском
3. Как договариваться о contracts между squads
4. Как строить quality strategy
5. Как деплоить безопасно и backward-compatible
6. Две STAR stories на английском
7. Один пример disagreement
8. Один пример ownership / follow-through`,
        },
      ],
    },
  ],
}
