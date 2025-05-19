"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, User, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedPlaceholder } from "@/components/animated-placeholder"
import { connectWallet, checkConnection, listenToAccountChanges } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simular carregamento para mostrar animações
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    // Check if user is already connected
    const checkWalletConnection = async () => {
      try {
        const connectedAccount = await checkConnection()
        setAccount(connectedAccount)
      } catch (error) {
        console.error("Erro ao verificar conexão:", error)
      }
    }

    checkWalletConnection()

    // Escutar mudanças de conta
    const unsubscribe = listenToAccountChanges((newAccount) => {
      setAccount(newAccount)
      if (!newAccount) {
        toast({
          title: "Desconectado",
          description: "Sua carteira foi desconectada.",
          variant: "destructive",
        })
      }
    })

    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [toast])

  const handleConnectWallet = async () => {
    setIsConnecting(true)

    try {
      const account = await connectWallet()
      setAccount(account)
      toast({
        title: "Conectado com sucesso",
        description: "Sua carteira foi conectada à aplicação.",
      })
    } catch (error: any) {
      console.error("Erro ao conectar com MetaMask:", error)
      toast({
        title: "Erro ao conectar",
        description: error.message || "Não foi possível conectar à MetaMask.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = () => {
    // Nota: MetaMask não tem um método direto para desconectar
    // Apenas removemos o estado local
    setAccount(null)
    toast({
      title: "Desconectado",
      description: "Sua carteira foi desconectada da aplicação.",
    })
  }

  const handleRoleSelection = (role: string) => {
    router.push(`/verificacao?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300 rounded-full opacity-20 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400 rounded-full opacity-10 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div
        className={`max-w-md w-full transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AnimatedPlaceholder width={120} height={120} className="rotating-placeholder" />
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 mb-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            FreteRacer
          </h1>
          <p className="text-zinc-600 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            O frete mais rápido, barato e inteligente vence.
          </p>
        </div>

        {!account ? (
          <Card
            className="shadow-lg border-zinc-200 gradient-border card-hover animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >
            <CardHeader className="text-center">
              <CardTitle>Bem-vindo ao FreteRacer</CardTitle>
              <CardDescription>Conecte sua carteira para começar</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                size="lg"
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-amber-500 hover:bg-amber-600 text-white btn-hover-effect transition-all duration-300 transform hover:scale-105"
              >
                <Wallet className={`mr-2 h-5 w-5 ${isConnecting ? "animate-spin" : ""}`} />
                {isConnecting ? "Conectando..." : "Conectar com MetaMask"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="shadow-lg border-zinc-200 gradient-border card-hover animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >
            <CardHeader className="text-center">
              <CardTitle>Escolha seu perfil</CardTitle>
              <CardDescription>
                Carteira conectada: {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-amber-500 text-amber-700 hover:bg-amber-50 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleRoleSelection("transportador")}
              >
                <Truck className="mr-2 h-5 w-5 text-amber-500" />
                Sou Prestador de Serviço (Transportador)
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-zinc-500 text-zinc-700 hover:bg-zinc-50 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleRoleSelection("cliente")}
              >
                <User className="mr-2 h-5 w-5 text-zinc-500" />
                Sou Cliente do Frete
              </Button>

              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnectWallet}
                  className="text-zinc-500 hover:text-zinc-700 transition-all duration-300"
                >
                  Desconectar carteira
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
