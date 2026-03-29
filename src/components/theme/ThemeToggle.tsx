'use client'

import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'education-theme'
const DEFAULT_THEME: Theme = 'light'
const THEME_EVENT = 'education-theme-change'

function isTheme(value: string | undefined): value is Theme {
  return value === 'light' || value === 'dark'
}

function readTheme(): Theme {
  if (typeof document !== 'undefined') {
    const rootTheme = document.documentElement.dataset.theme
    if (isTheme(rootTheme)) {
      return rootTheme
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const storedTheme = window.localStorage.getItem(STORAGE_KEY)
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme
      }
    } catch {}
  }

  return DEFAULT_THEME
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme

  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {}

  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }))
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getThemeSnapshot(): Theme {
  return readTheme()
}

function getServerThemeSnapshot(): Theme {
  return DEFAULT_THEME
}

function subscribeHydration() {
  return () => {}
}

function getHydratedSnapshot() {
  return true
}

function getServerHydratedSnapshot() {
  return false
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot)
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  )

  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(nextTheme)
      }}
      className="theme-toggle fixed z-50 inline-flex h-11 w-11 items-center justify-center rounded-full
        border border-white/10 bg-slate-900/80 text-slate-300
        shadow-lg shadow-slate-950/20 backdrop-blur-md transition-all duration-200
        hover:border-white/20 hover:bg-slate-800/80"
      aria-label={hydrated
        ? `Переключить на ${nextTheme === 'light' ? 'светлую' : 'тёмную'} тему`
        : 'Переключение темы'}
      title={hydrated
        ? `Переключить на ${nextTheme === 'light' ? 'светлую' : 'тёмную'} тему`
        : 'Переключение темы'}
    >
      <span className="sr-only">
        {hydrated
          ? `Текущая тема: ${theme === 'light' ? 'светлая' : 'тёмная'}`
          : 'Загрузка темы'}
      </span>
      {hydrated && theme === 'dark' ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-amber-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5" />
          <path d="M12 19.5V22" />
          <path d="M4.93 4.93l1.77 1.77" />
          <path d="M17.3 17.3l1.77 1.77" />
          <path d="M2 12h2.5" />
          <path d="M19.5 12H22" />
          <path d="M4.93 19.07l1.77-1.77" />
          <path d="M17.3 6.7l1.77-1.77" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-indigo-300"
          fill="currentColor"
        >
          <path d="M20.8 14.5A8.8 8.8 0 0 1 9.5 3.2a.75.75 0 0 0-.9-.95A10 10 0 1 0 21.75 15.4a.75.75 0 0 0-.95-.9Z" />
        </svg>
      )}
    </button>
  )
}
