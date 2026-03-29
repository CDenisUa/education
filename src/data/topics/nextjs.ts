// Types
import type { Topic } from '@/types'

export const nextjsTopic: Topic = {
  id: 'nextjs',
  title: 'Next.js',
  icon: '▲',
  description: 'App Router, Server Components, Data Fetching и оптимизации',
  sections: [
    {
      id: 'app-router',
      title: 'App Router',
      description: 'Файловая система маршрутизации в папке app/',
      explanation: `App Router (Next.js 13+) использует директорию \`app/\` и React Server Components.

**Специальные файлы:**
- \`page.tsx\` — UI страницы, доступный по URL
- \`layout.tsx\` — обёртка вокруг страниц (сохраняется при навигации)
- \`loading.tsx\` — UI загрузки (Suspense boundary)
- \`error.tsx\` — UI ошибки (Error boundary)
- \`not-found.tsx\` — страница 404
- \`route.ts\` — API endpoint

**Динамические сегменты:**
- \`[id]\` — динамический сегмент
- \`[...slug]\` — catch-all
- \`[[...slug]]\` — опциональный catch-all
- \`(group)\` — группировка без влияния на URL`,
      examples: [
        {
          title: 'Структура файлов',
          language: 'text',
          code: `app/
├── layout.tsx          # Корневой layout (html, body)
├── page.tsx            # Главная страница /
├── loading.tsx         # Skeleton для /
├── error.tsx           # Ошибка для /
├── not-found.tsx       # 404
│
├── (marketing)/        # Группа — не влияет на URL
│   ├── about/
│   │   └── page.tsx    # /about
│   └── contact/
│       └── page.tsx    # /contact
│
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       ├── page.tsx    # /blog/my-post
│       └── loading.tsx
│
├── dashboard/
│   ├── layout.tsx      # Layout только для dashboard
│   ├── page.tsx        # /dashboard
│   ├── settings/
│   │   └── page.tsx    # /dashboard/settings
│   └── @analytics/     # Параллельные роуты
│       └── page.tsx
│
└── api/
    └── users/
        ├── route.ts    # GET /api/users, POST /api/users
        └── [id]/
            └── route.ts # GET/PUT/DELETE /api/users/[id]`,
        },
        {
          title: 'page.tsx и layout.tsx',
          language: 'tsx',
          code: `// app/layout.tsx — корневой layout
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: { template: '%s | My App', default: 'My App' },
  description: 'Описание приложения',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <header>...</header>
        <main>{children}</main>
        <footer>...</footer>
      </body>
    </html>
  )
}

// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug) // Server Component — прямой доступ к БД
  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

// Генерация метаданных
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return { title: post?.title, description: post?.excerpt }
}

// Статическая генерация путей
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}`,
        },
      ],
      demoComponent: 'AppRouterDemo',
    },
    {
      id: 'server-components',
      title: 'Server Components',
      description: 'RSC — компоненты на сервере без JS в браузере',
      explanation: `React Server Components (RSC) выполняются **только на сервере**.

**Преимущества:**
- Прямой доступ к БД, файловой системе, секретам
- Нулевой JS bundle — компонент не включается в клиентский код
- Fetch данных ближе к источнику (без roundtrip)
- Автоматическое кэширование

**Ограничения:**
- Нет useState, useEffect, браузерных API
- Нет обработчиков событий
- Нет Context (как потребитель)

**По умолчанию в App Router все компоненты — Server.**
Чтобы сделать Client Component — добавь \`'use client'\` в начале файла.`,
      examples: [
        {
          title: 'Server vs Client Components',
          language: 'tsx',
          code: `// ServerComponent.tsx — нет 'use client'
// Выполняется на сервере, НЕ входит в JS bundle

import { db } from '@/lib/db' // прямой доступ к БД!
import { headers, cookies } from 'next/headers'

async function UserProfile({ userId }: { userId: string }) {
  // Прямой запрос к БД без API!
  const user = await db.user.findUnique({ where: { id: userId } })

  // Заголовки и cookies без request объекта
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return (
    <div>
      <h2>{user?.name}</h2>
      <InteractiveButton userId={userId} />  {/* Client Component внутри */}
    </div>
  )
}

// ---

// ClientComponent.tsx
'use client'  // Граница клиента

import { useState } from 'react'

export function InteractiveButton({ userId }: { userId: string }) {
  const [liked, setLiked] = useState(false)

  return (
    <button
      onClick={() => setLiked(l => !l)}
      className={liked ? 'text-red-500' : ''}
    >
      {liked ? '❤️ Нравится' : '🤍 Лайк'}
    </button>
  )
}`,
        },
        {
          title: 'Передача Server → Client',
          language: 'tsx',
          code: `// ✅ Серверный компонент может рендерить клиентский
// И передавать сериализуемые данные через props

// ServerPage.tsx (Server Component)
async function ProductPage({ params }) {
  const product = await db.product.findUnique(...)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Передаём данные в Client Component */}
      <AddToCartButton
        productId={product.id}
        price={product.price}
      />
    </div>
  )
}

// AddToCartButton.tsx (Client Component)
'use client'

export function AddToCartButton({
  productId,
  price
}: {
  productId: string
  price: number
}) {
  const [added, setAdded] = useState(false)

  return (
    <button onClick={() => {
      addToCart(productId)
      setAdded(true)
    }}>
      {added ? '✓ Добавлено' : \`Купить — $\${price}\`}
    </button>
  )
}`,
        },
      ],
      demoComponent: 'ServerComponentsDemo',
    },
    {
      id: 'data-fetching',
      title: 'Data Fetching',
      description: 'SSG, SSR, ISR и кэширование в App Router',
      explanation: `В App Router data fetching строится на расширенном \`fetch\` с кэшированием.

**Стратегии:**
- **Static** — данные получены при сборке, кэшируются бессрочно
- **Dynamic** — данные получаются при каждом запросе
- **Revalidating** — ISR: обновление кэша по времени или по тегу

**Параллельный fetch:** несколько \`await\` последовательно — медленно. Используй \`Promise.all\`.

**Streaming:** \`<Suspense>\` позволяет стримить части страницы до готовности данных.`,
      examples: [
        {
          title: 'fetch с кэшированием',
          language: 'tsx',
          code: `// Static — кэшируется навсегда (сборка)
const data = await fetch('https://api.example.com/posts', {
  cache: 'force-cache' // default в Next.js
})

// Dynamic — без кэша, каждый запрос
const data = await fetch('https://api.example.com/user', {
  cache: 'no-store'
})

// ISR — обновление каждые 60 секунд
const data = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 }
})

// ISR — по тегу (on-demand revalidation)
const data = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

// В Route Handler или Server Action:
// import { revalidateTag } from 'next/cache'
// revalidateTag('posts') — инвалидирует всё с тегом 'posts'`,
        },
        {
          title: 'Параллельный fetch + Streaming',
          language: 'tsx',
          code: `// app/dashboard/page.tsx
import { Suspense } from 'react'

async function UserStats({ userId }: { userId: string }) {
  // Медленный запрос — но не блокирует остальные
  const stats = await db.analytics.getStats(userId)
  return <StatsChart data={stats} />
}

async function RecentPosts({ userId }: { userId: string }) {
  const posts = await db.post.findMany({ where: { authorId: userId } })
  return <PostList posts={posts} />
}

export default async function DashboardPage() {
  // Запросы выполняются параллельно через Suspense!
  return (
    <div className="grid grid-cols-2 gap-6">
      <Suspense fallback={<SkeletonChart />}>
        <UserStats userId="1" />
      </Suspense>

      <Suspense fallback={<SkeletonList />}>
        <RecentPosts userId="1" />
      </Suspense>
    </div>
  )
}

// Каждый блок стримится независимо:
// - Быстрые данные показываются сразу
// - Медленные — как только придут`,
        },
      ],
      demoComponent: 'DataFetchingDemo',
    },
    {
      id: 'server-actions',
      title: 'Server Actions',
      description: 'Мутации данных прямо из компонентов без API',
      explanation: `Server Actions — асинхронные функции с директивой \`'use server'\`, выполняющиеся на сервере.

**Возможности:**
- Вызов прямо из \`<form action={...}>\` или обработчика события
- Прямой доступ к БД и серверным ресурсам
- Автоматическая CSRF-защита
- Интеграция с \`useFormState\` / \`useFormStatus\`
- Прогрессивное улучшение: работает без JS (через form)`,
      examples: [
        {
          title: 'Server Action в форме',
          language: 'tsx',
          code: `// actions/users.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const result = schema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  await db.user.create({ data: result.data })
  revalidatePath('/users') // инвалидировать кэш
  redirect('/users')       // редирект
}

// components/CreateUserForm.tsx
'use client'

import { useFormStatus, useFormState } from 'react-dom'
import { createUser } from '@/actions/users'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Сохранение...' : 'Создать'}
    </button>
  )
}

export function CreateUserForm() {
  const [state, action] = useFormState(createUser, null)

  return (
    <form action={action}>
      <input name="name" placeholder="Имя" />
      {state?.error?.name && <p>{state.error.name[0]}</p>}
      <input name="email" placeholder="Email" />
      {state?.error?.email && <p>{state.error.email[0]}</p>}
      <SubmitButton />
    </form>
  )
}`,
        },
      ],
      demoComponent: 'ServerActionsDemo',
    },
    {
      id: 'route-handlers',
      title: 'Route Handlers',
      description: 'API endpoints в app/api/ через route.ts',
      explanation: `Route Handlers — API endpoints в файлах \`route.ts\` внутри \`app/\`.

**HTTP методы:** GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

**Особенности:**
- Доступ к \`Request\`, возврат \`Response\`
- \`NextRequest\` / \`NextResponse\` — расширенные версии
- Кэширование GET-запросов (как и fetch)
- Можно использовать с серверными библиотеками

**Когда использовать:**
- Webhooks
- Публичные API для внешних потребителей
- Интеграции с OAuth
- Загрузка файлов`,
      examples: [
        {
          title: 'REST API Handler',
          language: 'typescript',
          code: `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')

  const users = await db.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })

  return NextResponse.json({ users, page })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Валидация
  const result = userSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 422 }
    )
  }

  const user = await db.user.create({ data: result.data })
  return NextResponse.json(user, { status: 201 })
}

// app/api/users/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.user.delete({ where: { id } })
  return new Response(null, { status: 204 })
}`,
        },
      ],
      demoComponent: 'RouteHandlersDemo',
    },
    {
      id: 'middleware',
      title: 'Middleware',
      description: 'Перехват запросов: auth, редиректы, заголовки',
      explanation: `Middleware выполняется **до** обработки запроса — идеально для аутентификации, редиректов и A/B-тестов.

**Возможности:**
- Чтение и запись cookies
- Чтение заголовков
- Редиректы и rewrite
- Добавление заголовков к ответу

**Файл:** \`middleware.ts\` в корне проекта (рядом с \`app/\`)

**Конфигурация:** \`config.matcher\` — паттерны путей, которые обрабатывает middleware.`,
      examples: [
        {
          title: 'Auth Middleware',
          language: 'typescript',
          code: `// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем публичные пути
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Проверяем токен
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // Редирект на логин с сохранением intended URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Добавляем заголовок для Server Components
  const response = NextResponse.next()
  response.headers.set('x-user-id', getUserIdFromToken(token))
  return response
}

export const config = {
  matcher: [
    // Исключаем статику и Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}`,
        },
      ],
      demoComponent: 'MiddlewareDemo',
    },
    {
      id: 'image-optimization',
      title: 'Оптимизация изображений',
      description: 'next/image — автоматическая оптимизация изображений',
      explanation: `Компонент \`<Image>\` из \`next/image\` автоматически:
- Конвертирует в WebP/AVIF
- Изменяет размер под экран (srcset)
- Ленивая загрузка по умолчанию
- Предотвращает CLS через \`width\`/\`height\`
- Оптимизирует загрузку через CDN`,
      examples: [
        {
          title: 'Все режимы next/image',
          language: 'tsx',
          code: `import Image from 'next/image'

// Локальное изображение (размеры автоматически)
import heroImage from '/public/hero.jpg'

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur"  // автоматический blur hash!
  priority            // LCP-изображение — загружать сразу
/>

// Внешнее изображение (нужно указать размеры)
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
/>

// Fill — заполняет родительский контейнер
<div style={{ position: 'relative', height: '400px' }}>
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    style={{ objectFit: 'cover' }}
    sizes="100vw"
  />
</div>

// next.config.js — разрешённые домены
// images: {
//   remotePatterns: [{
//     protocol: 'https',
//     hostname: 'example.com',
//   }]
// }`,
        },
      ],
      demoComponent: 'ImageDemo',
    },
    {
      id: 'metadata',
      title: 'Metadata API',
      description: 'SEO, Open Graph и динамические мета-теги',
      explanation: `Next.js App Router предоставляет типобезопасный Metadata API для управления \`<head>\`.

**Два способа:**
1. **Статические метаданные** — экспорт объекта \`metadata\`
2. **Динамические метаданные** — экспорт функции \`generateMetadata\`

**Наследование:** \`layout.tsx\` метаданные наследуются и могут переопределяться в \`page.tsx\`.`,
      examples: [
        {
          title: 'Metadata API',
          language: 'tsx',
          code: `// app/layout.tsx — базовые метаданные
import type { Metadata } from 'next'

export const metadata: Metadata = {
  // Template для дочерних страниц
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'Описание по умолчанию',
  metadataBase: new URL('https://example.com'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'My App',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    creator: '@username',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

// app/blog/[slug]/page.tsx — динамические метаданные
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,        // → "Заголовок | My App"
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
    alternates: {
      canonical: \`/blog/\${slug}\`,
    },
  }
}`,
        },
      ],
      demoComponent: 'MetadataDemo',
    },
  ],
}
