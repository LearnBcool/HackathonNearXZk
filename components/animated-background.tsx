import type React from "react"

interface AnimatedBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedBackground({ children, className = "" }: AnimatedBackgroundProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90 bg-blend-overlay z-0"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 animate-bg-spin-slow bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30"></div>
      </div>

      {/* Conteúdo */}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  )
}
