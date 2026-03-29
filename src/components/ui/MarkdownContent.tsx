'use client'

// Core
import { useMemo } from 'react'
// Components
import { CodeBlock } from '@/components/ui/CodeBlock'

interface MarkdownContentProps {
  content: string
  className?: string
}

type Segment =
  | { kind: 'code'; language: string; code: string }
  | { kind: 'md'; text: string }

function splitSegments(text: string): Segment[] {
  const segments: Segment[] = []
  const pattern = /```([\w-]*)\n([\s\S]*?)```/g
  let last = 0

  for (const match of text.matchAll(pattern)) {
    const before = text.slice(last, match.index)
    if (before.trim()) segments.push({ kind: 'md', text: before })
    segments.push({
      kind: 'code',
      language: match[1] || 'text',
      code: (match[2] ?? '').trimEnd(),
    })
    last = match.index! + match[0].length
  }

  const remaining = text.slice(last)
  if (remaining.trim()) segments.push({ kind: 'md', text: remaining })
  if (segments.length === 0) segments.push({ kind: 'md', text: text })

  return segments
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const segments = useMemo(() => splitSegments(content), [content])

  return (
    <div
      className={`theme-prose prose prose-sm max-w-none
        prose-p:leading-7
        prose-strong:font-semibold
        prose-a:underline prose-a:underline-offset-2
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-li:my-1
        prose-table:text-sm
        prose-td:py-2 prose-td:px-3
        prose-th:py-2 prose-th:px-3 prose-th:text-left
        prose-table:border prose-table:border-slate-700/30
        prose-tr:border-slate-700/30
        prose-img:rounded-xl prose-img:border prose-img:border-white/10
        prose-img:bg-slate-900/60 prose-img:p-2
        ${className}`}
    >
      {segments.map((seg, i) =>
        seg.kind === 'code' ? (
          <div key={i} className="not-prose my-4">
            <CodeBlock
              code={seg.code}
              language={seg.language}
              showLineNumbers={seg.code.split('\n').length > 5}
            />
          </div>
        ) : (
          <div key={i} dangerouslySetInnerHTML={{ __html: parseMarkdown(seg.text) }} />
        ),
      )}
    </div>
  )
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function parseMarkdown(text: string): string {
  const normalizedText = text.replace(/\r\n/g, '\n')

  // Protect inline code before other transforms
  const inlineSegments: string[] = []
  const withProtectedInline = normalizedText.replace(/`([^`\n]+)`/g, (_, inner) => {
    const index = inlineSegments.push(`<code>${escapeHtml(inner)}</code>`) - 1
    return `@@IC_${index}@@`
  })

  const html = escapeHtml(withProtectedInline)
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const isExternal = href.startsWith('http')
      const attrs = isExternal
        ? 'target="_blank" rel="noopener noreferrer"'
        : 'target="_blank"'
      return `<a href="${href}" ${attrs} class="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors">${label}</a>`
    })
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Ordered list
    .replace(/^\d+\. (.*$)/gm, '<li data-list="ordered">$1</li>')
    // Table
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n)+/g, (match) => {
      const rows = match.trim().split('\n')
      const headerRow = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
      const bodyRows = rows.slice(2).join('\n')
      return `<div class="theme-table-wrap"><table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table></div>\n`
    })
    // Unordered list
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li data-list="ordered">[\s\S]*?<\/li>\n?)+/g, (match) => (
      `<ol>${match.replaceAll(' data-list="ordered"', '')}</ol>`
    ))
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraphs (lines not matching other patterns)
    .replace(/^(?!(<|$))(.*$)/gm, '<p>$2</p>')
    // Clean up extra whitespace
    .replace(/\n\n+/g, '\n')
    .trim()

  // Restore inline code
  return html.replace(/@@IC_(\d+)@@/g, (_, i) => inlineSegments[Number(i)] ?? '')
}
