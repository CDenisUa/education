// Types
import type { InterviewQuestion } from '@/types'

export const typescriptQuestions: InterviewQuestion[] = [
  {
    id: 'ts-unknown-vs-any',
    question: 'Чем unknown лучше any, и когда каждый из них допустим?',
    category: 'TypeScript',
    level: 'middle',
    terms: [
      {
        en: 'any',
        ru: 'any',
        description: 'Тип, который отключает проверку TypeScript. С ним можно делать что угодно, и компилятор не защитит от ошибки.',
      },
      {
        en: 'unknown',
        ru: 'unknown',
        description: 'Безопасный верхний тип. Значение можно принять, но нельзя использовать без явной проверки или narrowing.',
      },
      {
        en: 'Narrowing',
        ru: 'Сужение типа',
        description: 'Проверки, после которых TypeScript уточняет тип значения: typeof, in, instanceof, custom type guards.',
      },
    ],
    shortAnswer:
      'unknown лучше any на внешних границах системы: JSON, API, catch, localStorage, postMessage. any отключает type safety, а unknown заставляет тебя сначала проверить значение. any допустим только как временный мост в legacy-коде или там, где типизировать сейчас дороже, чем риск.',
    fullAnswer: `## Простая модель

\`any\` говорит компилятору: "не мешай, я сам".  
\`unknown\` говорит: "я пока не знаю, что это, сначала проверь".

## Почему unknown безопаснее

Если функция принимает \`any\`, ты можешь сразу вызвать у значения любой метод, обратиться к любому полю и получить падение уже во время выполнения.

С \`unknown\` это запрещено, пока ты не докажешь тип:

- проверкой \`typeof\`
- проверкой полей через \`in\`
- кастомным type guard
- валидатором схемы

## Где это важно на практике

Границы системы почти всегда ненадёжны:

- ответы API
- \`JSON.parse\`
- данные из браузерного storage
- ошибки в \`catch\`
- сообщения из очередей и websocket

Там \`unknown\` лучше отражает реальность: данные пришли, но им ещё нельзя доверять.

## Когда any всё же допустим

\`any\` можно терпеть в двух местах:

- временная миграция legacy-кода
- слой, где ты явно изолировал небезопасный код и не даёшь \`any\` вытекать дальше

На интервью сильный ответ обычно звучит так:  
"Я стараюсь держать \`unknown\` на внешних границах, быстро валидировать данные и уже после этого работать с нормальными доменными типами. \`any\` использую как технический долг, а не как норму."`,
    visual: `\`\`\`text
External data
     |
     v
  unknown
     |
  validate / narrow
     |
     v
Domain type
     |
safe business logic
\`\`\``,
    examples: [
      {
        title: 'unknown на границе API',
        language: 'ts',
        code: `type User = {
  id: string
  name: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  )
}

async function loadUser(): Promise<User> {
  const raw: unknown = await fetch('/api/user').then(r => r.json())

  if (!isUser(raw)) {
    throw new Error('Invalid user payload')
  }

  return raw
}`,
      },
    ],
  },
  {
    id: 'ts-narrowing-discriminated-union',
    question: 'Что такое narrowing и discriminated union, и почему они так полезны на real-world проектах?',
    category: 'TypeScript',
    level: 'middle',
    terms: [
      {
        en: 'Union type',
        ru: 'Объединение типов',
        description: 'Тип вида A | B | C. Значение может быть одним из нескольких вариантов.',
      },
      {
        en: 'Discriminant',
        ru: 'Дискриминатор',
        description: 'Общее поле, по которому удобно различать варианты union, например kind, type, status.',
      },
      {
        en: 'Exhaustive check',
        ru: 'Полная проверка вариантов',
        description: 'Подход, при котором компилятор помогает убедиться, что обработаны все ветки union.',
      },
    ],
    shortAnswer:
      'Narrowing — это уточнение типа после проверок. Discriminated union — union, в котором есть общее поле-дискриминатор, например kind. Это один из лучших способов моделировать request state, form state, workflow state и API responses без хрупких boolean-флагов.',
    fullAnswer: `## Что это решает

Без нормального union люди часто делают так:

- \`isLoading: boolean\`
- \`error?: string\`
- \`data?: T\`

Проблема в том, что такие поля легко приводят к нелегальным комбинациям:

- \`isLoading = true\` и одновременно \`data\` уже есть
- \`error\` есть, но UI почему-то показывает success

## Почему discriminated union лучше

Ты явно перечисляешь допустимые состояния:

- idle
- loading
- success
- error

И TypeScript знает, какие поля существуют в каждой ветке.

## Где это особенно полезно

- загрузка данных
- многошаговые формы
- approval workflow
- ответы OpenAPI-клиента
- reducer state

## Что важно проговорить на интервью

Сильная мысль такая:  
"Я стараюсь моделировать состояние так, чтобы невозможные состояния было трудно выразить типами. Discriminated union хорошо для этого подходит."

Это не про "красивые типы", а про снижение количества багов в UI-логике.`,
    visual: `\`\`\`text
RequestState
 ├─ { kind: 'idle' }
 ├─ { kind: 'loading' }
 ├─ { kind: 'success', data: User[] }
 └─ { kind: 'error', message: string }

switch (state.kind)
  -> TS понимает точный shape каждой ветки
\`\`\``,
    examples: [
      {
        title: 'Request state через discriminated union',
        language: 'ts',
        code: `type User = {
  id: string
  name: string
}

type RequestState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; data: User[] }
  | { kind: 'error'; message: string }

function renderState(state: RequestState) {
  switch (state.kind) {
    case 'idle':
      return 'Введите запрос'
    case 'loading':
      return 'Загрузка...'
    case 'success':
      return state.data.map(user => user.name).join(', ')
    case 'error':
      return state.message
    default: {
      const exhaustiveCheck: never = state
      return exhaustiveCheck
    }
  }
}`,
      },
    ],
  },
  {
    id: 'ts-generics-keyof',
    question: 'Зачем нужны generics, keyof и indexed access types, и где это реально помогает во frontend?',
    category: 'TypeScript',
    level: 'middle',
    terms: [
      {
        en: 'Generic',
        ru: 'Обобщённый тип',
        description: 'Шаблон типа, который работает с разными данными без потери точности.',
      },
      {
        en: 'keyof',
        ru: 'keyof',
        description: 'Оператор, который возвращает union всех ключей объекта.',
      },
      {
        en: 'Indexed access',
        ru: 'Доступ по индексу типа',
        description: 'Тип вида T[K], который позволяет получить тип конкретного свойства.',
      },
    ],
    shortAnswer:
      'Generics позволяют писать переиспользуемые функции и хуки без потери типов. keyof и T[K] особенно полезны для таблиц, форм, сортировок, generic-select компонентов и helper-функций, где нужно безопасно работать с ключами объекта.',
    fullAnswer: `## В чём главная польза generics

Без generic ты быстро приходишь к двум плохим вариантам:

- дублировать код под каждый тип
- скатываться в \`any\`

Generics позволяют сделать один reusable слой и сохранить точный контракт.

## Где это чаще всего всплывает

- generic data table
- form field helpers
- API wrappers
- custom hooks
- сортировки и фильтры по ключам

## Почему keyof важен

Он ограничивает список допустимых ключей.  
Это полезно там, где пользователь передаёт имя поля: сортировка по колонке, доступ к значению, generic map/filter helpers.

## Как это звучит на интервью

Хороший ответ обычно такой:  
"Я использую generics не ради абстракции ради абстракции, а когда у меня есть повторяющийся паттерн с одинаковым поведением и разными данными. Главное — не переусложнять API и не терять читаемость."`,
    examples: [
      {
        title: 'Generic helper с keyof',
        language: 'ts',
        code: `function sortBy<T, K extends keyof T>(
  items: T[],
  key: K,
): T[] {
  return [...items].sort((a, b) => {
    const left = a[key]
    const right = b[key]

    if (left === right) return 0
    return left > right ? 1 : -1
  })
}

const users = [
  { id: '1', name: 'Anna', age: 31 },
  { id: '2', name: 'Bohdan', age: 27 },
]

sortBy(users, 'name')
sortBy(users, 'age')
// sortBy(users, 'unknownKey') // ошибка компиляции`,
      },
    ],
  },
  {
    id: 'ts-interface-vs-type',
    question: 'Когда выбирать interface, а когда type?',
    category: 'TypeScript',
    level: 'middle',
    terms: [
      {
        en: 'Interface',
        ru: 'Интерфейс',
        description: 'Способ описывать shape объекта с поддержкой declaration merging и extends.',
      },
      {
        en: 'Type alias',
        ru: 'Псевдоним типа',
        description: 'Более общий механизм. Подходит не только для объектов, но и для union, tuple, primitive composition.',
      },
      {
        en: 'Declaration merging',
        ru: 'Слияние деклараций',
        description: 'Особенность interface, при которой одинаковые объявления могут объединяться.',
      },
    ],
    shortAnswer:
      'На практике я выбираю type по умолчанию, потому что он универсальнее: union, intersection, tuple, mapped types. interface использую, когда описываю публичный shape объекта или хочу явно показать объектный контракт. Главное не религиозно спорить, а держать стиль последовательным.',
    fullAnswer: `## Базовое правило

- \`type\` универсальнее
- \`interface\` чуть лучше читается как объектный контракт

## Где type удобнее

- union types
- intersection types
- utility composition
- function signatures
- tuple types

## Где interface уместен

- объектные контракты на уровне публичного API
- props-объекты, если в команде это стандарт
- случаи, где реально полезен \`extends\` и declaration merging

## Что важно на интервью

Сильный ответ не звучит как "interface всегда лучше" или "type всегда лучше".  
Лучше сказать так:

"Обе конструкции в большинстве everyday-case решают похожую задачу. Я смотрю на читаемость и стиль проекта. Для union и compositional typing почти всегда беру type. Для object contract могу использовать interface, если это делает код понятнее."`,
    examples: [
      {
        title: 'type и interface рядом',
        language: 'ts',
        code: `type RequestStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'

interface UserDto {
  id: string
  name: string
}

type UserCardProps = {
  user: UserDto
  status: RequestStatus
  onSelect(id: string): void
}`,
      },
    ],
  },
  {
    id: 'ts-utility-types',
    question: 'Какие utility types ты реально используешь каждый день и зачем?',
    category: 'TypeScript',
    level: 'middle',
    terms: [
      {
        en: 'Pick / Omit',
        ru: 'Pick / Omit',
        description: 'Позволяют собрать новый тип из части полей существующего типа.',
      },
      {
        en: 'Partial',
        ru: 'Partial',
        description: 'Делает все поля типа опциональными.',
      },
      {
        en: 'Record',
        ru: 'Record',
        description: 'Строит объект по набору ключей и единому типу значения.',
      },
      {
        en: 'Readonly',
        ru: 'Readonly',
        description: 'Помечает поля как только для чтения.',
      },
    ],
    shortAnswer:
      'Каждый день чаще всего нужны Pick, Omit, Partial, Record и иногда Readonly. Но важно не злоупотреблять ими. Utility types полезны, когда они отражают смысл модели, а не превращают типы в головоломку.',
    fullAnswer: `## Как я на это смотрю

Utility types нужны, чтобы не копировать shape руками и не разносить изменение одной модели по десяти местам.

## Самые полезные на практике

- \`Pick\` — взять безопасный поднабор полей
- \`Omit\` — исключить лишнее
- \`Partial\` — patch/update формы
- \`Record\` — словари и capability maps
- \`Readonly\` — защитить неизменяемые структуры

## Где легко ошибиться

Проблема начинается, когда тип получается настолько сложным, что его уже никто не читает.  
Если после трёх слоёв \`Omit<Pick<...>>\` тип становится неочевидным, лучше дать ему нормальное доменное имя.

## Хорошая формулировка на интервью

"Я использую utility types как инструмент нормализации модели, а не как способ показать фокус с TypeScript. Если тип перестаёт объяснять бизнес-смысл, я выношу его в именованный alias."`,
    examples: [
      {
        title: 'Utility types в API и UI модели',
        language: 'ts',
        code: `type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator'
  createdAt: string
}

type UserPreview = Pick<User, 'id' | 'name' | 'role'>
type UserPatch = Partial<Pick<User, 'name' | 'email' | 'role'>>
type UsersById = Record<string, User>

function updateUser(id: string, patch: UserPatch) {
  // отправляем только изменённые поля
}`,
      },
    ],
  },
  {
    id: 'ts-typing-react',
    question: 'Как типизировать props, callbacks, refs и DOM events в React без лишнего шума?',
    category: 'TypeScript',
    level: 'middle',
    terms: [
      {
        en: 'Props contract',
        ru: 'Контракт props',
        description: 'Тип, который описывает, что компонент принимает извне и какие инварианты ожидает.',
      },
      {
        en: 'SyntheticEvent',
        ru: 'Синтетическое событие React',
        description: 'React-обёртка вокруг браузерного события. Для input и form лучше использовать конкретные типы вроде ChangeEvent<HTMLInputElement>.',
      },
      {
        en: 'Ref',
        ru: 'Ссылка на DOM или instance',
        description: 'Механизм доступа к DOM-узлу или imperative API. Обычно типизируется как useRef<HTMLDivElement | null>(null).',
      },
    ],
    shortAnswer:
      'Обычно я типизирую props через обычный object type, callbacks через явные сигнатуры, refs через конкретный DOM type, а события через React.ChangeEvent / MouseEvent и похожие типы. Я стараюсь не тянуть React.FC без причины и не усложнять типы там, где достаточно прямого контракта.',
    fullAnswer: `## Принцип

Типы компонента должны помогать читать контракт, а не мешать.

## Что я делаю обычно

- props: обычный \`type Props = { ... }\`
- callbacks: явная сигнатура, например \`onSelect(id: string): void\`
- refs: \`useRef<HTMLButtonElement | null>(null)\`
- events: конкретный event type для нужного элемента

## Что часто лучше не делать

- не заворачивать всё в слишком общий generic без нужды
- не использовать \`any\` для events
- не брать \`React.FC\` просто по привычке

## Где это важно

На senior-интервью смотрят не на то, знаешь ли ты редкий utility type, а умеешь ли держать контракт компонента ясным и предсказуемым.

Если компонент трудно типизировать просто, это иногда сигнал, что он делает слишком много.`,
    examples: [
      {
        title: 'Типизация props, events и refs',
        language: 'tsx',
        code: `import { useRef } from 'react'
import type { ChangeEvent } from 'react'

type SearchInputProps = {
  value: string
  onValueChange(nextValue: string): void
}

export function SearchInput({ value, onValueChange }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onValueChange(event.target.value)
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      placeholder="Search..."
    />
  )
}`,
      },
    ],
  },
  {
    id: 'ts-tsconfig-strict',
    question: 'Что в tsconfig ты считаешь обязательным для production-проекта?',
    category: 'TypeScript',
    level: 'senior',
    terms: [
      {
        en: 'strict',
        ru: 'strict mode',
        description: 'Набор строгих проверок TypeScript, который делает типовую систему реально полезной.',
      },
      {
        en: 'noUncheckedIndexedAccess',
        ru: 'Проверка индексированного доступа',
        description: 'Добавляет undefined при доступе по индексу, если значение может отсутствовать.',
      },
      {
        en: 'exactOptionalPropertyTypes',
        ru: 'Точные optional properties',
        description: 'Отличает "поле отсутствует" от "поле равно undefined".',
      },
    ],
    shortAnswer:
      'База для production — strict, noImplicitOverride, noFallthroughCasesInSwitch и последовательный контроль за null/undefined. В более зрелом проекте я ещё смотрю на noUncheckedIndexedAccess и exactOptionalPropertyTypes. Главное не просто включить флаги, а пережить миграцию и не оставить проект в полустрогом состоянии.',
    fullAnswer: `## Минимум, без которого я бы не стартовал

- \`strict: true\`
- \`noFallthroughCasesInSwitch: true\`
- \`noImplicitOverride: true\`
- аккуратная работа с \`null\` и \`undefined\`

## Что даёт хороший эффект в зрелых проектах

- \`noUncheckedIndexedAccess\`
- \`exactOptionalPropertyTypes\`

Они сначала "болят", но потом ловят очень реальные ошибки на данных и конфигурации.

## На что я смотрю кроме флагов

- нет ли мест, где команда массово глушит ошибки \`as any\`
- реально ли проходят build и typecheck в CI
- есть ли policy на generated types и third-party typings

## Что важно озвучить на интервью

Сильный ответ — не список флагов, а мысль:

"TypeScript приносит пользу только если он встроен в delivery-процесс. Если strict выключен в половине репозитория, а CI не валит сборку, ощущение безопасности ложное."`,
    examples: [
      {
        title: 'Пример production-ориентированного tsconfig',
        language: 'json',
        code: `{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}`,
      },
    ],
  },
]

export const playwrightOpenApiQuestions: InterviewQuestion[] = [
  {
    id: 'pw-locators-auto-wait',
    question: 'Почему Playwright обычно стабильнее старых e2e-подходов, и зачем нужны locators с auto-wait?',
    category: 'Playwright',
    level: 'middle',
    terms: [
      {
        en: 'Locator',
        ru: 'Локатор',
        description: 'Объект Playwright для поиска элемента. Он переоценивается перед действием и лучше переживает изменения DOM.',
      },
      {
        en: 'Auto-wait',
        ru: 'Автоожидание',
        description: 'Playwright автоматически ждёт, пока элемент станет готов для действия: появится, станет видимым, доступным и т.д.',
      },
      {
        en: 'Browser context',
        ru: 'Изолированный контекст браузера',
        description: 'Отдельная среда с собственными cookies, storage и сессией. Помогает изолировать тесты.',
      },
    ],
    shortAnswer:
      'Playwright стабильнее, потому что он ближе к пользовательскому поведению: работает через locators, умеет auto-wait, лучше изолирует тесты через browser contexts и имеет хороший debugging toolkit. Локатор — это не просто CSS selector, а абстракция над элементом, которую Playwright переоценивает в момент действия.',
    fullAnswer: `## Где обычно ломались старые e2e-тесты

- element ещё не появился
- element есть, но не готов к клику
- тест использует слишком хрупкий selector
- два теста делят одну и ту же сессию или данные

## Что делает Playwright лучше

- ждёт готовность элемента автоматически
- поощряет user-facing locators вроде \`getByRole\`
- даёт isolation через contexts
- имеет trace viewer, network capture, screenshots, videos

## Почему это важно

Стабильность e2e почти никогда не достигается через \`waitForTimeout\`.  
Она достигается через:

- хороший selector strategy
- корректные ожидания
- изоляцию тестов
- воспроизводимый test data setup

## Что говорить на интервью

"Я стараюсь тестировать через то, что видит пользователь: role, label, text, status. И полагаюсь на встроенный auto-wait, а не на sleep. Тогда тесты лучше переживают реальные изменения интерфейса."`,
    visual: `\`\`\`text
test action
   |
   v
locator resolves element
   |
checks actionability
  - attached
  - visible
  - enabled
  - stable enough
   |
   v
perform click/fill/assertion
\`\`\``,
    examples: [
      {
        title: 'User-facing locator вместо brittle selector',
        language: 'ts',
        code: `import { test, expect } from '@playwright/test'

test('create permit draft', async ({ page }) => {
  await page.goto('/permits')

  await page.getByRole('button', { name: 'Create permit' }).click()
  await page.getByLabel('Title').fill('Tank inspection')
  await page.getByRole('button', { name: 'Save draft' }).click()

  await expect(page.getByRole('status')).toHaveText(/draft saved/i)
})`,
      },
    ],
  },
  {
    id: 'pw-web-first-assertions',
    question: 'Что такое web-first assertions и почему sleep почти всегда плохая идея?',
    category: 'Playwright',
    level: 'middle',
    terms: [
      {
        en: 'Web-first assertion',
        ru: 'Проверка, ориентированная на веб',
        description: 'Ассерт, который ждёт нужного состояния страницы, а не проверяет всё мгновенно в одну точку времени.',
      },
      {
        en: 'Flaky test',
        ru: 'Нестабильный тест',
        description: 'Тест, который иногда проходит, а иногда падает без реальной функциональной регрессии.',
      },
      {
        en: 'Polling',
        ru: 'Опрос состояния',
        description: 'Повторная проверка условия в течение таймаута. Именно так работают многие устойчивые assertions.',
      },
    ],
    shortAnswer:
      'Web-first assertions ждут нужного состояния интерфейса в пределах таймаута. Sleep ждёт фиксированное время вслепую: иногда этого мало, иногда слишком много. Поэтому sleep делает тесты одновременно медленными и нестабильными.',
    fullAnswer: `## Почему sleep плох

\`waitForTimeout(2000)\` не знает, что реально происходит на странице.  
Он просто замораживает тест.

Проблемы:

- если UI обновился за 100 мс — ты зря ждёшь 2 секунды
- если UI обновился за 3 секунды — тест всё равно упадёт

## Какой подход лучше

Playwright умеет ждать наблюдаемый результат:

- текст появился
- элемент стал видимым
- URL изменился
- сетка отрисовалась

Это ближе к пользовательскому опыту и лучше сигнализирует о реальной проблеме.

## На интервью

Сильная формулировка:

"Я стараюсь ждать не время, а состояние. Если тест знает, чего он ждёт, он быстрее и стабильнее."`,
    examples: [
      {
        title: 'Плохой и хороший вариант ожидания',
        language: 'ts',
        code: `// ❌ Плохо: фиксированная пауза
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForTimeout(2000)
await expect(page.getByText('Saved')).toBeVisible()

// ✅ Лучше: ждём пользовательский сигнал
await page.getByRole('button', { name: 'Save' }).click()
await expect(page.getByRole('status')).toHaveText(/saved/i)`,
      },
    ],
  },
  {
    id: 'pw-fixtures-page-objects',
    question: 'Как организовать Playwright fixtures, helpers и Page Objects так, чтобы тесты были читаемыми, но не переабстрагированными?',
    category: 'Playwright',
    level: 'senior',
    terms: [
      {
        en: 'Fixture',
        ru: 'Фикстура',
        description: 'Подготовленная зависимость для теста: страница, авторизованный пользователь, seeded data, API client.',
      },
      {
        en: 'Page Object',
        ru: 'Page Object',
        description: 'Объект, который инкапсулирует работу со страницей. Полезен, если прячет только UI-смысл, а не всё подряд.',
      },
      {
        en: 'Test helper',
        ru: 'Вспомогательная функция теста',
        description: 'Небольшая переиспользуемая функция для подготовки данных или повторяющихся действий без тяжёлой OO-обвязки.',
      },
    ],
    shortAnswer:
      'Fixtures нужны для изоляции и подготовки окружения, helpers — для коротких повторяющихся операций, а Page Objects полезны, если они выражают язык продукта. Плохо, когда Page Object превращается в толстую прослойку, скрывающую весь DOM и делающую тесты нечитаемыми.',
    fullAnswer: `## Как я обычно раскладываю ответственность

- fixtures: auth, seeded data, api clients, feature flags
- helpers: короткие повторяющиеся действия и фабрики данных
- page object: только для действительно сложных экранов

## Когда Page Object полезен

Если у страницы есть явная бизнес-структура:

- permit editor
- approval queue
- incident dashboard

Тогда методы вроде \`approvePermit()\` или \`fillSafetyChecklist()\` читаются хорошо.

## Когда Page Object вреден

Если он превращается в слой вида:

- \`clickButton1()\`
- \`typeIntoField2()\`

Тогда это просто обёртка над DOM, которая прячет реальный сценарий.

## Что отвечать

"Я стараюсь выбирать самый простой уровень абстракции, который убирает дублирование, но не скрывает смысл теста."`,
    examples: [
      {
        title: 'Fixture + page object без overengineering',
        language: 'ts',
        code: `import { test as base } from '@playwright/test'

class PermitPage {
  constructor(private readonly page: import('@playwright/test').Page) {}

  async open() {
    await this.page.goto('/permits')
  }

  async createDraft(title: string) {
    await this.page.getByRole('button', { name: 'Create permit' }).click()
    await this.page.getByLabel('Title').fill(title)
    await this.page.getByRole('button', { name: 'Save draft' }).click()
  }
}

export const test = base.extend<{ permitPage: PermitPage }>({
  permitPage: async ({ page }, use) => {
    await use(new PermitPage(page))
  },
})`,
      },
    ],
  },
  {
    id: 'pw-route-vs-har-trace',
    question: 'Когда в Playwright лучше использовать route mocking, когда HAR, и как trace viewer помогает дебажить flaky tests?',
    category: 'Playwright',
    level: 'senior',
    terms: [
      {
        en: 'Route mocking',
        ru: 'Мок маршрутов',
        description: 'Перехват HTTP-запросов и возврат своих ответов прямо в тесте.',
      },
      {
        en: 'HAR',
        ru: 'HAR replay',
        description: 'Воспроизведение заранее записанного набора HTTP-запросов и ответов.',
      },
      {
        en: 'Trace viewer',
        ru: 'Trace viewer',
        description: 'Инструмент Playwright для просмотра шагов теста, DOM snapshot, сети, консоли и скриншотов.',
      },
    ],
    shortAnswer:
      'Route mocking хорош, когда нужно локально подменить 1-2 запроса и явно контролировать сценарий. HAR удобен для более широкого набора стабильных ответов. Trace viewer нужен для разборов flaky tests: он показывает, что видел тест, какой был DOM, сеть, консоль и тайминг шагов.',
    fullAnswer: `## Как я выбираю инструмент

### Route mocking

Подходит, когда:

- надо быстро смоделировать edge case
- нужен один конкретный error response
- хочешь явно показать в тесте, что именно подменяется

### HAR

Подходит, когда:

- сценарий большой
- хочется быстро изолировать UI от реального backend
- ответы уже стабильно записаны

Но HAR быстро устаревает, если API активно меняется.

## Зачем trace viewer

Когда тест упал, trace viewer помогает ответить на вопросы:

- что реально было на экране
- какой запрос ушёл
- что пришло в ответ
- была ли ошибка в консоли
- на каком шаге всё пошло не так

На интервью хорошо звучит мысль:

"Для flaky tests я сначала смотрю trace и только потом начинаю гадать. Без артефактов debugging превращается в угадайку."`,
    examples: [
      {
        title: 'Локальный route mock для edge-case',
        language: 'ts',
        code: `await page.route('**/api/permits/**', async route => {
  await route.fulfill({
    status: 409,
    contentType: 'application/json',
    body: JSON.stringify({
      code: 'VERSION_CONFLICT',
      message: 'Permit was changed by another user',
    }),
  })
})

await page.goto('/permits/42')
await page.getByRole('button', { name: 'Save' }).click()
await expect(page.getByRole('alert')).toHaveText(/changed by another user/i)`,
      },
    ],
  },
  {
    id: 'openapi-structure',
    question: 'Из чего состоит OpenAPI 3 spec и как это связано с type-safe frontend client?',
    category: 'OpenAPI',
    level: 'middle',
    terms: [
      {
        en: 'paths',
        ru: 'paths',
        description: 'Описание маршрутов и операций API.',
      },
      {
        en: 'components / schemas',
        ru: 'components / schemas',
        description: 'Переиспользуемые модели, параметры, security schemes и другие куски спецификации.',
      },
      {
        en: 'requestBody / responses',
        ru: 'Тело запроса / ответы',
        description: 'Описание входного payload и возможных ответов API.',
      },
      {
        en: 'securitySchemes',
        ru: 'Схемы безопасности',
        description: 'Описание bearer auth, API keys, OAuth и других механизмов аутентификации.',
      },
    ],
    shortAnswer:
      'OpenAPI 3 описывает маршруты, параметры, тела запросов, схемы ответов и безопасность. На frontend это нужно не ради документации как таковой, а чтобы генерировать type-safe client, держать контракт синхронизированным и ловить breaking changes до релиза.',
    fullAnswer: `## Что в OpenAPI важно понимать

Спецификация описывает не только "какой endpoint существует", но и:

- какие параметры обязательны
- какой request body ожидается
- какие ответы бывают
- какая авторизация нужна

## Основные блоки

- \`paths\` — сами операции
- \`components.schemas\` — переиспользуемые модели
- \`parameters\` — path/query/header/cookie параметры
- \`requestBody\` — тело запроса
- \`responses\` — ответы
- \`securitySchemes\` — auth-механизмы

## Что это даёт frontend

- generated client
- типы request/response
- меньше ручного дрейфа
- более предсказуемый rollback и rollout

На интервью полезно подчеркнуть:  
"Для frontend OpenAPI хорош не только как документация, а как источник истины для контрактов и генерации типов."`,
    visual: `\`\`\`text
OpenAPI spec
   |
   +--> docs for humans
   |
   +--> generated client
   |
   +--> TS request/response types
   |
   +--> contract checks in CI
\`\`\``,
    examples: [
      {
        title: 'Скелет OpenAPI 3 спецификации',
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
          type: string`,
      },
    ],
  },
  {
    id: 'openapi-breaking-changes-contract-first',
    question: 'Какие изменения API являются breaking changes и как организовать contract-first workflow между frontend и backend?',
    category: 'OpenAPI',
    level: 'senior',
    terms: [
      {
        en: 'Breaking change',
        ru: 'Ломающие изменения',
        description: 'Изменения контракта, после которых существующий клиент может перестать работать.',
      },
      {
        en: '$ref / oneOf / allOf',
        ru: 'Композиция схем',
        description: 'Механизмы переиспользования и комбинирования схем в OpenAPI.',
      },
      {
        en: 'Contract-first',
        ru: 'Контракт сначала',
        description: 'Подход, при котором команды сначала согласуют и фиксируют API-спецификацию, а потом пишут реализацию.',
      },
    ],
    shortAnswer:
      'Breaking change — это удаление или несовместимое изменение поля, enum, статуса ответа, auth-поведения или структуры payload. Contract-first workflow нужен, чтобы backend и frontend синхронизировались через спецификацию, generated client и CI checks, а не через устные договорённости.',
    fullAnswer: `## Что почти всегда ломает клиентов

- удаление поля
- изменение типа поля
- добавление нового обязательного поля
- смена значения enum
- изменение status code semantics
- изменение auth-требований

## Что обычно безопаснее

- добавление нового optional поля
- добавление нового endpoint
- расширение неиспользуемой части ответа, если клиент устойчив

## Как работает contract-first

1. Согласовали spec
2. Сгенерировали client/types
3. Прогнали CI checks
4. Реализовали backend и frontend
5. Выпустили с backward-compatible окном миграции

## Что отвечать на интервью

"Я не рассчитываю на память людей. Я хочу, чтобы контракт был формализован, клиент генерировался, а breaking changes были видны в review и CI."`,
    examples: [
      {
        title: 'Примеры breaking и non-breaking изменений',
        language: 'text',
        code: `Breaking:
- field name: string -> number
- remove required field
- enum: ['draft', 'approved'] -> ['pending', 'approved']
- response 200 JSON -> 204 empty body

Usually safe:
- add optional field
- add new endpoint
- add new optional query param

Strong workflow:
- PR with spec change
- generated types updated
- frontend smoke/contract checks
- rollout with backward compatibility window`,
      },
    ],
  },
]

export const backendAwarenessQuestions: InterviewQuestion[] = [
  {
    id: 'django-request-response-middleware',
    question: 'Как устроен request/response lifecycle в Django и где в нём находится middleware?',
    category: 'Backend',
    level: 'middle',
    terms: [
      {
        en: 'Request / Response lifecycle',
        ru: 'Жизненный цикл запроса',
        description: 'Путь HTTP-запроса через сервер, middleware, routing, view и обратно в виде ответа.',
      },
      {
        en: 'Middleware',
        ru: 'Промежуточный слой',
        description: 'Код, который обрабатывает запрос до view и/или ответ после view.',
      },
      {
        en: 'View',
        ru: 'Обработчик запроса',
        description: 'Функция или класс, который реализует бизнес-логику endpoint.',
      },
    ],
    shortAnswer:
      'Запрос приходит в Django, проходит цепочку middleware, попадает в router и view, затем формируется response и идёт обратно через response-часть middleware. Middleware подходит для cross-cutting concerns: auth, logging, tracing, request id, locale, rate limit integration.',
    fullAnswer: `## Простая ментальная модель

Запрос проходит через несколько ворот:

1. server / gateway
2. Django middleware
3. URL routing
4. view
5. response обратно наружу

## Зачем нужен middleware

Это место для сквозной логики, которую не хочется дублировать в каждом endpoint:

- request id
- auth/session
- logging
- tracing
- locale
- security headers

## Что важно понимать frontend/fullstack разработчику

Даже если ты не пишешь Django каждый день, полезно понимать, что не вся логика живёт во view. Иногда поведение API определяется middleware до того, как твой endpoint вообще начал работать.

На интервью можно сказать:

"Middleware — это слой для общесистемной логики вокруг запроса, а не место для доменной бизнес-логики конкретного use case."`,
    visual: `\`\`\`text
HTTP Request
   |
   v
Middleware chain
   |
   v
Router -> View -> Service / DB
   |
   v
Response
   |
   v
Middleware chain back
\`\`\``,
    examples: [
      {
        title: 'Упрощённый middleware пример',
        language: 'py',
        code: `class RequestIdMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = create_request_id()
        response = self.get_response(request)
        response['X-Request-ID'] = request.request_id
        return response`,
      },
    ],
  },
  {
    id: 'python-sync-vs-async',
    question: 'Чем sync и async код в Python-сервисе practically отличаются для веб-приложения?',
    category: 'Backend',
    level: 'middle',
    terms: [
      {
        en: 'I/O bound',
        ru: 'I/O-зависимая задача',
        description: 'Задача, которая большую часть времени ждёт сеть, диск, БД или другой внешний ресурс.',
      },
      {
        en: 'CPU bound',
        ru: 'CPU-зависимая задача',
        description: 'Задача, упирающаяся во вычисления процессора, а не в ожидание ввода-вывода.',
      },
      {
        en: 'Async / await',
        ru: 'Асинхронный код',
        description: 'Подход, при котором выполнение может уступать управление во время ожидания I/O.',
      },
    ],
    shortAnswer:
      'Async полезен там, где много I/O ожидания: HTTP calls, websockets, медленные внешние сервисы. Он не делает CPU-heavy код магически быстрее. Для веб-приложения это вопрос throughput и эффективного ожидания, а не серебряная пуля.',
    fullAnswer: `## Что важно понять

Async нужен, когда задача часто "ждёт":

- БД
- внешний API
- файловую систему
- очередь

В это время event loop может обслуживать другие запросы.

## Где люди ошибаются

Они думают, что \`async\` автоматически ускоряет всё подряд.  
Но если задача CPU-heavy, от \`async\` пользы мало. Там уже нужны другие решения: вынос в worker, отдельный процесс, очередь, батчинг.

## Что сказать на интервью

"Я воспринимаю sync vs async как архитектурный выбор под профиль нагрузки. Если сервис в основном ждёт I/O, async может быть полезен. Если проблема в тяжёлых вычислениях, смотреть надо в сторону background processing."`,
    examples: [
      {
        title: 'Async полезен при ожидании I/O',
        language: 'py',
        code: `async def enrich_permit(permit_id: str) -> dict:
    permit = await api_client.get_permit(permit_id)
    risks = await api_client.get_risks(permit_id)
    return {
        "permit": permit,
        "risks": risks,
    }`,
      },
    ],
  },
  {
    id: 'sqlalchemy-session-transaction',
    question: 'Что такое Session в SQLAlchemy и почему важно понимать transaction boundary?',
    category: 'Backend',
    level: 'senior',
    terms: [
      {
        en: 'Session',
        ru: 'Session',
        description: 'Unit of work вокруг ORM-операций и транзакции. Отслеживает изменения объектов и координирует flush/commit.',
      },
      {
        en: 'Transaction boundary',
        ru: 'Граница транзакции',
        description: 'Момент, где начинается и заканчивается атомарный набор изменений.',
      },
      {
        en: 'Unit of Work',
        ru: 'Единица работы',
        description: 'Подход, при котором связанные изменения собираются и коммитятся как одна логическая операция.',
      },
    ],
    shortAnswer:
      'Session в SQLAlchemy — это не "глобальная БД", а scoped unit of work. Её обычно держат в пределах запроса или фоновой job. Transaction boundary важна, потому что именно она определяет атомарность, откат и момент, когда другие увидят изменения.',
    fullAnswer: `## Почему это важно

Если держать session глобальной, быстро появляются проблемы:

- утечки состояния между запросами
- странные побочные эффекты
- трудно понять, что и когда закоммичено

## Как лучше думать

Request пришёл -> создали session -> сделали нужные изменения -> commit/rollback -> закрыли session.

То же самое для фоновой job: свой чёткий scope.

## Что даёт transaction boundary

Она отвечает на вопросы:

- какие изменения атомарны
- когда данные считаются сохранёнными
- как обрабатывается ошибка посередине процесса

На интервью хорошая формулировка:

"Я стараюсь держать transaction boundary короткой и осмысленной: достаточно большой для целостности, но не настолько большой, чтобы держать лишние locks и усложнять rollback."`,
    examples: [
      {
        title: 'Session per request / job',
        language: 'py',
        code: `def create_permit(session: Session, payload: PermitCreate) -> Permit:
    permit = Permit(title=payload.title, status='draft')
    session.add(permit)
    session.flush()  # получили id до commit
    return permit

def handler(payload: PermitCreate) -> str:
    with SessionLocal() as session:
        try:
            permit = create_permit(session, payload)
            session.commit()
            return permit.id
        except Exception:
            session.rollback()
            raise`,
      },
    ],
  },
  {
    id: 'sql-n-plus-one-eager-loading',
    question: 'Что такое N+1 query problem и когда нужна eager loading strategy?',
    category: 'Backend',
    level: 'senior',
    terms: [
      {
        en: 'N+1 problem',
        ru: 'Проблема N+1',
        description: 'Сначала читается список сущностей одним запросом, а затем для каждой сущности отдельно запрашиваются связанные данные.',
      },
      {
        en: 'Eager loading',
        ru: 'Предзагрузка связей',
        description: 'Стратегия, при которой связанные данные загружаются заранее меньшим количеством запросов.',
      },
      {
        en: 'Lazy loading',
        ru: 'Ленивая загрузка',
        description: 'Связанные данные подгружаются в момент первого обращения.',
      },
    ],
    shortAnswer:
      'N+1 — это когда ты читаешь 100 записей, а потом ещё 100 раз стучишься за связями. На маленьких данных это незаметно, на production быстро становится больно. Eager loading нужна, когда ты заранее знаешь, что связанные данные понадобятся для выдачи или рендера.',
    fullAnswer: `## Как это выглядит

Ты читаешь список permits:

- 1 запрос за permits
- потом для каждого permit грузишь owner

Если permits 100, получится 101 запрос.

## Почему это опасно

- растёт latency
- растёт нагрузка на БД
- трудно заметить на маленьких локальных данных

## Когда eager loading оправдана

Если UI или API точно требуют связанные данные прямо сейчас, лучше загрузить их осознанно:

- joinedload
- selectinload
- явный join

## Что важно проговорить

"Я не включаю eager loading везде подряд. Я смотрю на shape ответа и на то, какие отношения реально нужны в этом use case."`,
    visual: `\`\`\`text
Bad:
1 query for permits
+ 100 queries for owners
= 101 queries

Better:
1 query for permits
+ 1 query for owners
= 2 queries
\`\`\``,
    examples: [
      {
        title: 'N+1 и осознанная предзагрузка',
        language: 'py',
        code: `# Плохо: owner догружается для каждой записи отдельно
permits = session.query(Permit).all()
for permit in permits:
    print(permit.owner.name)

# Лучше: загружаем отношения заранее
permits = (
    session.query(Permit)
    .options(selectinload(Permit.owner))
    .all()
)`,
      },
    ],
  },
  {
    id: 'postgres-isolation-index-pagination',
    question: 'Что важно понимать про isolation levels, индексы и pagination в PostgreSQL?',
    category: 'Backend',
    level: 'senior',
    terms: [
      {
        en: 'READ COMMITTED',
        ru: 'READ COMMITTED',
        description: 'Стандартный уровень изоляции PostgreSQL. Каждый statement видит только уже закоммиченные данные на момент старта этого statement.',
      },
      {
        en: 'Index',
        ru: 'Индекс',
        description: 'Структура для ускорения поиска и сортировки, но не бесплатная по записи и хранению.',
      },
      {
        en: 'Offset pagination',
        ru: 'Пагинация через offset',
        description: 'Пагинация через LIMIT/OFFSET. Проста, но на больших объёмах данных и нестабильной сортировке может быть плоха.',
      },
      {
        en: 'Cursor pagination',
        ru: 'Курсорная пагинация',
        description: 'Пагинация относительно последнего элемента, обычно стабильнее и лучше масштабируется.',
      },
    ],
    shortAnswer:
      'Нужно понимать три вещи. READ COMMITTED — это не "полная магия целостности", а конкретный компромисс. Индексы ставятся под реальные фильтры и сортировки, а не просто "на всё подряд". Offset pagination удобна, но на больших таблицах и живых данных часто уступает cursor pagination.',
    fullAnswer: `## Isolation levels

Для прикладного разработчика важен не академический список уровней, а понимание, что:

- разные запросы видят данные по-разному
- длинные транзакции вредны
- иногда бизнес-операция требует явной защиты от гонок

\`READ COMMITTED\` обычно достаточно, но не решает все concurrency-case автоматически.

## Индексы

Индекс полезен там, где есть:

- частые фильтры
- сортировка
- join по foreign key

Но индекс — это не бесплатное ускорение. Он стоит места и замедляет запись.

## Pagination

Offset-пагинация проста, но:

- чем дальше offset, тем хуже производительность
- порядок может плыть при конкурентных изменениях

Cursor pagination лучше там, где большие объёмы и важна стабильность.

На интервью хорошо звучит фраза:

"Я хочу проектировать pagination и индексы от реального access pattern, а не от удобства первого запроса в админке."`,
    examples: [
      {
        title: 'Offset и cursor мыслью',
        language: 'sql',
        code: `-- Offset pagination
SELECT id, created_at, title
FROM permits
ORDER BY created_at DESC
LIMIT 50 OFFSET 5000;

-- Cursor-style pagination
SELECT id, created_at, title
FROM permits
WHERE created_at < $last_seen_created_at
ORDER BY created_at DESC
LIMIT 50;`,
      },
    ],
  },
  {
    id: 'redis-cache-invalidation',
    question: 'Где Redis использовать разумно, и как просто объяснить cache invalidation и stale data?',
    category: 'Backend',
    level: 'middle',
    terms: [
      {
        en: 'Cache',
        ru: 'Кэш',
        description: 'Временное хранилище для ускорения чтения и снижения нагрузки на более дорогой источник данных.',
      },
      {
        en: 'Cache invalidation',
        ru: 'Инвалидация кэша',
        description: 'Момент, когда кэш нужно сбросить или обновить, потому что данные больше нельзя считать актуальными.',
      },
      {
        en: 'Stale data',
        ru: 'Устаревшие данные',
        description: 'Данные, которые уже не совпадают с источником истины.',
      },
    ],
    shortAnswer:
      'Redis разумно использовать для cache, rate limiting, ephemeral state, locks и короткоживущих coordination задач. Cache invalidation — это правило, когда кэш перестаёт быть валидным. Stale data — когда пользователь видит данные, которые уже устарели относительно источника истины.',
    fullAnswer: `## Когда Redis уместен

- кэшировать дорогие чтения
- хранить rate limit counters
- держать короткоживущие токены и ephemeral state
- использовать как coordination слой

## Чего не стоит делать бездумно

Называть Redis "основной БД" просто потому, что туда быстро писать.

## Что такое cache invalidation простыми словами

Кэш полезен только пока он совпадает с реальностью.  
Как только источник истины изменился, надо решить:

- удаляем кэш
- обновляем кэш
- живём с TTL и допускаем временную неактуальность

## Что говорить на интервью

"Я воспринимаю кэш как оптимизацию, а не источник истины. Поэтому у меня всегда должен быть ответ на вопрос: когда и как он устаревает."`,
    examples: [
      {
        title: 'Cache-aside идея',
        language: 'text',
        code: `1. Читаем ключ из Redis
2. Если есть hit -> возвращаем значение
3. Если miss -> идём в primary store
4. Кладём результат в Redis с TTL

Важный вопрос:
- когда удалять или обновлять ключ после изменения данных?`,
      },
    ],
  },
  {
    id: 'celery-rabbitmq-idempotency',
    question: 'Что такое task queue, idempotent task, retry, acks_late и почему это важно для Celery/RabbitMQ?',
    category: 'Backend',
    level: 'senior',
    terms: [
      {
        en: 'Task queue',
        ru: 'Очередь задач',
        description: 'Механизм выноса долгой или ненадёжной работы из HTTP-request path в фоновые worker-процессы.',
      },
      {
        en: 'Idempotency',
        ru: 'Идемпотентность',
        description: 'Повторный запуск операции не должен приводить к повторному вредному побочному эффекту.',
      },
      {
        en: 'Retry',
        ru: 'Повторная попытка',
        description: 'Повторное выполнение задачи после временной ошибки.',
      },
      {
        en: 'acks_late',
        ru: 'Позднее подтверждение',
        description: 'Сообщение считается обработанным только после завершения задачи. При падении worker задача может быть доставлена ещё раз.',
      },
    ],
    shortAnswer:
      'Task queue нужна, чтобы не держать пользователя в HTTP-запросе ради долгой работы. Идемпотентность критична, потому что задача может выполниться повторно. Retry должен быть осознанным, а не blind retry storm. acks_late повышает шанс повторной доставки при падении worker, поэтому побочные эффекты должны быть защищены.',
    fullAnswer: `## Зачем выносить работу в очередь

Не всё нужно делать внутри request/response:

- генерация отчётов
- отправка email
- интеграции с внешними системами
- тяжёлые расчёты

## Почему идемпотентность так важна

В распределённой системе нужно исходить из того, что:

- worker может упасть
- сеть может оборваться
- задача может прийти повторно

Если операция не идемпотентна, ты рискуешь отправить письмо дважды, создать дубль записи или провести опасное действие повторно.

## Что говорить на интервью

"Для очередей я всегда думаю не только про happy path, но и про повторную доставку, частичное выполнение, retry policy и poison messages."`,
    visual: `\`\`\`text
HTTP request
   |
creates task
   |
   v
queue ---> worker
           |
        side effect
           |
 if worker crashes before ack
           |
      task may run again
\`\`\``,
    examples: [
      {
        title: 'Идемпотентная Celery-задача',
        language: 'py',
        code: `@shared_task(bind=True, autoretry_for=(ConnectionError,), retry_backoff=True)
def send_report(self, report_id: str) -> None:
    report = load_report(report_id)

    if report.status == 'sent':
        return

    deliver_report(report)
    mark_report_as_sent(report_id)`,
      },
    ],
  },
]

export const leadArchitectQuestions: InterviewQuestion[] = [
  {
    id: 'frontend-enterprise-architecture',
    question: 'Как бы ты спроектировал frontend для enterprise SaaS с несколькими модулями, ролями и squads?',
    category: 'Architecture',
    level: 'senior',
    terms: [
      {
        en: 'Bounded context',
        ru: 'Ограниченный контекст',
        description: 'Часть системы со своей моделью и языком, которую лучше не смешивать с остальными.',
      },
      {
        en: 'Feature slice',
        ru: 'Фича-срез',
        description: 'Организация кода вокруг конкретного бизнес-capability, а не вокруг технических слоёв.',
      },
      {
        en: 'Shared layer',
        ru: 'Общий слой',
        description: 'Переиспользуемый код. Опасен тем, что быстро разрастается и превращается в мусорный общий склад.',
      },
    ],
    shortAnswer:
      'Я бы проектировал такой frontend не вокруг pages и utils, а вокруг продуктовых областей: permits, approvals, reports, admin. Нужны чёткие границы модулей, отдельные договорённости по shared layer, явная политика по server state и permissions. Важно учитывать не только структуру папок, но и ownership между squads.',
    fullAnswer: `## С чего я бы начал

Сначала уточнил бы:

- сколько модулей и команд
- есть ли multi-tenant или сложная ролевая модель
- насколько критичны offline, latency, auditability
- нужен ли SSR или это чистый app shell

## Базовая архитектура

- feature-oriented structure
- отдельный слой API/contracts
- shared design system с сильной дисциплиной
- server state отдельно от UI state
- permissions как отдельная модель, не inline-if по всему дереву

## Главный риск

В enterprise UI чаще всего ломается не рендер, а границы ответственности:

- общие компоненты становятся слишком умными
- shared utils начинают знать про домен
- каждая команда трактует контракт по-своему

## Сильная мысль для интервью

"Я проектирую фронтенд не только как кодовую базу, но и как рабочую систему для нескольких команд. Поэтому ownership и границы модулей для меня так же важны, как React patterns."`,
    visual: `\`\`\`text
App
 ├─ permits
 ├─ approvals
 ├─ reports
 ├─ admin
 ├─ shared-ui
 ├─ api-contracts
 └─ platform / shell

Each module:
  own screens
  own domain logic
  clear API boundary
\`\`\``,
    examples: [
      {
        title: 'Feature-oriented structure',
        language: 'text',
        code: `src/
  features/
    permits/
      api/
      components/
      hooks/
      model/
      pages/
    approvals/
    reports/
  shared/
    ui/
    lib/
  app/
    providers/
    routing/`,
      },
    ],
  },
  {
    id: 'bounded-contexts-feature-slices',
    question: 'Как делить приложение на bounded contexts или feature slices и не превратить shared слой в свалку?',
    category: 'Architecture',
    level: 'senior',
    terms: [
      {
        en: 'Cohesion',
        ru: 'Связность',
        description: 'Насколько элементы модуля относятся к одной и той же задаче.',
      },
      {
        en: 'Coupling',
        ru: 'Связанность между модулями',
        description: 'Насколько один модуль зависит от внутренностей другого.',
      },
      {
        en: 'Ownership',
        ru: 'Ответственность за модуль',
        description: 'Кто принимает решения и поддерживает конкретную часть системы.',
      },
    ],
    shortAnswer:
      'Я делю приложение по бизнес-capability, а не по типам файлов. Shared слой ограничиваю жёстко: там только действительно общий UI, базовые утилиты и инфраструктурные вещи. Как только код начинает знать про доменную терминологию конкретной фичи, он должен жить в этой фиче.',
    fullAnswer: `## Главный критерий

Если кусок кода нужен только permits, он не должен жить в shared.

## Что часто попадает в shared зря

- "универсальные" таблицы с доменной логикой
- формы, которые уже знают про workflow
- API helpers, заточенные под один модуль

## Как я защищаю shared слой

- явные правила ревью
- ownership
- ограничения импорта
- вынос в shared только после второго-третьего реального use case

## Формулировка для интервью

"Я предпочитаю сначала держать код ближе к домену. Переиспользование нужно доказывать, а не предполагать заранее."`,
    examples: [
      {
        title: 'Плохой и хороший сигнал для shared',
        language: 'text',
        code: `Плохой shared:
- PermitTable
- ApprovalStatusBadge
- UserCanApproveHelper

Хороший shared:
- Button
- Modal
- date formatting helper
- generic query client setup`,
      },
    ],
  },
  {
    id: 'state-boundaries-choice-of-tools',
    question: 'Как определить границы server state, local UI state, derived state и form state, и как выбирать между Context, custom hooks и state manager?',
    category: 'Architecture',
    level: 'senior',
    terms: [
      {
        en: 'Server state',
        ru: 'Серверное состояние',
        description: 'Данные, источником истины для которых является backend.',
      },
      {
        en: 'Local UI state',
        ru: 'Локальное UI-состояние',
        description: 'Состояние интерфейса: открыто/закрыто, выбранный таб, фильтр панели и т.д.',
      },
      {
        en: 'Derived state',
        ru: 'Производное состояние',
        description: 'Значение, которое можно вычислить из уже существующих данных без отдельного хранения.',
      },
      {
        en: 'Form state',
        ru: 'Состояние формы',
        description: 'Черновые значения полей, validation errors, dirty flags, submit lifecycle.',
      },
    ],
    shortAnswer:
      'Сначала я определяю источник истины. Если данные живут на сервере, это server state и им нужен свой fetch/cache layer. Если значение можно вычислить из текущих props и state, я не храню его отдельно. Context подходит для стабильных широких зависимостей, а state manager нужен только когда реально есть сложная координация между distant parts of UI.',
    fullAnswer: `## Хорошая база

- server state: query/mutation слой
- local UI state: ближе к компоненту
- derived state: вычислять в render
- form state: отдельный form layer

## Где часто ошибаются

- кладут server data в global store без причины
- дублируют derived state в useState
- тянут Context для часто меняющихся данных, из-за чего всё лишний раз ререндерится

## Как выбираю инструменты

- Context: theme, auth shell, feature flags, стабильные настройки
- custom hook: повторяемое поведение фичи
- state manager: сложная межэкранная координация или offline/complex workflow

## Что озвучить на интервью

"Я не начинаю с выбора библиотеки. Я сначала определяю nature of state и только потом решаю, какой инструмент нужен."`,
    examples: [
      {
        title: 'Разделение состояний',
        language: 'ts',
        code: `type UiState = {
  isFiltersOpen: boolean
  selectedTab: 'active' | 'archived'
}

type PermitDraft = {
  title: string
  description: string
}

// permitsQuery.data -> server state
// uiState -> local UI state
// visiblePermits -> derived state
// draft -> form state`,
      },
    ],
  },
  {
    id: 'frontend-rbac-permissions',
    question: 'Как бы ты строил permission/RBAC model на frontend, чтобы логика не размазалась по компонентам?',
    category: 'Architecture',
    level: 'senior',
    terms: [
      {
        en: 'RBAC',
        ru: 'Role-Based Access Control',
        description: 'Подход, при котором доступ определяется ролью пользователя и разрешёнными действиями.',
      },
      {
        en: 'Capability',
        ru: 'Возможность / право действия',
        description: 'Конкретное разрешение, например canApprovePermit или canEditDraft.',
      },
      {
        en: 'Policy layer',
        ru: 'Слой политик',
        description: 'Центральное место, где описаны правила доступа.',
      },
    ],
    shortAnswer:
      'На frontend я стараюсь работать не напрямую с ролями, а с capability model. Компоненты спрашивают не "role === admin?", а "canApprovePermit?". Это делает код чище и лучше переживает изменения ролей. Но backend всё равно остаётся финальным источником истины.',
    fullAnswer: `## Почему role checks быстро портят код

Когда в интерфейсе появляются проверки вида:

- \`role === 'admin'\`
- \`role === 'supervisor'\`
- \`role !== 'viewer'\`

по всему приложению, доступы становятся трудно поддерживать.

## Что лучше

Вынести права в отдельную модель:

- capability map
- permission helpers
- route guards
- action guards

## Важный момент

Frontend permissions нужны для UX и сокрытия недоступных действий.  
Но реальная безопасность — на backend.

## На интервью

"Я хочу, чтобы UI говорил языком действий, а не ролей. Тогда permission model проще менять и тестировать."`,
    examples: [
      {
        title: 'Capability-first подход',
        language: 'ts',
        code: `type Capabilities = {
  canViewPermit: boolean
  canEditDraft: boolean
  canApprovePermit: boolean
}

function PermitActions({ capabilities }: { capabilities: Capabilities }) {
  return (
    <>
      {capabilities.canEditDraft && <button>Edit</button>}
      {capabilities.canApprovePermit && <button>Approve</button>}
    </>
  )
}`,
      },
    ],
  },
  {
    id: 'frontend-observability-and-rollout',
    question: 'Как бы ты строил observability для frontend и предотвращал breaking changes при независимом rollout frontend и backend?',
    category: 'Architecture',
    level: 'senior',
    terms: [
      {
        en: 'Observability',
        ru: 'Наблюдаемость',
        description: 'Способность понять, что происходит в системе, по логам, метрикам, трейсингу и пользовательским сигналам.',
      },
      {
        en: 'Backward compatibility',
        ru: 'Обратная совместимость',
        description: 'Свойство новой версии продолжать работать со старым клиентом или сервисом в переходный период.',
      },
      {
        en: 'Feature flag',
        ru: 'Фича-флаг',
        description: 'Механизм включения и выключения функциональности без нового релиза.',
      },
    ],
    shortAnswer:
      'Для frontend observability я бы собирал runtime errors, ключевые user flows, API failures, latency и correlation id. Чтобы rollout frontend и backend не ломал систему, нужен backward-compatible контракт, transition window, feature flags и быстрый rollback.',
    fullAnswer: `## Что важно видеть во frontend

- JS runtime errors
- failed API requests
- длительность критичных сценариев
- частоту пользовательских ошибок
- correlation id для связи с backend логами

## Почему rollout ломается

Не потому что CI плохой сам по себе, а потому что:

- frontend уже ждёт новое поле
- backend ещё не умеет новое значение enum
- фича выкатана асимметрично

## Что помогает

- backward-compatible API
- feature flags
- observability после deploy
- rollback policy

## Сильная формулировка

"Независимый деплой работает только если контракт выдерживает переходный период. Иначе мы просто быстро доставляем несовместимость."`,
    examples: [
      {
        title: 'Что логировать и чем страховаться',
        language: 'text',
        code: `Frontend observability:
- uncaught exceptions
- failed mutations
- long page load / slow action metrics
- key flow completion rate
- request id / trace id correlation

Safe rollout:
- add optional fields first
- keep old enum values valid temporarily
- guard new UI by feature flag
- monitor error rate after deploy`,
      },
    ],
  },
]

export const domainEnterpriseQuestions: InterviewQuestion[] = [
  {
    id: 'workflow-draft-review-approve',
    question: 'Как бы ты спроектировал workflow вида draft -> review -> approve -> complete?',
    category: 'Domain',
    level: 'senior',
    terms: [
      {
        en: 'Workflow state machine',
        ru: 'Машина состояний workflow',
        description: 'Явная модель допустимых состояний и переходов между ними.',
      },
      {
        en: 'Transition',
        ru: 'Переход состояния',
        description: 'Разрешённое изменение статуса записи, обычно зависящее от роли и валидации.',
      },
      {
        en: 'Draft',
        ru: 'Черновик',
        description: 'Редактируемое промежуточное состояние до финального подтверждения.',
      },
    ],
    shortAnswer:
      'Я бы моделировал такой flow как явную state machine с разрешёнными переходами и валидацией на сервере. В UI важно разделять editable draft, статус проверки и итоговые переходы. Пользователь должен видеть не просто "форму", а текущее системное состояние процесса.',
    fullAnswer: `## Главное правило

Это не просто "форма со статусом".  
Это workflow с допустимыми переходами.

## Что я бы разделил

- editable draft data
- текущий workflow state
- кто может выполнить какой transition
- audit events по переходам

## Почему это важно

Если всё смешать в одну сущность и пару boolean-флагов, очень быстро появятся нелегальные состояния.

## Как говорить на интервью

"Я бы моделировал процесс как state machine: явные статусы, явные переходы, серверная валидация переходов и UI, который показывает доступные действия только там, где они действительно возможны."`,
    visual: `\`\`\`text
draft --> review --> approved --> completed
   |         |
   |         v
   +------ rejected

Each transition:
- role check
- validation
- audit event
\`\`\``,
    examples: [
      {
        title: 'State model для approval flow',
        language: 'ts',
        code: `type PermitStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'completed'
  | 'rejected'

type Permit = {
  id: string
  status: PermitStatus
  title: string
}

function canApprove(status: PermitStatus) {
  return status === 'review'
}`,
      },
    ],
  },
  {
    id: 'audit-log-vs-current-state',
    question: 'Где держать immutable audit log, а где редактируемое текущее состояние?',
    category: 'Domain',
    level: 'senior',
    terms: [
      {
        en: 'Audit log',
        ru: 'Журнал аудита',
        description: 'Неизменяемая история того, кто, когда и что сделал.',
      },
      {
        en: 'Current state',
        ru: 'Текущее состояние',
        description: 'Актуальный редактируемый snapshot сущности, который нужен для повседневной работы.',
      },
      {
        en: 'Traceability',
        ru: 'Прослеживаемость',
        description: 'Возможность восстановить историю изменений и принятия решений.',
      },
    ],
    shortAnswer:
      'Текущее состояние и audit log — это разные модели. Current state нужен для работы пользователя здесь и сейчас. Audit log нужен для истории и проверки. Их нельзя смешивать в одну "табличку изменений", иначе страдает и UX, и compliance.',
    fullAnswer: `## Зачем разделять

Текущая запись отвечает на вопрос:

"Что система считает правдой сейчас?"

Audit log отвечает на вопрос:

"Как мы к этому пришли?"

## Почему нельзя смешивать

Если пытаться строить рабочий UI напрямую на событиях аудита, это неудобно.  
Если держать только текущее состояние без истории, теряется traceability.

## Практический подход

- current state: удобный для чтения и редактирования snapshot
- audit events: append-only история действий

На интервью полезно сказать:

"Для regulated или safety-critical продукта я хочу, чтобы история была отдельным первичным артефактом, а не побочным текстовым логом."`,
    examples: [
      {
        title: 'Current state + audit events',
        language: 'ts',
        code: `type PermitRecord = {
  id: string
  status: 'draft' | 'review' | 'approved'
  title: string
  updatedAt: string
}

type AuditEvent = {
  entityId: string
  type: 'created' | 'submitted' | 'approved' | 'rejected'
  actorId: string
  createdAt: string
  details?: Record<string, unknown>
}`,
      },
    ],
  },
  {
    id: 'role-based-ui-permission-layer',
    question: 'Как проектировать UI, если разные роли видят разные поля и действия?',
    category: 'Domain',
    level: 'senior',
    terms: [
      {
        en: 'Visibility rules',
        ru: 'Правила видимости',
        description: 'Логика, определяющая, какие поля и действия доступны конкретному пользователю.',
      },
      {
        en: 'Action guard',
        ru: 'Ограничитель действия',
        description: 'Проверка права на выполнение конкретного действия.',
      },
      {
        en: 'Policy-driven UI',
        ru: 'Интерфейс, управляемый политиками',
        description: 'Подход, при котором правила доступа централизованы, а не размазаны по дереву компонентов.',
      },
    ],
    shortAnswer:
      'Я бы не размазывал role-based if по JSX. Лучше иметь policy/capability слой и уже из него кормить компоненты. Тогда правила доступа централизованы, тестируемы и не ломаются при изменении ролей.',
    fullAnswer: `## Плохой путь

Когда в каждом компоненте появляются проверки:

- if role === admin
- if role !== viewer
- if user.department === ...

Через полгода это уже почти невозможно поддерживать.

## Лучший путь

- backend возвращает capabilities или достаточно информации для policy layer
- frontend строит единый слой правил
- компоненты получают уже готовые ответы can/cannot

## Что важно

UI может скрывать или отключать действия, но backend всё равно валидирует доступ окончательно.

На интервью хорошая мысль:

"Я стараюсь, чтобы компоненты работали языком возможностей, а не сложных бизнес-условий."`,
    examples: [
      {
        title: 'Policy helper для формы',
        language: 'ts',
        code: `type Capabilities = {
  canEditDetails: boolean
  canApprove: boolean
  canUploadAttachment: boolean
}

function getVisibleSections(capabilities: Capabilities) {
  return {
    details: capabilities.canEditDetails,
    approval: capabilities.canApprove,
    attachments: capabilities.canUploadAttachment,
  }
}`,
      },
    ],
  },
  {
    id: 'autosave-optimistic-conflicts',
    question: 'Как бы ты проектировал autosave, optimistic UI и conflict handling для enterprise-форм?',
    category: 'Domain',
    level: 'senior',
    terms: [
      {
        en: 'Autosave',
        ru: 'Автосохранение',
        description: 'Автоматическое сохранение черновика без явного клика пользователя.',
      },
      {
        en: 'Optimistic UI',
        ru: 'Оптимистичный UI',
        description: 'Подход, при котором интерфейс временно показывает успешный результат до подтверждения сервера.',
      },
      {
        en: 'Conflict',
        ru: 'Конфликт изменений',
        description: 'Ситуация, когда сущность была изменена параллельно другим пользователем или процессом.',
      },
    ],
    shortAnswer:
      'Для больших enterprise-форм я бы сначала разделил draft save и final submit. Autosave хорош для черновика, но не должен притворяться финальным подтверждением. Optimistic UI уместен не везде, а conflict handling требует явного versioning или revision token.',
    fullAnswer: `## Что важно не перепутать

Есть большая разница между:

- "данные черновика успешно сохранены"
- "бизнес-операция подтверждена системой"

## Autosave

Полезен там, где пользователь тратит много времени на ввод и может потерять вкладку или сеть.

## Optimistic UI

Хорош для быстрых и обратимых действий.  
Для опасных переходов workflow я бы был осторожнее.

## Conflict handling

Нужны:

- revision / version field
- понятное сообщение пользователю
- выбор: reload, merge, retry

На интервью полезно сказать:

"Я не делаю вид, что конфликтов не существует. Я предпочитаю явно моделировать sync state и возможность повторной синхронизации."`,
    examples: [
      {
        title: 'Сигналы состояния сохранения',
        language: 'ts',
        code: `type SaveState =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; savedAt: string }
  | { kind: 'error'; message: string }
  | { kind: 'conflict'; serverRevision: number }

// UI должен явно различать эти состояния,
// а не скрывать всё за одним boolean isSaving`,
      },
    ],
  },
  {
    id: 'partial-errors-and-operator-ux',
    question: 'Как показывать частичные ошибки, долгие API и stale-state UX для операторов, которым нужно работать быстро?',
    category: 'Domain',
    level: 'senior',
    terms: [
      {
        en: 'Partial failure',
        ru: 'Частичная ошибка',
        description: 'Ситуация, когда часть данных или операций завершилась успешно, а часть — нет.',
      },
      {
        en: 'Graceful degradation',
        ru: 'Мягкая деградация',
        description: 'Интерфейс продолжает быть полезным даже при ошибках или частичной недоступности системы.',
      },
      {
        en: 'Stale state',
        ru: 'Устаревшее состояние',
        description: 'UI показывает данные, которые могут уже не совпадать с сервером.',
      },
    ],
    shortAnswer:
      'Для операторского UX опасно скрывать системное состояние. Пользователь должен видеть, что загружается, что уже сохранено, что не удалось и что можно повторить. Частичная ошибка не должна валить весь экран, если часть сценария всё ещё полезна.',
    fullAnswer: `## Что важно в enterprise UX

Оператору часто нужно не "красивое ощущение", а ясность:

- что работает
- что не работает
- можно ли продолжать
- безопасно ли повторять действие

## Как я бы строил UX

- отдельные состояния loading/error для независимых блоков
- явные retry точки
- видимые stale indicators, если данные могли устареть
- частичная доступность экрана, а не глобальный blank error

## Что полезно озвучить

"Я стараюсь делать системное состояние видимым. В критичных workflow опаснее скрыть проблему, чем показать её слишком честно."`,
    examples: [
      {
        title: 'Частичная ошибка вместо total failure',
        language: 'text',
        code: `Экран depends on:
- permit details
- attachments
- approval history

Если упали attachments:
- permit details остаются доступны
- approval history остаётся доступна
- блок attachments показывает retry и ошибку локально`,
      },
    ],
  },
  {
    id: 'dangerous-actions-idempotent-ui',
    question: 'Что делать с опасными действиями: delete, approve, submit final report, чтобы UI был безопасным и не приводил к double submit?',
    category: 'Domain',
    level: 'senior',
    terms: [
      {
        en: 'Destructive action',
        ru: 'Разрушающее действие',
        description: 'Операция, которую нельзя безопасно повторять или легко откатить.',
      },
      {
        en: 'Double submit',
        ru: 'Повторная отправка',
        description: 'Ситуация, когда пользователь или сеть запускает ту же операцию дважды.',
      },
      {
        en: 'Idempotency key',
        ru: 'Ключ идемпотентности',
        description: 'Идентификатор, по которому backend понимает, что это повтор той же операции.',
      },
    ],
    shortAnswer:
      'Для опасных действий нужны явное подтверждение, блокировка повторного submit, понятное pending state и, желательно, серверная идемпотентность. Одним disabled button проблему не решить: сеть, retry и повторная доставка всё равно возможны.',
    fullAnswer: `## Что я считаю обязательным

- понятный confirm step для опасных действий
- pending state после старта операции
- защита от повторного клика
- серверная защита от дублирования

## Почему одного disabled button мало

Потому что повторы бывают не только от пользователя:

- retry на сети
- refresh
- два tab-а
- повторная доставка сообщения дальше по системе

## На интервью

"Для критичного действия я думаю сразу и про UX, и про backend semantics. UI может уменьшить риск, но финальную защиту должна давать система целиком."`,
    examples: [
      {
        title: 'Модель submit action',
        language: 'ts',
        code: `type SubmitState =
  | { kind: 'idle' }
  | { kind: 'confirming' }
  | { kind: 'submitting'; requestId: string }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

// requestId может использоваться как idempotency key
// при повторной попытке или сетевых проблемах`,
      },
    ],
  },
]

export const platformDeliveryQuestions: InterviewQuestion[] = [
  {
    id: 'ci-pipeline-cache-artifacts',
    question: 'Из чего должен состоять frontend CI pipeline, и чем cache отличается от artifacts?',
    category: 'Platform',
    level: 'middle',
    terms: [
      {
        en: 'Pipeline',
        ru: 'Pipeline',
        description: 'Цепочка проверок и шагов доставки изменений от коммита до артефакта или deploy.',
      },
      {
        en: 'Cache',
        ru: 'Кэш',
        description: 'Механизм ускорения будущих запусков workflow, например за счёт сохранённых зависимостей.',
      },
      {
        en: 'Artifact',
        ru: 'Артефакт',
        description: 'Сохранённый результат конкретного запуска: билд, coverage report, traces, screenshots.',
      },
    ],
    shortAnswer:
      'Базовый frontend pipeline обычно включает install, typecheck, lint, tests, build и минимальный e2e smoke. Cache ускоряет будущие прогонки, а artifact сохраняет конкретный результат текущего run. Их нельзя путать: cache про скорость, artifact про воспроизводимость и разбор результата.',
    fullAnswer: `## Что я считаю базой

- install dependencies
- typecheck
- lint
- unit / integration tests
- build
- e2e smoke для критичного сценария

## Cache vs artifact

Cache:

- ускоряет следующие запуски
- например npm cache или tool cache

Artifact:

- относится к текущему run
- build output
- screenshots
- traces
- coverage

## Что полезно сказать на интервью

"Я стараюсь, чтобы pipeline давал высокий signal-to-noise. Проверки должны реально защищать main, а не просто создавать шум."`,
    examples: [
      {
        title: 'Логика pipeline по шагам',
        language: 'text',
        code: `Frontend CI:
1. install
2. typecheck
3. lint
4. unit/integration
5. build
6. e2e smoke
7. upload artifacts on failure

Cache:
- node_modules / package manager cache

Artifacts:
- build output
- traces
- screenshots
- coverage report`,
      },
    ],
  },
  {
    id: 'ci-environments-secrets-previews',
    question: 'Как организовать environments, secrets, preview deployments и blocking checks в CI/CD?',
    category: 'Platform',
    level: 'senior',
    terms: [
      {
        en: 'Environment',
        ru: 'Окружение',
        description: 'Набор настроек, секретов и правил для конкретной стадии: preview, staging, production.',
      },
      {
        en: 'Blocking check',
        ru: 'Блокирующая проверка',
        description: 'Проверка, без прохождения которой merge или deploy невозможен.',
      },
      {
        en: 'Preview deployment',
        ru: 'Preview deployment',
        description: 'Временное окружение для проверки конкретного PR или ветки.',
      },
    ],
    shortAnswer:
      'Секреты и environments должны быть разведены по стадиям. Preview environment полезен для product/design review и smoke testing. Блокирующими я делаю только проверки с высоким signal-to-noise, иначе команда перестаёт доверять pipeline.',
    fullAnswer: `## Что важно разделять

- preview
- staging
- production

У каждого окружения свои:

- secrets
- approvals
- rollout правила

## Что я бы делал blocking

- typecheck
- build
- стабильные тесты
- минимальный smoke

## Что не стоит делать blocking бездумно

- flaky e2e
- шумные аналитические проверки без ясного сигнала

## На интервью хорошо сказать

"Я хочу, чтобы pipeline защищал доставку, а не просто тормозил её. Поэтому блокирующими должны быть только надёжные и действительно полезные проверки."`,
    examples: [
      {
        title: 'Что должно быть у preview',
        language: 'text',
        code: `Preview environment:
- isolated URL per PR
- safe test credentials
- seeded demo data if needed
- quick smoke test
- visible link in PR

Production:
- stricter approvals
- observability checks
- rollback path`,
      },
    ],
  },
  {
    id: 'k8s-deployment-rolling-update',
    question: 'Чем Deployment отличается от Pod и что такое rolling update простыми словами?',
    category: 'Platform',
    level: 'middle',
    terms: [
      {
        en: 'Pod',
        ru: 'Pod',
        description: 'Базовая единица запуска контейнера в Kubernetes.',
      },
      {
        en: 'Deployment',
        ru: 'Deployment',
        description: 'Контроллер, который управляет желаемым количеством Pod-ов и их обновлением.',
      },
      {
        en: 'Rolling update',
        ru: 'Постепенное обновление',
        description: 'Стратегия, при которой старые экземпляры заменяются новыми поэтапно, а не все сразу.',
      },
    ],
    shortAnswer:
      'Pod — это конкретный экземпляр приложения. Deployment — управляющий слой, который следит, сколько pod-ов должно быть и какой версии. Rolling update — это постепенная замена старой версии новой без полного падения сервиса.',
    fullAnswer: `## Простая аналогия

Pod — это один сотрудник на смене.  
Deployment — это менеджер, который следит, сколько сотрудников должно работать и когда их менять.

## Что делает rolling update

Он не выключает всю старую версию сразу.  
Сначала поднимает часть новой, убеждается, что она готова, и только потом убирает старую.

## Почему это важно

Без этого любой deploy легко превращается в короткий, но реальный outage.

## Что сказать на интервью

"Deployment — это декларация желаемого состояния, а rolling update — безопасный способ дойти до него без резкого обрыва сервиса."`,
    visual: `\`\`\`text
Old pods: [v1][v1][v1][v1]
             |
rolling update
             v
Mixed:    [v2][v1][v2][v1]
             |
             v
New pods: [v2][v2][v2][v2]
\`\`\``,
    examples: [
      {
        title: 'Суть без YAML-шума',
        language: 'text',
        code: `Pod:
- один running instance

Deployment:
- desired replica count
- update strategy
- self-healing

Rolling update:
- replace gradually
- keep service available
- allow rollback`,
      },
    ],
  },
  {
    id: 'readiness-liveness-zero-downtime',
    question: 'Чем readiness probe отличается от liveness probe и что реально нужно для zero-downtime deployment?',
    category: 'Platform',
    level: 'senior',
    terms: [
      {
        en: 'Readiness probe',
        ru: 'Проверка готовности',
        description: 'Показывает, можно ли уже слать трафик на экземпляр.',
      },
      {
        en: 'Liveness probe',
        ru: 'Проверка жизнеспособности',
        description: 'Показывает, жив ли процесс и надо ли его перезапустить.',
      },
      {
        en: 'Zero downtime',
        ru: 'Развёртывание без простоя',
        description: 'Обновление, при котором пользователи не ощущают недоступности сервиса.',
      },
    ],
    shortAnswer:
      'Readiness отвечает на вопрос "можно ли уже слать трафик?", liveness — "процесс вообще жив?". Для zero downtime мало просто иметь rolling update. Нужны readiness probes, достаточное число реплик, backward compatibility, корректная shutdown-логика и наблюдаемость после релиза.',
    fullAnswer: `## Readiness vs liveness

Readiness:

- не готов -> трафик не идёт

Liveness:

- завис / умер -> Kubernetes перезапускает контейнер

## Что нужно для zero downtime на практике

- rolling update
- readiness probe
- больше одной реплики
- корректное завершение старого инстанса
- совместимость между версиями

## Что полезно сказать

"Zero downtime — это не один checkbox в Kubernetes. Это цепочка условий, включая совместимость контракта и корректный lifecycle приложения."`,
    examples: [
      {
        title: 'Ключевая мысль про probes',
        language: 'text',
        code: `Readiness:
- protects users from not-yet-ready instance

Liveness:
- restarts broken process

Without readiness:
- traffic can hit a pod that has started,
  but is still not able to serve requests safely`,
      },
    ],
  },
  {
    id: 'terraform-state-plan-drift',
    question: 'Зачем Terraform state, чем plan отличается от apply и что такое drift?',
    category: 'Platform',
    level: 'senior',
    terms: [
      {
        en: 'Terraform state',
        ru: 'Состояние Terraform',
        description: 'Файл, который связывает конфигурацию с уже существующими реальными ресурсами.',
      },
      {
        en: 'Plan',
        ru: 'План изменений',
        description: 'Предпросмотр того, что Terraform собирается изменить.',
      },
      {
        en: 'Apply',
        ru: 'Применение изменений',
        description: 'Фактическое создание, изменение или удаление ресурсов.',
      },
      {
        en: 'Drift',
        ru: 'Дрейф',
        description: 'Расхождение между описанной конфигурацией и реальным состоянием инфраструктуры.',
      },
    ],
    shortAnswer:
      'Terraform state нужен, чтобы понимать, какие реальные ресурсы соответствуют коду. Plan показывает, что изменится, apply меняет инфраструктуру. Drift — это когда реальность уже отличается от кода, например кто-то руками поменял ресурс в облаке.',
    fullAnswer: `## Почему state так важен

Terraform не "угадывает" инфраструктуру заново каждый раз.  
Ему нужен state, чтобы понимать:

- что уже существует
- какие ресурсы кому соответствуют
- как построить корректный diff

## Plan vs apply

Plan:

- безопасный просмотр будущих изменений

Apply:

- реальное изменение инфраструктуры

## Почему drift опасен

Если кто-то менял ресурсы руками, конфигурация и реальность расходятся.  
Тогда следующий apply может удивить команду.

## Что говорить на интервью

"Terraform ценен не только тем, что создаёт ресурсы, а тем, что делает инфраструктуру управляемой и проверяемой. Поэтому state, locking и drift detection — это не детали, а основа подхода."`,
    examples: [
      {
        title: 'Практические сигналы',
        language: 'text',
        code: `Terraform plan:
- preview before change

Terraform apply:
- actual mutation

Remote state + locking:
- prevents concurrent writes

Drift:
- code says one thing
- cloud already looks different`,
      },
    ],
  },
  {
    id: 'rollback-policy-post-deploy-signals',
    question: 'Как бы ты объяснил rollback policy и какие сигналы смотришь сразу после deploy?',
    category: 'Platform',
    level: 'senior',
    terms: [
      {
        en: 'Rollback',
        ru: 'Откат',
        description: 'Возврат к предыдущей стабильной версии после неудачного релиза.',
      },
      {
        en: 'Error rate',
        ru: 'Частота ошибок',
        description: 'Доля запросов или действий, завершившихся ошибкой.',
      },
      {
        en: 'Synthetic smoke',
        ru: 'Синтетическая smoke-проверка',
        description: 'Небольшой автоматический сценарий, который подтверждает жизнеспособность ключевого user flow.',
      },
    ],
    shortAnswer:
      'Rollback policy — это заранее оговорённые условия, при которых мы не героически лечим прод на лету, а быстро откатываемся. После deploy я смотрю error rate, latency, failed user flows, логи, алерты и синтетический smoke по критичному сценарию.',
    fullAnswer: `## Почему rollback policy нужна заранее

Когда релиз уже ломает пользователей, поздно спорить, кто принимает решение.

## Что я бы смотрел после deploy

- error rate
- latency
- failed API / mutations
- completion rate ключевого user flow
- runtime logs
- synthetic smoke

## Когда откатываться

Если сигнал сильный и impact на пользователей реален, лучше быстро откатиться и разбираться спокойно, чем держать сломанное поведение ради сохранения лица.

## Хорошая формулировка

"Rollback — это не признание поражения, а нормальная часть безопасного delivery."`,
    examples: [
      {
        title: 'Rollback checklist',
        language: 'text',
        code: `After deploy watch:
- error rate
- latency
- failed login / save / submit flow
- JS runtime errors
- backend 5xx / 4xx spikes

Rollback if:
- key flow broken
- errors spike materially
- safe mitigation is slower than rollback`,
      },
    ],
  },
]

export const scenarioQuestions: InterviewQuestion[] = [
  {
    id: 'scenario-form-slow-large-dataset',
    question: 'После релиза форма стала медленной на больших datasets. Как ищешь bottleneck?',
    category: 'Scenarios',
    level: 'senior',
    terms: [
      {
        en: 'Bottleneck',
        ru: 'Узкое место',
        description: 'Конкретная точка, которая ограничивает производительность системы или экрана.',
      },
      {
        en: 'Profiling',
        ru: 'Профилирование',
        description: 'Измерение времени и частоты операций для поиска источника тормозов.',
      },
      {
        en: 'Hypothesis-driven debugging',
        ru: 'Отладка через гипотезы',
        description: 'Подход, при котором ты не угадываешь, а проверяешь конкретные версии проблемы по сигналам.',
      },
    ],
    shortAnswer:
      'Я бы сначала сузил проблему: это network, render, validation, derived computations или DOM size. Потом использовал бы React Profiler, браузерный Performance tab и runtime measurements. На senior-уровне важна не магическая оптимизация, а порядок диагностики.',
    fullAnswer: `## Как я бы действовал

1. Подтвердил бы воспроизводимость
2. Выяснил, тормозит ли ввод, загрузка, submit или initial render
3. Снял бы профили
4. Проверил бы re-render patterns, дорогие вычисления, размер DOM, частоту state updates

## Что часто оказывается причиной

- слишком широкие re-renders
- форма хранит лишнее derived state
- дорогая валидация на каждый keypress
- тяжёлые списки без виртуализации

## Что отвечать

"Я не начинаю с useMemo наугад. Сначала локализую место, где теряется время, и только потом выбираю оптимизацию."`,
    examples: [
      {
        title: 'Порядок разбора perf-проблемы',
        language: 'text',
        code: `1. Reproduce on realistic data
2. Measure with React Profiler / Performance tab
3. Check render frequency
4. Check expensive validation / mapping
5. Check DOM size
6. Apply targeted fix and re-measure`,
      },
    ],
  },
  {
    id: 'scenario-table-10000-rows',
    question: 'Таблица на 10 000 строк тормозит при фильтрации. Что делаешь первым?',
    category: 'Scenarios',
    level: 'senior',
    terms: [
      {
        en: 'Virtualization',
        ru: 'Виртуализация',
        description: 'Отрисовка только видимой части длинного списка или таблицы.',
      },
      {
        en: 'Debounce',
        ru: 'Дебаунс',
        description: 'Отложенный запуск операции после прекращения потока событий.',
      },
      {
        en: 'Derived computation',
        ru: 'Производное вычисление',
        description: 'Пересчёт значений на основе уже имеющихся данных.',
      },
    ],
    shortAnswer:
      'Сначала я бы выяснил, где именно тормозит: ввод, фильтрация данных или рендер 10 000 DOM-узлов. В большинстве случаев первое практичное решение — сократить объём одновременно отрисовываемого UI через виртуализацию и стабилизировать тяжёлые вычисления рядом с input.',
    fullAnswer: `## Частая ошибка

Люди сразу начинают мемоизировать всё подряд.  
Но у большой таблицы часто есть две разные проблемы:

- дорогая фильтрация данных
- слишком большой DOM

## Что я бы сделал

- проверил бы размер списка и DOM
- вынес бы фильтрацию из hot path input
- рассмотрел бы \`useDeferredValue\` для медленного поддерева
- добавил бы virtualization

## Что важно проговорить

"Если таблица физически рисует 10 000 строк, проблема не всегда в алгоритме фильтрации. Иногда главный выигрыш — просто перестать рендерить невидимую часть."`,
    examples: [
      {
        title: 'Мысль по шагам',
        language: 'tsx',
        code: `const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

const filteredRows = rows.filter(row =>
  row.title.toLowerCase().includes(deferredQuery.toLowerCase())
)

// Следующий шаг в реальном приложении:
// - virtualized table
// - maybe server-side filtering
// - avoid rendering all rows at once`,
      },
    ],
  },
  {
    id: 'scenario-animations-vs-e2e',
    question: 'Дизайнеры требуют сложные анимации, а e2e стали flaky. Как решаешь конфликт?',
    category: 'Scenarios',
    level: 'senior',
    terms: [
      {
        en: 'Flaky test',
        ru: 'Нестабильный тест',
        description: 'Тест с непредсказуемым результатом без реальной функциональной регрессии.',
      },
      {
        en: 'Actionability',
        ru: 'Готовность к действию',
        description: 'Состояние элемента, при котором с ним можно безопасно взаимодействовать.',
      },
      {
        en: 'Testability',
        ru: 'Тестопригодность',
        description: 'Насколько систему удобно и надёжно проверять автоматикой.',
      },
    ],
    shortAnswer:
      'Я бы не сводил это к спору "дизайн против тестов". Нужно уточнить, какие анимации реально ценны, а какие мешают testability. Обычно решение — не убрать motion целиком, а договориться о predictable states, правильных locators и, возможно, test-mode CSS для нестабильных эффектов.',
    fullAnswer: `## Как я бы разговаривал с командой

Сначала проверил бы, какие именно анимации ломают тесты:

- переходные состояния overlay
- delayed buttons
- moving targets

## Дальше варианты

- улучшить selectors и assertions
- ждать стабильный user-visible state
- упростить только проблемные переходы
- ввести test mode для анимаций, если это оправдано

## Что важно на интервью

"Я бы не ломал UX и не ломал quality signal бездумно. Сначала нашёл бы точку конфликта и предложил решение, которое сохраняет и motion, и надёжность автоматизации."`,
    examples: [
      {
        title: 'Компромиссный подход',
        language: 'text',
        code: `1. Find exact flaky transition
2. Prefer stable end-state assertions
3. Avoid clicking moving targets
4. Reduce only problematic animation
5. Consider test-mode animation shortening if justified`,
      },
    ],
  },
  {
    id: 'scenario-contract-drift',
    question: 'Backend внезапно меняет enum или payload, frontend падает. Что делаешь сначала и как страхуешься заранее?',
    category: 'Scenarios',
    level: 'senior',
    terms: [
      {
        en: 'Contract drift',
        ru: 'Дрейф контракта',
        description: 'Ситуация, когда клиент и сервер живут с разным пониманием схемы данных.',
      },
      {
        en: 'Blast radius',
        ru: 'Радиус поражения',
        description: 'Какая часть системы и каких пользователей затронута проблемой.',
      },
      {
        en: 'Graceful fallback',
        ru: 'Мягкий fallback',
        description: 'Поведение, при котором система не идеальна, но не падает полностью.',
      },
    ],
    shortAnswer:
      'Сначала локализую impact и включаю безопасный fallback, если это возможно. Затем подтверждаю, что проблема именно в контракте, а не в parsing bug. В долгую страхуюсь generated client, schema checks, defensive parsing на границах и политикой backward-compatible rollout.',
    fullAnswer: `## Immediate mitigation

- понять, кто сломан и насколько сильно
- временно защитить UI fallback-логикой или флагом
- синхронизироваться с backend по фактической причине

## Long-term fix

- generated types/client
- schema diff в CI
- runtime validation на внешней границе
- backward-compatible rollout policy

## Что важно сказать

"В таких инцидентах я разделяю mitigation и системный fix. Сначала уменьшаю impact, потом чиню процесс, из-за которого проблема вообще стала возможной."`,
    examples: [
      {
        title: 'Защитный parse на границе',
        language: 'ts',
        code: `type PermitStatus = 'draft' | 'review' | 'approved'

function normalizeStatus(value: string): PermitStatus | 'unknown' {
  if (value === 'draft' || value === 'review' || value === 'approved') {
    return value
  }

  return 'unknown'
}`,
      },
    ],
  },
  {
    id: 'scenario-long-report-generation',
    question: 'Репорт генерируется 10 минут. Как бы ты спроектировал UX, polling/push и retry-поведение?',
    category: 'Scenarios',
    level: 'senior',
    terms: [
      {
        en: 'Long-running job',
        ru: 'Долгая задача',
        description: 'Операция, которая длится слишком долго для обычного HTTP-request path.',
      },
      {
        en: 'Polling',
        ru: 'Опрос статуса',
        description: 'Периодическая проверка статуса задачи.',
      },
      {
        en: 'Push updates',
        ru: 'Push-обновления',
        description: 'Доставка статуса через websocket, SSE или другой push-механизм.',
      },
    ],
    shortAnswer:
      'Я бы делал report generation асинхронной job с явным статусом: queued, running, completed, failed. Для UX важно сразу вернуть control пользователю, показать текущий статус, дать безопасный retry и не выдавать "готово", пока готов только факт запуска.',
    fullAnswer: `## Что здесь нельзя делать

Нельзя держать пользователя 10 минут на одном POST-запросе с крутилкой.

## Как я бы строил решение

- пользователь запускает job
- получает job id и первый статус
- UI показывает progress / phase
- статус обновляется через polling или push
- результат можно открыть позже

## Что важно для UX

- можно закрыть экран и вернуться
- видно queued/running/failed/completed
- retry осмысленный, не создаёт бесконечные дубли

## На интервью

"Я бы разделил запуск задачи, наблюдение за статусом и получение результата. Это делает систему и UX честнее."`,
    examples: [
      {
        title: 'Статус долгой задачи',
        language: 'ts',
        code: `type ReportJobState =
  | { kind: 'queued' }
  | { kind: 'running'; progress?: number }
  | { kind: 'completed'; fileUrl: string }
  | { kind: 'failed'; message: string }

// UI может либо poll-ить status endpoint,
// либо получать обновления по websocket/SSE`,
      },
    ],
  },
  {
    id: 'scenario-scope-underestimated',
    question: 'Ты видишь, что задача недооценена вдвое, а сроки жёсткие. Когда и как эскалируешь?',
    category: 'Scenarios',
    level: 'senior',
    terms: [
      {
        en: 'Scope cut',
        ru: 'Сокращение объёма',
        description: 'Сознательное уменьшение объёма фичи для сохранения сроков и качества.',
      },
      {
        en: 'Escalation',
        ru: 'Эскалация',
        description: 'Раннее донесение риска до людей, которые могут принять решение.',
      },
      {
        en: 'Risk communication',
        ru: 'Коммуникация риска',
        description: 'Чёткое описание проблемы, impact и вариантов действий без драматизации.',
      },
    ],
    shortAnswer:
      'Эскалировать нужно рано, как только у тебя есть сигнал, что план нереалистичен. Не с формулировкой "я не успеваю", а с разбором: что именно оказалось сложнее, какой impact, какие есть варианты scope cut или sequencing. Senior-сигнал здесь — не героизм, а прозрачность и управляемость риска.',
    fullAnswer: `## Когда эскалировать

Не в последний вечер перед дедлайном, а когда стало понятно, что оценка трещит.

## Как я бы это сформулировал

- где именно сложность выросла
- что уже подтверждено фактами
- что ещё неизвестно
- какие есть варианты:
  - уменьшить scope
  - разбить на этапы
  - сдвинуть срок

## Что важно на интервью

"Для меня зрелое поведение — не молча тащить задачу до провала, а вовремя сделать риск видимым и принести варианты решения."`,
    examples: [
      {
        title: 'Хорошая форма эскалации',
        language: 'text',
        code: `Current status:
- API contract is less stable than expected
- form workflow requires extra conflict handling

Options:
1. Ship read-only version now, editing later
2. Keep full scope, move deadline
3. Disable advanced flow behind flag

Recommendation:
- option 1 for safer delivery`,
      },
    ],
  },
]

export const englishBehavioralQuestions: InterviewQuestion[] = [
  {
    id: 'behavioral-self-intro',
    question: 'Tell me about yourself and your recent React-heavy project.',
    category: 'Behavioral',
    level: 'middle',
    terms: [
      {
        en: 'Self-introduction',
        ru: 'Самопрезентация',
        description: 'Короткий связный рассказ о себе, опыте и текущей ценности для команды.',
      },
      {
        en: 'Relevance',
        ru: 'Релевантность',
        description: 'Насколько твой рассказ связан именно с этой ролью и этим стеком.',
      },
    ],
    shortAnswer:
      'Хороший self-intro — это не автобиография и не список технологий. Он должен быстро показать твой текущий уровень, тип проектов, твою сильную сторону и почему это совпадает с вакансией.',
    fullAnswer: `## Что должен услышать интервьюер за 60 секунд

- кто ты сейчас по уровню и фокусу
- на каких продуктах работал недавно
- в чём твоя практическая сила
- почему это релевантно их роли

## Чего лучше избегать

- длинной истории "с чего я начинал в 2015"
- списка всех библиотек подряд
- абстрактного "I love coding"

## Сильная мысль

"Я стараюсь говорить не только что делал, но и какую проблему обычно умею решать для команды."`,
    examples: [
      {
        title: '60-second self-intro',
        language: 'text',
        code: `I am a senior frontend engineer with a strong React and TypeScript background.
Over the last few years I worked mostly on complex product interfaces where
performance, API contracts, state management, and delivery quality mattered a lot.

I am most useful when a team needs someone who can both implement and structure:
break down a feature, clarify backend contracts, improve test reliability,
and help ship changes without creating long-term chaos.`,
      },
    ],
  },
  {
    id: 'behavioral-technical-tradeoff',
    question: 'Describe a difficult technical decision you made and the trade-off behind it.',
    category: 'Behavioral',
    level: 'senior',
    terms: [
      {
        en: 'Trade-off',
        ru: 'Компромисс',
        description: 'Сознательный выбор между несколькими несовместимыми плюсами и минусами.',
      },
      {
        en: 'Decision framing',
        ru: 'Формулировка решения',
        description: 'Способ объяснить, какие варианты были и почему выбран один из них.',
      },
    ],
    shortAnswer:
      'Интервьюер здесь проверяет не "идеальное решение", а твой способ мыслить: какие варианты ты видел, какие ограничения учитывал, как принял решение и что получил в результате. Хороший ответ всегда содержит контекст и цену выбора.',
    fullAnswer: `## Как строить ответ

1. Какой был контекст
2. Какие варианты реально рассматривались
3. Что было важнее всего: срок, качество, масштабируемость, risk reduction
4. Почему выбран этот вариант
5. Что получилось в итоге

## Что делает ответ сильнее

- назвать не только плюсы, но и минусы своего решения
- показать, что решение было соразмерно контексту

## Что плохо звучит

"Мы сделали X, потому что это best practice."

Лучше:

"Мы выбрали X, потому что в том контексте важнее были скорость rollout и предсказуемость, а не идеальная абстракция."`,
    examples: [
      {
        title: 'Trade-off answer skeleton',
        language: 'text',
        code: `Situation:
- large workflow refactor under deadline

Options:
- quick patch in existing module
- slower feature-slice extraction

Decision:
- extract only the critical domain boundary now,
  keep some legacy adapters temporarily

Trade-off:
- not perfectly clean architecture
- but safer rollout and lower regression risk`,
      },
    ],
  },
  {
    id: 'behavioral-disagreement',
    question: 'Tell me about a time when you disagreed with a backend engineer or product manager.',
    category: 'Behavioral',
    level: 'senior',
    terms: [
      {
        en: 'Disagreement',
        ru: 'Рабочее несогласие',
        description: 'Нормальная ситуация, где у сторон разные приоритеты или гипотезы.',
      },
      {
        en: 'Alignment',
        ru: 'Выравнивание понимания',
        description: 'Процесс приведения команды к общему контексту и решению.',
      },
      {
        en: 'Outcome-oriented communication',
        ru: 'Коммуникация через результат',
        description: 'Обсуждение не через "кто прав", а через impact на продукт, сроки и риски.',
      },
    ],
    shortAnswer:
      'Здесь важно показать, что ты умеешь спорить по делу и не разрушать сотрудничество. Лучший ответ описывает конфликт интересов, твой способ прояснить факты и то, как команда пришла к лучшему решению без лишней драмы.',
    fullAnswer: `## Что интервьюер хочет понять

- умеешь ли ты спорить без эго
- можешь ли ты перевести спор из мнений в факты и trade-offs
- сохраняешь ли ты рабочее сотрудничество после конфликта

## Хорошая структура

- в чём было расхождение
- какой риск ты видел
- как ты это донёс
- как команда приняла решение
- какой был результат

## Полезная формулировка

"Я стараюсь не спорить абстрактно. Я перевожу разговор в конкретику: impact, rollout, testability, ownership."`,
    examples: [
      {
        title: 'STAR-шаблон для disagreement story',
        language: 'text',
        code: `Situation:
- frontend and backend had different assumptions about API shape

Task:
- align without blocking delivery

Action:
- wrote down assumptions
- proposed two contract options
- explained rollout and testing impact

Result:
- agreed on safer option
- shipped without breaking old clients`,
      },
    ],
  },
  {
    id: 'behavioral-ambiguous-requirements',
    question: 'How do you handle ambiguous requirements and make sure a feature is delivered on time?',
    category: 'Behavioral',
    level: 'senior',
    terms: [
      {
        en: 'Ambiguity',
        ru: 'Неопределённость требований',
        description: 'Ситуация, когда детали, ограничения или критерии готовности ещё не ясны.',
      },
      {
        en: 'Delivery risk',
        ru: 'Риск поставки',
        description: 'Фактор, который может сорвать срок или ухудшить качество результата.',
      },
      {
        en: 'Scope clarification',
        ru: 'Уточнение объёма',
        description: 'Прояснение того, что действительно входит в задачу и что можно отложить.',
      },
    ],
    shortAnswer:
      'Я не жду, что неоднозначность исчезнет сама. Сначала раскладываю unknowns: бизнес-правила, API, edge cases, критерии готовности. Потом фиксирую минимальный scope, зависимости и риски. Это и помогает уложиться в срок без ложного ощущения контроля.',
    fullAnswer: `## Как я подхожу к неоднозначной задаче

1. Выделяю неизвестные
2. Уточняю обязательный outcome
3. Отделяю must-have от nice-to-have
4. Делаю риски видимыми
5. Регулярно обновляю статус по фактам

## Что важно на интервью

Интервьюер хочет услышать не "я сам всё разберу", а зрелое управление неопределённостью.

Хорошая мысль:

"Сроки лучше защищаются не оптимизмом, а ранним прояснением границ и зависимостей."`,
    examples: [
      {
        title: 'Структура ответа',
        language: 'text',
        code: `When requirements are ambiguous, I first identify what is unclear:
- business rules
- API expectations
- edge cases
- delivery constraints

Then I align on:
- minimal shippable scope
- dependencies
- risk areas
- check-in points`,
      },
    ],
  },
  {
    id: 'behavioral-delivery-on-time',
    question: 'What do you do when you realize the original estimate was wrong or a feature may miss the deadline?',
    category: 'Behavioral',
    level: 'senior',
    terms: [
      {
        en: 'Estimate',
        ru: 'Оценка',
        description: 'Предварительное предположение о стоимости работы во времени и рисках.',
      },
      {
        en: 'Mitigation',
        ru: 'Снижение риска',
        description: 'Действия, уменьшающие impact проблемы.',
      },
      {
        en: 'Expectation management',
        ru: 'Управление ожиданиями',
        description: 'Прозрачная коммуникация о реальном статусе и вариантах решения.',
      },
    ],
    shortAnswer:
      'Я сообщаю о риске рано, объясняю причину, приношу варианты и рекомендацию. Senior-реакция — не молча надеяться успеть, а превратить проблему в управляемое решение: сократить scope, разбить релиз, скрыть часть за feature flag или пересогласовать сроки.',
    fullAnswer: `## Что важно

Ошибиться в оценке нормально.  
Плохо — скрывать это до самого дедлайна.

## Как я действую

- подтверждаю фактами, что оценка уехала
- локализую причину
- формулирую варианты
- даю recommendation, а не просто проблему

## Что полезно сказать

"Когда оценка ломается, моя задача — как можно раньше сделать ситуацию понятной для команды и помочь выбрать лучший компромисс."`,
    examples: [
      {
        title: 'Формула эскалации',
        language: 'text',
        code: `What changed:
- API complexity is higher than expected
- extra conflict handling is required

Impact:
- current deadline is at risk

Options:
- reduce scope
- split release
- move deadline

Recommendation:
- ship core flow now, advanced path later`,
      },
    ],
  },
  {
    id: 'behavioral-incident-ownership',
    question: 'Tell me about a bug or incident that was your responsibility.',
    category: 'Behavioral',
    level: 'senior',
    terms: [
      {
        en: 'Ownership',
        ru: 'Ответственность',
        description: 'Готовность не только исправить проблему, но и довести расследование и системный fix до конца.',
      },
      {
        en: 'Root cause',
        ru: 'Корневая причина',
        description: 'Не просто место падения, а исходная причина, из-за которой инцидент стал возможен.',
      },
      {
        en: 'Postmortem',
        ru: 'Разбор инцидента',
        description: 'Структурированное понимание причин, impact и preventive actions.',
      },
    ],
    shortAnswer:
      'Здесь важно показать зрелость: не перекладывать вину, а описать impact, mitigation, root cause и preventive actions. Сильный ответ всегда заканчивается тем, что изменилось в системе или процессе после инцидента.',
    fullAnswer: `## Что хочет услышать интервьюер

- ты умеешь брать ответственность
- не оправдываешься и не обвиняешь
- умеешь разделить hotfix и long-term prevention

## Хорошая структура

- что произошло
- какой был impact
- что ты сделал сразу
- в чём оказалась root cause
- что поменяли, чтобы история не повторилась

## Формулировка, которая хорошо работает

"Я стараюсь не считать инцидент закрытым после hotfix. Он закрыт, когда понятна корневая причина и есть preventive action."`,
    examples: [
      {
        title: 'Incident story skeleton',
        language: 'text',
        code: `Situation:
- production flow started failing after release

Immediate action:
- localized blast radius
- rolled back / enabled fallback
- coordinated with backend and support

Root cause:
- contract drift + missing guard in frontend

Prevention:
- contract checks in CI
- better runtime validation
- rollout checklist update`,
      },
    ],
  },
]
