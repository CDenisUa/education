// Types
import type { Topic } from '@/types'

export const reactTopic: Topic = {
  id: 'react',
  title: 'React',
  icon: '⚛️',
  description: 'Компоненты, хуки, reconciliation, Fiber, concurrent features и React 19 API',
  sections: [
    {
      id: 'components',
      title: 'Компоненты',
      description: 'Функциональные компоненты, JSX и props',
      explanation: `Компонент — функция, которая принимает props и возвращает JSX.

**JSX:**
- Компилируется в \`React.createElement()\` вызовы
- Атрибуты camelCase: \`className\`, \`onClick\`, \`htmlFor\`
- Любое JS-выражение в \`{}\`
- Один корневой элемент (или Fragment \`<></>\`)

**Props:**
- Только для чтения
- Любые данные: примитивы, объекты, функции, JSX
- \`children\` — специальный prop для вложенного содержимого`,
      examples: [
        {
          title: 'Анатомия компонента',
          language: 'tsx',
          code: `interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={\`
        \${variants[variant]}
        \${sizes[size]}
        rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
      \`}
    >
      {children ?? label}
    </button>
  )
}`,
        },
        {
          title: 'Composition pattern',
          language: 'tsx',
          code: `// Compound components
interface CardProps {
  children: React.ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={\`rounded-lg border bg-white shadow-sm \${className}\`}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children }: CardProps) {
  return <div className="border-b px-6 py-4">{children}</div>
}

Card.Body = function CardBody({ children }: CardProps) {
  return <div className="px-6 py-4">{children}</div>
}

Card.Footer = function CardFooter({ children }: CardProps) {
  return <div className="border-t px-6 py-4">{children}</div>
}

// Использование
<Card>
  <Card.Header><h2>Заголовок</h2></Card.Header>
  <Card.Body><p>Содержимое</p></Card.Body>
  <Card.Footer><Button label="OK" /></Card.Footer>
</Card>`,
        },
      ],
      demoComponent: 'ComponentsDemo',
    },
    {
      id: 'react-mental-model',
      title: 'Как React обновляет UI',
      description: 'State, render, commit и Virtual DOM простыми словами',
      explanation: `React удобно понимать так: ты меняешь данные, а React сам приводит экран к нужному виду.

## Главная цепочка
- событие или \`setState\` запускают обновление
- React снова вызывает компонент и получает **новое описание UI**
- потом React сравнивает новый результат с прошлым
- в браузер попадают только нужные изменения

## Простая аналогия
Сначала React рисует интерфейс **на бумаге**. Это черновик, который обычно называют Virtual DOM. Потом он сравнивает новый черновик со старым и только после этого идёт в реальный DOM.

## Что важно понять
- ре-рендер значит "компонент вызвали ещё раз", а не "весь DOM уничтожили"
- state ведёт себя как **снимок на момент конкретного рендера**
- render должен быть чистым: без запросов, таймеров и мутаций
- в Strict Mode React может вызвать render дважды в dev, чтобы быстрее найти нечистую логику`,
      examples: [
        {
          title: 'State как снимок',
          language: 'tsx',
          code: `function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    console.log(count) // 0
    setCount(count + 1)
    console.log(count) // всё ещё 0
  }

  return (
    <button onClick={handleClick}>
      Счётчик: {count}
    </button>
  )
}

// setCount не меняет переменную count мгновенно.
// Он просит React выполнить новый render с новым состоянием.`,
        },
        {
          title: 'Render не равен полному обновлению DOM',
          language: 'tsx',
          code: `function Clock({ time }: { time: string }) {
  return (
    <>
      <h1>{time}</h1>
      <input placeholder="Попробуй ввести текст" />
    </>
  )
}

// Если time меняется каждую секунду,
// React обновит <h1>, но не будет заново создавать <input>,
// потому что элемент остался на том же месте в дереве.`,
        },
      ],
    },
    {
      id: 'reconciliation-and-keys',
      title: 'Reconciliation и key',
      description: 'Как React сравнивает деревья и почему key это не формальность',
      explanation: `Полное сравнение двух деревьев UI было бы слишком дорогим, поэтому React использует **эвристики** и работает быстро в большинстве обычных случаев.

## Главные правила сравнения
- если у элемента поменялся **type**, React сносит старое поддерево и создаёт новое
- если type тот же, React обновляет props и пытается сохранить состояние
- списки без \`key\` React сравнивает **по позиции**
- списки с \`key\` React сравнивает **по личности элемента**

## Как думать о key
\`key\` — это паспорт элемента. Он нужен не "для React вообще", а чтобы React понял: это тот же объект или уже другой.

## Практический вывод
- \`key={index}\` опасен, если список можно вставлять, удалять или сортировать
- стабильный \`key\` должен приходить из данных: \`id\`, \`slug\`, \`email\`
- смена \`key\` — это законный способ **сбросить state** компонента`,
      examples: [
        {
          title: 'Плохой и хороший key',
          language: 'tsx',
          code: `type Todo = {
  id: string
  text: string
}

function BadList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  )
}

function GoodList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}

// Если вставить новый элемент в начало,
// index-key может "перепутать" состояние строк списка.
// key={todo.id} сохраняет правильную связь между данными и UI.`,
        },
        {
          title: 'key как сброс состояния',
          language: 'tsx',
          code: `function ProfilePage({ userId }: { userId: string }) {
  return <ProfileForm key={userId} userId={userId} />
}

function ProfileForm({ userId }: { userId: string }) {
  const [comment, setComment] = useState('')

  return (
    <>
      <h2>Профиль: {userId}</h2>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
    </>
  )
}

// Когда userId меняется, меняется и key.
// React размонтирует старую форму и смонтирует новую,
// поэтому локальный state сбросится автоматически.`,
        },
      ],
    },
    {
      id: 'use-state',
      title: 'useState',
      description: 'Локальное состояние компонента',
      explanation: `\`useState\` даёт компоненту **память** между рендерами.

**Ключевые факты:**
- state — это **снимок** на момент текущего рендера
- Возвращает \`[value, setter]\`
- setter имеет **стабильную ссылку** между рендерами
- Setter может принимать **новое значение** или **функцию обновления**
- Функция обновления — когда новое состояние зависит от предыдущего
- Обновление асинхронно — setState не меняет значение сразу
- React батчит несколько setState в один ре-рендер (React 18+)
- Для объектов — нужно создавать **новый объект** (иммутабельность)`,
      examples: [
        {
          title: 'Паттерны useState',
          language: 'tsx',
          code: `// Примитив
const [count, setCount] = useState(0)
const [name, setName] = useState('')
const [isOpen, setIsOpen] = useState(false)

// Объект — всегда создаём новый
const [user, setUser] = useState({ name: '', email: '' })

const updateName = (name: string) => {
  setUser(prev => ({ ...prev, name })) // spread для иммутабельности
}

// Массив
const [items, setItems] = useState<string[]>([])

const addItem = (item: string) => {
  setItems(prev => [...prev, item])
}

const removeItem = (index: number) => {
  setItems(prev => prev.filter((_, i) => i !== index))
}

// Ленивая инициализация — функция вызывается один раз
const [data] = useState(() => {
  return JSON.parse(localStorage.getItem('data') ?? '{}')
})

// Функциональное обновление — когда зависит от предыдущего
const increment = () => setCount(prev => prev + 1)`,
        },
        {
          title: 'Toggle и derived state',
          language: 'tsx',
          code: `// Toggle
const [isDark, setIsDark] = useState(false)
const toggle = () => setIsDark(prev => !prev)

// Derived state — вычисляется, не хранится
function SearchList() {
  const [items] = useState(['Apple', 'Banana', 'Cherry', 'Date'])
  const [query, setQuery] = useState('')

  // НЕ НУЖЕН useState для filteredItems!
  const filtered = query
    ? items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
    : items

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </>
  )
}`,
        },
      ],
      demoComponent: 'UseStateDemo',
    },
    {
      id: 'use-effect',
      title: 'useEffect',
      description: 'Побочные эффекты: синхронизация с внешними системами',
      explanation: `\`useEffect\` синхронизирует компонент с **внешней системой** (DOM, API, подписки).

**Не используй useEffect для:**
- Трансформации данных для рендера — делай это прямо при рендере
- Обработки пользовательских событий — используй обработчики
- Инициализации приложения — делай вне компонента

**Зависимости:**
- \`[]\` — только при монтировании
- \`[a, b]\` — при изменении \`a\` или \`b\`
- Без массива — при каждом рендере (редко нужно)

**Timing:**
- \`useEffect\` запускается **после paint**
- \`useLayoutEffect\` запускается **до paint** и нужен редко: обычно для измерения DOM без визуального "скачка"

**Cleanup функция** — возвращается из effect, вызывается при размонтировании или перед следующим запуском.

Если внутри effect нужно читать **последние props/state**, но не хочется заново переподписывать effect, в React 19 для этого есть \`useEffectEvent\`.`,
      examples: [
        {
          title: 'Правильные use cases',
          language: 'tsx',
          code: `// 1. Fetch данных (лучше использовать React Query)
useEffect(() => {
  let cancelled = false

  async function loadData() {
    setLoading(true)
    try {
      const data = await fetchUser(userId)
      if (!cancelled) setUser(data)
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  loadData()
  return () => { cancelled = true } // cleanup предотвращает race condition
}, [userId])

// 2. Подписка на событие
useEffect(() => {
  const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
  const mq = window.matchMedia('(max-width: 768px)')
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}, [])

// 3. Синхронизация с DOM
useEffect(() => {
  document.title = count === 0
    ? 'Нет уведомлений'
    : \`(\${count}) Уведомления\`
}, [count])

// 4. Интервал
useEffect(() => {
  const id = setInterval(() => setTime(Date.now()), 1000)
  return () => clearInterval(id)
}, [])`,
        },
        {
          title: 'Классические ошибки',
          language: 'tsx',
          code: `// ❌ Бесконечный цикл — объект создаётся при каждом рендере
useEffect(() => {
  fetchData(options)
}, [options]) // { page: 1 } !== { page: 1 }

// ✅ Используй примитивы в зависимостях
useEffect(() => {
  fetchData({ page, sort })
}, [page, sort])

// ❌ Устаревшая переменная (stale closure)
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // count всегда = 0!
  }, 1000)
  return () => clearInterval(id)
}, []) // count не в зависимостях

// ✅ Функциональное обновление
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // всегда актуальное значение
  }, 1000)
  return () => clearInterval(id)
}, [])`,
        },
      ],
      demoComponent: 'UseEffectDemo',
    },
    {
      id: 'fiber-and-phases',
      title: 'Fiber tree и фазы рендера',
      description: 'current tree, workInProgress, Render Phase и Commit Phase',
      explanation: `Fiber — это внутренняя структура React, где **каждый компонент представлен отдельным узлом**.

## Простая картинка в голове
Представь, что React ведёт работу не прямо на экране, а на карточках задачи. Для каждого компонента есть Fiber-узел: там React хранит тип компонента, hooks, pending-обновления и служебные флаги.

## Double buffering
React держит два дерева:
- **current** — то, что уже показано пользователю
- **workInProgress** — дерево, которое React сейчас собирает в фоне

Когда работа готова, React атомарно переключает корень: новое дерево становится текущим. Поэтому пользователь не видит "половину обновления".

## Фазы
- **Trigger** — что-то вызвало обновление: событие, setState, context
- **Render Phase** — React считает новый UI; эту фазу можно прервать и пересчитать
- **Commit Phase** — React меняет DOM и запускает layout/effect-логику; эта фаза короткая и синхронная

## Почему хуки нельзя вызывать в условиях
React ориентируется на **порядок вызовов hooks** внутри Fiber-узла. Если порядок между рендерами меняется, React начинает читать не те данные.

## Senior-словарь
У Fiber-узла часто обсуждают поля \`type\`, \`stateNode\`, \`memoizedState\`, \`alternate\`, \`lanes\` и \`flags\`. Не нужно помнить все детали, но полезно понимать их смысл.`,
      examples: [
        {
          title: 'current и workInProgress',
          language: 'text',
          code: `current tree
Root
└── ProductPage
    └── Reviews

workInProgress tree
Root
└── ProductPage
    └── Reviews
        alternate -> ссылка на текущий Reviews fiber

Что происходит:
1. Пользователь нажал кнопку
2. React начал строить workInProgress
3. Если всё готово, происходит commit
4. workInProgress становится новым current tree`,
        },
        {
          title: 'Почему hooks нельзя вызывать условно',
          language: 'tsx',
          code: `function BadComponent({ isOpen }: { isOpen: boolean }) {
  const [count] = useState(0)

  if (isOpen) {
    useEffect(() => {
      console.log('Открыто')
    }, [])
  }

  const [name] = useState('Ada')
  return <div>{count} {name}</div>
}

// При isOpen=false второй hook — это useState(name)
// При isOpen=true второй hook — это useEffect
// Порядок сломался, React "съезжает" по списку hooks.

function GoodComponent({ isOpen }: { isOpen: boolean }) {
  const [count] = useState(0)
  const [name] = useState('Ada')

  useEffect(() => {
    if (isOpen) {
      console.log('Открыто')
    }
  }, [isOpen])

  return <div>{count} {name}</div>
}`,
        },
      ],
    },
    {
      id: 'concurrent-react',
      title: 'Concurrent React',
      description: 'Scheduler, Lanes, startTransition, useTransition и useDeferredValue',
      explanation: `Современный React умеет различать **срочную** и **несрочную** работу.

## Как думать о приоритетах
- ввод в поле, клик, фокус — срочно
- тяжёлая фильтрация, сортировка, графики — можно сделать в фоне

Внутри React этим управляет Scheduler. Он раскладывает обновления по **Lanes**. Проще всего представить lanes как несколько дорожек с разным приоритетом.

## Главные API
- \`startTransition\` — помечает обновление как несрочное
- \`useTransition\` — делает то же самое, но ещё даёт \`isPending\`
- \`useDeferredValue\` — откладывает обновление конкретного значения для медленного поддерева

## Практический смысл
- input должен печататься сразу
- список результатов может обновиться чуть позже
- долгий render можно прервать более срочным действием пользователя

## Важные caveats
- transitions не подходят для **контролируемого значения input**
- \`startTransition\` помечает только синхронно запланированные обновления
- \`useDeferredValue\` не отменяет сетевые запросы сам по себе`,
      examples: [
        {
          title: 'useTransition для тяжёлого списка',
          language: 'tsx',
          code: `function SearchPage({ allItems }: { allItems: string[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value

    setQuery(next) // срочное обновление

    startTransition(() => {
      setFilter(next) // несрочное обновление
    })
  }

  const visibleItems = allItems.filter(item =>
    item.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Обновляем список...</p>}
      <ResultsList items={visibleItems} />
    </>
  )
}`,
        },
        {
          title: 'useDeferredValue для медленного поддерева',
          language: 'tsx',
          code: `function SearchScreen({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.title.toLowerCase().includes(deferredQuery.toLowerCase())
    )
  }, [products, deferredQuery])

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск..."
      />

      {query !== deferredQuery && <p>Показываем старый список, новый уже считается...</p>}

      <SlowProductGrid items={filteredProducts} />
    </>
  )
}`,
        },
      ],
    },
    {
      id: 'use-memo-callback',
      title: 'useMemo и useCallback',
      description: 'Мемоизация вычислений и функций',
      explanation: `Мемоизация позволяет избежать лишних вычислений и ре-рендеров.

**useMemo** — кэширует **результат вычисления**:
- Используй когда вычисление действительно дорогое
- Вычисляется только при изменении зависимостей

**useCallback** — кэширует **функцию**:
- Нужен когда функция передаётся в \`React.memo\` компонент
- Или является зависимостью useEffect

**Что важно в современном React:**
- если в проекте включён React Compiler, часть ручной мемоизации может стать не нужна
- \`React.memo\` бесполезен, если ты всё равно передаёшь новые объекты и функции каждый render

**Правило:** Не добавляй мемоизацию преждевременно. Сначала измерь производительность.`,
      examples: [
        {
          title: 'useMemo для тяжёлых вычислений',
          language: 'tsx',
          code: `function DataTable({ data, sortKey, filter }: Props) {
  // Фильтрация + сортировка больших массивов — мемоизируем
  const processed = useMemo(() => {
    return data
      .filter(item => item.name.includes(filter))
      .sort((a, b) => a[sortKey] > b[sortKey] ? 1 : -1)
  }, [data, sortKey, filter]) // пересчитывается только при изменении

  return <table>...</table>
}

// НЕ нужна мемоизация для простых вычислений:
// const doubled = useMemo(() => x * 2, [x]) — лишнее!
// const doubled = x * 2 // просто так`,
        },
        {
          title: 'useCallback для стабильных функций',
          language: 'tsx',
          code: `const ExpensiveList = React.memo(({ onSelect }: { onSelect: (id: number) => void }) => {
  console.log('List rendered')
  return <ul>...</ul>
})

function Parent() {
  const [selected, setSelected] = useState<number | null>(null)
  const [theme, setTheme] = useState('dark')

  // ❌ Без useCallback — новая функция при каждом рендере
  // const handleSelect = (id: number) => setSelected(id)

  // ✅ С useCallback — стабильная ссылка
  const handleSelect = useCallback((id: number) => {
    setSelected(id)
  }, []) // пустой массив — функция никогда не меняется

  // При смене theme — ExpensiveList НЕ ре-рендерится
  return (
    <>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
        Тема: {theme}
      </button>
      <ExpensiveList onSelect={handleSelect} />
    </>
  )
}`,
        },
      ],
      demoComponent: 'MemoDemo',
    },
    {
      id: 'use-ref',
      title: 'useRef',
      description: 'Ссылки на DOM, мутабельные значения без ре-рендера',
      explanation: `\`useRef\` возвращает мутабельный объект \`{ current: value }\`.

**Два сценария:**
1. **Доступ к DOM-узлу** — передаётся в \`ref\` атрибут
2. **Мутабельное значение** — изменение НЕ вызывает ре-рендер

**Отличие от useState:**
- \`useRef\` — изменение не перерисовывает компонент
- \`useState\` — изменение вызывает ре-рендер

**Паттерн "latest ref"** — сохранение последней версии callback без зависимостей в useEffect.

В современном коде для части таких сценариев удобнее \`useEffectEvent\`, если задача именно в effect-логике, а не в хранении произвольного значения.`,
      examples: [
        {
          title: 'Доступ к DOM',
          language: 'tsx',
          code: `function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  // Авто-фокус при монтировании
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Программный фокус
  const focusInput = () => {
    inputRef.current?.focus()
  }

  // Получить значение без controlled input
  const handleSubmit = () => {
    const value = inputRef.current?.value ?? ''
    console.log('Search:', value)
  }

  return (
    <div>
      <input ref={inputRef} type="search" />
      <button onClick={focusInput}>Фокус</button>
      <button onClick={handleSubmit}>Найти</button>
    </div>
  )
}`,
        },
        {
          title: 'Значения без ре-рендера',
          language: 'tsx',
          code: `function StopWatch() {
  const [time, setTime] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      setTime(t => t + 10)
    }, 10)
  }

  const stop = () => {
    clearInterval(intervalRef.current!)
    intervalRef.current = null
  }

  return (
    <div>
      <p>{(time / 1000).toFixed(2)}s</p>
      <button onClick={start}>Старт</button>
      <button onClick={stop}>Стоп</button>
    </div>
  )
}

// Latest ref pattern — избегаем stale closure
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref
}`,
        },
      ],
      demoComponent: 'UseRefDemo',
    },
    {
      id: 'use-reducer',
      title: 'useReducer',
      description: 'Сложная логика состояния через reducer',
      explanation: `\`useReducer\` — альтернатива \`useState\` для сложной логики состояния.

**Когда использовать:**
- Несколько связанных состояний
- Следующее состояние зависит от предыдущего
- Сложные переходы состояний
- Логику состояния нужно вынести и протестировать отдельно

**Структура:**
- **State** — текущее состояние
- **Action** — описание что произошло (\`{ type, payload }\`)
- **Reducer** — чистая функция \`(state, action) => newState\`

**Важно:**
- \`dispatch\` имеет стабильную ссылку между рендерами
- \`useReducer\` хорошо ложится на state machine и сложные переходы
- это не глобальный store, а просто другой способ локально управлять состоянием`,
      examples: [
        {
          title: 'Todo List с useReducer',
          language: 'tsx',
          code: `type Todo = { id: string; text: string; done: boolean }
type Action =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'CLEAR_DONE' }

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [...state, {
        id: crypto.randomUUID(),
        text: action.text,
        done: false
      }]
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id
          ? { ...todo, done: !todo.done }
          : todo
      )
    case 'DELETE':
      return state.filter(todo => todo.id !== action.id)
    case 'CLEAR_DONE':
      return state.filter(todo => !todo.done)
    default:
      return state
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, [])
  const [text, setText] = useState('')

  const add = () => {
    if (!text.trim()) return
    dispatch({ type: 'ADD', text })
    setText('')
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={add}>Добавить</button>
      <button onClick={() => dispatch({ type: 'CLEAR_DONE' })}>
        Очистить выполненные
      </button>
      {todos.map(todo => (
        <div key={todo.id}>
          <span
            onClick={() => dispatch({ type: 'TOGGLE', id: todo.id })}
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}`,
        },
      ],
      demoComponent: 'UseReducerDemo',
    },
    {
      id: 'context',
      title: 'Context API',
      description: 'Передача данных через дерево без prop drilling',
      explanation: `Context позволяет передавать данные глубоко в дерево компонентов без props.

Контекст удобно понимать как **широковещательный канал**: когда значение provider меняется, React сообщает об этом всем потребителям ниже по дереву.

**Когда использовать:**
- Тема (dark/light)
- Текущий пользователь
- Язык / локализация
- Глобальные настройки

**Когда НЕ использовать:**
- Для состояния, которое меняется часто — все потребители перерисуются
- Можно решить поднятием состояния или composition

**Оптимизация:** разделяй контексты на быстро/редко меняющиеся части.

В React 19 ты можешь встретить две записи provider:
- старая: \`<ThemeContext.Provider value={value}>\`
- новая: \`<ThemeContext value={value}>\``,
      examples: [
        {
          title: 'Полный паттерн Context',
          language: 'tsx',
          code: `// ThemeContext.tsx
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  )

  return (
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  )
}

// Типобезопасный хук
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Использование
function Header() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
      </button>
    </header>
  )
}`,
        },
      ],
      demoComponent: 'ContextDemo',
    },
    {
      id: 'react-19-hooks',
      title: 'Новые API React 19',
      description: 'useEffectEvent, useOptimistic, useActionState и use',
      explanation: `React 19 добавил несколько API, которые закрывают частые боли в асинхронном UI.

## Что дают новые хуки
- \`useEffectEvent\` — читать **свежие props/state** внутри effect без лишних переподписок
- \`useOptimistic\` — мгновенно показать результат до ответа сервера
- \`useActionState\` — получить result, action и \`isPending\` для async-операции
- \`use\` — читать Promise или Context и работать вместе с Suspense

## Как думать о них проще
- \`useEffectEvent\`: "подписка остаётся той же, но callback всегда видит новые значения"
- \`useOptimistic\`: "сначала делаем UI счастливым, потом подтверждаем результат"
- \`useActionState\`: "форма или action сами хранят pending и последний результат"
- \`use\`: "компонент может подождать ресурс прямо во время render"

## Практический вывод
- эти API не заменяют базовые hooks, а закрывают неудобные сценарии вокруг effects и async
- особенно полезны в формах, optimistic UI и Suspense-потоках`,
      examples: [
        {
          title: 'useEffectEvent вместо stale closure в effect',
          language: 'tsx',
          code: `import { useEffect, useEffectEvent } from 'react'

function ChatRoom({
  roomId,
  theme,
}: {
  roomId: string
  theme: 'light' | 'dark'
}) {
  const onConnected = useEffectEvent(() => {
    showNotification('Подключено', theme)
  })

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()
    connection.on('connected', () => {
      onConnected()
    })

    return () => connection.disconnect()
  }, [roomId]) // theme не заставляет переподключаться

  return <p>Комната: {roomId}</p>
}`,
        },
        {
          title: 'useOptimistic и useActionState',
          language: 'tsx',
          code: `import { useActionState, useOptimistic } from 'react'

type Comment = {
  id: string
  text: string
  sending?: boolean
}

async function sendComment(
  previousState: string | null,
  formData: FormData,
) {
  const message = String(formData.get('message') ?? '')

  try {
    await api.comments.create({ message })
    return null
  } catch {
    return 'Не удалось отправить комментарий'
  }
}

function Comments({ initialComments }: { initialComments: Comment[] }) {
  const [comments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: string) => [
      ...state,
      {
        id: crypto.randomUUID(),
        text: newComment,
        sending: true,
      },
    ]
  )

  const [error, submitAction, isPending] = useActionState(sendComment, null)

  function formAction(formData: FormData) {
    const message = String(formData.get('message') ?? '')
    addOptimisticComment(message)
    submitAction(formData)
  }

  return (
    <>
      <form action={formAction}>
        <input name="message" />
        <button disabled={isPending}>Отправить</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            {comment.text}
            {comment.sending && ' (Отправляем...)'}
          </li>
        ))}
      </ul>
    </>
  )
}`,
        },
        {
          title: 'use с Suspense',
          language: 'tsx',
          code: `import { Suspense, use } from 'react'

function ProductPage({
  productPromise,
}: {
  productPromise: Promise<{ name: string; price: number }>
}) {
  return (
    <Suspense fallback={<p>Загружаем товар...</p>}>
      <ProductDetails productPromise={productPromise} />
    </Suspense>
  )
}

function ProductDetails({
  productPromise,
}: {
  productPromise: Promise<{ name: string; price: number }>
}) {
  const product = use(productPromise)

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.price} €</p>
    </article>
  )
}`,
        },
      ],
    },
    {
      id: 'senior-patterns',
      title: 'Senior Patterns',
      description: 'stale closure, useLayoutEffect, memo traps, Context splitting и key-reset',
      explanation: `На уровне Senior уже ждут не просто знание API, а понимание **почему оно работает именно так** и где ломаются наивные решения.

## Что обычно спрашивают
- почему stale closure появляется в таймерах и подписках
- чем \`useEffect\` отличается от \`useLayoutEffect\` относительно paint
- почему \`React.memo\` не спасает от нестабильных props
- почему один большой Context быстро становится узким местом
- как \`key\` помогает не только в списках, но и для сброса state

## Полезные ориентиры
- stale closure лечится через функциональный setState, зависимости, ref или \`useEffectEvent\`
- \`useLayoutEffect\` нужен редко, в основном для измерения DOM до paint
- и \`setState\`, и \`dispatch\` из \`useReducer\` имеют стабильную ссылку
- Context лучше делить на "данные" и "действия", если обновления частые
- \`React.memo\` помогает только когда props действительно стабильны`,
      examples: [
        {
          title: 'useEffect vs useLayoutEffect',
          language: 'tsx',
          code: `function Tooltip() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const nextHeight = ref.current?.getBoundingClientRect().height ?? 0
    setHeight(nextHeight)
  }, [])

  return (
    <div ref={ref} style={{ marginTop: -height / 2 }}>
      Подсказка
    </div>
  )
}

// useLayoutEffect полезен, когда нужно измерить DOM
// до того, как браузер покажет кадр пользователю.`,
        },
        {
          title: 'React.memo и split context',
          language: 'tsx',
          code: `const UserCard = React.memo(function UserCard({
  className,
  onOpen,
}: {
  className: string
  onOpen: () => void
}) {
  return <button className={className} onClick={onOpen}>Открыть</button>
})

function BadParent() {
  const [theme, setTheme] = useState('dark')

  return (
    <UserCard
      className={theme === 'dark' ? 'text-white' : 'text-black'}
      onOpen={() => console.log('open')}
    />
  )
}

// React.memo не спасает:
// onOpen создаётся заново на каждом render.

const ThemeValueContext = createContext<'light' | 'dark'>('dark')
const ThemeActionsContext = createContext<{ toggle(): void } | null>(null)

// split context нужен, чтобы компоненты,
// которым нужны только actions, не зависели от theme value.`,
        },
      ],
    },
    {
      id: 'custom-hooks',
      title: 'Кастомные хуки',
      description: 'Переиспользуемая логика состояния и эффектов',
      explanation: `Кастомный хук — функция начинающаяся с \`use\`, которая может вызывать другие хуки.

**Принципы:**
- Один хук — одна ответственность
- Возвращай только то, что нужно потребителю
- Хуки не шарят состояние между вызовами — каждый вызов изолирован
- Имя начинается с \`use\` — это правило, не опция`,
      examples: [
        {
          title: 'Полезные кастомные хуки',
          language: 'tsx',
          code: `// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback((val: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof val === 'function'
        ? (val as (p: T) => T)(prev)
        : val
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }, [key])

  return [value, set] as const
}

// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

// useFetch
function useFetch<T>(url: string) {
  const [state, setState] = useState<{
    data: T | null
    loading: boolean
    error: Error | null
  }>({ data: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error })
        }
      })

    return () => controller.abort()
  }, [url])

  return state
}`,
        },
      ],
      demoComponent: 'CustomHooksDemo',
    },
  ],
}
