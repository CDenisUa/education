// Types
import type { Topic } from '@/types'

export const htmlTopic: Topic = {
  id: 'html',
  title: 'HTML',
  icon: '🏗️',
  description: 'Структура веб-страниц: семантика, формы, медиа и доступность',
  sections: [
    {
      id: 'semantic-elements',
      title: 'Семантические элементы',
      description: 'HTML5 семантические теги для структурирования контента',
      explanation: `Семантические элементы описывают **смысл** содержимого, а не его внешний вид. Они помогают браузерам, поисковикам и скринридерам понять структуру страницы.

**Зачем это нужно:**
- SEO: поисковики лучше индексируют структурированный контент
- Доступность: скринридеры правильно озвучивают контент
- Читаемость кода: понятная структура без комментариев
- Стандарты: соответствие спецификации HTML5`,
      examples: [
        {
          title: 'Структура страницы',
          language: 'html',
          code: `<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Главная</a></li>
        <li><a href="/about">О нас</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Заголовок статьи</h1>
        <time datetime="2024-01-15">15 января 2024</time>
      </header>
      <section>
        <h2>Введение</h2>
        <p>Содержание раздела...</p>
      </section>
      <aside>
        <p>Связанная информация</p>
      </aside>
    </article>
  </main>

  <footer>
    <p>&copy; 2024 Мой сайт</p>
  </footer>
</body>`,
        },
        {
          title: 'Figure и Figcaption',
          language: 'html',
          code: `<figure>
  <img
    src="/photo.jpg"
    alt="Описание фото для скринридеров"
    width="800"
    height="600"
    loading="lazy"
  />
  <figcaption>
    Подпись к изображению с <cite>источником</cite>
  </figcaption>
</figure>`,
        },
        {
          title: 'Details и Summary',
          language: 'html',
          code: `<!-- Нативный аккордеон без JS -->
<details>
  <summary>Нажмите, чтобы раскрыть</summary>
  <p>Скрытый контент, который показывается при клике.</p>
  <ul>
    <li>Элемент 1</li>
    <li>Элемент 2</li>
  </ul>
</details>

<!-- Открыт по умолчанию -->
<details open>
  <summary>Уже открыт</summary>
  <p>Этот блок открыт сразу.</p>
</details>`,
        },
      ],
      demoComponent: 'SemanticDemo',
    },
    {
      id: 'forms',
      title: 'Формы и Инпуты',
      description: 'HTML5 типы полей, валидация, атрибуты форм',
      explanation: `HTML5 добавил множество новых типов input и атрибутов для валидации без JavaScript.

**Ключевые возможности:**
- Нативная валидация через атрибуты \`required\`, \`pattern\`, \`min\`, \`max\`
- Новые типы: \`email\`, \`tel\`, \`date\`, \`range\`, \`color\`, \`search\`
- Семантическое связывание через \`<label for="id">\`
- Группировка через \`<fieldset>\` и \`<legend>\`
- Список вариантов через \`<datalist>\``,
      examples: [
        {
          title: 'Типы полей HTML5',
          language: 'html',
          code: `<form>
  <!-- Email с валидацией -->
  <label for="email">Email:</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    placeholder="user@example.com"
  />

  <!-- Число в диапазоне -->
  <label for="age">Возраст (18-100):</label>
  <input
    type="number"
    id="age"
    min="18"
    max="100"
    step="1"
  />

  <!-- Ползунок -->
  <label for="volume">Громкость:</label>
  <input type="range" id="volume" min="0" max="100" value="50" />

  <!-- Дата -->
  <input type="date" min="2024-01-01" />

  <!-- Цвет -->
  <input type="color" value="#ff0000" />

  <!-- Телефон с паттерном -->
  <input
    type="tel"
    pattern="[0-9]{10}"
    placeholder="0991234567"
  />

  <!-- Поиск -->
  <input type="search" placeholder="Поиск..." />
</form>`,
        },
        {
          title: 'Datalist — автодополнение',
          language: 'html',
          code: `<label for="browser">Браузер:</label>
<input
  list="browsers"
  id="browser"
  name="browser"
  placeholder="Начните вводить..."
/>
<datalist id="browsers">
  <option value="Chrome" />
  <option value="Firefox" />
  <option value="Safari" />
  <option value="Edge" />
  <option value="Opera" />
</datalist>`,
        },
        {
          title: 'Fieldset и Legend',
          language: 'html',
          code: `<form>
  <fieldset>
    <legend>Личные данные</legend>
    <label for="fname">Имя:</label>
    <input type="text" id="fname" required />
    <label for="lname">Фамилия:</label>
    <input type="text" id="lname" />
  </fieldset>

  <fieldset>
    <legend>Способ доставки</legend>
    <label>
      <input type="radio" name="delivery" value="courier" /> Курьер
    </label>
    <label>
      <input type="radio" name="delivery" value="post" /> Почта
    </label>
    <label>
      <input type="radio" name="delivery" value="pickup" /> Самовывоз
    </label>
  </fieldset>
</form>`,
        },
      ],
      demoComponent: 'FormsDemo',
    },
    {
      id: 'media',
      title: 'Медиа-элементы',
      description: 'Video, Audio, Canvas, SVG и Picture',
      explanation: `HTML5 предоставляет нативные элементы для работы с медиа без плагинов.

**Элементы:**
- \`<video>\` — встроенное видео с нативными контролами
- \`<audio>\` — аудиоплеер
- \`<picture>\` — адаптивные изображения
- \`<canvas>\` — программная графика через JS
- \`<svg>\` — векторная графика прямо в HTML`,
      examples: [
        {
          title: 'Video с fallback',
          language: 'html',
          code: `<video
  width="640"
  height="360"
  controls
  autoplay
  muted
  loop
  poster="/preview.jpg"
  preload="metadata"
>
  <source src="/video.webm" type="video/webm" />
  <source src="/video.mp4" type="video/mp4" />
  <!-- Субтитры -->
  <track
    kind="subtitles"
    src="/subs.vtt"
    srclang="ru"
    label="Русский"
    default
  />
  Ваш браузер не поддерживает video.
</video>`,
        },
        {
          title: 'Picture — адаптивные изображения',
          language: 'html',
          code: `<picture>
  <!-- Авиформат для современных браузеров -->
  <source
    srcset="/image.avif"
    type="image/avif"
  />
  <!-- WebP для большинства браузеров -->
  <source
    srcset="/image-800.webp 800w, /image-1600.webp 1600w"
    type="image/webp"
    sizes="(max-width: 768px) 100vw, 800px"
  />
  <!-- Fallback -->
  <img
    src="/image.jpg"
    alt="Описание"
    width="800"
    height="450"
    loading="lazy"
    decoding="async"
  />
</picture>`,
        },
        {
          title: 'Inline SVG',
          language: 'html',
          code: `<svg
  width="100"
  height="100"
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Красный круг"
>
  <circle
    cx="50" cy="50" r="40"
    fill="#e74c3c"
    stroke="#c0392b"
    stroke-width="3"
  />
  <text
    x="50" y="55"
    text-anchor="middle"
    fill="white"
    font-size="16"
  >
    SVG
  </text>
</svg>`,
        },
      ],
      demoComponent: 'MediaDemo',
    },
    {
      id: 'accessibility',
      title: 'Доступность (ARIA)',
      description: 'ARIA-атрибуты, роли и доступность для скринридеров',
      explanation: `ARIA (Accessible Rich Internet Applications) дополняет семантику HTML для динамического контента.

**Ключевые концепции:**
- **Роли** (\`role\`): описывают тип элемента (\`button\`, \`dialog\`, \`navigation\`)
- **Свойства** (\`aria-label\`, \`aria-describedby\`): добавляют описание
- **Состояния** (\`aria-expanded\`, \`aria-hidden\`, \`aria-checked\`): динамические состояния
- **Правило №1**: Используй нативный HTML прежде чем прибегать к ARIA`,
      examples: [
        {
          title: 'ARIA на практике',
          language: 'html',
          code: `<!-- Кнопка с пояснением -->
<button
  aria-label="Закрыть диалог"
  aria-describedby="close-hint"
>
  ×
</button>
<span id="close-hint" hidden>
  Нажмите Escape для закрытия
</span>

<!-- Аккордеон -->
<button
  aria-expanded="false"
  aria-controls="section1"
>
  Показать содержимое
</button>
<div id="section1" hidden>
  Скрытый контент
</div>

<!-- Прогресс-бар -->
<div
  role="progressbar"
  aria-valuenow="65"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Загрузка файла"
>
  65%
</div>

<!-- Живая область (объявления) -->
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Форма успешно отправлена
</div>`,
        },
        {
          title: 'Навигация с landmarks',
          language: 'html',
          code: `<!-- Скип-ссылка для клавиатурных пользователей -->
<a href="#main-content" class="skip-link">
  Перейти к основному контенту
</a>

<header role="banner">
  <nav aria-label="Основная навигация">
    <ul>
      <li><a href="/" aria-current="page">Главная</a></li>
      <li><a href="/about">О нас</a></li>
    </ul>
  </nav>
</header>

<main id="main-content" tabindex="-1">
  <h1>Заголовок страницы</h1>
</main>

<aside aria-label="Связанные статьи">
  <!-- боковая панель -->
</aside>`,
        },
      ],
      demoComponent: 'AccessibilityDemo',
    },
    {
      id: 'meta-head',
      title: 'Head и Meta-теги',
      description: 'SEO, Open Graph, viewport и подключение ресурсов',
      explanation: `Содержимое \`<head>\` невидимо пользователю, но критично для SEO, производительности и соцсетей.

**Категории:**
- **Базовые**: charset, viewport, title, description
- **SEO**: canonical, robots, og/twitter мета
- **Производительность**: preload, prefetch, preconnect
- **PWA**: theme-color, manifest, apple-touch-icon`,
      examples: [
        {
          title: 'Полный <head>',
          language: 'html',
          code: `<head>
  <!-- Кодировка — всегда первой -->
  <meta charset="UTF-8" />

  <!-- Адаптивность -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- SEO -->
  <title>Название страницы | Сайт</title>
  <meta name="description" content="Описание до 160 символов" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://example.com/page" />

  <!-- Open Graph для соцсетей -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Название" />
  <meta property="og:description" content="Описание" />
  <meta property="og:image" content="https://example.com/og.jpg" />
  <meta property="og:url" content="https://example.com/page" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Название" />
  <meta name="twitter:image" content="https://example.com/og.jpg" />

  <!-- Производительность: предзагрузка критичных ресурсов -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="//cdn.example.com" />

  <!-- Иконки -->
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- PWA -->
  <meta name="theme-color" content="#0f172a" />
  <link rel="manifest" href="/manifest.json" />

  <!-- Стили -->
  <link rel="stylesheet" href="/styles.css" />
</head>`,
        },
      ],
      demoComponent: 'MetaDemo',
    },
  ],
}
