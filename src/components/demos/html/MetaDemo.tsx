'use client'

// Core
import { useState } from 'react'

const metaTags = [
  { category: 'Базовые', color: 'blue', tags: [
    { name: 'charset', content: 'UTF-8', desc: 'Кодировка документа — всегда первый тег' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1', desc: 'Адаптивность для мобильных' },
    { name: 'title', content: 'Название страницы | Сайт', desc: 'Заголовок в браузере и поисковике' },
    { name: 'description', content: 'Описание страницы до 160 символов...', desc: 'Сниппет в результатах поиска' },
  ]},
  { category: 'SEO', color: 'green', tags: [
    { name: 'robots', content: 'index, follow', desc: 'Инструкции для поисковых роботов' },
    { name: 'canonical', content: 'https://example.com/page', desc: 'Канонический URL страницы' },
    { name: 'og:title', content: 'Название для соцсетей', desc: 'Open Graph — заголовок' },
    { name: 'og:image', content: 'https://example.com/og.jpg', desc: 'Превью-картинка в соцсетях' },
  ]},
  { category: 'Производительность', color: 'purple', tags: [
    { name: 'preload', content: 'href="/font.woff2" as="font"', desc: 'Предзагрузка критичных ресурсов' },
    { name: 'preconnect', content: 'href="https://api.example.com"', desc: 'Предустановка TCP-соединения' },
    { name: 'dns-prefetch', content: 'href="//cdn.example.com"', desc: 'Предварительный DNS-запрос' },
  ]},
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
}

export function MetaDemo() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Нажмите на тег, чтобы увидеть его описание
      </p>
      {metaTags.map(group => (
        <div key={group.category}>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {group.category}
          </h3>
          <div className="space-y-1.5">
            {group.tags.map(tag => (
              <button
                key={tag.name}
                onClick={() => setSelected(selected === tag.name ? null : tag.name)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-sm
                  ${selected === tag.name
                    ? colorMap[group.color]
                    : 'bg-slate-800/40 border-white/8 hover:border-white/15'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <code className="font-mono text-xs text-slate-300 font-medium">
                    {tag.name.startsWith('og:') || tag.name === 'preload' || tag.name === 'preconnect' || tag.name === 'dns-prefetch'
                      ? `<link rel="${tag.name}"`
                      : `<meta name="${tag.name}"`}
                  </code>
                  <code className="font-mono text-xs text-slate-500 truncate max-w-[200px]">
                    {tag.content}
                  </code>
                </div>
                {selected === tag.name && (
                  <p className="mt-2 text-xs text-slate-300 border-t border-white/10 pt-2">
                    {tag.desc}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
