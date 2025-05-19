"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, BarChartIcon as ChartBar, LogOut, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AnimatedPlaceholder } from "@/components/animated-placeholder"
import { checkConnection } from "@/lib/web3"

interface DashboardHeaderProps {
  role: string
  onOpenSidebar?: () => void
}

export function DashboardHeader({ role, onOpenSidebar }: DashboardHeaderProps) {
  const router = useRouter()
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const checkWalletConnection = async () => {
      const connectedAccount = await checkConnection()
      setAccount(connectedAccount)

      if (!connectedAccount) {
        router.push("/")
      }
    }

    checkWalletConnection()
  }, [router])

  const handleLogout = () => {
    router.push("/")
  }

  const handleAnalytics = () => {
    router.push("/dashboard/analytics")
  }

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSidebar}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col h-full">
                <div className="py-4 border-b flex items-center">
                  <AnimatedPlaceholder width={40} height={40} className="mr-2" />
                  <div>
                    <h2 className="text-lg font-bold">
                      Frete<span className="text-amber-500">Racer</span>
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {role === "transportador" ? "Prestador de Serviço" : "Cliente do Frete"}
                    </p>
                  </div>
                </div>
                {/* Conteúdo do sidebar mobile */}
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center ml-2">
            <AnimatedPlaceholder width={32} height={32} className="mr-2 hidden sm:block" />
            <h1 className="text-xl font-bold">
              Frete<span className="text-amber-500">Racer</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalytics}
            className="transition-all duration-300 hover:bg-amber-50 hover:text-amber-600"
          >
            <ChartBar className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Análises</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="transition-all duration-300 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
