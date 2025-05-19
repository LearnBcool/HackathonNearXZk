"use client"

import { useEffect, useRef } from "react"

interface AnimatedMapProps {
  className?: string
}

export function AnimatedMap({ className }: AnimatedMapProps) {
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

    // Criar pontos para representar cidades
    const cities = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, name: "São Paulo" },
      { x: canvas.width * 0.4, y: canvas.height * 0.2, name: "Rio de Janeiro" },
      { x: canvas.width * 0.6, y: canvas.height * 0.4, name: "Belo Horizonte" },
      { x: canvas.width * 0.8, y: canvas.height * 0.3, name: "Brasília" },
      { x: canvas.width * 0.3, y: canvas.height * 0.6, name: "Curitiba" },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, name: "Porto Alegre" },
      { x: canvas.width * 0.7, y: canvas.height * 0.6, name: "Salvador" },
    ]

    // Criar rotas entre cidades
    const routes = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 0, to: 4 },
      { from: 4, to: 5 },
      { from: 3, to: 6 },
    ]

    // Criar veículos em movimento
    const vehicles = routes.map((route) => ({
      route,
      progress: Math.random(),
      speed: 0.0005 + Math.random() * 0.001,
    }))

    // Função de animação
    const animate = () => {
      // Limpar o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar o fundo do mapa
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Desenhar as rotas
      routes.forEach((route) => {
        const fromCity = cities[route.from]
        const toCity = cities[route.to]

        ctx.beginPath()
        ctx.moveTo(fromCity.x, fromCity.y)
        ctx.lineTo(toCity.x, toCity.y)
        ctx.strokeStyle = "#d4d4d8"
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Desenhar as cidades
      cities.forEach((city) => {
        ctx.beginPath()
        ctx.arc(city.x, city.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#f59e0b"
        ctx.fill()

        ctx.font = "12px Arial"
        ctx.fillStyle = "#71717a"
        ctx.textAlign = "center"
        ctx.fillText(city.name, city.x, city.y + 20)
      })

      // Desenhar os veículos
      vehicles.forEach((vehicle) => {
        const fromCity = cities[vehicle.route.from]
        const toCity = cities[vehicle.route.to]

        // Calcular a posição atual do veículo
        const x = fromCity.x + (toCity.x - fromCity.x) * vehicle.progress
        const y = fromCity.y + (toCity.y - fromCity.y) * vehicle.progress

        // Desenhar o veículo
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#10b981"
        ctx.fill()

        // Atualizar a posição do veículo
        vehicle.progress += vehicle.speed
        if (vehicle.progress > 1) {
          vehicle.progress = 0
        }
      })

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
