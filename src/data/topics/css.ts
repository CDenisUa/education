// Types
import type { Topic } from '@/types'

export const cssTopic: Topic = {
  id: 'css',
  title: 'CSS',
  icon: '🎨',
  description: 'Стили, анимации, Grid, Flexbox и современные CSS-фичи',
  sections: [
    {
      id: 'box-model',
      title: 'Блочная модель',
      description: 'Content, Padding, Border, Margin и box-sizing',
      explanation: `Каждый HTML-элемент — прямоугольник. Блочная модель описывает пространство вокруг содержимого.

**Слои снаружи внутрь:**
1. **Margin** — внешний отступ (прозрачный, не кликабельный)
2. **Border** — граница (имеет цвет и стиль)
3. **Padding** — внутренний отступ (background-color распространяется)
4. **Content** — само содержимое (width/height)

**box-sizing:**
- \`content-box\` (default): width = только контент, padding и border добавляются
- \`border-box\`: width = контент + padding + border (**предпочтительно**)`,
      examples: [
        {
          title: 'box-sizing: border-box',
          language: 'css',
          code: `/* Глобальный сброс — лучшая практика */
*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px; /* Ширина ВКЛЮЧАЕТ padding и border */
  padding: 24px;
  border: 2px solid #e2e8f0;
  margin: 16px auto;
}

/* content-box (по умолчанию) */
.box-content {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Итоговая ширина: 200 + 20*2 + 5*2 = 250px */
}

/* border-box */
.box-border {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Итоговая ширина: ровно 200px */
}`,
        },
        {
          title: 'Схлопывание margin',
          language: 'css',
          code: `/* Схлопывание вертикальных margin */
.paragraph {
  margin-top: 16px;
  margin-bottom: 24px;
}

/*
  Между двумя paragraphs расстояние будет
  max(16px, 24px) = 24px, а НЕ 40px
  Это происходит только для вертикальных margin
  соседних блочных элементов
*/

/* Предотвращение схлопывания */
.container {
  padding-top: 1px;   /* или */
  overflow: hidden;    /* или */
  display: flex;       /* flex/grid отменяет схлопывание */
}`,
        },
      ],
      demoComponent: 'BoxModelDemo',
    },
    {
      id: 'flexbox',
      title: 'Flexbox',
      description: 'Одномерные раскладки с flex-контейнером',
      explanation: `Flexbox решает задачу **одномерного** выравнивания — строка ИЛИ колонка.

**Контейнер** (\`display: flex\`):
- \`flex-direction\`: row | column | row-reverse | column-reverse
- \`justify-content\`: выравнивание по **главной** оси
- \`align-items\`: выравнивание по **поперечной** оси
- \`flex-wrap\`: перенос на новую строку
- \`gap\`: расстояние между элементами

**Дочерние элементы:**
- \`flex-grow\`: как растёт элемент
- \`flex-shrink\`: как сжимается
- \`flex-basis\`: базовый размер
- \`align-self\`: индивидуальное выравнивание
- \`order\`: порядок без изменения HTML`,
      examples: [
        {
          title: 'Центрирование через Flexbox',
          language: 'css',
          code: `/* Классическое центрирование */
.center {
  display: flex;
  justify-content: center; /* горизонталь */
  align-items: center;     /* вертикаль */
  min-height: 100vh;
}

/* Навигационная строка */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
}

.navbar .logo { /* Без grow */ }
.navbar .nav-links {
  display: flex;
  gap: 24px;
  flex: 1; /* занять всё свободное место */
}
.navbar .actions { /* Без grow */ }`,
        },
        {
          title: 'flex shorthand',
          language: 'css',
          code: `/*
  flex: grow shrink basis
*/
.item {
  flex: 1;        /* flex: 1 1 0%  — равномерный рост */
  flex: auto;     /* flex: 1 1 auto */
  flex: none;     /* flex: 0 0 auto — не растёт и не сжимается */
  flex: 0 0 200px; /* фиксированный размер */
}

/* Адаптивные карточки */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 280px; /* растёт, но минимум 280px */
  max-width: 400px;
}`,
        },
        {
          title: 'Святой Грааль — трёхколоночный layout',
          language: 'css',
          code: `/* Holy Grail Layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-body {
  display: flex;
  flex: 1;
}

.sidebar-left  { width: 200px; flex-shrink: 0; }
.main-content  { flex: 1; }          /* занимает всё остальное */
.sidebar-right { width: 160px; flex-shrink: 0; }

header, footer { flex-shrink: 0; }`,
        },
      ],
      demoComponent: 'FlexboxDemo',
    },
    {
      id: 'grid',
      title: 'CSS Grid',
      description: 'Двумерные раскладки с именованными областями',
      explanation: `CSS Grid решает **двумерные** раскладки — строки И колонки одновременно.

**Ключевые свойства:**
- \`grid-template-columns\` / \`grid-template-rows\`: определение треков
- \`fr\` — fractional unit, делит свободное место
- \`grid-template-areas\`: именованные области
- \`grid-column\` / \`grid-row\`: позиционирование элементов
- \`gap\`: расстояние между ячейками
- \`auto-fit\` + \`minmax()\`: адаптивные колонки без media queries`,
      examples: [
        {
          title: 'grid-template-areas',
          language: 'css',
          code: `.layout {
  display: grid;
  grid-template-columns: 240px 1fr 200px;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
  min-height: 100vh;
  gap: 8px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }`,
        },
        {
          title: 'Auto-fit с minmax — адаптивная сетка',
          language: 'css',
          code: `/* Адаптивная сетка БЕЗ media queries */
.gallery {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  );
  gap: 24px;
}
/*
  auto-fit: создаёт столько колонок, сколько влезает
  minmax(250px, 1fr): минимум 250px, максимум — всё место
  Автоматически: 1 → 2 → 3 → 4 колонки при изменении ширины
*/

/* Элемент на всю ширину */
.featured {
  grid-column: 1 / -1; /* от первой линии до последней */
}

/* Span нескольких ячеек */
.wide { grid-column: span 2; }
.tall { grid-row: span 3; }`,
        },
        {
          title: 'Явное позиционирование',
          language: 'css',
          code: `.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 120px);
  gap: 8px;
}

/* Через номера линий */
.hero {
  grid-column: 1 / 3;    /* колонки 1-2 */
  grid-row: 1 / 3;       /* строки 1-2 */
}

/* Через span */
.banner {
  grid-column: 1 / -1;   /* вся строка */
}

/* Сокращённая запись */
.item {
  grid-area: 2 / 3 / 4 / 5;
  /* row-start / col-start / row-end / col-end */
}`,
        },
      ],
      demoComponent: 'GridDemo',
    },
    {
      id: 'custom-properties',
      title: 'CSS Custom Properties',
      description: 'CSS-переменные, каскад и темизация',
      explanation: `CSS Custom Properties (переменные) — мощный инструмент для управления дизайн-системой.

**Отличия от SASS-переменных:**
- Работают **в реальном времени** — меняются через JS
- Участвуют в **каскаде** — можно переопределять в scope
- Доступны **в JS** через \`getComputedStyle\` и \`setProperty\`
- Поддерживают **fallback**: \`var(--color, red)\``,
      examples: [
        {
          title: 'Система дизайна через переменные',
          language: 'css',
          code: `/* Токены дизайна */
:root {
  /* Цвета */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;

  /* Типографика */
  --font-sans: 'Inter', system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  /* Отступы */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-8: 32px;

  /* Радиусы */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Тени */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Тёмная тема */
[data-theme="dark"] {
  --color-surface: #0f172a;
  --color-text: #f1f5f9;
  --color-muted: #94a3b8;
}`,
        },
        {
          title: 'Переменные в JS',
          language: 'javascript',
          code: `// Читать CSS-переменную
const root = document.documentElement
const primary = getComputedStyle(root)
  .getPropertyValue('--color-primary').trim()

// Изменить CSS-переменную
root.style.setProperty('--color-primary', '#e74c3c')

// Переключение темы
function toggleTheme() {
  const html = document.documentElement
  const isDark = html.dataset.theme === 'dark'
  html.dataset.theme = isDark ? 'light' : 'dark'
}

// Динамический акцентный цвет
function setAccent(hue) {
  root.style.setProperty(
    '--color-primary',
    \`hsl(\${hue}, 80%, 60%)\`
  )
}`,
        },
      ],
      demoComponent: 'CSSVariablesDemo',
    },
    {
      id: 'animations',
      title: 'Анимации и Переходы',
      description: 'transition, animation, @keyframes и performance',
      explanation: `CSS анимации работают на GPU и не блокируют главный поток JavaScript.

**transition** — плавный переход между состояниями:
- Срабатывает при изменении свойства (hover, class, etc.)
- \`transition: property duration easing delay\`

**animation** — сложные анимации по ключевым кадрам:
- Не требует изменения состояния
- Может повторяться, реверсироваться

**Производительность:**
- Анимируй только \`transform\` и \`opacity\` — они на GPU
- Избегай \`width\`, \`height\`, \`top\`, \`left\` — они вызывают reflow`,
      examples: [
        {
          title: 'Transitions',
          language: 'css',
          code: `/* Базовый переход */
.button {
  background: #6366f1;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  transition:
    background 200ms ease,
    transform 150ms ease,
    box-shadow 150ms ease;
}

.button:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99,102,241,0.4);
}

.button:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Переход всех свойств (осторожно — дорого) */
.slow { transition: all 0.3s ease; }`,
        },
        {
          title: '@keyframes — сложные анимации',
          language: 'css',
          code: `/* Спиннер */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}

/* Пульс */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.95); }
}
.loading {
  animation: pulse 2s ease-in-out infinite;
}

/* Slide-in */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.modal {
  animation: slideIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Shake (ошибка формы) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}
.error { animation: shake 400ms ease; }`,
        },
        {
          title: 'prefers-reduced-motion',
          language: 'css',
          code: `/* Уважай настройки пользователя */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Или включай анимацию только когда она разрешена */
@media (prefers-reduced-motion: no-preference) {
  .hero-image {
    animation: float 3s ease-in-out infinite;
  }
}`,
        },
      ],
      demoComponent: 'AnimationsDemo',
    },
    {
      id: 'selectors',
      title: 'Селекторы и Специфичность',
      description: 'Все типы CSS-селекторов и расчёт специфичности',
      explanation: `Специфичность определяет, какое правило побеждает при конфликте.

**Вес (от высшего к низшему):**
1. \`!important\` — не использовать без причины
2. Inline styles: \`style="..."\` — (1,0,0,0)
3. ID: \`#id\` — (0,1,0,0)
4. Class, attribute, pseudo-class: \`.class\`, \`[attr]\`, \`:hover\` — (0,0,1,0)
5. Element, pseudo-element: \`div\`, \`::before\` — (0,0,0,1)
6. Universal: \`*\` — (0,0,0,0)

При равной специфичности побеждает **последнее** правило.`,
      examples: [
        {
          title: 'Современные CSS-селекторы',
          language: 'css',
          code: `/* :is() — группировка с сохранением специфичности */
:is(h1, h2, h3) { color: navy; }

/* :where() — то же, но специфичность = 0 */
:where(h1, h2, h3) { margin: 0; }

/* :has() — родительский селектор */
.card:has(img) { padding: 0; }
form:has(:invalid) { border-color: red; }
li:has(+ li) { border-bottom: 1px solid; } /* не последний */

/* :not() */
a:not(.btn):not([href^="http"]) {
  color: inherit;
}

/* Атрибутные селекторы */
[href^="https"] { /* начинается с */ }
[href$=".pdf"]  { /* заканчивается на */ }
[class*="icon"] { /* содержит */ }
[lang|="en"]    { /* en или en-US */ }

/* Nth-selectors */
li:nth-child(2n+1)    { /* нечётные */ }
li:nth-last-child(3)  { /* третий с конца */ }
p:nth-of-type(even)   { /* чётные <p> */ }`,
        },
      ],
      demoComponent: 'SelectorsDemo',
    },
    {
      id: 'responsive',
      title: 'Адаптивный дизайн',
      description: 'Media queries, container queries и clamp()',
      explanation: `Современный адаптивный дизайн выходит за рамки простых media queries.

**Инструменты:**
- \`@media\`: адаптация по размеру **вьюпорта**
- \`@container\`: адаптация по размеру **контейнера** (новое!)
- \`clamp(min, ideal, max)\`: fluid typography и spacing
- \`min()\` / \`max()\`: умные ограничения
- CSS Grid \`auto-fit\` + \`minmax()\`: адаптация без media queries`,
      examples: [
        {
          title: 'Mobile-first подход',
          language: 'css',
          code: `/* Mobile-first: базовые стили для мобильных */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Планшеты и выше */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Десктоп */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
  }
}

/* Тёмная тема через media */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text: #f1f5f9;
  }
}`,
        },
        {
          title: 'clamp() — fluid typography',
          language: 'css',
          code: `/* clamp(min, preferred, max) */
:root {
  --text-base: clamp(14px, 1.5vw, 18px);
  --text-xl: clamp(20px, 4vw, 36px);
  --text-hero: clamp(32px, 8vw, 80px);
}

/* Fluid spacing */
.section {
  padding: clamp(32px, 8vw, 96px);
  gap: clamp(16px, 3vw, 32px);
}

/* Без переломных точек — плавное масштабирование */
h1 { font-size: var(--text-hero); }
p  { font-size: var(--text-base); }`,
        },
        {
          title: 'Container Queries',
          language: 'css',
          code: `/* Делаем элемент контейнером */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Адаптируем карточку по размеру контейнера */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
  .card-image {
    height: 100%;
    object-fit: cover;
  }
}

/* Работает независимо от размера экрана!
   Одна карточка в узкой колонке — вертикальная
   Она же в широкой колонке — горизонтальная */`,
        },
      ],
      demoComponent: 'ResponsiveDemo',
    },
  ],
}
