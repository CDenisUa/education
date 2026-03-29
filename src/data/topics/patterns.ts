// Types
import type { Topic } from '@/types'

export const patternsTopic: Topic = {
  id: 'patterns',
  title: 'Patterns',
  icon: '🧩',
  description: 'SOLID, React common patterns, OOP, presentation patterns и инженерные эвристики',
  sections: [
    {
      id: 'engineering-principles',
      title: 'Engineering Principles',
      description: 'DRY, KISS, YAGNI, Separation of Concerns, Composition over Inheritance и Guard Clauses',
      explanation: `Паттерны полезны только тогда, когда они **снижают сложность**, а не создают новую. Поэтому сначала стоит держать в голове базовые инженерные принципы.

## DRY
- не "вынеси любой повтор в helper", а "не дублируй знание"
- если правило валидации, маппинг статуса или контракт API живут в трёх местах, код начнёт расходиться
- если две функции похожи синтаксически, но решают разные задачи, иногда лучше оставить их раздельно

## KISS
- сложность должна окупаться
- если задачу можно решить двумя прозрачными ветками вместо "универсального движка", обычно выигрывает простое решение
- KISS особенно важен в UI, где слишком абстрактные компоненты быстро становятся нечитаемыми

## YAGNI
- не строим абстракцию "на вырост", если текущая задача её не требует
- часто вреднее заранее делать "универсальный" form engine или generic repository, чем написать конкретную реализацию под текущий use case
- YAGNI не запрещает рефакторинг, он запрещает преждевременную сложность

## Separation of Concerns
- UI-компонент отвечает за отображение и события
- domain/use-case слой отвечает за правила
- data/access слой отвечает за HTTP, БД, cache, broker
- чем меньше слой знает о деталях соседнего слоя, тем проще менять систему

## Composition over Inheritance
- в frontend почти всегда лучше композиция: \`Dialog\` + \`Dialog.Header\` + \`Dialog.Body\`, а не дерево наследования
- на backend композиция тоже чаще выигрывает: сервис получает policy/adapter/validator через зависимости, а не наследуется от гигантского базового класса

## Guard Clauses / Return First
- ранний выход убирает лишнюю вложенность
- код легче читать сверху вниз: плохой путь отсекается сразу, основной остаётся плоским
- особенно полезно в validation, handlers, controller actions и React render-ветках

## Command Query Separation
- функция либо меняет состояние, либо возвращает данные
- смешение query и side effects усложняет отладку и тесты
- полезно и для frontend helpers, и для backend services`,
      examples: [
        {
          title: 'Frontend: return first + derived state',
          language: 'tsx',
          code: `type UserCardProps = {
  user: {
    name: string
    email?: string
    status: 'active' | 'blocked'
  } | null
  isLoading: boolean
}

export function UserCard({ user, isLoading }: UserCardProps) {
  if (isLoading) {
    return <p>Loading user...</p>
  }

  if (!user) {
    return <p>User not found</p>
  }

  const statusLabel =
    user.status === 'active' ? 'Active account' : 'Blocked account'

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email ?? 'No email provided'}</p>
      <strong>{statusLabel}</strong>
    </section>
  )
}

// Здесь нет лишней вложенности и нет отдельного state
// для statusLabel: он вычисляется прямо в render.`,
        },
        {
          title: 'Backend: KISS + SoC + no premature abstraction',
          language: 'python',
          code: `from dataclasses import dataclass

@dataclass
class ReportPayload:
    title: str
    severity: str


class ReportValidator:
    def validate(self, payload: ReportPayload) -> None:
        if not payload.title.strip():
            raise ValueError("title is required")
        if payload.severity not in {"low", "medium", "high"}:
            raise ValueError("invalid severity")


class ReportRepository:
    def save(self, payload: ReportPayload) -> dict:
        return {"id": "rep-42", "title": payload.title, "severity": payload.severity}


class ReportService:
    def __init__(self, validator: ReportValidator, repository: ReportRepository) -> None:
        self.validator = validator
        self.repository = repository

    def create_report(self, payload: ReportPayload) -> dict:
        self.validator.validate(payload)
        return self.repository.save(payload)

# Здесь нет "универсального BaseService", потому что он пока не нужен.
# Каждый объект отвечает за одну вещь.`,
        },
      ],
    },
    {
      id: 'solid',
      title: 'SOLID',
      description: 'S, O, L, I, D с примерами на frontend и backend',
      explanation: `SOLID полезно воспринимать не как священный ритуал, а как **набор тестов на здравый смысл**. Если код сложно менять, трудно покрывать тестами и страшно расширять, обычно где-то нарушен один из принципов.

## S — Single Responsibility Principle
- модуль должен иметь одну причину для изменения
- React-компонент не должен одновременно рендерить UI, ходить в API, валидировать бизнес-правила и логировать аналитику
- backend-класс не должен одновременно знать HTTP, SQL и billing logic

## O — Open/Closed Principle
- код открыт для расширения, но закрыт для переписывания ядра при каждом новом кейсе
- вместо \`if/else\` на 20 веток лучше использовать strategy map, policy objects или adapter registry
- на frontend это видно в notification renderers, cell renderers, filters, payment methods

## L — Liskov Substitution Principle
- потомок должен вести себя как корректная замена базового типа
- если класс "наследуется", но ломает ожидания клиента, иерархия плохая
- на практике это часто сигнал "нужно не наследование, а композиция"

## I — Interface Segregation Principle
- интерфейсы должны быть узкими и целевыми
- frontend hook не должен возвращать 15 методов "на всякий случай"
- backend service contract не должен заставлять клиента зависеть от неиспользуемых методов

## D — Dependency Inversion Principle
- высокоуровневая логика зависит от абстракций, а не от деталей
- use case знает про \`PaymentGateway\`, а не про конкретный Stripe SDK
- React-компонент знает про \`loadUsers()\`, а не про детали fetch, headers и retry policy

## Как использовать SOLID без фанатизма
- не дробить код ради самих классов и интерфейсов
- сначала понять точку изменения: что в системе меняется чаще всего
- если абстракция не делает код проще для изменения и тестирования, она лишняя`,
      examples: [
        {
          title: 'Frontend: SOLID на TypeScript',
          language: 'tsx',
          code: `type ToastKind = 'success' | 'error' | 'warning'

type Toast = {
  kind: ToastKind
  message: string
}

interface ToastRenderer {
  render(toast: Toast): React.ReactNode
}

class SuccessToastRenderer implements ToastRenderer {
  render(toast: Toast) {
    return <div className="border border-emerald-500">{toast.message}</div>
  }
}

class ErrorToastRenderer implements ToastRenderer {
  render(toast: Toast) {
    return <div className="border border-rose-500">{toast.message}</div>
  }
}

const renderers: Record<ToastKind, ToastRenderer> = {
  success: new SuccessToastRenderer(),
  error: new ErrorToastRenderer(),
  warning: {
    render(toast) {
      return <div className="border border-amber-500">{toast.message}</div>
    },
  },
}

export function ToastView({ toast }: { toast: Toast }) {
  return <>{renderers[toast.kind].render(toast)}</>
}

// SRP: ToastView только выбирает renderer
// OCP: новый kind добавляется новым renderer
// DIP: UI зависит от интерфейса ToastRenderer, а не от деталей реализации`,
        },
        {
          title: 'Backend: SOLID на Python',
          language: 'python',
          code: `from typing import Protocol


class PaymentGateway(Protocol):
    def charge(self, amount_cents: int, token: str) -> str: ...


class StripeGateway:
    def charge(self, amount_cents: int, token: str) -> str:
        return f"stripe:{amount_cents}:{token}"


class CheckoutService:
    def __init__(self, gateway: PaymentGateway) -> None:
        self.gateway = gateway

    def checkout(self, amount_cents: int, token: str) -> str:
        if amount_cents <= 0:
            raise ValueError("amount must be positive")
        return self.gateway.charge(amount_cents, token)

# DIP: CheckoutService не зависит от конкретного SDK
# ISP: контракт маленький - только charge
# OCP: можно подставить другой gateway без переписывания use case`,
        },
      ],
    },
    {
      id: 'react-common-patterns',
      title: 'React Common Patterns',
      description: 'Custom hooks, lifting state, controlled/uncontrolled, compound, headless, render props и HOC',
      explanation: `У React есть несколько повторяющихся паттернов. На интервью важно не просто перечислить их, а понимать **когда какой выгоднее**.

## Custom Hooks
- выносят переиспользуемую stateful logic
- хороший hook решает конкретную задачу: \`useDebouncedValue\`, \`useInfiniteScroll\`, \`usePermission\`
- hook не должен становиться "магическим мешком" со слишком общим API

## Lifting State Up
- если два дочерних компонента должны видеть один и тот же источник истины, состояние поднимают в ближайшего общего родителя
- это базовый и часто самый простой паттерн синхронизации UI

## Controlled vs Uncontrolled
- controlled input хранит значение в React state
- uncontrolled input опирается на DOM/ref
- controlled удобен для бизнес-логики, uncontrolled иногда выгоднее для простых форм и интеграции с form libraries

## Compound Components
- группа компонентов с общим контекстом: \`Tabs\`, \`Tabs.List\`, \`Tabs.Trigger\`, \`Tabs.Content\`
- плюс: выразительный API
- риск: если внутренняя связность слишком большая, отладка становится сложнее

## Headless Components
- компонент отдаёт поведение и state, а внешний слой управляет внешним видом
- особенно хорошо работает для dropdown, combobox, dialog, tooltip, date picker

## Render Props и HOC
- это не "запрещённые" паттерны, но в современном React чаще выигрывают hooks и composition
- HOC всё ещё встречается в legacy code, analytics wrappers, auth guards, feature flags
- render props полезно знать, потому что они объясняют, как раньше делили логику до custom hooks

## Container / Presentational
- сегодня это скорее эвристика, чем строгий паттерн
- полезна как способ не смешивать orchestration с rendering logic`,
      examples: [
        {
          title: 'Custom hook + headless component',
          language: 'tsx',
          code: `function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(value => !value),
  }
}

type DisclosureProps = {
  title: string
  children: React.ReactNode
}

export function Disclosure({ title, children }: DisclosureProps) {
  const { isOpen, toggle } = useDisclosure()

  return (
    <section>
      <button type="button" onClick={toggle}>
        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </section>
  )
}`,
        },
        {
          title: 'Legacy pattern: HOC и render props',
          language: 'tsx',
          code: `function withFeatureFlag<TProps>(
  Component: React.ComponentType<TProps>,
  featureName: string,
) {
  return function WrappedComponent(props: TProps) {
    const isEnabled = useFeatureFlag(featureName)
    if (!isEnabled) {
      return null
    }
    return <Component {...props} />
  }
}

function MouseTracker({
  render,
}: {
  render: (position: { x: number; y: number }) => React.ReactNode
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div
      onMouseMove={(event) => {
        setPosition({ x: event.clientX, y: event.clientY })
      }}
    >
      {render(position)}
    </div>
  )
}`,
        },
      ],
    },
    {
      id: 'flux-and-state-patterns',
      title: 'Flux and State Patterns',
      description: 'Unidirectional data flow, reducer pattern, store boundaries и action-driven updates',
      explanation: `Flux важен не потому, что нужно механически учить названия \`dispatch\` и \`store\`, а потому что он объясняет **как не потерять контроль над состоянием** в большом UI.

<img src="/images/diagrams/flux-cycle.svg" alt="Flux / unidirectional data flow" />

## Суть Flux
- UI не мутирует state напрямую
- пользовательское действие превращается в action
- action обрабатывается в одном понятном месте
- UI рендерится из нового state snapshot

## Что это даёт
- предсказуемость
- replay/debugging через action log
- понятные точки изменения состояния
- меньше хаоса, чем при "каждый компонент меняет всё сам"

## Reducer Pattern
- reducer принимает \`state\` и \`action\`, возвращает новый \`state\`
- это удобно, когда переходов состояния много и они должны быть явно перечислены
- reducer не должен содержать HTTP-запросы и побочные эффекты

## Где здесь React
- \`useReducer\` даёт локальный flux-style state
- Context + reducer даёт lightweight global store
- Redux formalizes same idea
- Zustand проще по API, но всё равно выигрывает от явных action boundaries

## Что часто идёт не так
- store превращается в свалку всего приложения
- action names слишком низкоуровневые и не отражают бизнес-смысл
- derived data хранится в state вместо selectors
- side effects смешиваются с reducer logic

## Практический вывод
- локальный state оставляй локальным
- общий store вводи, когда состояние реально разделяется между несколькими зонами приложения
- action-имена лучше делать на языке продукта: \`reportApproved\`, \`filtersChanged\`, \`draftSaved\``,
      examples: [
        {
          title: 'Context + reducer store',
          language: 'tsx',
          code: `type FiltersState = {
  query: string
  onlyActive: boolean
}

type FiltersAction =
  | { type: 'queryChanged'; query: string }
  | { type: 'onlyActiveToggled' }
  | { type: 'reset' }

const initialState: FiltersState = {
  query: '',
  onlyActive: false,
}

function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case 'queryChanged':
      return { ...state, query: action.query }
    case 'onlyActiveToggled':
      return { ...state, onlyActive: !state.onlyActive }
    case 'reset':
      return initialState
  }
}

const FiltersContext = createContext<{
  state: FiltersState
  dispatch: React.Dispatch<FiltersAction>
} | null>(null)`,
        },
        {
          title: 'Selectors and derived data',
          language: 'typescript',
          code: `type Report = {
  id: string
  title: string
  status: 'draft' | 'approved'
}

type ReportsState = {
  items: Report[]
  selectedStatus: 'all' | 'draft' | 'approved'
}

function selectVisibleReports(state: ReportsState) {
  if (state.selectedStatus === 'all') {
    return state.items
  }

  return state.items.filter(report => report.status === state.selectedStatus)
}

// visibleReports не нужно хранить в state,
// потому что это derived data из items + selectedStatus.`,
        },
      ],
    },
    {
      id: 'presentation-patterns',
      title: 'MVC, MVP, MVVM',
      description: 'Разница между presentation patterns и их связь с React',
      explanation: `Эти паттерны появились раньше React, но на интервью их всё ещё любят спрашивать, потому что они показывают, умеешь ли ты **разделять UI, состояние и координацию**.

<img src="/images/diagrams/presentation-patterns.svg" alt="MVC MVP MVVM comparison" />

## MVC
- Model хранит данные и правила
- View показывает UI
- Controller обрабатывает input и координирует работу
- хорошо ложится на серверные web frameworks и часть desktop UI

## MVP
- Presenter активнее управляет View
- View обычно максимально "тупая"
- удобно там, где хочется очень явного orchestration и высокой тестируемости presenter-логики

## MVVM
- ViewModel подготавливает данные и команды для View
- binding синхронизирует View и ViewModel
- особенно естественен для платформ с мощным data binding

## Где здесь React
- React сам по себе не MVC framework
- React-компонент чаще играет роль View
- custom hooks, container components, reducers и services часто берут на себя часть Presenter/ViewModel responsibilities
- поэтому в React разговор обычно идёт не "мы пишем MVVM", а "мы отделяем rendering от orchestration и data access"

## Когда это полезно на практике
- если UI толстый и насыщен бизнес-правилами, полезно вынести orchestration в hook/service/view model слой
- если проект маленький, строгая терминология MVC/MVP/MVVM может только мешать
- важно не имя паттерна, а то, насколько понятны границы ответственности`,
      examples: [
        {
          title: 'React как View + ViewModel hook',
          language: 'tsx',
          code: `function useReportListViewModel() {
  const [query, setQuery] = useState('')
  const reports = useReportsQuery(query)

  return {
    query,
    setQuery,
    reports: reports.data ?? [],
    isLoading: reports.isLoading,
    isEmpty: !reports.isLoading && (reports.data?.length ?? 0) === 0,
  }
}

function ReportListScreen() {
  const vm = useReportListViewModel()

  return (
    <>
      <SearchInput value={vm.query} onChange={vm.setQuery} />
      {vm.isLoading ? <Spinner /> : <ReportTable reports={vm.reports} />}
    </>
  )
}`,
        },
        {
          title: 'MVP-style presenter separation',
          language: 'typescript',
          code: `interface LoginView {
  showLoading(): void
  showError(message: string): void
  navigateToDashboard(): void
}

class LoginPresenter {
  constructor(
    private view: LoginView,
    private authService: { login(email: string, password: string): Promise<void> },
  ) {}

  async submit(email: string, password: string) {
    this.view.showLoading()

    try {
      await this.authService.login(email, password)
      this.view.navigateToDashboard()
    } catch {
      this.view.showError('Invalid credentials')
    }
  }
}`,
        },
      ],
    },
    {
      id: 'oop-and-gof',
      title: 'OOP and Practical GoF',
      description: 'Инкапсуляция, абстракция, полиморфизм, плюс Strategy, Adapter, Facade, Factory и Observer',
      explanation: `OOP и классические GoF-паттерны полезны не как музей, а как словарь решений для повторяющихся задач.

## OOP short version
- инкапсуляция: объект скрывает детали и держит инварианты
- абстракция: клиент работает с понятным контрактом
- полиморфизм: разные реализации можно использовать одинаково
- наследование: самый опасный инструмент, применять осторожно

## Паттерны, которые реально встречаются
- Strategy: выбрать алгоритм по контексту
- Adapter: подогнать внешний API под свой контракт
- Facade: спрятать сложную подсистему за простым интерфейсом
- Factory: централизовать создание объектов/клиентов
- Observer / Pub-Sub: подписки на события

## Где это видно во frontend
- Strategy для cell renderers, formatter-ов, payment methods
- Adapter для browser APIs, third-party widgets, generated clients
- Facade вокруг analytics/sdk/storage
- Observer в event bus, websocket subscriptions, external stores

## Где это видно на backend
- Strategy для pricing/payment/routing policies
- Factory для gateways, db clients, serializers
- Adapter для внешних API и брокеров
- Facade для orchestration нескольких подсистем

## Anti-pattern warning
- не каждую функцию нужно превращать в класс
- если простая функция решает задачу лучше, оставляй функцию
- OOP полезно там, где действительно есть устойчивые контракты и состояния объектов`,
      examples: [
        {
          title: 'Frontend: adapter + facade',
          language: 'typescript',
          code: `type StorageApi = {
  get(key: string): string | null
  set(key: string, value: string): void
}

class BrowserStorageAdapter implements StorageApi {
  get(key: string) {
    return window.localStorage.getItem(key)
  }

  set(key: string, value: string) {
    window.localStorage.setItem(key, value)
  }
}

class SessionFacade {
  constructor(private storage: StorageApi) {}

  saveToken(token: string) {
    this.storage.set('auth_token', token)
  }

  readToken() {
    return this.storage.get('auth_token')
  }
}`,
        },
        {
          title: 'Backend: strategy + factory',
          language: 'python',
          code: `from typing import Protocol


class PricePolicy(Protocol):
    def calculate(self, base_price: int) -> int: ...


class StandardPolicy:
    def calculate(self, base_price: int) -> int:
        return base_price


class VipPolicy:
    def calculate(self, base_price: int) -> int:
        return int(base_price * 0.9)


def create_policy(user_role: str) -> PricePolicy:
    if user_role == "vip":
        return VipPolicy()
    return StandardPolicy()


def final_price(user_role: str, base_price: int) -> int:
    policy = create_policy(user_role)
    return policy.calculate(base_price)`,
        },
      ],
    },
  ],
}
