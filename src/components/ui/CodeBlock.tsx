'use client'

// Core
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
  className?: string
  variant?: 'default' | 'edge-to-edge-mobile'
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true,
  className = '',
  variant = 'default',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const isEdgeToEdgeMobile = variant === 'edge-to-edge-mobile'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`theme-code-block flex min-h-0 flex-col overflow-hidden bg-[#1e1e1e] ${isEdgeToEdgeMobile ? 'rounded-none border-y border-white/10 md:rounded-xl md:border' : 'rounded-xl border border-white/10'} ${className}`}>
      <div className={`flex shrink-0 items-center justify-between bg-[#2d2d2d] border-b border-white/10 ${isEdgeToEdgeMobile ? 'px-4 py-2.5 md:px-4' : 'px-4 py-2.5'}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {title && (
            <span className="ml-2 text-xs text-white/40 font-mono">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 font-mono uppercase tracking-wider">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="text-xs text-white/40 hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            {copied ? '✓ Скопировано' : 'Копировать'}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <SyntaxHighlighter
          language={language === 'tsx' ? 'typescript' : language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: isEdgeToEdgeMobile ? '16px 16px 20px' : '16px',
            minHeight: '100%',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.6',
          }}
          lineNumberStyle={{
            color: '#4a4a6a',
            minWidth: '2.5em',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
