"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Truck, User, Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAccount(accounts[0])
        localStorage.setItem("walletAddress", accounts[0])
      } else {
        alert("Por favor, instale o MetaMask para usar este aplicativo")
      }
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    // Verificar se já existe uma carteira conectada
    const savedAccount = localStorage.getItem("walletAddress")
    if (savedAccount) {
      setAccount(savedAccount)

      // Verificar se já existe um cadastro de prestador para esta carteira
      const savedPrestadorData = localStorage.getItem("prestadorData")
      if (savedPrestadorData) {
        const prestadorData = JSON.parse(savedPrestadorData)
        // Se a carteira salva corresponder à carteira do prestador, redirecionar para o dashboard
        if (prestadorData.walletAddress === savedAccount) {
          router.push("/dashboard-transportador")
        }
      }
    }

    // Ouvir eventos de mudança de conta
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          localStorage.setItem("walletAddress", accounts[0])
        } else {
          setAccount(null)
          localStorage.removeItem("walletAddress")
        }
      })
    }
  }, [router])

  const selectRole = async (role: string) => {
    if (!account) {
      alert("Por favor, conecte sua carteira primeiro")
      return
    }

    if (role === "prestador") {
      // Verificar se já existe um cadastro de prestador para esta carteira
      const savedPrestadorData = localStorage.getItem("prestadorData")
      if (savedPrestadorData) {
        const prestadorData = JSON.parse(savedPrestadorData)
        // Se a carteira salva corresponder à carteira do prestador, redirecionar para o dashboard
        if (prestadorData.walletAddress === account) {
          router.push("/dashboard-transportador")
          return
        }
      }
      router.push("/cadastro-prestador")
    } else {
      router.push("/marketplace")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black bg-opacity-90 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-blend-overlay bg-cover">
      <div className="max-w-4xl w-full mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-amber-50">FreteRacer</h1>
        <p className="text-xl md:text-2xl mb-12 text-amber-100">Redução de Custos Logísticos com Gamificação</p>

        <Card className="bg-amber-50 border-none shadow-lg mb-8 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Bem-vindo</CardTitle>
            <CardDescription className="text-center">Conecte sua carteira para começar</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {!account ? (
              <Button
                onClick={connectWallet}
                className="bg-amber-800 hover:bg-amber-900 text-amber-50 w-full"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Conectar com MetaMask
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center">
                <p className="mb-2 font-medium">Carteira Conectada:</p>
                <p className="text-sm bg-amber-100 p-2 rounded-md">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {account && (
          <div className="mb-6">
            <Button
              onClick={() => {
                localStorage.removeItem("walletAddress")
                setAccount(null)
              }}
              variant="outline"
              className="bg-transparent border-amber-800 text-amber-800 hover:bg-amber-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Desconectar Carteira
            </Button>
          </div>
        )}

        {account && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-amber-50 border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Truck className="mr-2 h-6 w-6" />
                  Sou Transportador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center">Cadastre-se como prestador de serviço e receba propostas de frete</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => selectRole("prestador")}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50"
                >
                  Continuar como Transportador
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-amber-50 border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <User className="mr-2 h-6 w-6" />
                  Sou Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center">
                  Publique suas necessidades de frete e receba lances dos transportadores
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => selectRole("cliente")}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50"
                >
                  Continuar como Cliente
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
