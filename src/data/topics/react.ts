// Types
import type { Topic } from '@/types'

export const reactTopic: Topic = {
  id: 'react',
  title: 'React',
  icon: '⚛️',
  description: 'Компоненты, хуки, контекст, производительность и паттерны',
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
      id: 'use-state',
      title: 'useState',
      description: 'Локальное состояние компонента',
      explanation: `\`useState\` добавляет локальное состояние к функциональному компоненту.

**Ключевые факты:**
- Возвращает \`[value, setter]\`
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

**Cleanup функция** — возвращается из effect, вызывается при размонтировании или перед следующим запуском.`,
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

**Паттерн "latest ref"** — сохранение последней версии callback без зависимостей в useEffect.`,
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
- **Reducer** — чистая функция \`(state, action) => newState\``,
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

**Когда использовать:**
- Тема (dark/light)
- Текущий пользователь
- Язык / локализация
- Глобальные настройки

**Когда НЕ использовать:**
- Для состояния, которое меняется часто — все потребители перерисуются
- Можно решить поднятием состояния или composition

**Оптимизация:** разделяй контексты на быстро/редко меняющиеся части.`,
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
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
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
