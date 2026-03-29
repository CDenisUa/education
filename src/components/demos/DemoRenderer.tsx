'use client'

// Core
import { lazy, Suspense } from 'react'

const demoMap: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  // HTML demos
  SemanticDemo: lazy(() => import('./html/SemanticDemo').then(m => ({ default: m.SemanticDemo }))),
  FormsDemo: lazy(() => import('./html/FormsDemo').then(m => ({ default: m.FormsDemo }))),
  MediaDemo: lazy(() => import('./html/MediaDemo').then(m => ({ default: m.MediaDemo }))),
  AccessibilityDemo: lazy(() => import('./html/AccessibilityDemo').then(m => ({ default: m.AccessibilityDemo }))),
  MetaDemo: lazy(() => import('./html/MetaDemo').then(m => ({ default: m.MetaDemo }))),
  // CSS demos
  BoxModelDemo: lazy(() => import('./css/BoxModelDemo').then(m => ({ default: m.BoxModelDemo }))),
  FlexboxDemo: lazy(() => import('./css/FlexboxDemo').then(m => ({ default: m.FlexboxDemo }))),
  GridDemo: lazy(() => import('./css/GridDemo').then(m => ({ default: m.GridDemo }))),
  CSSVariablesDemo: lazy(() => import('./css/CSSVariablesDemo').then(m => ({ default: m.CSSVariablesDemo }))),
  AnimationsDemo: lazy(() => import('./css/AnimationsDemo').then(m => ({ default: m.AnimationsDemo }))),
  SelectorsDemo: lazy(() => import('./css/SelectorsDemo').then(m => ({ default: m.SelectorsDemo }))),
  ResponsiveDemo: lazy(() => import('./css/ResponsiveDemo').then(m => ({ default: m.ResponsiveDemo }))),
  // JS demos
  ScopeDemo: lazy(() => import('./js/ScopeDemo').then(m => ({ default: m.ScopeDemo }))),
  DestructuringDemo: lazy(() => import('./js/DestructuringDemo').then(m => ({ default: m.DestructuringDemo }))),
  AsyncDemo: lazy(() => import('./js/AsyncDemo').then(m => ({ default: m.AsyncDemo }))),
  DOMDemo: lazy(() => import('./js/DOMDemo').then(m => ({ default: m.DOMDemo }))),
  EventsDemo: lazy(() => import('./js/EventsDemo').then(m => ({ default: m.EventsDemo }))),
  FetchDemo: lazy(() => import('./js/FetchDemo').then(m => ({ default: m.FetchDemo }))),
  StorageDemo: lazy(() => import('./js/StorageDemo').then(m => ({ default: m.StorageDemo }))),
  IntersectionDemo: lazy(() => import('./js/IntersectionDemo').then(m => ({ default: m.IntersectionDemo }))),
  MutationDemo: lazy(() => import('./js/MutationDemo').then(m => ({ default: m.MutationDemo }))),
  CanvasDemo: lazy(() => import('./js/CanvasDemo').then(m => ({ default: m.CanvasDemo }))),
  GeolocationDemo: lazy(() => import('./js/GeolocationDemo').then(m => ({ default: m.GeolocationDemo }))),
  WebWorkerDemo: lazy(() => import('./js/WebWorkerDemo').then(m => ({ default: m.WebWorkerDemo }))),
  ClassesDemo: lazy(() => import('./js/ClassesDemo').then(m => ({ default: m.ClassesDemo }))),
  // React demos
  ComponentsDemo: lazy(() => import('./react/ComponentsDemo').then(m => ({ default: m.ComponentsDemo }))),
  UseStateDemo: lazy(() => import('./react/UseStateDemo').then(m => ({ default: m.UseStateDemo }))),
  UseEffectDemo: lazy(() => import('./react/UseEffectDemo').then(m => ({ default: m.UseEffectDemo }))),
  MemoDemo: lazy(() => import('./react/MemoDemo').then(m => ({ default: m.MemoDemo }))),
  UseRefDemo: lazy(() => import('./react/UseRefDemo').then(m => ({ default: m.UseRefDemo }))),
  UseReducerDemo: lazy(() => import('./react/UseReducerDemo').then(m => ({ default: m.UseReducerDemo }))),
  ContextDemo: lazy(() => import('./react/ContextDemo').then(m => ({ default: m.ContextDemo }))),
  CustomHooksDemo: lazy(() => import('./react/CustomHooksDemo').then(m => ({ default: m.CustomHooksDemo }))),
}

interface DemoRendererProps {
  component: string
  topicId: string
  sectionId: string
}

export function DemoRenderer({ component }: DemoRendererProps) {
  const DemoComponent = demoMap[component]

  if (!DemoComponent) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-white/10 bg-white/2">
        <p className="text-slate-500 text-sm">Демо в разработке</p>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-48 rounded-xl border border-white/10 bg-white/2">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Загрузка демо...
        </div>
      </div>
    }>
      <DemoComponent />
    </Suspense>
  )
}
