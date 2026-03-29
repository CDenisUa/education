// Types
import type { Topic } from '@/types'

export const typescriptTopic: Topic = {
  id: 'typescript',
  title: 'TypeScript',
  icon: 'TS',
  description: 'Типы, generics, utility types, tsconfig и практическая интеграция с React',
  sections: [
    {
      id: 'types-and-inference',
      title: 'Базовые типы и Inference',
      description: 'Аннотации, вывод типов, literal types, unknown, never и as const',
      explanation: `TypeScript добавляет статическую проверку типов поверх JavaScript и умеет **выводить типы автоматически**.

**Ключевые идеи:**
- типы полезнее всего на границах модулей и функций
- \`any\` отключает проверку и должен быть исключением
- \`unknown\` безопаснее для внешних данных, чем \`any\`
- \`never\` описывает невозможное состояние
- \`as const\` фиксирует литералы и делает объект readonly

## Когда писать тип явно
- публичный API функции
- возвращаемое значение сложной фабрики
- конфигурации и контракты между модулями
- места, где вывод типа становится слишком широким

## Когда можно довериться inference
- локальные переменные
- return type простых функций
- литералы внутри небольших вычислений`,
      examples: [
        {
          title: 'Примитивы, массивы и вывод типов',
          language: 'typescript',
          code: `const projectName = 'education'
// projectName: "education"

let requestCount = 0
// requestCount: number

const isReady = true
const tags = ['ts', 'types', 'tooling']
// tags: string[]

const coords: [number, number] = [48.2, 16.37]

function formatPrice(value: number, currency = 'EUR') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
  }).format(value)
}

const total = formatPrice(1299)
// total: string`,
        },
        {
          title: 'unknown, never, as const',
          language: 'typescript',
          code: `function parseJson(value: string): unknown {
  return JSON.parse(value)
}

const payload = parseJson('{"kind":"user","id":1}')

if (
  typeof payload === 'object' &&
  payload !== null &&
  'kind' in payload
) {
  console.log(payload.kind)
}

function fail(message: string): never {
  throw new Error(message)
}

const statusMap = {
  draft: 'Черновик',
  published: 'Опубликовано',
  archived: 'Архив',
} as const

type Status = keyof typeof statusMap
// "draft" | "published" | "archived"

const status: Status = 'published'`,
        },
      ],
    },
    {
      id: 'unions-and-narrowing',
      title: 'Union Types и Narrowing',
      description: 'typeof, in, discriminated unions и exhaustive checking',
      explanation: `Сильная сторона TypeScript — умение **сужать тип** по коду, который ты уже написал.

**Инструменты narrowing:**
- \`typeof\` для примитивов
- \`instanceof\` для классов
- \`in\` для проверки наличия свойства
- user-defined type guards
- discriminated unions через общее поле, например \`kind\`

## Практический паттерн
Лучше хранить состояние не как набор флагов, а как **объединение вариантов**. Тогда компилятор проверяет, что ты обработал каждый кейс.

## Exhaustive checking
Комбинация \`switch\` + \`never\` помогает ловить забытые ветки ещё на этапе сборки.`,
      examples: [
        {
          title: 'Базовое narrowing',
          language: 'typescript',
          code: `type InputValue = string | number | Date

function normalizeValue(value: InputValue): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return value.toFixed(2)
  }

  return value.toISOString()
}

type ApiError = { message: string; code: string }
type ApiSuccess = { data: { id: number; name: string } }

function handleResponse(response: ApiError | ApiSuccess) {
  if ('data' in response) {
    return response.data.name
  }

  return \`Ошибка: \${response.code}\`
}`,
        },
        {
          title: 'Discriminated union + never',
          language: 'typescript',
          code: `type RequestState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: string[] }
  | { kind: 'error'; message: string }

function assertNever(value: never): never {
  throw new Error(\`Unhandled case: \${JSON.stringify(value)}\`)
}

function renderState(state: RequestState) {
  switch (state.kind) {
    case 'idle':
      return 'Нажмите кнопку загрузки'
    case 'loading':
      return 'Загрузка...'
    case 'success':
      return state.data.join(', ')
    case 'error':
      return state.message
    default:
      return assertNever(state)
  }
}`,
        },
      ],
    },
    {
      id: 'functions-and-generics',
      title: 'Функции, Generics и keyof',
      description: 'Типизация функций, generic-параметры, constraints и переиспользуемый API',
      explanation: `TypeScript особенно полезен там, где один и тот же алгоритм должен работать с разными типами.

**Generics нужны, когда:**
- ты хочешь сохранить тип входа в выходе
- функция работает с коллекцией или контейнером
- API должен быть переиспользуемым, но строгим

## Constraints
\`extends\` позволяет ограничить generic и сказать компилятору: "мне нужен не любой тип, а тип с конкретной структурой".

## keyof
\`keyof T\` строит union из ключей объекта и отлично подходит для безопасного доступа к полям.`,
      examples: [
        {
          title: 'Типизация функций и callbacks',
          language: 'typescript',
          code: `type Formatter = (value: number) => string

const currencyFormatter: Formatter = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function mapValues<TInput, TOutput>(
  items: TInput[],
  transform: (item: TInput, index: number) => TOutput,
): TOutput[] {
  return items.map(transform)
}

const lengths = mapValues(['ts', 'react', 'next'], (item) => item.length)
// number[]`,
        },
        {
          title: 'Generics с constraints и keyof',
          language: 'typescript',
          code: `function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = {
  id: 1,
  name: 'Ada',
  role: 'admin',
}

const role = pluck(user, 'role')
// role: "admin"

function createCacheEntry<T extends { id: string | number }>(entity: T) {
  return {
    cacheKey: \`entity:\${entity.id}\`,
    entity,
  }
}

const entry = createCacheEntry({ id: '42', title: 'Type Safety' })`,
        },
      ],
    },
    {
      id: 'aliases-and-interfaces',
      title: 'Type Alias vs Interface',
      description: 'Композиция типов, extends, intersection и выбор между interface и type',
      explanation: `И \`interface\`, и \`type\` описывают форму данных, но у них разный фокус.

**Когда удобен interface:**
- публичный контракт объекта
- классы через \`implements\`
- расширение через \`extends\`
- декларативное описание API

**Когда удобен type:**
- union и intersection
- tuple
- utility-комбинации
- вычисляемые и условные типы

## Практическое правило
Для объектных контрактов команды часто выбирают \`interface\`, а для вычисляемых конструкций и union — \`type\`.`,
      examples: [
        {
          title: 'Interface и extends',
          language: 'typescript',
          code: `interface BaseEntity {
  id: string
  createdAt: string
}

interface User extends BaseEntity {
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

interface AdminUser extends User {
  permissions: string[]
}

const admin: AdminUser = {
  id: 'u_1',
  createdAt: new Date().toISOString(),
  email: 'admin@example.com',
  role: 'admin',
  permissions: ['users:read', 'users:write'],
}`,
        },
        {
          title: 'Type alias и intersections',
          language: 'typescript',
          code: `type ApiMeta = {
  requestId: string
  durationMs: number
}

type ApiSuccess<T> = {
  ok: true
  data: T
} & ApiMeta

type ApiFailure = {
  ok: false
  error: string
} & ApiMeta

type ApiResult<T> = ApiSuccess<T> | ApiFailure

type UserPreview = {
  id: string
  name: string
}

const result: ApiResult<UserPreview[]> = {
  ok: true,
  requestId: 'req_123',
  durationMs: 42,
  data: [{ id: 'u_1', name: 'Ada' }],
}`,
        },
      ],
    },
    {
      id: 'utility-types',
      title: 'Utility Types',
      description: 'Partial, Pick, Omit, Record, ReturnType, Parameters и Awaited',
      explanation: `Utility types позволяют **собирать новые типы из существующих**, не дублируя описание вручную.

## Самые полезные в реальной работе
- \`Partial<T>\` — все поля опциональны
- \`Required<T>\` — все поля обязательны
- \`Pick<T, K>\` — взять часть полей
- \`Omit<T, K>\` — исключить часть полей
- \`Record<K, V>\` — словарь по ключам
- \`Parameters<T>\`, \`ReturnType<T>\` — вытащить типы из функции
- \`Awaited<T>\` — распаковать Promise

## Зачем это нужно
Utility types особенно полезны для DTO, form state, cache layers и API-контрактов.`,
      examples: [
        {
          title: 'Работа с DTO и patch-обновлениями',
          language: 'typescript',
          code: `interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: string
}

type CreateUserInput = Omit<User, 'id' | 'createdAt'>
type UpdateUserInput = Partial<CreateUserInput>
type UserCard = Pick<User, 'id' | 'name' | 'role'>

const patch: UpdateUserInput = {
  name: 'Ada Lovelace',
}

const preview: UserCard = {
  id: 'u_1',
  name: 'Ada Lovelace',
  role: 'admin',
}`,
        },
        {
          title: 'Вывод типов из функций и Promise',
          language: 'typescript',
          code: `async function fetchUsers() {
  return [
    { id: 'u_1', name: 'Ada' },
    { id: 'u_2', name: 'Linus' },
  ]
}

type FetchUsersResult = Awaited<ReturnType<typeof fetchUsers>>
// { id: string; name: string }[]

function createUser(name: string, role: 'admin' | 'editor') {
  return { id: crypto.randomUUID(), name, role }
}

type CreateUserParams = Parameters<typeof createUser>
// [name: string, role: "admin" | "editor"]

type RoleMap = Record<'admin' | 'editor' | 'viewer', number>
const roleOrder: RoleMap = {
  admin: 1,
  editor: 2,
  viewer: 3,
}`,
        },
      ],
    },
    {
      id: 'advanced-types',
      title: 'Mapped, Conditional и Template Literal Types',
      description: 'Построение типов через вычисления, infer и преобразование ключей',
      explanation: `Продвинутые типы нужны тогда, когда типы становятся **частью архитектуры**, а не просто аннотациями.

## Что умеет продвинутый уровень
- mapped types проходят по ключам объекта
- conditional types выбирают результат по условию
- \`infer\` извлекает часть типа
- template literal types строят строки из частей

## Где это реально полезно
- typed events
- API-клиенты
- form builders
- адаптеры и schema-driven UI`,
      examples: [
        {
          title: 'Mapped types и изменение модификаторов',
          language: 'typescript',
          code: `type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Flags<T> = {
  [K in keyof T as \`is\${Capitalize<string & K>}\`]: boolean
}

type User = {
  readonly id: string
  readonly email: string
  role: 'admin' | 'editor'
}

type EditableUser = Mutable<User>
type UserFlags = Flags<{ active: true; verified: true }>

const flags: UserFlags = {
  isActive: true,
  isVerified: false,
}`,
        },
        {
          title: 'Conditional types, infer и event names',
          language: 'typescript',
          code: `type UnwrapPromise<T> = T extends Promise<infer TValue> ? TValue : T

type EventName<T extends Record<string, unknown>> =
  keyof {
    [K in keyof T as \`\${string & K}Changed\`]: T[K]
  }

type Settings = {
  theme: 'light' | 'dark'
  lang: 'ru' | 'en'
}

type SettingsEvent = EventName<Settings>
// "themeChanged" | "langChanged"

type ApiValue = UnwrapPromise<Promise<{ ok: true }>>
// { ok: true }`,
        },
      ],
    },
    {
      id: 'classes-and-oop',
      title: 'Классы, implements и abstract',
      description: 'Модификаторы доступа, readonly, abstract и типизация объектной модели',
      explanation: `TypeScript не заставляет использовать ООП, но делает классы заметно безопаснее.

**Важные инструменты:**
- \`public\`, \`private\`, \`protected\`
- parameter properties в конструкторе
- \`readonly\` для инвариантов
- \`implements\` для контракта
- \`abstract\` для базовых абстракций

## Когда классы действительно уместны
- доменные сущности
- сервисы с внутренним состоянием
- адаптеры и инфраструктурный код
- SDK и обёртки над API`,
      examples: [
        {
          title: 'Класс сервиса с инкапсуляцией',
          language: 'typescript',
          code: `interface Logger {
  log(message: string): void
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(\`[LOG] \${message}\`)
  }
}

class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly logger: Logger,
  ) {}

  async get<T>(path: string): Promise<T> {
    this.logger.log(\`GET \${path}\`)
    const response = await fetch(\`\${this.baseUrl}\${path}\`)
    return response.json() as Promise<T>
  }
}`,
        },
        {
          title: 'abstract class и наследование',
          language: 'typescript',
          code: `abstract class Repository<T extends { id: string }> {
  abstract findById(id: string): Promise<T | null>

  async require(id: string): Promise<T> {
    const entity = await this.findById(id)
    if (!entity) {
      throw new Error(\`Entity \${id} not found\`)
    }
    return entity
  }
}

type Article = { id: string; title: string }

class ArticleRepository extends Repository<Article> {
  private readonly data = new Map<string, Article>()

  async findById(id: string) {
    return this.data.get(id) ?? null
  }
}`,
        },
      ],
    },
    {
      id: 'tsconfig-and-modules',
      title: 'tsconfig, модули и import type',
      description: 'strict mode, moduleResolution, paths, declaration files и правильные импорты',
      explanation: `Большая часть пользы TypeScript приходит не только от аннотаций, но и от **строгой конфигурации компилятора**.

## Что обычно включают в production-проекте
- \`strict\`
- \`noUncheckedIndexedAccess\`
- \`exactOptionalPropertyTypes\`
- \`noImplicitOverride\`
- \`moduleResolution: "bundler"\` для современных сборщиков

## import type
Используй \`import type\`, когда нужен только тип. Это делает намерение очевидным и упрощает tree-shaking.

## Паттерн
Конфиг должен усиливать архитектуру проекта, а не просто удовлетворять компилятор.`,
      examples: [
        {
          title: 'Практичный tsconfig.json',
          language: 'json',
          code: `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "next-env.d.ts"]
}`,
        },
        {
          title: 'Модули, import type и декларации',
          language: 'typescript',
          code: `import { createClient } from '@/lib/api'
import type { User, ApiResponse } from '@/types'

export async function loadUser(id: string): Promise<User> {
  const client = createClient()
  const response = await client.get<ApiResponse<User>>(\`/users/\${id}\`)
  return response.data
}

// globals.d.ts
declare global {
  interface Window {
    __APP_VERSION__: string
  }
}

// svg.d.ts
declare module '*.svg' {
  const src: string
  export default src
}`,
        },
      ],
    },
    {
      id: 'react-with-typescript',
      title: 'React + TypeScript',
      description: 'Props, события, hooks, discriminated unions и типизация компонентов',
      explanation: `В React TypeScript особенно полезен для **props, состояния, событий и асинхронных сценариев**.

## Хорошие практики
- типизируй публичные props компонента
- не аннотируй всё подряд, если inference уже справился
- для async state используй discriminated union
- для DOM событий используй типы из React: \`ChangeEvent\`, \`FormEvent\`, \`MouseEvent\`
- для wrapper-компонентов полезен \`ComponentProps\`

## Частая ошибка
Типизировать только happy-path и забывать про loading/error. TypeScript отлично помогает описать полный state machine UI.`,
      examples: [
        {
          title: 'Props, события и ComponentProps',
          language: 'tsx',
          code: `import type { ChangeEvent, ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
  loading?: boolean
}

function Button({ loading = false, children, ...props }: ButtonProps) {
  return (
    <button disabled={loading || props.disabled} {...props}>
      {loading ? 'Загрузка...' : children}
    </button>
  )
}

type SearchProps = {
  query: string
  onQueryChange(value: string): void
}

function SearchInput({ query, onQueryChange }: SearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value)
  }

  return <input value={query} onChange={handleChange} />
}`,
        },
        {
          title: 'Состояние запроса как union',
          language: 'tsx',
          code: `type User = {
  id: string
  name: string
}

type UserState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: User[] }
  | { kind: 'error'; message: string }

function UsersPanel() {
  const [state, setState] = useState<UserState>({ kind: 'idle' })

  async function loadUsers() {
    setState({ kind: 'loading' })
    try {
      const response = await fetch('/api/users')
      const data = (await response.json()) as User[]
      setState({ kind: 'success', data })
    } catch (error) {
      setState({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  if (state.kind === 'loading') return <p>Загрузка...</p>
  if (state.kind === 'error') return <p>{state.message}</p>
  if (state.kind === 'success') return <ul>{state.data.map(user => <li key={user.id}>{user.name}</li>)}</ul>

  return <button onClick={loadUsers}>Загрузить</button>
}`,
        },
      ],
    },
  ],
}
