'use client'

// Core
import { useRef, useEffect, useState } from 'react'

export function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [mode, setMode] = useState<'shapes' | 'animation' | 'paint'>('shapes')
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#6366f1')
  const [brushSize, setBrushSize] = useState(4)

  useEffect(() => {
    if (mode === 'shapes') drawShapes()
    if (mode === 'animation') startAnimation()
    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [mode])

  const drawShapes = () => {
    cancelAnimationFrame(animRef.current)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Gradient rect
    const grad = ctx.createLinearGradient(20, 0, 120, 0)
    grad.addColorStop(0, '#6366f1')
    grad.addColorStop(1, '#ec4899')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect?.(20, 20, 100, 70, 8)
    ctx.fill()

    // Circle
    ctx.beginPath()
    ctx.arc(200, 55, 35, 0, Math.PI * 2)
    ctx.fillStyle = '#22c55e'
    ctx.fill()
    ctx.strokeStyle = '#16a34a'
    ctx.lineWidth = 3
    ctx.stroke()

    // Triangle
    ctx.beginPath()
    ctx.moveTo(290, 20)
    ctx.lineTo(340, 90)
    ctx.lineTo(240, 90)
    ctx.closePath()
    ctx.fillStyle = '#f59e0b'
    ctx.fill()

    // Text
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('Canvas API', 180, 135)
    ctx.font = '11px monospace'
    ctx.fillStyle = '#64748b'
    ctx.fillText('fillRect · arc · lineTo · text · gradient', 180, 155)
  }

  const startAnimation = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const balls: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      r: Math.random() * 15 + 8,
      color: ['#6366f1', '#22c55e', '#ec4899', '#f59e0b', '#06b6d4'][Math.floor(Math.random() * 5)],
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      balls.forEach(ball => {
        ball.x += ball.vx
        ball.y += ball.vy

        if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1
        if (ball.y < ball.r || ball.y > canvas.height - ball.r) ball.vy *= -1

        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
        ctx.fillStyle = ball.color + 'cc'
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const clearPaint = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const getPaintPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'paint') return
    setIsDrawing(true)
    const ctx = canvasRef.current!.getContext('2d')!
    const pos = getPaintPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'paint') return
    const ctx = canvasRef.current!.getContext('2d')!
    const pos = getPaintPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const handleMouseUp = () => setIsDrawing(false)

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/60 rounded-lg w-fit border border-white/10">
        {([
          { id: 'shapes', label: '🎨 Фигуры' },
          { id: 'animation', label: '⚡ Анимация' },
          { id: 'paint', label: '✏️ Рисование' },
        ] as const).map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-md text-sm transition-all
              ${mode === m.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Paint controls */}
      {mode === 'paint' && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Цвет:</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-white/10 bg-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Размер: <span className="font-mono text-white">{brushSize}</span></label>
            <input type="range" min="1" max="20" value={brushSize}
              onChange={e => setBrushSize(+e.target.value)}
              className="w-24 accent-indigo-500" />
          </div>
          <button onClick={clearPaint}
            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500/80 text-xs text-white rounded-lg transition-colors">
            Очистить
          </button>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={360}
        height={180}
        className={`w-full rounded-xl border border-white/10 bg-slate-950
          ${mode === 'paint' ? 'cursor-crosshair' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {mode === 'paint' && (
        <p className="text-xs text-slate-500 text-center">Рисуйте мышью на холсте</p>
      )}
    </div>
  )
}
