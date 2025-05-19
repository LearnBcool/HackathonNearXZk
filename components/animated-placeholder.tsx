"use client"

import { useEffect, useRef } from "react"

interface AnimatedPlaceholderProps {
  width?: number
  height?: number
  className?: string
}

export function AnimatedPlaceholder({ width = 200, height = 200, className }: AnimatedPlaceholderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Definir o tamanho do canvas
    canvas.width = width
    canvas.height = height

    // Criar a animação
    let rotation = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.7

    const animate = () => {
      // Limpar o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar o círculo externo
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 3
      ctx.stroke()

      // Desenhar o texto "FR"
      ctx.font = "bold 48px Arial"
      ctx.fillStyle = "#f59e0b"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("FR", centerX, centerY)

      // Desenhar os pontos girando
      for (let i = 0; i < 8; i++) {
        const angle = rotation + (i * Math.PI) / 4
        const x = centerX + Math.cos(angle) * (radius * 1.2)
        const y = centerY + Math.sin(angle) * (radius * 1.2)

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = i % 2 === 0 ? "#f59e0b" : "#71717a"
        ctx.fill()
      }

      // Atualizar a rotação
      rotation += 0.02

      requestAnimationFrame(animate)
    }

    // Iniciar a animação
    animate()
  }, [width, height])

  return <canvas ref={canvasRef} className={className} />
}
