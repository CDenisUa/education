// Types
import type { InterviewQuestion } from '@/types'

export const reactQuestions: InterviewQuestion[] = [
  {
    id: 'render-commit',
    question: 'Что такое render и commit, и почему re-render не означает полный redraw DOM?',
    category: 'React',
    level: 'senior',
    terms: [
      {
        en: 'Render phase',
        ru: 'Фаза рендера',
        description: 'Этап, на котором React вызывает компонент-функцию и строит новое виртуальное дерево (VDOM). Чистая операция — без побочных эффектов и изменений DOM.',
      },
      {
        en: 'Commit phase',
        ru: 'Фаза коммита',
        description: 'Этап, на котором React применяет вычисленные изменения к реальному DOM. Здесь же запускаются эффекты (useLayoutEffect, useEffect).',
      },
      {
        en: 'Reconciliation',
        ru: 'Согласование (Reconciliation)',
        description: 'Алгоритм сравнения старого и нового виртуального дерева. React определяет минимальный набор операций, необходимых для обновления реального DOM.',
      },
      {
        en: 'Virtual DOM',
        ru: 'Виртуальный DOM',
        description: 'Лёгкое in-memory представление дерева UI в виде JS-объектов. Позволяет React вычислять diff без обращения к реальному DOM на каждый рендер.',
      },
      {
        en: 'Diffing',
        ru: 'Диффинг',
        description: 'Процесс попарного сравнения старых и новых React-элементов для нахождения минимального количества DOM-мутаций.',
      },
    ],
    shortAnswer:
      'Render — это вызов функции компонента и построение нового VDOM-дерева. Commit — это применение diff к реальному DOM. Re-render не означает полный redraw, потому что React через reconciliation находит только изменившиеся узлы и точечно обновляет DOM, а не пересоздаёт его целиком.',
    fullAnswer: `## Две фазы работы React

React разделяет обновление UI на две строго отделённые фазы: **render** и **commit**.

### Фаза Render

В фазе рендера React **вызывает функции компонентов** и строит новое дерево React-элементов (Virtual DOM). Это чисто вычислительный этап: React не трогает реальный DOM, не запускает эффекты и не делает ввод/вывод.

Именно поэтому функции компонентов должны быть **чистыми** — один и тот же props/state всегда даёт одинаковый JSX-вывод. Если функция имеет побочные эффекты, они могут сработать дважды в режиме Strict Mode — это намеренно, чтобы выявить проблемы.

### Reconciliation — diff двух деревьев

После построения нового дерева React запускает **reconciliation**: сравнивает новое и предыдущее деревья поэлементно.

Алгоритм работает по двум эвристикам:
1. **Тип узла изменился** → старый узел уничтожается, создаётся новый (вместе со всем поддеревом).
2. **Тип узла тот же** → React обновляет только изменившиеся атрибуты/пропсы, дочерние узлы рекурсируются.

Это позволяет за O(n) найти нужные изменения вместо классического O(n³) для diff деревьев.

### Фаза Commit

Только когда diff готов, React переходит к фазе коммита и **минимально мутирует реальный DOM**. Например, если изменился только \`className\` одного \`<div>\`, React выполнит ровно одну операцию: \`element.className = '...'\`.

Порядок в фазе commit:
1. **beforeMutation** — синхронно, DOM ещё не изменён
2. **mutation** — применение DOM-изменений (insertions, updates, deletions)
3. **layout** — вызовы \`useLayoutEffect\` (синхронно после мутаций)
4. После "отпускания" в браузер — вызовы \`useEffect\` (асинхронно)

### Почему re-render ≠ redraw DOM

Браузерный "redraw" — дорогая операция: layout → paint → composite. React избегает её лишних вызовов, обновляя только **необходимые узлы**.

\`\`\`tsx
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <span>Счётчик: {count}</span>  {/* обновится */}
      <button onClick={() => setCount(c => c + 1)}>+</button>  {/* не изменится */}
    </div>
  )
}
\`\`\`

При клике React ре-рендерит \`Counter\` (вызывает функцию заново), но в DOM обновит только текстовый узел внутри \`<span>\`. Элемент \`<button>\` останется нетронутым — браузер не перерисует его.

### Итог

| Этап | Что происходит | DOM |
|---|---|---|
| Render | Вызов функций компонентов, построение нового VDOM | Не меняется |
| Reconciliation | Diff старого и нового VDOM | Не меняется |
| Commit | Применение минимального diff | Точечно меняется |`,
    examples: [
      {
        title: 'Render vs Commit: наглядный пример',
        language: 'tsx',
        code: `import { useState, useEffect, useLayoutEffect } from 'react'

function Demo() {
  const [count, setCount] = useState(0)

  // Запускается в фазе commit (layout), синхронно
  useLayoutEffect(() => {
    console.log('commit: DOM уже обновлён, count =', count)
  }, [count])

  // Запускается после commit, асинхронно
  useEffect(() => {
    console.log('after commit: браузер уже отрисовал, count =', count)
  }, [count])

  // Вызов этой функции — фаза render
  console.log('render: строим VDOM, count =', count)

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
// Порядок в консоли при клике:
// render: строим VDOM, count = 1
// commit: DOM уже обновлён, count = 1
// after commit: браузер уже отрисовал, count = 1`,
      },
    ],
  },

  {
    id: 'useeffect-vs-uselayouteffect',
    question: 'Чем useEffect отличается от useLayoutEffect?',
    category: 'React',
    level: 'middle',
    terms: [
      {
        en: 'useEffect',
        ru: 'useEffect',
        description: 'Хук для выполнения побочных эффектов. Запускается асинхронно после того, как браузер отрисовал изменения DOM.',
      },
      {
        en: 'useLayoutEffect',
        ru: 'useLayoutEffect',
        description: 'Хук для эффектов, требующих синхронного доступа к DOM после его мутации, но до отрисовки браузером. Блокирует paint.',
      },
      {
        en: 'Paint',
        ru: 'Отрисовка (Paint)',
        description: 'Этап работы браузера, на котором пиксели записываются на экран. useLayoutEffect выполняется до этого этапа, useEffect — после.',
      },
      {
        en: 'Layout thrashing',
        ru: 'Layout thrashing',
        description: 'Ситуация принудительного синхронного reflow браузера из-за чередования чтения и записи DOM-свойств. useLayoutEffect помогает избежать этого.',
      },
    ],
    shortAnswer:
      'useEffect запускается асинхронно после того, как браузер отрисовал изменения — он не блокирует paint. useLayoutEffect запускается синхронно после DOM-мутаций, но до отрисовки, поэтому подходит для измерения и синхронной корректировки DOM без видимого мерцания.',
    visual: 'Порядок выполнения хуков относительно цикла отрисовки браузера.',
    fullAnswer: `## useEffect vs useLayoutEffect

Оба хука запускаются **после** фазы commit (после изменения DOM), но в разное время.

### useEffect — для большинства случаев

Подходит для: fetch-запросов, подписок, аналитики, логирования, таймеров. Не блокирует браузер, поэтому UI остаётся отзывчивым.

\`\`\`tsx
useEffect(() => {
  const controller = new AbortController()
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
  return () => controller.abort()
}, [])
\`\`\`

### useLayoutEffect — для синхронной работы с DOM

Нужен когда: вы читаете размеры/позиции DOM-элементов и сразу корректируете их. Если делать это в \`useEffect\`, пользователь увидит промежуточное состояние (мерцание).

**Типичный кейс — тултип с авто-позиционированием:**

\`\`\`tsx
function Tooltip({ anchorRef, children }) {
  const tooltipRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const tooltip = tooltipRef.current
    if (!anchor || !tooltip) return

    const rect = anchor.getBoundingClientRect()
    // Читаем позицию и сразу корректируем — до отрисовки
    tooltip.style.top = \`\${rect.bottom + 8}px\`
    tooltip.style.left = \`\${rect.left}px\`
  })

  return <div ref={tooltipRef}>{children}</div>
}
\`\`\`

Если заменить на \`useEffect\`, тултип на долю секунды появится в неправильном месте (в позиции 0,0 или где рендерится по умолчанию), а затем прыгнет — пользователь это заметит.

### Когда что использовать

| Критерий | useEffect | useLayoutEffect |
|---|---|---|
| Запрос к API | ✅ | ❌ |
| Подписки и таймеры | ✅ | ❌ |
| Чтение размеров DOM | ❌ | ✅ |
| Синхронная корректировка DOM | ❌ | ✅ |
| SSR | ✅ работает | ⚠️ только клиент |

### Важно: SSR

\`useLayoutEffect\` не работает на сервере — React выдаёт предупреждение. Для SSR-совместимых библиотек используют паттерн: \`const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect\`.

### Правило

Начинайте с \`useEffect\`. Переходите на \`useLayoutEffect\` только если видите визуальное мерцание, вызванное синхронным чтением/записью DOM.`,
    examples: [
      {
        title: 'Мерцание с useEffect vs плавность с useLayoutEffect',
        language: 'tsx',
        code: `import { useRef, useState, useLayoutEffect } from 'react'

function AutoResizeTextarea() {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')

  // С useEffect textarea сначала покажет старую высоту,
  // затем прыгнет — пользователь заметит.
  // useLayoutEffect исправляет это: высота меняется до paint.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => setValue(e.target.value)}
      style={{ overflow: 'hidden', resize: 'none' }}
    />
  )
}`,
      },
    ],
  },

  {
    id: 'hooks-conditions',
    question: 'Почему hooks нельзя вызывать в условиях?',
    category: 'React',
    level: 'junior',
    terms: [
      {
        en: 'Rules of Hooks',
        ru: 'Правила хуков',
        description: 'Два официальных ограничения React: хуки вызываются только на верхнем уровне функции компонента и только в функциональных компонентах или кастомных хуках.',
      },
      {
        en: 'Hooks call order',
        ru: 'Порядок вызова хуков',
        description: 'React идентифицирует каждый хук по его порядковому номеру в списке вызовов. Если порядок меняется между рендерами — внутреннее состояние хуков сдвигается.',
      },
      {
        en: 'Fiber node',
        ru: 'Узел Fiber',
        description: 'Внутренняя структура данных React, представляющая компонент. Содержит связный список (linked list) состояний хуков в порядке их вызова.',
      },
      {
        en: 'Linked list of hooks',
        ru: 'Связный список хуков',
        description: 'Структура, в которой React хранит состояния всех хуков компонента. Каждый элемент списка соответствует одному вызову хука по порядку.',
      },
    ],
    shortAnswer:
      'React хранит состояние хуков во внутреннем связном списке и сопоставляет каждый хук с его состоянием по порядковому индексу. Если вызвать хук внутри условия, его порядковый номер может измениться между рендерами, и React запишет данные не в тот слот — это приведёт к некорректному поведению или крэшу.',
    fullAnswer: `## Как React хранит состояние хуков

React не использует имена переменных для идентификации хуков. Вместо этого он создаёт **связный список** в памяти Fiber-узла компонента. Каждый вызов хука во время рендера добавляет (или читает) следующий элемент этого списка.

### Что происходит внутри

\`\`\`
// Первый рендер — React заполняет список
useState(0)         → slot[0]: { value: 0 }
useState('')        → slot[1]: { value: '' }
useEffect(() => {}) → slot[2]: { deps: [] }

// Второй рендер — React читает список в том же порядке
useState(0)         → читает slot[0] → получает 0
useState('')        → читает slot[1] → получает ''
useEffect(() => {}) → читает slot[2] → сравнивает deps
\`\`\`

Список работает только если порядок хуков **идентичен** на каждом рендере.

### Что сломается при условном вызове

\`\`\`tsx
// ❌ Нельзя — при isLoggedIn = false список хуков укорачивается
function Profile({ isLoggedIn }) {
  const [name, setName] = useState('') // slot[0]

  if (isLoggedIn) {
    const [role, setRole] = useState('user') // slot[1] — появляется/исчезает!
  }

  const [age, setAge] = useState(0) // slot[1] или slot[2] — зависит от условия
}
\`\`\`

При первом рендере с \`isLoggedIn = true\`:
- slot[0] → name
- slot[1] → role
- slot[2] → age

При ре-рендере с \`isLoggedIn = false\`:
- slot[0] → name ✅
- slot[1] → age ← **получает значение role!** 💥

### Правильный подход

Условная **логика** помещается **внутрь** хука, а не снаружи:

\`\`\`tsx
// ✅ Порядок хуков всегда одинаков
function Profile({ isLoggedIn }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('user') // всегда вызывается

  useEffect(() => {
    if (!isLoggedIn) return // условие внутри эффекта
    fetchRole().then(setRole)
  }, [isLoggedIn])

  return <div>{isLoggedIn ? role : 'Гость'}</div>
}
\`\`\`

Если логика всё же требует условного хука — вынесите её в **отдельный дочерний компонент**. Каждый компонент имеет свой независимый список хуков.

\`\`\`tsx
// ✅ Условный рендер компонента, а не условный хук
function App({ isLoggedIn }) {
  return isLoggedIn ? <UserProfile /> : <GuestView />
}
\`\`\`

### Почему React не сделал это умнее?

Можно было бы использовать уникальные ключи для хуков, но это потребовало бы явной передачи идентификаторов (как в некоторых других фреймворках). React намеренно выбрал подход с порядком вызовов — он более лаконичен и не требует бойлерплейта. Ограничение — приемлемый компромисс.`,
    examples: [
      {
        title: 'Правило хуков: условие внутри, а не снаружи',
        language: 'tsx',
        code: `// ❌ Нарушает Rules of Hooks — ESLint (eslint-plugin-react-hooks) выдаст ошибку
function Bad({ show }: { show: boolean }) {
  if (show) {
    const [value, setValue] = useState(0) // хук в условии
  }
  return null
}

// ✅ Условие внутри хука — порядок вызовов стабилен
function Good({ show }: { show: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!show) return
    console.log('shown, value:', value)
  }, [show, value])

  return show ? <span>{value}</span> : null
}`,
      },
    ],
  },

  {
    id: 'stale-closure',
    question: 'Что такое stale closure и как его исправить?',
    category: 'React',
    level: 'middle',
    terms: [
      {
        en: 'Closure',
        ru: 'Замыкание',
        description: 'Функция, которая сохраняет ссылки на переменные из своего лексического окружения. В React каждый рендер создаёт новые замыкания с актуальными значениями.',
      },
      {
        en: 'Stale closure',
        ru: 'Устаревшее замыкание',
        description: 'Ситуация, когда замыкание захватило старое значение переменной (из предыдущего рендера), тогда как актуальное значение уже другое.',
      },
      {
        en: 'Dependency array',
        ru: 'Массив зависимостей',
        description: 'Второй аргумент useEffect/useCallback/useMemo. Определяет, при изменении каких значений нужно пересоздавать замыкание.',
      },
      {
        en: 'useRef',
        ru: 'useRef',
        description: 'Хук, возвращающий мутируемый объект { current }. Изменение .current не вызывает ре-рендер, поэтому ref всегда содержит актуальное значение без проблемы замыканий.',
      },
      {
        en: 'Functional update',
        ru: 'Функциональное обновление',
        description: 'Форма вызова setState с коллбэком (prevState => newState). Гарантирует работу с актуальным состоянием, не зависит от замыкания.',
      },
    ],
    shortAnswer:
      'Stale closure возникает, когда функция замкнулась на старое значение переменной и использует его даже после ре-рендера. Исправляется тремя способами: правильным указанием зависимостей в хуках, использованием функционального обновления setState, или сохранением актуального значения в ref.',
    fullAnswer: `## Stale Closure в React

### Природа проблемы

Каждый рендер создаёт **новый экземпляр** всех переменных и функций компонента. Когда функция "запоминает" значение переменной через замыкание, она захватывает конкретный экземпляр из конкретного рендера.

\`\`\`tsx
// ❌ Классический пример stale closure
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // count захвачен из рендера на момент создания эффекта
      // всегда равен 0 — стейл замыкание!
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, []) // пустой массив → эффект создан один раз → count всегда 0
}
\`\`\`

### Способ 1: Добавить зависимость

Самый прямолинейный: добавить \`count\` в deps array. Эффект пересоздаётся при каждом изменении \`count\`, всегда имеет актуальное значение.

\`\`\`tsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // count актуален
  }, 1000)
  return () => clearInterval(id) // старый таймер очищается
}, [count]) // ✅ пересоздаём при изменении count
\`\`\`

Минус: таймер пересоздаётся каждую секунду — может быть нежелательно.

### Способ 2: Функциональное обновление

Для обновления стейта на основе предыдущего значения можно не захватывать текущее значение вовсе:

\`\`\`tsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // ✅ React передаёт актуальное prev
  }, 1000)
  return () => clearInterval(id)
}, []) // deps пустой — эффект создаётся один раз
\`\`\`

Это идиоматичное решение для таймеров и интервалов.

### Способ 3: Ref для нестабильных зависимостей

Когда нужно ссылаться на актуальное значение, но не хочется пересоздавать эффект, используют "ref-трюк":

\`\`\`tsx
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback)

  // Всегда держим ref актуальным
  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current() // ✅ всегда последняя версия callback
    }, delay)
    return () => clearInterval(id)
  }, [delay]) // delay стабилен → эффект не пересоздаётся
}
\`\`\`

### Способ 4: useEffectEvent (React 19+)

В React 19 появился хук \`useEffectEvent\` (ранее экспериментальный), специально для этого паттерна:

\`\`\`tsx
function Timer() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1) // нестабильная зависимость

  // onTick не попадает в deps, но всегда актуален
  const onTick = useEffectEvent(() => {
    setCount(c => c + step) // захватывает актуальный step
  })

  useEffect(() => {
    const id = setInterval(onTick, 1000)
    return () => clearInterval(id)
  }, []) // ✅ нет зависимостей, нет stale closure
}
\`\`\`

### Как найти stale closure

1. **ESLint** с \`eslint-plugin-react-hooks\` — правило \`exhaustive-deps\` предупреждает о пропущенных зависимостях
2. **Симптомы**: функция всегда работает с начальным значением, обработчик событий не видит новый state, стейт "скачет" при быстрых кликах`,
    examples: [
      {
        title: 'Три способа исправить stale closure',
        language: 'tsx',
        code: `import { useState, useEffect, useRef } from 'react'

// ❌ Проблема: всегда логирует count = 0
function StaleExample() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => console.log(count), 3000)
    return () => clearTimeout(id)
  }, []) // stale: count захвачен при монтировании
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// ✅ Способ 1: добавить в deps
function Fix1() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => console.log(count), 3000)
    return () => clearTimeout(id)
  }, [count]) // пересоздаётся при каждом изменении
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// ✅ Способ 2: ref для актуального значения
function Fix2() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  countRef.current = count // обновляем на каждом рендере

  useEffect(() => {
    const id = setTimeout(() => console.log(countRef.current), 3000)
    return () => clearTimeout(id)
  }, []) // deps пустой, ref всегда актуален
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}`,
      },
    ],
  },

  {
    id: 'react-memo',
    question: 'Когда React.memo не помогает?',
    category: 'React',
    level: 'middle',
    terms: [
      {
        en: 'React.memo',
        ru: 'React.memo',
        description: 'HOC, который мемоизирует компонент: пропускает ре-рендер, если props не изменились (по shallow-сравнению).',
      },
      {
        en: 'Shallow comparison',
        ru: 'Поверхностное сравнение',
        description: 'Сравнение объектов по ссылке (===) для каждого ключа props. Примитивы сравниваются по значению, объекты и функции — по ссылке.',
      },
      {
        en: 'Referential equality',
        ru: 'Ссылочное равенство',
        description: 'Два объекта или функции равны только если указывают на один и тот же адрес в памяти. Новый объект с теми же полями !== старый объект.',
      },
      {
        en: 'useCallback',
        ru: 'useCallback',
        description: 'Хук, мемоизирующий функцию. Возвращает стабильную ссылку на функцию, пока не изменятся зависимости.',
      },
      {
        en: 'useMemo',
        ru: 'useMemo',
        description: 'Хук, мемоизирующий результат вычисления. Возвращает стабильную ссылку на объект/массив, пока не изменятся зависимости.',
      },
    ],
    shortAnswer:
      'React.memo не помогает, когда родительский компонент передаёт дочернему нестабильные ссылки: объекты, массивы или функции, создаваемые заново на каждом рендере. При shallow comparison такие props всегда "новые", и мемоизация не срабатывает.',
    fullAnswer: `## Когда React.memo бесполезен

React.memo сравнивает старые и новые props с помощью **shallow comparison**: для каждого ключа выполняется \`Object.is(prevProp, nextProp)\`. Это работает отлично для примитивов, но ломается при нестабильных ссылках.

### 1. Объекты и массивы, создаваемые inline

\`\`\`tsx
const MemoChild = React.memo(({ config }) => <div>{config.size}</div>)

function Parent() {
  return (
    // ❌ Новый объект { size: 10 } создаётся на КАЖДОМ рендере Parent
    // React.memo всегда видит "изменённый" prop
    <MemoChild config={{ size: 10 }} />
  )
}
\`\`\`

**Решение**: вынести объект за пределы компонента (если статичный) или мемоизировать с \`useMemo\`.

\`\`\`tsx
// ✅ Статичный объект — создаётся один раз
const CONFIG = { size: 10 }
function Parent() {
  return <MemoChild config={CONFIG} />
}

// ✅ Динамичный объект — мемоизируем
function Parent({ size }) {
  const config = useMemo(() => ({ size }), [size])
  return <MemoChild config={config} />
}
\`\`\`

### 2. Функции-коллбэки, объявленные inline

\`\`\`tsx
const MemoButton = React.memo(({ onClick }) => <button onClick={onClick}>Click</button>)

function Parent() {
  // ❌ Новая функция на каждый рендер Parent
  return <MemoButton onClick={() => console.log('click')} />
}
\`\`\`

**Решение**: \`useCallback\`.

\`\`\`tsx
function Parent() {
  const handleClick = useCallback(() => console.log('click'), [])
  return <MemoButton onClick={handleClick} /> // ✅ стабильная ссылка
}
\`\`\`

### 3. Context меняется выше по дереву

\`\`\`tsx
const MemoChild = React.memo(() => {
  const theme = useContext(ThemeContext) // ← подписка на контекст
  return <div className={theme}>...</div>
})

// При изменении ThemeContext MemoChild ре-рендерится НЕСМОТРЯ на memo
// Context — не prop, React.memo не защищает от него
\`\`\`

### 4. Родительский компонент не мемоизирован

Если сам родитель ре-рендерится слишком часто — дети будут ре-рендериться тоже, пока не стабилизируются пропсы. Мемоизировать детей без стабилизации пропсов в родителе — бесполезно.

### 5. Сложная логика сравнения

По умолчанию \`React.memo\` делает shallow compare. Для глубоко вложенных структур это не поможет — потребуется кастомная функция сравнения:

\`\`\`tsx
const MemoChild = React.memo(
  ({ data }) => <div>{data.user.name}</div>,
  (prev, next) => prev.data.user.name === next.data.user.name // кастомный comparator
)
\`\`\`

### Когда React.memo действительно помогает

- Компонент **дорогой** (тяжёлый рендер, большие списки)
- Принимает только **примитивные props** или **стабильные ссылки** (вынесенные за пределы или мемоизированные)
- Ре-рендерится часто из-за родителя, хотя его собственные данные не менялись

### Антипаттерн: мемоизировать всё подряд

\`React.memo\` не бесплатен — он добавляет накладные расходы на сравнение. Для простых компонентов это может быть дороже, чем сам ре-рендер. Применяйте измеряемо.`,
    examples: [
      {
        title: 'React.memo с нестабильными и стабильными пропсами',
        language: 'tsx',
        code: `import { memo, useState, useCallback, useMemo } from 'react'

const ExpensiveList = memo(({ items, onSelect }: {
  items: string[]
  onSelect: (item: string) => void
}) => {
  console.log('ExpensiveList rendered') // следим за ре-рендерами
  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => onSelect(item)}>{item}</li>
      ))}
    </ul>
  )
})

// ❌ Каждый рендер Parent создаёт новые items и onSelect
function BadParent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* memo бесполезен — items и onSelect новые на каждый рендер */}
      <ExpensiveList items={['a', 'b', 'c']} onSelect={item => console.log(item)} />
    </>
  )
}

// ✅ Стабилизируем ссылки — memo работает
function GoodParent() {
  const [count, setCount] = useState(0)
  const items = useMemo(() => ['a', 'b', 'c'], [])
  const onSelect = useCallback((item: string) => console.log(item), [])
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* memo срабатывает — items и onSelect стабильны */}
      <ExpensiveList items={items} onSelect={onSelect} />
    </>
  )
}`,
      },
    ],
  },

  {
    id: 'key-prop',
    question: 'Как работает key и почему index в динамическом списке опасен?',
    category: 'React',
    level: 'junior',
    terms: [
      {
        en: 'key prop',
        ru: 'Проп key',
        description: 'Специальный проп React, помогающий алгоритму reconciliation однозначно идентифицировать элементы списка между рендерами.',
      },
      {
        en: 'Reconciliation',
        ru: 'Согласование',
        description: 'Алгоритм React для сравнения старого и нового VDOM и вычисления минимального набора DOM-изменений.',
      },
      {
        en: 'List index as key',
        ru: 'Индекс массива как key',
        description: 'Антипаттерн: использование индекса элемента массива в качестве key. Опасен при динамических списках, где порядок элементов может меняться.',
      },
      {
        en: 'Component state corruption',
        ru: 'Повреждение состояния компонента',
        description: 'Ситуация, когда React ассоциирует state от одного элемента с другим из-за совпадения key-значений при изменении порядка.',
      },
    ],
    shortAnswer:
      'Key помогает React однозначно идентифицировать элементы списка при reconciliation: одинаковый key = тот же компонент, обновить; новый key = новый компонент, смонтировать. Использование index опасно в динамических списках: при удалении/вставке/сортировке индексы сдвигаются, React путает элементы и может применить state одного компонента к другому.',
    fullAnswer: `## Как работает key в списках

Когда React рендерит массив элементов, ему нужно знать, что изменилось между рендерами: какие элементы добавились, удалились или переместились. Key — это **стабильный идентификатор** элемента.

### Алгоритм без key

Без key React сравнивает элементы списка **позиционно**: старый элемент на позиции 0 с новым на позиции 0, и т.д. Если вставить элемент в начало списка, React не знает об этом и перезапишет все компоненты по порядку.

### Алгоритм с key

С key React строит словарь \`{ key → fiber }\` и сравнивает по идентификатору:
- Если key из старого дерева нашёлся в новом — компонент **обновляется** (DOM-узел переиспользуется)
- Если key пропал — компонент **размонтируется**
- Если key появился новый — компонент **монтируется**

\`\`\`tsx
// ✅ Стабильные уникальные ключи
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}
\`\`\`

### Почему index опасен

\`\`\`tsx
const list = ['Alice', 'Bob', 'Charlie']
// index:          0        1       2
\`\`\`

При удалении "Alice":
\`\`\`tsx
const list = ['Bob', 'Charlie']
// index:      0        1
\`\`\`

React видит: элемент с key=0 всё ещё существует (теперь это "Bob"), но его props изменились. React **обновит** компонент на позиции 0, а не удалит Alice и сдвинет остальных. Если у компонента есть внутренний state (например, checked-состояние чекбокса) — он останется у "Bob", хотя должен был принадлежать "Alice".

### Визуализация проблемы

\`\`\`
До удаления:
key=0: <TodoItem text="Alice" checked={true} />  ← галочка у Alice
key=1: <TodoItem text="Bob"   checked={false} />
key=2: <TodoItem text="Charlie" checked={false} />

После удаления Alice (удаляем первый элемент):
key=0: <TodoItem text="Bob"     checked={?} />  ← React обновляет props,
                                                    но state остаётся: checked=true!
key=1: <TodoItem text="Charlie" checked={false} />
// Bob теперь показывает галочку Алисы — состояние "приклеилось" к индексу
\`\`\`

### Когда index безопасен

Использование index **допустимо** только при выполнении всех трёх условий:
1. Список **никогда не меняется** (только добавление в конец)
2. Элементы **не имеют внутреннего состояния** или key (uncontrolled inputs)
3. Список **не фильтруется** и не сортируется

### Key как инструмент сброса состояния

Key можно использовать намеренно для **принудительного сброса** компонента. Смена key приведёт к полному размонтированию и монтированию нового компонента:

\`\`\`tsx
// Сброс формы при смене userId — без key пришлось бы вручную очищать все поля
function UserForm({ userId }) {
  return <Form key={userId} defaultValues={...} />
}
\`\`\``,
    examples: [
      {
        title: 'Опасность index как key: состояние "прилипает" к позиции',
        language: 'tsx',
        code: `import { useState } from 'react'

function TodoItem({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <li style={{ textDecoration: done ? 'line-through' : 'none' }}>
      <input type="checkbox" checked={done} onChange={e => setDone(e.target.checked)} />
      {text}
    </li>
  )
}

export function TodoList() {
  const [items, setItems] = useState(['Alice', 'Bob', 'Charlie'])

  const removeFirst = () => setItems(prev => prev.slice(1))

  return (
    <div>
      <button onClick={removeFirst}>Удалить первый элемент</button>
      <ul>
        {items.map((item, index) => (
          // ❌ Отметьте Alice галочкой, затем нажмите кнопку —
          //    галочка "перейдёт" к Bob, хотя его не трогали
          <TodoItem key={index} text={item} />
        ))}
      </ul>

      <ul>
        {items.map(item => (
          // ✅ Стабильный key — галочка привязана к элементу, а не позиции
          <TodoItem key={item} text={item} />
        ))}
      </ul>
    </div>
  )
}`,
      },
    ],
  },

  {
    id: 'context-value-change',
    question: 'Что происходит при изменении context value?',
    category: 'React',
    level: 'middle',
    terms: [
      {
        en: 'Context propagation',
        ru: 'Распространение контекста',
        description: 'Механизм, при котором изменение value в Provider вызывает ре-рендер всех потребителей этого контекста вне зависимости от дерева компонентов.',
      },
      {
        en: 'Context consumer',
        ru: 'Потребитель контекста',
        description: 'Компонент, подписавшийся на контекст через useContext. Перерендерится при любом изменении value в соответствующем Provider.',
      },
      {
        en: 'Bailout',
        ru: 'Ранний выход (Bailout)',
        description: 'Оптимизация React, позволяющая пропустить ре-рендер компонента, если его входные данные не изменились.',
      },
      {
        en: 'Context splitting',
        ru: 'Разделение контекста',
        description: 'Паттерн разбиения одного большого контекста на несколько меньших, чтобы изменение одной части не вызывало ре-рендер потребителей других частей.',
      },
      {
        en: 'useMemo / useCallback stabilization',
        ru: 'Стабилизация через useMemo / useCallback',
        description: 'Техника предотвращения лишних ре-рендеров потребителей контекста путём мемоизации value объекта в Provider.',
      },
    ],
    shortAnswer:
      'При изменении value в Provider React использует Object.is для сравнения старого и нового значения. Если они различаются, все компоненты, подписанные через useContext на этот контекст, безусловно ре-рендерятся — React.memo и shouldComponentUpdate их не защищают.',
    fullAnswer: `## Что происходит при изменении context value

### Механизм обновления

React отслеживает все компоненты, вызвавшие \`useContext(SomeContext)\`. При изменении value в соответствующем \`<SomeContext.Provider value={...}>\` React:

1. Сравнивает старое и новое value через \`Object.is\`
2. Если они **различаются** — помечает всех подписчиков как "нуждающихся в обновлении"
3. Ре-рендерит всех подписчиков, **пропуская промежуточные компоненты** в дереве

Ключевое: промежуточные компоненты между Provider и Consumer **не ре-рендерятся** (если сами не подписаны на контекст). Но сами потребители — **ре-рендерятся всегда**, даже если они обёрнуты в \`React.memo\`.

\`\`\`tsx
const Ctx = createContext<{ a: number; b: number }>({ a: 0, b: 0 })

// React.memo НЕ защищает от context
const ConsumerA = React.memo(() => {
  const { a } = useContext(Ctx)
  return <div>{a}</div> // ре-рендерится при изменении b тоже!
})
\`\`\`

### Проблема: объект в value пересоздаётся при каждом рендере

\`\`\`tsx
// ❌ Каждый рендер Parent создаёт новый объект value
function Parent() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('dark')

  return (
    // Object.is({ user, theme }, { user, theme }) → false (разные объекты)
    // → все потребители ре-рендерятся при каждом рендере Parent
    <Ctx.Provider value={{ user, theme }}>
      <App />
    </Ctx.Provider>
  )
}
\`\`\`

**Решение**: мемоизировать value.

\`\`\`tsx
function Parent() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('dark')

  const value = useMemo(() => ({ user, theme }), [user, theme])
  // ✅ Объект пересоздаётся только при изменении user или theme

  return <Ctx.Provider value={value}><App /></Ctx.Provider>
}
\`\`\`

### Паттерн: разделение контекста

Если контекст содержит часто меняющиеся и редко меняющиеся данные, разделите их:

\`\`\`tsx
// ❌ Один большой контекст: изменение theme → ре-рендер потребителей user
const AppContext = createContext({ user: null, theme: 'dark', notifications: [] })

// ✅ Разные контексты — изолированные обновления
const UserContext = createContext(null)
const ThemeContext = createContext('dark')
const NotificationContext = createContext([])

function App() {
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <NotificationContext.Provider value={notifications}>
          <Tree />
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
\`\`\`

### Паттерн: разделение data и actions

Функции-сеттеры стабильны между рендерами (setState из useReducer или useState не меняется). Поэтому вынесение actions в отдельный контекст позволяет избежать лишних ре-рендеров компонентов, которые только вызывают действия, но не читают данные:

\`\`\`tsx
const DataCtx = createContext(null)
const ActionsCtx = createContext(null)

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // actions не зависят от state — стабильны
  const actions = useMemo(() => ({
    increment: () => dispatch({ type: 'increment' }),
    decrement: () => dispatch({ type: 'decrement' }),
  }), [])

  return (
    <ActionsCtx.Provider value={actions}>
      <DataCtx.Provider value={state}>
        {children}
      </DataCtx.Provider>
    </ActionsCtx.Provider>
  )
}
\`\`\`

### Альтернатива: внешний стор

Для сложных случаев (частые обновления, много потребителей) рассмотрите \`useSyncExternalStore\` или библиотеки (Zustand, Jotai) — они обновляют только подписанных на изменившиеся слайсы.`,
    examples: [
      {
        title: 'Разделение контекста data и actions',
        language: 'tsx',
        code: `import { createContext, useContext, useReducer, useMemo } from 'react'

type State = { count: number }
type Actions = { increment(): void; decrement(): void }

const StateCtx = createContext<State>({ count: 0 })
const ActionsCtx = createContext<Actions>({ increment: () => {}, decrement: () => {} })

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    (s: State, action: 'inc' | 'dec') =>
      action === 'inc' ? { count: s.count + 1 } : { count: s.count - 1 },
    { count: 0 }
  )

  // actions стабильны — dispatch не меняется
  const actions = useMemo<Actions>(() => ({
    increment: () => dispatch('inc'),
    decrement: () => dispatch('dec'),
  }), [])

  return (
    <ActionsCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>
        {children}
      </StateCtx.Provider>
    </ActionsCtx.Provider>
  )
}

// Этот компонент НЕ ре-рендерится при изменении count
function Controls() {
  const { increment, decrement } = useContext(ActionsCtx)
  console.log('Controls rendered') // только при монтировании
  return (
    <>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </>
  )
}

// Только этот ре-рендерится при изменении count
function Display() {
  const { count } = useContext(StateCtx)
  return <span>{count}</span>
}`,
      },
    ],
  },

  {
    id: 'usereducer-vs-usestate',
    question: 'Когда нужен useReducer, а когда достаточно useState?',
    category: 'React',
    level: 'middle',
    terms: [
      {
        en: 'useState',
        ru: 'useState',
        description: 'Хук для управления простым локальным состоянием. Принимает начальное значение, возвращает пару [state, setState].',
      },
      {
        en: 'useReducer',
        ru: 'useReducer',
        description: 'Хук для управления сложным состоянием через паттерн reducer. Принимает функцию-редьюсер и начальное состояние, возвращает [state, dispatch].',
      },
      {
        en: 'Reducer',
        ru: 'Редьюсер',
        description: 'Чистая функция (state, action) => newState. Централизует логику переходов между состояниями, легко тестируется изолированно.',
      },
      {
        en: 'Action',
        ru: 'Действие (Action)',
        description: 'Объект, описывающий намерение изменить состояние. Обычно имеет поле type и опциональный payload.',
      },
      {
        en: 'Derived state',
        ru: 'Производное состояние',
        description: 'Значение, вычисляемое из существующего state, а не хранящееся отдельно. Предпочтительнее дублирования состояния.',
      },
    ],
    shortAnswer:
      'useState достаточно для независимых примитивных значений или простых объектов. useReducer предпочтительнее, когда следующий state зависит от предыдущего по сложной логике, когда несколько sub-state значений меняются вместе, или когда логику изменений нужно тестировать изолированно.',
    fullAnswer: `## useState vs useReducer: выбор инструмента

Оба хука хранят состояние между рендерами, но оптимизированы под разные задачи.

### Когда достаточно useState

**Простые независимые значения**: булевы флаги, строки, числа, простые объекты без сложной логики переходов.

\`\`\`tsx
const [isOpen, setIsOpen] = useState(false)
const [query, setQuery] = useState('')
const [page, setPage] = useState(1)
\`\`\`

**Правило**: если для обновления состояния достаточно одной строки — \`useState\` подойдёт.

### Когда нужен useReducer

#### 1. Несколько связанных полей меняются вместе

\`\`\`tsx
// ❌ useState: три отдельных вызова setState, которые всегда идут вместе
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

async function load() {
  setLoading(true)        // 1
  setError(null)          // 2 — три отдельных ре-рендера
  try {
    const d = await fetch(...)
    setData(d)            // 3
    setLoading(false)     // 4
  } catch(e) {
    setError(e)           // 5
    setLoading(false)     // 6
  }
}

// ✅ useReducer: атомарное обновление, одна точка входа
type State = { data: Data | null; loading: boolean; error: Error | null }
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Data }
  | { type: 'FETCH_ERROR'; payload: Error }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null }
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.payload }
  }
}
\`\`\`

#### 2. Следующий state зависит от предыдущего через сложную логику

\`\`\`tsx
// useReducer для конечного автомата (FSM)
type TrafficLight = 'red' | 'yellow' | 'green'

function trafficReducer(state: TrafficLight): TrafficLight {
  switch (state) {
    case 'red':    return 'green'
    case 'green':  return 'yellow'
    case 'yellow': return 'red'
  }
}

const [light, nextLight] = useReducer(trafficReducer, 'red')
// dispatch без action — просто переход к следующему состоянию
\`\`\`

#### 3. Логика изменений требует тестирования

Редьюсер — это чистая функция, легко тестируемая без React:

\`\`\`tsx
// Тест без React Testing Library, без mount, без renders
test('FETCH_SUCCESS обновляет данные и сбрасывает loading', () => {
  const prevState = { data: null, loading: true, error: null }
  const action = { type: 'FETCH_SUCCESS' as const, payload: mockData }
  const nextState = reducer(prevState, action)
  expect(nextState).toEqual({ data: mockData, loading: false, error: null })
})
\`\`\`

#### 4. Большое state-дерево с вложенностью

\`\`\`tsx
// useState с иммутабельными обновлениями быстро превращается в спагетти
setForm(prev => ({
  ...prev,
  address: { ...prev.address, city: 'Moscow' }
}))

// useReducer + Immer — читаемо и безопасно
dispatch({ type: 'SET_CITY', payload: 'Moscow' })
// в reducer с Immer:
case 'SET_CITY': state.address.city = action.payload; break;
\`\`\`

### Краткое правило выбора

| Критерий | useState | useReducer |
|---|---|---|
| Независимые примитивы | ✅ | ✅ |
| Несколько связанных полей | ❌ много setState | ✅ |
| Сложная логика переходов | ❌ | ✅ |
| Тестируемость логики | сложнее | ✅ легко |
| Действия с названиями | не нужны | ✅ |`,
    examples: [
      {
        title: 'Async fetch state через useReducer',
        language: 'tsx',
        code: `import { useReducer } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

type FetchAction<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: string }

function createFetchReducer<T>() {
  return function reducer(
    state: FetchState<T>,
    action: FetchAction<T>
  ): FetchState<T> {
    switch (action.type) {
      case 'LOADING':
        return { data: null, loading: true, error: null }
      case 'SUCCESS':
        return { data: action.payload, loading: false, error: null }
      case 'ERROR':
        return { data: null, loading: false, error: action.payload }
      default:
        return state
    }
  }
}

interface User { id: number; name: string }

export function UserProfile({ id }: { id: number }) {
  const [state, dispatch] = useReducer(createFetchReducer<User>(), {
    data: null, loading: false, error: null
  })

  async function load() {
    dispatch({ type: 'LOADING' })
    try {
      const res = await fetch(\`/api/users/\${id}\`)
      const user: User = await res.json()
      dispatch({ type: 'SUCCESS', payload: user })
    } catch (e) {
      dispatch({ type: 'ERROR', payload: String(e) })
    }
  }

  if (state.loading) return <p>Загрузка...</p>
  if (state.error) return <p>Ошибка: {state.error}</p>
  if (!state.data) return <button onClick={load}>Загрузить</button>
  return <div>{state.data.name}</div>
}`,
      },
    ],
  },

  {
    id: 'concurrent-rendering',
    question: 'Что такое concurrent rendering простыми словами?',
    category: 'React',
    level: 'senior',
    terms: [
      {
        en: 'Concurrent rendering',
        ru: 'Конкурентный рендеринг',
        description: 'Возможность React прерывать, откладывать и возобновлять рендеринг компонентов. Позволяет браузеру оставаться отзывчивым во время тяжёлых обновлений.',
      },
      {
        en: 'Interruptible rendering',
        ru: 'Прерываемый рендеринг',
        description: 'Свойство concurrent рендеринга: React может остановить текущий рендер на полпути, дать браузеру обработать события, и возобновить позже.',
      },
      {
        en: 'Priority scheduling',
        ru: 'Приоритетное планирование',
        description: 'Механизм, при котором React назначает разные приоритеты разным обновлениям. Срочные (ввод пользователя) обрабатываются раньше несрочных (фоновые данные).',
      },
      {
        en: 'Transitions',
        ru: 'Переходы (Transitions)',
        description: 'API React для обозначения несрочных обновлений (startTransition, useTransition). Такие обновления могут прерываться и откладываться.',
      },
      {
        en: 'Time slicing',
        ru: 'Нарезка времени (Time Slicing)',
        description: 'Техника разбиения длинного рендера на небольшие временные слоты (как правило, ~5ms). Браузер получает управление между слотами.',
      },
    ],
    shortAnswer:
      'Concurrent rendering — это режим работы React, в котором рендеринг стал прерываемым. Раньше запущенный рендер блокировал браузер до конца. Теперь React может приостановить тяжёлый рендер, дать браузеру обработать клик или ввод, и вернуться к рендеру позже.',
    fullAnswer: `## Concurrent Rendering — что это и зачем

### Проблема: synchronous blocking render

До React 18 рендеринг был **синхронным и неделимым**: раз начав рендер, React работал до конца. Если дерево компонентов большое, браузер не мог обработать ввод пользователя пока React не закончит.

\`\`\`
Старый React:
[User types] → [React renders whole tree — 200ms block] → [Browser paints]
                                                            ↑ пользователь
                                                              ждёт 200ms
\`\`\`

Результат: лаги при вводе, "залипание" интерфейса.

### Решение: прерываемый рендеринг

Concurrent React работает иначе. Рендер разбивается на небольшие "чанки" с помощью **time slicing**. Между чанками React проверяет: есть ли более срочная работа?

\`\`\`
Concurrent React:
[User types] → [React renders chunk 1 — 5ms]
             → [Check: срочное обновление?]
             → [User typed again → срочно!]
             → [Handle urgent input — 1ms]
             → [Resume background render]
             → [Browser paints latest state]
\`\`\`

### Приоритеты обновлений

Concurrent React разделяет обновления на два класса:

**Срочные (urgent)** — немедленная реакция ожидается пользователем:
- Нажатия клавиш, клики, скролл

**Несрочные (transition)** — небольшая задержка незаметна:
- Подгрузка данных, переход между страницами, фильтрация большого списка

\`\`\`tsx
import { startTransition, useState } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('') // срочно: обновляем инпут сразу
  const [results, setResults] = useState([])

  function handleChange(e) {
    setQuery(e.target.value) // ← срочное обновление, не может быть прервано

    startTransition(() => {
      setResults(filterItems(e.target.value)) // ← несрочное, может быть прервано
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      <ResultsList results={results} />
    </>
  )
}
\`\`\`

Если пользователь печатает быстро — React прерывает незавершённый рендер results и начинает с актуальным значением. Ввод всегда отзывчив.

### Что входит в Concurrent Features

- **\`startTransition\` / \`useTransition\`** — помечаем несрочные обновления
- **\`useDeferredValue\`** — откладываем "отставание" конкретного значения
- **\`Suspense\`** — ждём данные/код без блокировки остального UI
- **\`<Offscreen>\`** (будущее) — рендерим скрытые части дерева в фоне

### Важное: opt-in через API

Concurrent режим включается по умолчанию в React 18 при использовании \`createRoot\`. Но **прерываемым** рендер становится только для обновлений, помеченных как transition. Обычный \`setState\` по-прежнему срочный и синхронный.

### Ограничения и требования

1. Компоненты **должны быть идемпотентными** — React может вызвать render-функцию несколько раз для одного обновления (в Strict Mode это намеренно тестируется)
2. Побочные эффекты только в \`useEffect\` — не в теле рендера
3. Внешние сторы совместимы через \`useSyncExternalStore\``,
    examples: [
      {
        title: 'startTransition: срочный ввод + несрочный рендер списка',
        language: 'tsx',
        code: `import { useState, useTransition, memo } from 'react'

// Дорогой компонент: 10 000 элементов
const HeavyList = memo(({ filter }: { filter: string }) => {
  const items = Array.from({ length: 10_000 }, (_, i) => \`Item \${i}\`)
  const filtered = items.filter(item =>
    item.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <ul>
      {filtered.slice(0, 100).map(item => <li key={item}>{item}</li>)}
    </ul>
  )
})

export function SearchWithTransition() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value) // ← срочно: инпут обновляется немедленно

    startTransition(() => {
      setFilter(value) // ← несрочно: может быть прервано новым вводом
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Поиск..." />
      {isPending && <span>Обновление...</span>}
      <HeavyList filter={filter} />
    </div>
  )
}`,
      },
    ],
  },

  {
    id: 'usetransition-vs-usedeferredvalue',
    question: 'Разница useTransition и useDeferredValue?',
    category: 'React',
    level: 'senior',
    terms: [
      {
        en: 'useTransition',
        ru: 'useTransition',
        description: 'Хук, возвращающий [isPending, startTransition]. Позволяет явно пометить setState-обновления как несрочные.',
      },
      {
        en: 'useDeferredValue',
        ru: 'useDeferredValue',
        description: 'Хук, принимающий значение и возвращающий его "отложенную" копию. Копия обновляется позже, когда браузер не занят срочными задачами.',
      },
      {
        en: 'isPending',
        ru: 'Флаг ожидания (isPending)',
        description: 'Булево значение из useTransition. True, пока несрочное обновление ещё не закончило рендер — можно показать индикатор загрузки.',
      },
      {
        en: 'Stale-while-revalidate',
        ru: 'Устаревшее при перепроверке',
        description: 'Паттерн: показывать старые данные, пока загружаются новые. useDeferredValue реализует этот паттерн для UI.',
      },
    ],
    shortAnswer:
      'useTransition используется когда вы контролируете источник обновления (сами вызываете setState) и хотите пометить его несрочным. useDeferredValue — когда значение приходит извне (через props или из другого состояния) и вы хотите, чтобы дочерний рендер "отставал".',
    fullAnswer: `## useTransition vs useDeferredValue

Оба хука — инструменты Concurrent Features для откладывания несрочных обновлений. Разница — в точке применения.

### useTransition — оборачиваем обновление

Используется когда вы **управляете setState**: вы явно решаете, какой вызов несрочный.

\`\`\`tsx
const [isPending, startTransition] = useTransition()

// Вы сами вызываете setState и обворачиваете в startTransition
function handleSearch(query: string) {
  setInputValue(query)           // срочно: инпут сразу
  startTransition(() => {
    setSearchResults(query)      // несрочно: рендер списка может подождать
  })
}
\`\`\`

**Преимущества**:
- Флаг \`isPending\` — знаете точно, что идёт несрочный рендер, можно показать спиннер
- Несрочное обновление **прерывается** при следующем вводе — всегда рендерим с актуальными данными

### useDeferredValue — откладываем значение

Используется когда **значение уже вычислено** (из props, state или другого хука) и вы хотите, чтобы дочерний рендер "отставал":

\`\`\`tsx
function SearchPage({ query }: { query: string }) {
  // query приходит извне — вы не контролируете его setState
  const deferredQuery = useDeferredValue(query)

  // deferredQuery обновится позже, когда браузер освободится
  return <ExpensiveResults query={deferredQuery} />
}
\`\`\`

\`deferredQuery\` остаётся старым значением, пока фоновый рендер с новым значением не завершится. Пользователь видит старые результаты (stale-while-revalidate) вместо пустого экрана.

### Визуальное сравнение

\`\`\`
useTransition:
  Вы → setState() внутри startTransition → React откладывает

useDeferredValue:
  Откуда-то → значение → useDeferredValue → "медленная копия"
\`\`\`

### Детектирование stale через useDeferredValue

\`\`\`tsx
function Results({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)
  const isStale = deferredQuery !== query // показываем, что данные устарели

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <ExpensiveList query={deferredQuery} />
    </div>
  )
}
\`\`\`

### Когда что использовать

| Ситуация | Инструмент |
|---|---|
| Вы вызываете setState | useTransition |
| Значение приходит из props | useDeferredValue |
| Нужен флаг isPending | useTransition |
| Нужно "отставание" для дочернего компонента | useDeferredValue |
| Оптимизация компонента-библиотеки | useDeferredValue |

### Совместное использование

Иногда используют оба: \`useTransition\` для управления обновлением на уровне компонента с инпутом, и \`useDeferredValue\` внутри дорогого дочернего компонента как дополнительный барьер:

\`\`\`tsx
// Родитель: управляет переходом
function Parent() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <input onChange={e => {
        startTransition(() => setQuery(e.target.value))
      }} />
      {isPending && <Spinner />}
      <Child query={query} />
    </>
  )
}

// Дочерний: дополнительная буферизация для очень тяжёлого рендера
function Child({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)
  return <HeavyVisualization data={deferredQuery} />
}
\`\`\``,
    examples: [
      {
        title: 'useDeferredValue: плавный поиск без блокировки инпута',
        language: 'tsx',
        code: `import { useState, useDeferredValue, memo } from 'react'

// Тяжёлый компонент — мемоизируем, чтобы React мог пропускать рендер
const SlowList = memo(({ query }: { query: string }) => {
  // Имитируем медленный рендер
  const startTime = performance.now()
  while (performance.now() - startTime < 50) {} // искусственная задержка

  const items = Array.from({ length: 500 }, (_, i) => \`Result \${i}: \${query}\`)
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
})

export function DeferredSearch() {
  const [text, setText] = useState('')
  const deferredText = useDeferredValue(text)

  const isStale = text !== deferredText

  return (
    <div>
      {/* Инпут всегда отзывчив — обновляется немедленно */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Начните вводить..."
      />

      {/* Список рендерится с задержкой, инпут не блокируется */}
      <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        {isStale && <small>Обновление...</small>}
        <SlowList query={deferredText} />
      </div>
    </div>
  )
}`,
      },
    ],
  },

  {
    id: 'useeffectevent',
    question: 'Для чего в React 19 нужен useEffectEvent?',
    category: 'React',
    level: 'senior',
    terms: [
      {
        en: 'useEffectEvent',
        ru: 'useEffectEvent',
        description: 'Хук React 19, создающий "event handler" для эффекта. Функция всегда имеет актуальные значения из замыкания, но не попадает в deps array и не вызывает пересоздания эффекта.',
      },
      {
        en: 'Effect event',
        ru: 'Событие эффекта',
        description: 'Концепция: часть логики эффекта, которая должна видеть актуальные данные, но не должна быть реактивной зависимостью.',
      },
      {
        en: 'Reactive dependency',
        ru: 'Реактивная зависимость',
        description: 'Значение, при изменении которого эффект должен пересоздаться. useEffectEvent позволяет использовать нереактивные значения внутри реактивного эффекта.',
      },
      {
        en: 'Non-reactive logic',
        ru: 'Нереактивная логика',
        description: 'Логика, которая должна выполняться при срабатывании эффекта, но не должна сама по себе вызывать новые срабатывания эффекта.',
      },
    ],
    shortAnswer:
      'useEffectEvent решает конкретную задачу: когда нужно использовать актуальное значение из props/state внутри эффекта, но не хочется, чтобы это значение было реактивной зависимостью (то есть не хочется пересоздавать эффект при каждом его изменении).',
    fullAnswer: `## useEffectEvent: нереактивная логика в реактивном эффекте

### Проблема, которую он решает

Рассмотрим классический кейс: нужно логировать аналитику при посещении страницы. URL — зависимость (эффект должен сработать при смене страницы). Но \`userId\` — контекстное значение, которое просто нужно знать в момент отправки.

\`\`\`tsx
// ❌ Проблема: добавляем userId в deps
useEffect(() => {
  logPageView(url, userId) // нужен актуальный userId
}, [url, userId]) // ← эффект пересоздаётся и при смене userId тоже!
// Если userId изменился, не меняя url — аналитика отправится повторно

// ❌ Проблема: убираем userId из deps (но ESLint будет ругаться)
useEffect(() => {
  logPageView(url, userId) // stale closure: userId может быть устаревшим
}, [url]) // exhaustive-deps предупреждение
\`\`\`

Нам нужно: **эффект реагирует на \`url\`**, но **читает актуальный \`userId\`** без реакции на него.

### Решение: useEffectEvent

\`\`\`tsx
import { useEffect, useEffectEvent } from 'react'

function Page({ url, userId }: { url: string; userId: string }) {
  // onVisit — "event": всегда актуален, не является зависимостью
  const onVisit = useEffectEvent((visitedUrl: string) => {
    logPageView(visitedUrl, userId) // userId актуален, не в deps
  })

  useEffect(() => {
    onVisit(url) // вызываем event — он видит актуальный userId
  }, [url]) // ✅ только url — корректная зависимость
}
\`\`\`

\`onVisit\` — это не обычная функция и не \`useCallback\`. Это "event handler for effects":
- Всегда захватывает **актуальные значения** из замыкания (как ref-трюк)
- **Не является реактивным** — изменение \`userId\` не пересоздаёт эффект
- ESLint-плагин знает о нём и не добавляет его в deps

### Как работает под капотом

По сути, \`useEffectEvent\` — это синтаксический сахар над ref-паттерном:

\`\`\`tsx
// Примерная реализация useEffectEvent
function useEffectEvent(fn) {
  const ref = useRef(fn)
  useLayoutEffect(() => { ref.current = fn }) // всегда актуальная функция
  return useCallback((...args) => ref.current(...args), []) // стабильная ссылка
}
\`\`\`

### Правила использования

1. **Вызывать только внутри эффектов** — не в JSX, не напрямую в теле компонента
2. **Не передавать другим компонентам** — это внутренняя деталь эффекта
3. **Не добавлять в deps** — это нарушит смысл хука

\`\`\`tsx
// ❌ Нельзя вызывать в рендере
const onEvent = useEffectEvent(() => doSomething())
return <button onClick={onEvent}>click</button> // неправильно

// ✅ Только внутри useEffect
useEffect(() => {
  const handler = () => onEvent()
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, []) // onEvent не в deps
\`\`\`

### Реальные кейсы

- **Аналитика**: логировать событие с актуальным user/session, но реагировать только на смену роута
- **Websocket**: отправлять сообщение с актуальным контентом формы, но не переподключаться при каждом нажатии клавиши
- **Интервалы**: таймер реагирует только на изменение delay, но callback всегда видит актуальный state`,
    examples: [
      {
        title: 'useEffectEvent: аналитика с актуальным userId',
        language: 'tsx',
        code: `import { useState, useEffect, useEffectEvent } from 'react'

function usePageAnalytics(url: string) {
  const [userId, setUserId] = useState<string | null>(null)
  const [logLevel, setLogLevel] = useState<'basic' | 'detailed'>('basic')

  // onVisit видит актуальные userId и logLevel,
  // но НЕ является реактивной зависимостью
  const onVisit = useEffectEvent((visitedUrl: string) => {
    if (!userId) return

    const payload = {
      url: visitedUrl,
      userId,
      ...(logLevel === 'detailed' ? { timestamp: Date.now() } : {}),
    }

    console.log('[Analytics]', payload)
    // analytics.track(payload)
  })

  // Эффект срабатывает ТОЛЬКО при изменении url
  // Изменение userId или logLevel не вызывает повторную отправку
  useEffect(() => {
    onVisit(url)
  }, [url]) // ✅ onVisit не нужен в deps

  return { setUserId, setLogLevel }
}

export function App() {
  const [page, setPage] = useState('/home')
  const { setUserId } = usePageAnalytics(page)

  return (
    <div>
      <button onClick={() => setUserId('user-123')}>Войти</button>
      <nav>
        <button onClick={() => setPage('/home')}>Главная</button>
        <button onClick={() => setPage('/about')}>О нас</button>
      </nav>
      <p>Текущая страница: {page}</p>
    </div>
  )
}`,
      },
    ],
  },

  {
    id: 'fiber-architecture',
    question: 'Как объяснить Fiber, current tree и workInProgress?',
    category: 'React',
    level: 'senior',
    terms: [
      {
        en: 'Fiber',
        ru: 'Fiber (волокно)',
        description: 'Единица работы в React. Каждый компонент соответствует одному Fiber-узлу — объекту, хранящему тип компонента, props, state, ссылки на родителя/детей/сиблингов и метаданные для планировщика.',
      },
      {
        en: 'Current tree',
        ru: 'Текущее дерево (current tree)',
        description: 'Дерево Fiber-узлов, соответствующее текущему отрисованному состоянию DOM. Каждый узел имеет флаг current.',
      },
      {
        en: 'workInProgress tree',
        ru: 'Рабочее дерево (workInProgress tree)',
        description: 'Копия current tree, строящаяся во время рендера. После коммита становится новым current tree через двойное буферирование.',
      },
      {
        en: 'Double buffering',
        ru: 'Двойное буферирование',
        description: 'Техника: React поддерживает два дерева (current и workInProgress). Рендер происходит в workInProgress, не трогая current. После коммита деревья меняются ролями.',
      },
      {
        en: 'Alternate',
        ru: 'Альтернативный узел (alternate)',
        description: 'Ссылка между current и workInProgress версиями одного и того же Fiber-узла. fiber.alternate указывает на парный узел в другом дереве.',
      },
    ],
    shortAnswer:
      'Fiber — это объект-представление компонента в памяти React. React поддерживает два дерева: current (то, что сейчас в DOM) и workInProgress (строится во время рендера). После коммита workInProgress становится новым current. Двойное буферирование позволяет прерывать рендер без повреждения текущего UI.',
    fullAnswer: `## Fiber: архитектура рендеринга React

### Что такое Fiber-узел

До версии 16 React использовал рекурсивный алгоритм на стеке вызовов — его нельзя было прервать. Fiber переосмыслил это: каждый компонент представлен как **объект в куче (heap)**, связанный с другими через ссылки.

Упрощённая структура Fiber-узла:

\`\`\`ts
interface FiberNode {
  // Идентификация
  type: string | Function       // 'div', MyComponent
  key: string | null

  // Связи в дереве (не вложенность, а связный список)
  return: FiberNode | null      // родитель
  child: FiberNode | null       // первый дочерний
  sibling: FiberNode | null     // следующий сибл

  // Данные
  pendingProps: Props
  memoizedProps: Props          // props последнего рендера
  memoizedState: any            // state (или linked list хуков)

  // Двойное буферирование
  alternate: FiberNode | null   // парный узел в другом дереве

  // Для планировщика
  lanes: Lanes                  // приоритет обновлений
  flags: Flags                  // что нужно сделать (Update, Placement, Deletion)
}
\`\`\`

### Обход дерева: не рекурсия, а итерация

Поскольку Fiber — это linked list в куче, React может **обойти дерево итеративно**, сохраняя промежуточный результат в объекте \`workInProgress\`. Если нужно прервать — просто запоминаем текущий узел и выходим.

\`\`\`
Обход: вниз по child, потом по sibling, потом return к родителю
       App
       ├── Header (child)
       │   └── Logo (child of Header)
       └── Main (sibling of Header)
           ├── Article
           └── Sidebar
\`\`\`

### Двойное буферирование: current и workInProgress

React поддерживает **два дерева**:

\`\`\`
current tree          workInProgress tree
────────────          ───────────────────
  <App>       ←alt→     <App>
  <Header>    ←alt→     <Header>
  <Main>      ←alt→     <Main>
\`\`\`

**Current tree** — "то, что видит пользователь". Его узлы соответствуют реальному DOM. React не трогает это дерево во время рендера.

**workInProgress tree** — строится во время рендера. Каждый узел создаётся как копия current (через \`alternate\`) и обновляется с новыми props/state.

Если рендер **прерывается** — workInProgress просто откидывается или возобновляется с нуля. Current дерево и DOM остаются неизменными.

### Фаза коммита: swap деревьев

После завершения рендера React проходит по workInProgress tree и применяет накопленные флаги (\`flags\`: Placement, Update, Deletion) к DOM. Затем — **атомарно меняет корневые указатели**:

\`\`\`ts
// Внутри React (упрощённо)
root.current = finishedWork  // workInProgress становится current
\`\`\`

Теперь старый current стал новым workInProgress для следующего обновления.

### Хуки как linked list внутри Fiber

Каждый хук — это узел в \`memoizedState\` Fiber-узла:

\`\`\`
Fiber.memoizedState →
  { memoizedState: 0, next: →    }  // useState(0)
  { memoizedState: '', next: →   }  // useState('')
  { memoizedState: {...}, next: null }  // useEffect deps
\`\`\`

Именно поэтому нельзя вызывать хуки условно — порядок узлов должен совпадать между рендерами.

### Lanes: приоритизация обновлений

Каждое обновление помечается "полосой" (lane) — битовым флагом приоритета:

\`\`\`
SyncLane           (1 <<  0) — синхронные обновления (срочные)
InputContinuousLane (1 << 4) — непрерывный ввод (scroll, drag)
DefaultLane        (1 << 9) — обычные setState
TransitionLane     (1 << 13+) — startTransition
\`\`\`

Scheduler выбирает следующую работу, исходя из lanes — это и есть concurrent scheduling.`,
    examples: [
      {
        title: 'Визуализация структуры Fiber через DevTools',
        language: 'tsx',
        code: `// Для изучения Fiber-дерева прямо в коде (dev-only):
// В Chrome DevTools → Console → $r (выбранный компонент в React DevTools)
// $r._debugOwner, $r.memoizedState, $r.alternate

// Простой пример, демонстрирующий концепцию двух деревьев
import { useState, useEffect } from 'react'

function FiberDemo() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // В момент выполнения этого эффекта:
    // - workInProgress дерево уже стало current
    // - DOM обновлён
    // - fiber.alternate указывает на предыдущую версию
    console.log('Commit завершён, DOM актуален')
  }, [count])

  return (
    <div>
      {/* Структура Fiber для этого дерева:
          FiberNode(FiberDemo)
            .child → FiberNode('div')
                       .child → FiberNode('p')
                                  .sibling → FiberNode('button')
      */}
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Обновить (создаст workInProgress)
      </button>
    </div>
  )
}

// Как посмотреть Fiber в DevTools консоли:
// 1. Откройте React DevTools, выберите компонент
// 2. В консоли: const fiber = $r._debugFiber ?? $r
// 3. fiber.memoizedState — linked list хуков
// 4. fiber.alternate — предыдущая версия (или null после первого рендера)`,
      },
    ],
  },
]
