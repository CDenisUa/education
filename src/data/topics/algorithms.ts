// Types
import type { Topic } from '@/types'

export const algorithmsTopic: Topic = {
  id: 'algorithms',
  title: 'Algorithms',
  icon: '🧠',
  description: 'Big O, структуры данных, шаблоны задач и практические алгоритмы для frontend/fullstack',
  sections: [
    {
      id: 'complexity-and-structures',
      title: 'Complexity and Data Structures',
      description: 'Big O, trade-offs и выбор подходящей структуры данных',
      explanation: `Алгоритмы начинаются не с "как быстро написать код", а с вопроса **что будет с этим кодом на 10 элементах, на 10 000 и на 10 миллионах**.

## Big O простыми словами
- \`O(1)\` — время почти не растёт от размера входа
- \`O(log n)\` — рост медленный, типичный пример: binary search
- \`O(n)\` — один проход по данным
- \`O(n log n)\` — хорошая сортировка
- \`O(n²)\` — чаще всего двойной цикл, быстро становится больно

## Что часто спрашивают
- какая сложность у текущего решения
- можно ли уменьшить количество проходов
- можно ли обменять память на скорость
- какая структура данных лучше подходит для задачи

## Быстрые эвристики
- нужен быстрый поиск по ключу: \`Map\` / \`Set\`
- нужен порядок вставки и простой обход: массив
- нужна LIFO-семантика: stack
- нужна FIFO-семантика: queue
- нужна иерархия: tree
- нужны связи между сущностями: graph

## Типичная ошибка на интервью
- кандидат знает алгоритм, но не объясняет trade-off
- сильный ответ почти всегда звучит так: "Сейчас у нас \`O(n²)\`, я могу перейти к \`O(n)\` за счёт \`Set\`"`,
      examples: [
        {
          title: 'Сравнение подходов',
          language: 'typescript',
          code: `const values = [4, 8, 15, 16, 23, 42]

function containsLinear(target: number): boolean {
  return values.includes(target)
}

const valueSet = new Set(values)

function containsFast(target: number): boolean {
  return valueSet.has(target)
}

// includes -> O(n)
// Set.has -> average O(1)
// Но Set тратит дополнительную память.`,
        },
        {
          title: 'Структуры под задачу',
          language: 'typescript',
          code: `type User = {
  id: string
  email: string
}

const users: User[] = [
  { id: '1', email: 'ada@example.com' },
  { id: '2', email: 'grace@example.com' },
]

const usersById = new Map(users.map(user => [user.id, user]))

function getUserById(id: string) {
  return usersById.get(id) ?? null
}

// Для списка отображения оставляем массив.
// Для быстрого доступа по id строим Map.
// Часто в реальных приложениях нужны обе структуры одновременно.`,
        },
      ],
    },
    {
      id: 'hashmaps-and-frequency',
      title: 'Hash Maps and Frequency Patterns',
      description: 'Подсчёт частот, дедупликация, grouping и быстрый lookup',
      explanation: `Самый полезный шаблон на интервью и в реальной работе: **сделать lookup-структуру один раз и убрать лишние вложенные циклы**.

## Когда думать про Map / Set
- проверить дубликаты
- посчитать частоты
- сгруппировать элементы
- быстро соединить данные из двух массивов
- построить индекс по \`id\`, \`slug\`, \`email\`

## Типовые задачи
- valid anagram
- first unique character
- group by status
- intersection of arrays
- merge API payload with local cache

## Реальный fullstack-use case
- backend прислал список entities
- frontend отдельно держит selected ids
- вместо \`selectedIds.includes(item.id)\` в каждом проходе можно сделать \`Set\` и ускорить рендер большого списка`,
      examples: [
        {
          title: 'Подсчёт частот символов',
          language: 'typescript',
          code: `function isAnagram(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  const counts = new Map<string, number>()

  for (const char of a) {
    counts.set(char, (counts.get(char) ?? 0) + 1)
  }

  for (const char of b) {
    const next = (counts.get(char) ?? 0) - 1
    if (next < 0) {
      return false
    }
    counts.set(char, next)
  }

  return [...counts.values()].every(count => count === 0)
}`,
        },
        {
          title: 'Group by status',
          language: 'typescript',
          code: `type Ticket = {
  id: string
  status: 'open' | 'done'
}

function groupByStatus(tickets: Ticket[]) {
  return tickets.reduce<Record<Ticket['status'], Ticket[]>>(
    (acc, ticket) => {
      acc[ticket.status].push(ticket)
      return acc
    },
    { open: [], done: [] },
  )
}

// Паттерн часто встречается в dashboard, reporting,
// агрегации API response и вычислении counters.`,
        },
      ],
    },
    {
      id: 'two-pointers-and-window',
      title: 'Two Pointers and Sliding Window',
      description: 'Подзадачи на подмассивы, подстроки, пары и непрерывные диапазоны',
      explanation: `Если задача звучит как "найти **непрерывный** кусок", "подстроку", "подмассив", "пару с условием", почти всегда стоит проверить two pointers или sliding window.

## Two Pointers
- часто работает на отсортированных данных
- указатели движутся навстречу или в одну сторону
- типичные задачи: pair sum, merge intervals, remove duplicates

## Sliding Window
- полезен, когда нужен лучший диапазон из подряд идущих элементов
- окно расширяется вправо и при необходимости сжимается слева
- типичные задачи: longest substring without repeats, max sum subarray, minimum window

## Что даёт этот паттерн
- вместо перебора всех диапазонов \`O(n²)\` часто получается \`O(n)\`
- главное понять, какое условие делает окно "валидным"`,
      examples: [
        {
          title: 'Two pointers: pair sum',
          language: 'typescript',
          code: `function hasPairWithSum(values: number[], target: number): boolean {
  let left = 0
  let right = values.length - 1

  while (left < right) {
    const sum = values[left] + values[right]

    if (sum === target) {
      return true
    }

    if (sum < target) {
      left += 1
    } else {
      right -= 1
    }
  }

  return false
}

// Работает за O(n), если массив уже отсортирован.`,
        },
        {
          title: 'Sliding window: longest unique substring',
          language: 'typescript',
          code: `function longestUniqueSubstring(text: string): number {
  let left = 0
  let best = 0
  const seen = new Map<string, number>()

  for (let right = 0; right < text.length; right += 1) {
    const char = text[right]

    if (seen.has(char) && (seen.get(char) ?? 0) >= left) {
      left = (seen.get(char) ?? 0) + 1
    }

    seen.set(char, right)
    best = Math.max(best, right - left + 1)
  }

  return best
}`,
        },
      ],
    },
    {
      id: 'stack-queue-recursion',
      title: 'Stack, Queue and Recursion',
      description: 'LIFO/FIFO мышление, обходы и задачи на вложенность',
      explanation: `Stack и queue кажутся примитивными, но на практике они лежат под кучей реальных алгоритмов.

## Stack
- LIFO: last in, first out
- подходит для парсинга, вложенных структур, undo/redo, DFS
- классическая задача: валидность скобок

## Queue
- FIFO: first in, first out
- подходит для BFS, job processing, rate limiting, task scheduling

## Recursion
- удобна для tree traversal, backtracking, divide and conquer
- важно следить за base case и не терять состояние между вызовами
- если рекурсия становится трудно читаемой, не стыдно перейти к явному stack`,
      examples: [
        {
          title: 'Stack: valid parentheses',
          language: 'typescript',
          code: `function isValidBrackets(text: string): boolean {
  const stack: string[] = []
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  }

  for (const char of text) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char)
      continue
    }

    if (pairs[char]) {
      const last = stack.pop()
      if (last !== pairs[char]) {
        return false
      }
    }
  }

  return stack.length === 0
}`,
        },
        {
          title: 'Recursion: nested comments flatten',
          language: 'typescript',
          code: `type CommentNode = {
  id: string
  replies: CommentNode[]
}

function flattenComments(nodes: CommentNode[]): string[] {
  const result: string[] = []

  function visit(node: CommentNode) {
    result.push(node.id)
    for (const reply of node.replies) {
      visit(reply)
    }
  }

  for (const node of nodes) {
    visit(node)
  }

  return result
}`,
        },
      ],
    },
    {
      id: 'trees-graphs-search',
      title: 'Trees, Graphs, BFS and DFS',
      description: 'Обходы, shortest path intuition и зависимые данные',
      explanation: `Как только данные перестают быть просто списком, появляются tree и graph patterns.

## Tree
- у каждого узла обычно один родитель и несколько детей
- примеры: DOM, меню, комментарии, категории, file systems

## Graph
- узлы и связи могут быть произвольными
- примеры: зависимости модулей, маршрутные сети, workflow transitions

## DFS
- уходит в глубину
- удобно для рекурсивных обходов, поиска компонент, topological thinking

## BFS
- идёт по слоям
- полезен для shortest path в невзвешенном графе
- часто реализуется через queue

## Интервью-эвристика
- "ближайший путь", "минимальное число переходов" -> подумай про BFS
- "обойти все ветки", "проверить вложенность", "перебрать все варианты" -> подумай про DFS`,
      examples: [
        {
          title: 'Binary tree DFS traversal',
          language: 'typescript',
          code: `type TreeNode = {
  value: number
  left: TreeNode | null
  right: TreeNode | null
}

function inorder(root: TreeNode | null): number[] {
  if (!root) {
    return []
  }

  return [
    ...inorder(root.left),
    root.value,
    ...inorder(root.right),
  ]
}`,
        },
        {
          title: 'Graph BFS shortest steps',
          language: 'typescript',
          code: `function shortestSteps(
  graph: Record<string, string[]>,
  start: string,
  target: string,
): number {
  const queue: Array<{ node: string; distance: number }> = [
    { node: start, distance: 0 },
  ]
  const visited = new Set<string>([start])

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current.node === target) {
      return current.distance
    }

    for (const next of graph[current.node] ?? []) {
      if (!visited.has(next)) {
        visited.add(next)
        queue.push({ node: next, distance: current.distance + 1 })
      }
    }
  }

  return -1
}`,
        },
      ],
    },
    {
      id: 'sorting-and-binary-search',
      title: 'Sorting and Binary Search',
      description: 'Отсортируй или не сортируй, и когда binary search реально применим',
      explanation: `Сортировка часто используется как **подготовительный шаг**, который открывает путь к более эффективному алгоритму.

## Когда сортировка полезна
- нужно быстро искать пары/диапазоны
- нужно упорядочить события по времени
- нужно сгруппировать похожие данные

## Когда sorting hurts
- если данные нужны в исходном порядке и сортировка ломает семантику
- если сортировка дороже, чем разовая линейная обработка

## Binary Search
- работает на монотонном условии
- не только для "найти элемент в массиве"
- подходит и для поиска ответа: минимальное время, максимальный размер, первый валидный индекс

## Частая ошибка
- binary search пытаются применить к несортированным данным или к условию без монотонности`,
      examples: [
        {
          title: 'Binary search by index',
          language: 'typescript',
          code: `function binarySearch(values: number[], target: number): number {
  let left = 0
  let right = values.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (values[mid] === target) {
      return mid
    }

    if (values[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return -1
}`,
        },
        {
          title: 'Search on answer',
          language: 'typescript',
          code: `function minCapacity(tasks: number[], days: number): number {
  let left = Math.max(...tasks)
  let right = tasks.reduce((sum, value) => sum + value, 0)

  function canShip(capacity: number) {
    let usedDays = 1
    let current = 0

    for (const task of tasks) {
      if (current + task > capacity) {
        usedDays += 1
        current = 0
      }
      current += task
    }

    return usedDays <= days
  }

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (canShip(mid)) {
      right = mid
    } else {
      left = mid + 1
    }
  }

  return left
}`,
        },
      ],
    },
    {
      id: 'dynamic-programming-backtracking',
      title: 'Dynamic Programming and Backtracking',
      description: 'Когда помнить прошлые подзадачи, а когда перебирать варианты',
      explanation: `Эти темы обычно пугают формулировками, но их можно понять очень практично.

## Dynamic Programming
- задача состоит из повторяющихся подзадач
- если одни и те же вычисления встречаются снова и снова, результат стоит запомнить
- есть два обычных пути: memoization сверху вниз и tabulation снизу вверх

## Backtracking
- надо перебрать пространство вариантов и отбрасывать плохие ветки
- полезен для subsets, permutations, path search, constraint problems

## Как различать
- "найти лучший ответ при выборе шагов" -> часто DP
- "перебрать все валидные комбинации" -> часто backtracking
- иногда задача сначала решается backtracking, а потом оптимизируется через memoization`,
      examples: [
        {
          title: 'DP: climbing stairs',
          language: 'typescript',
          code: `function climbStairs(n: number): number {
  if (n <= 2) {
    return n
  }

  let prev2 = 1
  let prev1 = 2

  for (let step = 3; step <= n; step += 1) {
    const current = prev1 + prev2
    prev2 = prev1
    prev1 = current
  }

  return prev1
}

// Идея:
// ways(n) = ways(n - 1) + ways(n - 2)`,
        },
        {
          title: 'Backtracking: generate subsets',
          language: 'typescript',
          code: `function subsets(values: number[]): number[][] {
  const result: number[][] = []
  const current: number[] = []

  function dfs(index: number) {
    if (index === values.length) {
      result.push([...current])
      return
    }

    current.push(values[index])
    dfs(index + 1)

    current.pop()
    dfs(index + 1)
  }

  dfs(0)
  return result
}`,
        },
      ],
    },
    {
      id: 'practical-web-algorithms',
      title: 'Practical Web Algorithms',
      description: 'Debounce, throttle, memoization, retry/backoff, LRU и другие паттерны ближе к продуктовой разработке',
      explanation: `На fullstack/frontend интервью полезно показать, что ты знаешь не только LeetCode-шаблоны, но и **алгоритмическое мышление в продукте**.

## Debounce
- ждём паузу перед выполнением действия
- подходит для search input, autosave, live validation

## Throttle
- ограничиваем частоту вызова
- подходит для scroll, resize, mouse move, telemetry

## Memoization
- кешируем результат чистой функции
- полезно, когда входы повторяются и вычисление дорогое

## Retry with Backoff
- не долбим внешний сервис подряд без паузы
- увеличиваем задержку между попытками

## LRU Cache
- держим ограниченное количество недавно использованных элементов
- часто применимо в backend services, API clients, data loaders

## Почему это считается алгоритмами
- тут тоже есть структуры данных, сложность, политика вытеснения, правила повторной попытки и управление нагрузкой`,
      examples: [
        {
          title: 'Debounce',
          language: 'typescript',
          code: `function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: TArgs) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}`,
        },
        {
          title: 'Tiny LRU cache',
          language: 'typescript',
          code: `class LRUCache<K, V> {
  constructor(private limit: number, private map = new Map<K, V>()) {}

  get(key: K): V | undefined {
    const value = this.map.get(key)
    if (value === undefined) {
      return undefined
    }

    this.map.delete(key)
    this.map.set(key, value)
    return value
  }

  set(key: K, value: V) {
    if (this.map.has(key)) {
      this.map.delete(key)
    }

    this.map.set(key, value)

    if (this.map.size > this.limit) {
      const oldestKey = this.map.keys().next().value as K
      this.map.delete(oldestKey)
    }
  }
}`,
        },
      ],
    },
  ],
}
