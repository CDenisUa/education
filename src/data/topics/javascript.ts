// Types
import type { Topic } from '@/types'

export const javascriptTopic: Topic = {
  id: 'javascript',
  title: 'JavaScript',
  icon: '⚡',
  description: 'Современный JS: ES6+, асинхронность, паттерны и Browser API',
  sections: [
    {
      id: 'variables-scope',
      title: 'Переменные и Область видимости',
      description: 'var, let, const, hoisting, TDZ и замыкания',
      explanation: `ES6 заменил проблемный \`var\` двумя новыми объявлениями.

**Ключевые отличия:**

| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Область | функция | блок | блок |
| Hoisting | да (undefined) | TDZ | TDZ |
| Повторное объявление | да | нет | нет |
| Изменение | да | да | только примитивы |

**Temporal Dead Zone (TDZ)** — промежуток от начала блока до объявления \`let\`/\`const\`. Обращение в этот период → ReferenceError.

**Замыкание** — функция, которая запоминает переменные из своего лексического окружения.`,
      examples: [
        {
          title: 'Hoisting и TDZ',
          language: 'javascript',
          code: `// var — hoisting
console.log(x) // undefined (не ошибка!)
var x = 5

// let — TDZ
console.log(y) // ReferenceError!
let y = 5

// var в цикле — классическая ловушка
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 3 3 3
}

// let в цикле — каждая итерация свой scope
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0) // 0 1 2
}`,
        },
        {
          title: 'Замыкания (Closures)',
          language: 'javascript',
          code: `// Замыкание — функция + её лексическое окружение
function createCounter(initial = 0) {
  let count = initial // переменная в замыкании

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = initial },
    getValue: () => count,
  }
}

const counter = createCounter(10)
counter.increment() // 11
counter.increment() // 12
counter.decrement() // 11
counter.getValue()  // 11

// Практический пример — мемоизация
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

const slowSquare = (n) => {
  // имитация тяжёлого вычисления
  return n * n
}
const fastSquare = memoize(slowSquare)`,
        },
      ],
      demoComponent: 'ScopeDemo',
    },
    {
      id: 'destructuring',
      title: 'Деструктуризация и Spread',
      description: 'ES6 деструктуризация, spread/rest, optional chaining',
      explanation: `ES6+ синтаксис для удобной работы с объектами и массивами.

**Деструктуризация** — извлечение значений в переменные.
**Spread** (\`...\`) — разворачивает итерируемое.
**Rest** (\`...\`) — собирает оставшиеся в массив/объект.
**Optional chaining** (\`?.\`) — безопасный доступ к вложенным свойствам.
**Nullish coalescing** (\`??\`) — fallback только для \`null\`/\`undefined\`.`,
      examples: [
        {
          title: 'Деструктуризация объектов',
          language: 'javascript',
          code: `const user = {
  id: 1,
  name: 'Alice',
  role: 'admin',
  address: {
    city: 'Kyiv',
    country: 'UA'
  }
}

// Базовая
const { name, role } = user

// Переименование
const { name: userName } = user

// Дефолтное значение
const { age = 25 } = user

// Вложенная деструктуризация
const { address: { city } } = user

// Rest
const { id, ...rest } = user
// rest = { name, role, address }

// В параметрах функции
function greet({ name, role = 'user' }) {
  return \`Hello, \${name} (\${role})\`
}
greet(user) // "Hello, Alice (admin)"`,
        },
        {
          title: 'Spread и Rest',
          language: 'javascript',
          code: `// Копирование объекта (shallow)
const copy = { ...user }
const withAge = { ...user, age: 30 }

// Слияние объектов
const defaults = { theme: 'dark', lang: 'ru' }
const settings = { lang: 'en', fontSize: 16 }
const merged = { ...defaults, ...settings }
// { theme: 'dark', lang: 'en', fontSize: 16 }

// Массивы
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const combined = [...arr1, ...arr2] // [1..6]
const cloned = [...arr1]

// Rest в функции
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}
sum(1, 2, 3, 4, 5) // 15

// Optional chaining
const city = user?.address?.city       // 'Kyiv'
const zip = user?.address?.zip         // undefined
const len = user?.tags?.length ?? 0    // 0`,
        },
      ],
      demoComponent: 'DestructuringDemo',
    },
    {
      id: 'async-await',
      title: 'Асинхронность: Promises и Async/Await',
      description: 'Event loop, Promises, async/await, обработка ошибок',
      explanation: `JavaScript — однопоточный язык, асинхронность реализуется через Event Loop.

**Event Loop:**
1. Выполняется синхронный код (Call Stack)
2. Выполняются **microtasks** (Promise.then, queueMicrotask)
3. Выполняется одна **macrotask** (setTimeout, setInterval, I/O)
4. Повтор

**Promise** — объект, представляющий будущий результат:
- \`pending\` → \`fulfilled\` | \`rejected\`

**async/await** — синтаксический сахар над Promise.`,
      examples: [
        {
          title: 'Event Loop — порядок выполнения',
          language: 'javascript',
          code: `console.log('1 — sync')

setTimeout(() => console.log('2 — macrotask'), 0)

Promise.resolve()
  .then(() => console.log('3 — microtask'))
  .then(() => console.log('4 — microtask 2'))

queueMicrotask(() => console.log('5 — microtask'))

console.log('6 — sync')

// Порядок вывода:
// 1 — sync
// 6 — sync
// 3 — microtask
// 5 — microtask
// 4 — microtask 2
// 2 — macrotask`,
        },
        {
          title: 'Promise API',
          language: 'javascript',
          code: `// Promise.all — все или ничего
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id)
])

// Promise.allSettled — все результаты (в т.ч. ошибки)
const results = await Promise.allSettled([
  fetch('/api/a'),
  fetch('/api/b'),
  fetch('/api/c')
])
results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log(result.value)
  } else {
    console.error(result.reason)
  }
})

// Promise.race — первый выполнившийся
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 5000)
)
const data = await Promise.race([fetch('/api'), timeout])

// Promise.any — первый успешный
const fastest = await Promise.any([
  fetch('https://server1.com/api'),
  fetch('https://server2.com/api'),
])`,
        },
        {
          title: 'Async/Await паттерны',
          language: 'javascript',
          code: `// Базовый async/await
async function loadUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`)
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to load user:', error)
    throw error // пробрасываем дальше
  }
}

// Параллельные запросы (НЕ последовательные!)
async function loadDashboard(userId) {
  // ❌ Медленно — последовательно:
  // const user = await fetchUser(userId)
  // const posts = await fetchPosts(userId)

  // ✅ Быстро — параллельно:
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
  ])
  return { user, posts }
}

// Retry с экспоненциальным backoff
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 2 ** i * 1000))
    }
  }
}`,
        },
      ],
      demoComponent: 'AsyncDemo',
    },
    {
      id: 'dom-api',
      title: 'DOM API',
      description: 'Поиск, создание, изменение и удаление DOM-элементов',
      explanation: `DOM (Document Object Model) — программный интерфейс к HTML-документу.

**Выборка элементов:**
- \`querySelector\` / \`querySelectorAll\` — по CSS-селектору
- \`getElementById\` — быстрейший поиск по ID
- \`closest()\` — поиск ближайшего предка

**Создание и изменение:**
- \`createElement\` — создание нового элемента
- \`innerHTML\` — быстро, но опасно (XSS!)
- \`textContent\` — безопасная установка текста
- \`insertAdjacentHTML\` — вставка HTML без парсинга всего элемента
- \`cloneNode\` — клонирование

**Работа с классами:** \`classList.add/remove/toggle/contains\``,
      examples: [
        {
          title: 'Современные методы выборки',
          language: 'javascript',
          code: `// querySelector — возвращает первый
const btn = document.querySelector('.btn-primary')
const input = document.querySelector('input[type="email"]')

// querySelectorAll — возвращает NodeList
const cards = document.querySelectorAll('.card')
cards.forEach(card => card.classList.add('loaded'))

// Поиск внутри элемента
const nav = document.querySelector('nav')
const links = nav.querySelectorAll('a')

// closest — поиск предка
document.addEventListener('click', (e) => {
  const card = e.target.closest('.card')
  if (!card) return
  console.log('Clicked card:', card.dataset.id)
})

// matches — проверка соответствия
element.matches('.active') // true/false`,
        },
        {
          title: 'Создание и вставка элементов',
          language: 'javascript',
          code: `// Безопасное создание
function createCard({ title, text, imageUrl }) {
  const card = document.createElement('article')
  card.className = 'card'
  card.dataset.id = crypto.randomUUID()

  const img = document.createElement('img')
  img.src = imageUrl
  img.alt = title
  img.loading = 'lazy'

  const h2 = document.createElement('h2')
  h2.textContent = title // безопасно (нет XSS)

  const p = document.createElement('p')
  p.textContent = text

  card.append(img, h2, p)
  return card
}

// Вставка
const list = document.querySelector('.cards')
const card = createCard({ title: 'Test', text: 'Hello', imageUrl: '/img.jpg' })

list.append(card)                    // в конец
list.prepend(card)                   // в начало
list.insertBefore(card, list.firstChild)
card.insertAdjacentElement('afterend', other) // после

// insertAdjacentHTML — быстро и безопасно если нет пользовательских данных
list.insertAdjacentHTML('beforeend', \`
  <li class="item">Static content</li>
\`)`,
        },
        {
          title: 'DocumentFragment — пакетная вставка',
          language: 'javascript',
          code: `// Вставка 1000 элементов эффективно
const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
}))

// ❌ Медленно — 1000 перерисовок DOM
// items.forEach(item => {
//   list.innerHTML += \`<li>\${item.name}</li>\`
// })

// ✅ Быстро — одна вставка
const fragment = document.createDocumentFragment()
items.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item.name
  li.dataset.id = item.id
  fragment.appendChild(li)
})
list.appendChild(fragment) // одно обновление DOM`,
        },
      ],
      demoComponent: 'DOMDemo',
    },
    {
      id: 'events',
      title: 'Events API',
      description: 'Обработчики, всплытие, делегирование, кастомные события',
      explanation: `События — механизм реагирования на действия пользователя и браузера.

**Фазы события:**
1. **Capture** (захват) — от \`document\` вниз к цели
2. **Target** — на целевом элементе
3. **Bubble** (всплытие) — от цели вверх к \`document\`

**Делегирование** — вместо сотни обработчиков на каждом элементе — один на родителе. Использует всплытие.

**Кастомные события** — \`CustomEvent\` для коммуникации между компонентами.`,
      examples: [
        {
          title: 'addEventListener и его опции',
          language: 'javascript',
          code: `const btn = document.querySelector('button')

// Базовый
btn.addEventListener('click', handler)

// С опциями
btn.addEventListener('click', handler, {
  once: true,      // сработает один раз и удалится
  passive: true,   // не будет вызывать preventDefault (оптимизация scroll)
  capture: true,   // на фазе захвата
})

// Удаление обработчика
btn.removeEventListener('click', handler)

// AbortController — удаление группы обработчиков
const controller = new AbortController()
const { signal } = controller

document.addEventListener('click', handler, { signal })
document.addEventListener('keydown', handler, { signal })
document.addEventListener('scroll', handler, { signal })

// Удалить все сразу
controller.abort()`,
        },
        {
          title: 'Делегирование событий',
          language: 'javascript',
          code: `// ❌ Плохо — обработчик на каждом элементе
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ Хорошо — один обработчик на контейнере
const list = document.querySelector('.todo-list')

list.addEventListener('click', (event) => {
  // Находим ближайший интересующий элемент
  const deleteBtn = event.target.closest('[data-action="delete"]')
  const editBtn   = event.target.closest('[data-action="edit"]')
  const item      = event.target.closest('.todo-item')

  if (deleteBtn && item) {
    const id = item.dataset.id
    deleteTodo(id)
    item.remove()
  }

  if (editBtn && item) {
    openEditModal(item.dataset.id)
  }
})

// Работает для динамически добавляемых элементов!`,
        },
        {
          title: 'CustomEvent',
          language: 'javascript',
          code: `// Создание кастомного события
const cartUpdateEvent = new CustomEvent('cart:update', {
  bubbles: true,     // всплывает
  composed: true,    // проходит через Shadow DOM
  detail: {
    itemId: 42,
    quantity: 3,
    total: 299.99,
  }
})

// Диспатч
document.querySelector('.add-to-cart').addEventListener('click', () => {
  document.dispatchEvent(cartUpdateEvent)
})

// Прослушивание в другом компоненте
document.addEventListener('cart:update', (event) => {
  const { itemId, quantity, total } = event.detail
  updateCartUI({ itemId, quantity, total })
})`,
        },
      ],
      demoComponent: 'EventsDemo',
    },
    {
      id: 'fetch-api',
      title: 'Fetch API',
      description: 'Запросы, заголовки, AbortController и обработка ошибок',
      explanation: `Fetch API — современная замена XMLHttpRequest для HTTP-запросов.

**Ключевые аспекты:**
- Возвращает Promise
- \`response.ok\` — true если статус 200-299
- Необходимо **вручную** проверять статус (fetch не бросает ошибку при 404/500)
- \`AbortController\` для отмены запроса
- \`Request\` / \`Response\` — объекты для переиспользования`,
      examples: [
        {
          title: 'Fetch паттерны',
          language: 'javascript',
          code: `// Базовый GET
const response = await fetch('/api/users')
if (!response.ok) throw new Error(response.statusText)
const users = await response.json()

// POST с JSON
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
})

// Отправка формы (multipart)
const formData = new FormData(formElement)
await fetch('/api/upload', { method: 'POST', body: formData })

// AbortController — отмена запроса
const controller = new AbortController()

const fetchData = async () => {
  try {
    const res = await fetch('/api/data', {
      signal: controller.signal
    })
    return res.json()
  } catch (e) {
    if (e.name === 'AbortError') {
      console.log('Request cancelled')
    }
  }
}

// Отмена (например, при unmount или новом запросе)
controller.abort()`,
        },
        {
          title: 'Обёртка над fetch',
          language: 'javascript',
          code: `// Универсальный API-клиент
class ApiClient {
  #baseUrl
  #defaultHeaders

  constructor(baseUrl) {
    this.#baseUrl = baseUrl
    this.#defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  setAuthToken(token) {
    this.#defaultHeaders['Authorization'] = \`Bearer \${token}\`
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.#baseUrl}\${endpoint}\`
    const config = {
      ...options,
      headers: {
        ...this.#defaultHeaders,
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw Object.assign(new Error(error.message ?? 'API Error'), {
        status: response.status,
        data: error,
      })
    }

    return response.status === 204 ? null : response.json()
  }

  get(url, params) {
    const query = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return this.request(url + query)
  }

  post(url, body) {
    return this.request(url, { method: 'POST', body: JSON.stringify(body) })
  }

  put(url, body) {
    return this.request(url, { method: 'PUT', body: JSON.stringify(body) })
  }

  delete(url) {
    return this.request(url, { method: 'DELETE' })
  }
}

export const api = new ApiClient('https://api.example.com')`,
        },
      ],
      demoComponent: 'FetchDemo',
    },
    {
      id: 'storage',
      title: 'Web Storage API',
      description: 'localStorage, sessionStorage, IndexedDB и cookies',
      explanation: `Браузер предоставляет несколько механизмов для хранения данных на клиенте.

| | localStorage | sessionStorage | Cookie | IndexedDB |
|---|---|---|---|---|
| Размер | ~5MB | ~5MB | ~4KB | Сотни MB |
| Время жизни | Постоянно | Вкладка | Настраивается | Постоянно |
| Доступ | JS | JS | JS + Server | JS |
| Синхронность | Синхронно | Синхронно | Синхронно | Асинхронно |`,
      examples: [
        {
          title: 'localStorage с сериализацией',
          language: 'javascript',
          code: `// Типизированная обёртка над localStorage
const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage write failed:', e)
      return false
    }
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  clear() {
    localStorage.clear()
  }
}

// Использование
storage.set('user', { id: 1, name: 'Alice' })
const user = storage.get('user')          // { id: 1, name: 'Alice' }
const theme = storage.get('theme', 'dark') // 'dark' — fallback

// Слушаем изменения из других вкладок
window.addEventListener('storage', (event) => {
  if (event.key === 'user') {
    console.log('User changed in another tab:', event.newValue)
  }
})`,
        },
        {
          title: 'Cookies — работа через document.cookie',
          language: 'javascript',
          code: `// Читать все cookies — неудобный API
const cookies = document.cookie.split('; ')
  .reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[decodeURIComponent(key)] = decodeURIComponent(value)
    return acc
  }, {})

// Установить cookie
function setCookie(name, value, days = 7) {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  document.cookie = [
    \`\${encodeURIComponent(name)}=\${encodeURIComponent(value)}\`,
    \`expires=\${expires.toUTCString()}\`,
    'path=/',
    'SameSite=Strict',
    // 'Secure', // только HTTPS
    // 'HttpOnly', // только через сервер
  ].join('; ')
}

// Удалить cookie
function deleteCookie(name) {
  document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/\`
}`,
        },
      ],
      demoComponent: 'StorageDemo',
    },
    {
      id: 'intersection-observer',
      title: 'Intersection Observer',
      description: 'Lazy loading, infinite scroll и анимации при прокрутке',
      explanation: `IntersectionObserver — асинхронное API для отслеживания пересечения элементов с вьюпортом или другим элементом.

**Преимущества перед scroll событием:**
- Не блокирует главный поток
- Нет постоянного polling
- Встроенная поддержка threshold и margins

**Применения:**
- Lazy loading изображений
- Infinite scroll
- Анимации при появлении
- Отслеживание видимости рекламы/контента`,
      examples: [
        {
          title: 'Lazy loading изображений',
          language: 'javascript',
          code: `// HTML: <img data-src="/real-image.jpg" src="/placeholder.jpg">
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return

      const img = entry.target
      img.src = img.dataset.src
      img.removeAttribute('data-src')
      img.classList.add('loaded')
      observer.unobserve(img) // Прекращаем наблюдение
    })
  },
  {
    rootMargin: '200px 0px', // Начать за 200px до появления
    threshold: 0,
  }
)

document.querySelectorAll('img[data-src]')
  .forEach(img => observer.observe(img))`,
        },
        {
          title: 'Анимации при появлении',
          language: 'javascript',
          code: `// CSS
// .reveal { opacity: 0; transform: translateY(30px); transition: all 0.6s; }
// .reveal.visible { opacity: 1; transform: translateY(0); }

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        // Если анимация одноразовая:
        observer.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.1,        // 10% элемента видно
    rootMargin: '0px',
  }
)

document.querySelectorAll('.reveal')
  .forEach(el => observer.observe(el))`,
        },
        {
          title: 'Infinite Scroll',
          language: 'javascript',
          code: `// Sentinel — пустой div в конце списка
const sentinel = document.querySelector('#load-more-trigger')
let page = 1
let isLoading = false

const observer = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || isLoading) return

  isLoading = true
  try {
    const data = await fetchPage(++page)
    appendItems(data.items)
    if (data.isLastPage) observer.unobserve(sentinel)
  } finally {
    isLoading = false
  }
})

observer.observe(sentinel)`,
        },
      ],
      demoComponent: 'IntersectionDemo',
    },
    {
      id: 'mutation-observer',
      title: 'Mutation Observer',
      description: 'Отслеживание изменений в DOM',
      explanation: `MutationObserver позволяет асинхронно следить за изменениями в DOM-дереве.

**Что можно отслеживать:**
- Добавление/удаление дочерних элементов (\`childList\`)
- Изменение атрибутов (\`attributes\`)
- Изменение текстового содержимого (\`characterData\`)
- Всё поддерево (\`subtree: true\`)

**Применения:**
- Реагирование на динамически добавленный контент
- Отладка изменений DOM
- Полифиллы и библиотеки компонентов`,
      examples: [
        {
          title: 'Базовое использование',
          language: 'javascript',
          code: `const target = document.querySelector('#dynamic-content')

const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          console.log('Добавлен:', node)
          // Применяем логику к новому элементу
          initComponent(node)
        }
      })
      mutation.removedNodes.forEach(node => {
        console.log('Удалён:', node)
        cleanupComponent(node)
      })
    }

    if (mutation.type === 'attributes') {
      console.log(
        \`Атрибут "\${mutation.attributeName}" изменён\`
      )
    }
  })
})

observer.observe(target, {
  childList: true,   // следить за дочерними
  subtree: true,     // и всем поддеревом
  attributes: true,  // и за атрибутами
  attributeFilter: ['class', 'data-state'], // только эти атрибуты
})

// Остановить наблюдение
observer.disconnect()`,
        },
      ],
      demoComponent: 'MutationDemo',
    },
    {
      id: 'canvas',
      title: 'Canvas API',
      description: '2D-графика, анимации и обработка изображений',
      explanation: `Canvas API предоставляет растровую 2D-графику через JavaScript.

**Контекст рисования:** \`canvas.getContext('2d')\`

**Основные операции:**
- Прямоугольники: \`fillRect\`, \`strokeRect\`, \`clearRect\`
- Пути: \`beginPath\`, \`moveTo\`, \`lineTo\`, \`arc\`, \`closePath\`
- Текст: \`fillText\`, \`strokeText\`
- Изображения: \`drawImage\`
- Трансформации: \`translate\`, \`rotate\`, \`scale\`

**requestAnimationFrame** — для плавных анимаций (60 FPS).`,
      examples: [
        {
          title: 'Базовое рисование',
          language: 'javascript',
          code: `const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Размер с учётом pixel ratio (ретина)
const dpr = window.devicePixelRatio || 1
canvas.width = 400 * dpr
canvas.height = 300 * dpr
canvas.style.width = '400px'
canvas.style.height = '300px'
ctx.scale(dpr, dpr)

// Прямоугольники
ctx.fillStyle = '#6366f1'
ctx.fillRect(10, 10, 100, 60)

ctx.strokeStyle = '#e74c3c'
ctx.lineWidth = 3
ctx.strokeRect(120, 10, 100, 60)

// Круг
ctx.beginPath()
ctx.arc(280, 40, 30, 0, Math.PI * 2)
ctx.fillStyle = '#22c55e'
ctx.fill()

// Текст
ctx.font = '20px Inter, sans-serif'
ctx.fillStyle = '#0f172a'
ctx.textAlign = 'center'
ctx.fillText('Hello Canvas!', 200, 150)

// Градиент
const gradient = ctx.createLinearGradient(0, 200, 400, 300)
gradient.addColorStop(0, '#6366f1')
gradient.addColorStop(1, '#ec4899')
ctx.fillStyle = gradient
ctx.fillRect(0, 200, 400, 100)`,
        },
        {
          title: 'Анимация через requestAnimationFrame',
          language: 'javascript',
          code: `const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 400
canvas.height = 300

let x = 0
let animId

function animate() {
  // Очистка
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Рисуем
  ctx.beginPath()
  ctx.arc(x, 150, 20, 0, Math.PI * 2)
  ctx.fillStyle = '#6366f1'
  ctx.fill()

  // Движение
  x = (x + 2) % (canvas.width + 40) - 20

  // Следующий кадр
  animId = requestAnimationFrame(animate)
}

animate()

// Остановить
function stop() {
  cancelAnimationFrame(animId)
}`,
        },
      ],
      demoComponent: 'CanvasDemo',
    },
    {
      id: 'geolocation',
      title: 'Geolocation API',
      description: 'Получение координат пользователя',
      explanation: `Geolocation API позволяет получить географическое положение устройства.

**Методы:**
- \`getCurrentPosition(success, error, options)\` — разовый запрос
- \`watchPosition(success, error, options)\` — непрерывное отслеживание
- \`clearWatch(id)\` — остановить отслеживание

**Требования:**
- HTTPS (или localhost)
- Разрешение пользователя
- Может быть недоступно в некоторых браузерах/режимах`,
      examples: [
        {
          title: 'Геолокация с обработкой ошибок',
          language: 'javascript',
          code: `if (!navigator.geolocation) {
  console.error('Geolocation не поддерживается')
}

// Разовый запрос
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords
    console.log(\`Координаты: \${latitude}, \${longitude}\`)
    console.log(\`Точность: ±\${accuracy} метров\`)
    console.log(\`Время: \${new Date(position.timestamp)}\`)
  },
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('Пользователь отказал в доступе')
        break
      case error.POSITION_UNAVAILABLE:
        console.error('Координаты недоступны')
        break
      case error.TIMEOUT:
        console.error('Время ожидания истекло')
        break
    }
  },
  {
    enableHighAccuracy: true, // GPS вместо WiFi
    timeout: 10000,           // мс
    maximumAge: 60000,        // кэш координат
  }
)

// Отслеживание движения
const watchId = navigator.geolocation.watchPosition(
  ({ coords }) => updateMap(coords),
  handleError
)
// Остановить
navigator.geolocation.clearWatch(watchId)`,
        },
      ],
      demoComponent: 'GeolocationDemo',
    },
    {
      id: 'web-workers',
      title: 'Web Workers',
      description: 'Многопоточность в браузере — тяжёлые вычисления без блокировки UI',
      explanation: `Web Workers выполняются в отдельном потоке, не блокируя главный (UI) поток.

**Ограничения Worker:**
- Нет доступа к DOM
- Нет \`window\` / \`document\`
- Общение только через сообщения

**Виды:**
- **Dedicated Worker** — один скрипт, один потребитель
- **Shared Worker** — доступен из нескольких вкладок
- **Service Worker** — офлайн-кэширование, фоновые синхронизации

**Когда использовать:** парсинг больших файлов, шифрование, обработка изображений, ML-инференс.`,
      examples: [
        {
          title: 'Создание Worker',
          language: 'javascript',
          code: `// main.js
const worker = new Worker('/worker.js')

// Отправка данных в Worker
worker.postMessage({
  type: 'PROCESS',
  data: largeArray
})

// Получение результата
worker.onmessage = (event) => {
  const { type, result } = event.data
  if (type === 'RESULT') {
    displayResult(result)
  }
}

worker.onerror = (error) => {
  console.error('Worker error:', error)
}

// Завершить Worker
worker.terminate()

// ---
// worker.js
self.onmessage = (event) => {
  const { type, data } = event.data

  if (type === 'PROCESS') {
    // Тяжёлые вычисления не блокируют UI!
    const result = data.reduce((sum, n) => {
      // Имитация сложных вычислений
      return sum + fibonacci(n)
    }, 0)

    self.postMessage({ type: 'RESULT', result })
  }
}

function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}`,
        },
        {
          title: 'Inline Worker (без отдельного файла)',
          language: 'javascript',
          code: `// Создание Worker из строки кода
const workerCode = \`
  self.onmessage = function(e) {
    const { numbers } = e.data
    const sorted = [...numbers].sort((a, b) => a - b)
    self.postMessage({ sorted })
  }
\`

const blob = new Blob([workerCode], {
  type: 'application/javascript'
})
const workerUrl = URL.createObjectURL(blob)
const worker = new Worker(workerUrl)

// Используем
worker.postMessage({ numbers: [5, 2, 8, 1, 9, 3] })
worker.onmessage = ({ data }) => {
  console.log('Sorted:', data.sorted) // [1, 2, 3, 5, 8, 9]
  worker.terminate()
  URL.revokeObjectURL(workerUrl) // освободить память
}`,
        },
      ],
      demoComponent: 'WebWorkerDemo',
    },
    {
      id: 'classes',
      title: 'Классы и ООП',
      description: 'ES6 классы, наследование, приватные поля, геттеры',
      explanation: `ES6 классы — синтаксический сахар над прототипным наследованием JS.

**Возможности:**
- \`constructor\` — инициализация
- \`#privateField\` — приватные поля (ES2022)
- \`get\` / \`set\` — аксессоры
- \`static\` — методы/поля класса
- \`extends\` — наследование
- \`super\` — вызов родительского конструктора/метода`,
      examples: [
        {
          title: 'Современный класс',
          language: 'javascript',
          code: `class EventEmitter {
  #listeners = new Map()

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, [])
    }
    this.#listeners.get(event).push(callback)
    return this // для chaining
  }

  off(event, callback) {
    const callbacks = this.#listeners.get(event) ?? []
    this.#listeners.set(event,
      callbacks.filter(cb => cb !== callback)
    )
    return this
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach(cb => cb(...args))
    return this
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }
}

class UserStore extends EventEmitter {
  #users = []

  get count() { return this.#users.length }

  add(user) {
    this.#users.push(user)
    this.emit('change', this.#users)
  }

  static create() { return new UserStore() }
}

const store = UserStore.create()
store.on('change', users => console.log('Users:', users))
store.add({ id: 1, name: 'Alice' })`,
        },
      ],
      demoComponent: 'ClassesDemo',
    },
  ],
}
