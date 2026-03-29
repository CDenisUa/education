'use client'

// Core
import { useMemo } from 'react'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = useMemo(() => parseMarkdown(content), [content])

  return (
    <div
      className="prose prose-invert prose-sm max-w-none
        prose-p:text-slate-300 prose-p:leading-7
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-indigo-300 prose-code:bg-indigo-950/50
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-ul:text-slate-300 prose-ol:text-slate-300
        prose-li:my-1
        prose-h1:text-white prose-h2:text-white prose-h3:text-slate-100
        prose-table:text-sm
        prose-thead:text-slate-200
        prose-td:text-slate-300 prose-td:py-2 prose-td:px-3
        prose-th:py-2 prose-th:px-3 prose-th:text-left
        prose-table:border prose-table:border-white/10
        prose-tr:border-white/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function parseMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Table
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n)+/g, (match) => {
      const rows = match.trim().split('\n')
      const headerRow = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
      const bodyRows = rows.slice(2).join('\n')
      return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>\n`
    })
    // Unordered list
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraphs (lines not matching other patterns)
    .replace(/^(?!<[htuloi]|$)(.*$)/gm, '<p>$1</p>')
    // Clean up extra whitespace
    .replace(/\n\n+/g, '\n')
    .trim()
}
