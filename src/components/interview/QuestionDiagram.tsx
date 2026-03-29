'use client'

// Core
import { useEffect, useMemo, useRef } from 'react'

type Accent = 'indigo' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'slate'

interface DiagramCard {
  title: string
  lines?: string[]
  accent?: Accent
}

type DiagramSpec =
  | {
    kind: 'flow'
    nodes: DiagramCard[]
  }
  | {
    kind: 'branch'
    root: DiagramCard
    branches: DiagramCard[]
    footer?: string
  }
  | {
    kind: 'comparison'
    columns: DiagramCard[]
  }
  | {
    kind: 'sequence'
    stages: DiagramCard[]
    footer?: string
  }

const DIAGRAMS: Record<string, DiagramSpec> = {
  'useeffect-vs-uselayouteffect': {
    kind: 'flow',
    nodes: [
      { title: 'React commit', lines: ['DOM мутации применены к дереву'], accent: 'indigo' },
      { title: 'useLayoutEffect', lines: ['синхронно, до отрисовки', 'блокирует браузер'], accent: 'amber' },
      { title: 'Браузер: paint', lines: ['layout → paint → composite', 'пользователь видит изменения'], accent: 'cyan' },
      { title: 'useEffect', lines: ['асинхронно, после отрисовки', 'не блокирует UI'], accent: 'emerald' },
    ],
  },
  'ts-unknown-vs-any': {
    kind: 'flow',
    nodes: [
      { title: 'External data', accent: 'cyan' },
      { title: 'unknown', accent: 'amber' },
      { title: 'validate / narrow', lines: ['type guard', 'schema check'], accent: 'indigo' },
      { title: 'Domain type', accent: 'emerald' },
      { title: 'Safe business logic', accent: 'slate' },
    ],
  },
  'ts-narrowing-discriminated-union': {
    kind: 'branch',
    root: { title: 'RequestState', accent: 'indigo' },
    branches: [
      { title: "idle", accent: 'slate' },
      { title: "loading", accent: 'amber' },
      { title: "success", lines: ['data: User[]'], accent: 'emerald' },
      { title: "error", lines: ['message: string'], accent: 'rose' },
    ],
    footer: 'switch(state.kind) -> TypeScript знает точный shape каждой ветки',
  },
  'pw-locators-auto-wait': {
    kind: 'flow',
    nodes: [
      { title: 'test action', accent: 'cyan' },
      { title: 'locator resolves element', accent: 'indigo' },
      { title: 'checks actionability', lines: ['attached', 'visible', 'enabled', 'stable'], accent: 'amber' },
      { title: 'click / fill / assertion', accent: 'emerald' },
    ],
  },
  'openapi-structure': {
    kind: 'branch',
    root: { title: 'OpenAPI spec', accent: 'indigo' },
    branches: [
      { title: 'docs for humans', accent: 'cyan' },
      { title: 'generated client', accent: 'emerald' },
      { title: 'TS request / response types', accent: 'amber' },
      { title: 'contract checks in CI', accent: 'rose' },
    ],
  },
  'django-request-response-middleware': {
    kind: 'flow',
    nodes: [
      { title: 'HTTP Request', accent: 'cyan' },
      { title: 'Middleware chain', lines: ['auth', 'logging', 'request id'], accent: 'amber' },
      { title: 'Router -> View -> Service', accent: 'indigo' },
      { title: 'HTTP Response', accent: 'emerald' },
      { title: 'Middleware back', lines: ['headers', 'logging'], accent: 'slate' },
    ],
  },
  'sql-n-plus-one-eager-loading': {
    kind: 'comparison',
    columns: [
      { title: 'Bad: N + 1', lines: ['1 query for permits', '+ 100 queries for owners', '= 101 total'], accent: 'rose' },
      { title: 'Better', lines: ['1 query for permits', '+ 1 query for owners', '= 2 total'], accent: 'emerald' },
    ],
  },
  'celery-rabbitmq-idempotency': {
    kind: 'flow',
    nodes: [
      { title: 'HTTP request', accent: 'cyan' },
      { title: 'creates task', accent: 'indigo' },
      { title: 'queue', lines: ['RabbitMQ'], accent: 'amber' },
      { title: 'worker', lines: ['side effect happens here'], accent: 'emerald' },
      { title: 'if crash before ack -> task may run again', accent: 'rose' },
    ],
  },
  'frontend-enterprise-architecture': {
    kind: 'branch',
    root: { title: 'App shell', accent: 'indigo' },
    branches: [
      { title: 'permits', accent: 'cyan' },
      { title: 'approvals', accent: 'emerald' },
      { title: 'reports', accent: 'amber' },
      { title: 'admin', accent: 'rose' },
      { title: 'shared UI', accent: 'slate' },
      { title: 'API contracts', accent: 'indigo' },
      { title: 'platform', accent: 'cyan' },
    ],
    footer: 'Each module owns screens, domain logic and a clear API boundary',
  },
  'workflow-draft-review-approve': {
    kind: 'sequence',
    stages: [
      { title: 'draft', lines: ['editable'], accent: 'slate' },
      { title: 'review', lines: ['validation', 'role check'], accent: 'amber' },
      { title: 'approved', lines: ['transition allowed'], accent: 'emerald' },
      { title: 'completed', lines: ['final state'], accent: 'indigo' },
    ],
    footer: 'Rejected path returns from review with a visible reason and audit event',
  },
  'k8s-deployment-rolling-update': {
    kind: 'sequence',
    stages: [
      { title: 'Old pods', lines: ['v1 v1 v1 v1'], accent: 'rose' },
      { title: 'Mixed rollout', lines: ['v2 v1 v2 v1'], accent: 'amber' },
      { title: 'New pods', lines: ['v2 v2 v2 v2'], accent: 'emerald' },
    ],
    footer: 'Traffic should go only to ready pods during the rollout',
  },
}

interface Palette {
  canvas: string
  border: string
  text: string
  muted: string
  arrow: string
  accents: Record<Accent, { border: string; fill: string; text: string }>
}

function getPalette(): Palette {
  const isLight = document.documentElement.dataset.theme === 'light'

  if (isLight) {
    return {
      canvas: 'rgba(226, 232, 240, 0.45)',
      border: 'rgba(15, 23, 42, 0.1)',
      text: 'rgb(15, 23, 42)',
      muted: 'rgba(51, 65, 85, 0.82)',
      arrow: 'rgba(79, 70, 229, 0.7)',
      accents: {
        indigo: { border: 'rgba(79, 70, 229, 0.28)', fill: 'rgba(79, 70, 229, 0.1)', text: 'rgb(67, 56, 202)' },
        emerald: { border: 'rgba(5, 150, 105, 0.28)', fill: 'rgba(5, 150, 105, 0.1)', text: 'rgb(4, 120, 87)' },
        amber: { border: 'rgba(202, 138, 4, 0.28)', fill: 'rgba(202, 138, 4, 0.1)', text: 'rgb(161, 98, 7)' },
        cyan: { border: 'rgba(8, 145, 178, 0.28)', fill: 'rgba(8, 145, 178, 0.1)', text: 'rgb(14, 116, 144)' },
        rose: { border: 'rgba(220, 38, 38, 0.24)', fill: 'rgba(220, 38, 38, 0.08)', text: 'rgb(185, 28, 28)' },
        slate: { border: 'rgba(71, 85, 105, 0.22)', fill: 'rgba(148, 163, 184, 0.16)', text: 'rgb(30, 41, 59)' },
      },
    }
  }

  return {
    canvas: 'rgba(15, 23, 42, 0.48)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: 'rgb(248, 250, 252)',
    muted: 'rgba(203, 213, 225, 0.8)',
    arrow: 'rgba(129, 140, 248, 0.82)',
    accents: {
      indigo: { border: 'rgba(129, 140, 248, 0.28)', fill: 'rgba(99, 102, 241, 0.12)', text: 'rgb(165, 180, 252)' },
      emerald: { border: 'rgba(52, 211, 153, 0.26)', fill: 'rgba(16, 185, 129, 0.1)', text: 'rgb(110, 231, 183)' },
      amber: { border: 'rgba(251, 191, 36, 0.22)', fill: 'rgba(245, 158, 11, 0.1)', text: 'rgb(253, 224, 71)' },
      cyan: { border: 'rgba(34, 211, 238, 0.22)', fill: 'rgba(8, 145, 178, 0.1)', text: 'rgb(103, 232, 249)' },
      rose: { border: 'rgba(251, 113, 133, 0.24)', fill: 'rgba(225, 29, 72, 0.1)', text: 'rgb(253, 164, 175)' },
      slate: { border: 'rgba(148, 163, 184, 0.2)', fill: 'rgba(30, 41, 59, 0.62)', text: 'rgb(226, 232, 240)' },
    },
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(nextLine).width <= maxWidth || !currentLine) {
      currentLine = nextLine
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke: string,
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
) {
  const headLength = 8
  const angle = Math.atan2(toY - fromY, toX - fromX)

  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6),
  )
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6),
  )
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  card: DiagramCard,
  x: number,
  y: number,
  width: number,
) {
  const accent = palette.accents[card.accent ?? 'slate']
  const innerWidth = width - 28

  ctx.font = '600 15px var(--font-geist-sans), sans-serif'
  const titleLines = wrapText(ctx, card.title, innerWidth)
  ctx.font = '500 12px var(--font-geist-sans), sans-serif'
  const detailLines = (card.lines ?? []).flatMap(line => wrapText(ctx, line, innerWidth))

  const height = 26 + titleLines.length * 20 + detailLines.length * 16 + (detailLines.length > 0 ? 10 : 0)

  drawRoundedRect(ctx, x, y, width, height, 18, accent.fill, accent.border)

  let currentY = y + 24

  ctx.fillStyle = accent.text
  ctx.font = '600 15px var(--font-geist-sans), sans-serif'
  for (const line of titleLines) {
    ctx.fillText(line, x + 14, currentY)
    currentY += 20
  }

  if (detailLines.length > 0) {
    currentY += 2
    ctx.fillStyle = palette.muted
    ctx.font = '500 12px var(--font-geist-sans), sans-serif'
    for (const line of detailLines) {
      ctx.fillText(line, x + 14, currentY)
      currentY += 16
    }
  }

  return height
}

function drawFooter(ctx: CanvasRenderingContext2D, palette: Palette, footer: string, y: number, width: number) {
  ctx.fillStyle = palette.muted
  ctx.font = '500 12px var(--font-geist-sans), sans-serif'
  const lines = wrapText(ctx, footer, width - 40)
  let currentY = y

  for (const line of lines) {
    ctx.fillText(line, 20, currentY)
    currentY += 16
  }

  return currentY
}

function drawDiagram(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  spec: DiagramSpec,
  width: number,
) {
  const padding = 20
  const gap = 20
  const cardWidth = width - padding * 2
  let height = 0

  if (spec.kind === 'flow') {
    let currentY = padding
    const positions: Array<{ centerX: number; bottomY: number; topY: number }> = []

    for (const node of spec.nodes) {
      const cardHeight = drawCard(ctx, palette, node, padding, currentY, cardWidth)
      positions.push({
        centerX: padding + cardWidth / 2,
        topY: currentY,
        bottomY: currentY + cardHeight,
      })
      currentY += cardHeight + gap
    }

    for (let index = 0; index < positions.length - 1; index += 1) {
      const current = positions[index]
      const next = positions[index + 1]
      drawArrow(ctx, current.centerX, current.bottomY + 4, next.centerX, next.topY - 4, palette.arrow)
    }

    height = currentY - gap + padding
  }

  if (spec.kind === 'comparison') {
    const stacked = width < 680
    const columnGap = 18
    const columnWidth = stacked
      ? cardWidth
      : (width - padding * 2 - columnGap) / 2

    let currentY = padding
    let tallestRow = 0

    spec.columns.forEach((column, index) => {
      const x = stacked ? padding : padding + index * (columnWidth + columnGap)
      const y = stacked ? currentY : padding
      const cardHeight = drawCard(ctx, palette, column, x, y, columnWidth)
      tallestRow = Math.max(tallestRow, cardHeight)

      if (stacked) {
        currentY += cardHeight + gap
      }
    })

    height = stacked ? currentY - gap + padding : tallestRow + padding * 2
  }

  if (spec.kind === 'branch') {
    const rootWidth = Math.min(300, cardWidth)
    const rootX = (width - rootWidth) / 2
    const rootY = padding
    const rootHeight = drawCard(ctx, palette, spec.root, rootX, rootY, rootWidth)

    const stacked = width < 720
    const columns = stacked ? 2 : Math.min(4, spec.branches.length)
    const branchGapX = 16
    const branchGapY = 18
    const branchWidth = stacked
      ? (width - padding * 2 - branchGapX) / 2
      : (width - padding * 2 - branchGapX * (columns - 1)) / columns

    const rows = Math.ceil(spec.branches.length / columns)
    let maxBranchBottom = 0

    spec.branches.forEach((branch, index) => {
      const row = Math.floor(index / columns)
      const col = index % columns
      const branchX = padding + col * (branchWidth + branchGapX)
      const branchY = rootY + rootHeight + 56 + row * (120 + branchGapY)
      const branchHeight = drawCard(ctx, palette, branch, branchX, branchY, branchWidth)

      const branchCenterX = branchX + branchWidth / 2
      drawArrow(ctx, width / 2, rootY + rootHeight + 10, branchCenterX, branchY - 6, palette.arrow)

      maxBranchBottom = Math.max(maxBranchBottom, branchY + branchHeight)
    })

    height = maxBranchBottom + padding

    if (spec.footer) {
      height += 14
      height = drawFooter(ctx, palette, spec.footer, maxBranchBottom + 24, width) + padding
    }
  }

  if (spec.kind === 'sequence') {
    const stacked = width < 760
    const stageGap = 18
    const stageWidth = stacked
      ? cardWidth
      : (width - padding * 2 - stageGap * (spec.stages.length - 1)) / spec.stages.length

    const positions: Array<{ left: number; right: number; top: number; bottom: number; centerY: number }> = []

    let currentY = padding
    let maxBottom = 0

    spec.stages.forEach((stage, index) => {
      const x = stacked ? padding : padding + index * (stageWidth + stageGap)
      const y = stacked ? currentY : padding
      const stageHeight = drawCard(ctx, palette, stage, x, y, stageWidth)

      positions.push({
        left: x,
        right: x + stageWidth,
        top: y,
        bottom: y + stageHeight,
        centerY: y + stageHeight / 2,
      })

      if (stacked) {
        currentY += stageHeight + gap
      }

      maxBottom = Math.max(maxBottom, y + stageHeight)
    })

    for (let index = 0; index < positions.length - 1; index += 1) {
      const current = positions[index]
      const next = positions[index + 1]
      if (stacked) {
        drawArrow(ctx, padding + cardWidth / 2, current.bottom + 4, padding + cardWidth / 2, next.top - 4, palette.arrow)
        continue
      }

      drawArrow(ctx, current.right + 4, current.centerY, next.left - 4, next.centerY, palette.arrow)
    }

    height = stacked ? currentY - gap + padding : maxBottom + padding

    if (spec.footer) {
      height += 14
      height = drawFooter(ctx, palette, spec.footer, maxBottom + 24, width) + padding
    }
  }

  return Math.max(height, 220)
}

interface QuestionDiagramProps {
  questionId: string
  description?: string
}

export function QuestionDiagram({ questionId, description }: QuestionDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spec = useMemo(() => DIAGRAMS[questionId], [questionId])

  useEffect(() => {
    if (!spec || !containerRef.current || !canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const container = containerRef.current

    const render = () => {
      const width = Math.max(container.clientWidth, 280)
      const dpr = window.devicePixelRatio || 1
      const palette = getPalette()
      const context = canvas.getContext('2d')

      if (!context) {
        return
      }

      context.font = '600 15px var(--font-geist-sans), sans-serif'
      const measuredHeight = drawDiagram(context, palette, spec, width)

      canvas.width = width * dpr
      canvas.height = measuredHeight * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${measuredHeight}px`

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, measuredHeight)

      drawRoundedRect(context, 0.5, 0.5, width - 1, measuredHeight - 1, 22, palette.canvas, palette.border)
      drawDiagram(context, palette, spec, width)
    }

    render()

    const resizeObserver = new ResizeObserver(() => render())
    const mutationObserver = new MutationObserver(() => render())

    resizeObserver.observe(container)
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [spec])

  if (!spec) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="question-diagram overflow-hidden rounded-none border-y border-white/8 bg-slate-900/30 md:rounded-2xl md:border md:bg-slate-900/40"
    >
      <canvas
        ref={canvasRef}
        aria-label={description ?? 'Visual diagram'}
        className="block w-full"
      />
    </div>
  )
}

export function hasQuestionDiagram(questionId: string) {
  return questionId in DIAGRAMS
}
