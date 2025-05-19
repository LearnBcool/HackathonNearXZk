"use client"

import { useEffect, useRef } from "react"

interface AnimatedLogoProps {
  className?: string
}

export function AnimatedLogo({ className }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar o canvas para o tamanho do elemento
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Criar a animação do logo
    let rotation = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    const animate = () => {
      // Limpar o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar o círculo externo
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 3
      ctx.stroke()

      // Desenhar o ícone de caminhão
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Desenhar um caminhão simplificado
      ctx.beginPath()
      ctx.rect(-radius * 0.4, -radius * 0.2, radius * 0.8, radius * 0.4)
      ctx.fillStyle = "#f59e0b"
      ctx.fill()

      // Cabine do caminhão
      ctx.beginPath()
      ctx.rect(-radius * 0.6, -radius * 0.2, radius * 0.2, radius * 0.3)
      ctx.fillStyle = "#f59e0b"
      ctx.fill()

      // Rodas
      ctx.beginPath()
      ctx.arc(-radius * 0.4, radius * 0.25, radius * 0.1, 0, Math.PI * 2)
      ctx.fillStyle = "#71717a"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(radius * 0.3, radius * 0.25, radius * 0.1, 0, Math.PI * 2)
      ctx.fillStyle = "#71717a"
      ctx.fill()

      ctx.restore()

      // Atualizar a rotação
      rotation += 0.01

      requestAnimationFrame(animate)
    }

    // Iniciar a animação
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
