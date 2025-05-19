"use client"

import { useState } from "react"
import { ArrowRight, Calendar, MapPin, Package, Truck, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContract } from "@/hooks/use-contract"
import { useToast } from "@/hooks/use-toast"

interface MarketplaceCardProps {
  service: {
    id: string
    origem: string
    destino: string
    carga: string
    peso: string
    volume: string
    data: string
    status: string
  }
  userRole: string
}

export function MarketplaceCard({ service, userRole }: MarketplaceCardProps) {
  const { placeBid, acceptBid, requestService } = useContract()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bidValue, setBidValue] = useState("")
  const [bidSubmitted, setBidSubmitted] = useState(false)
  const [bidAccepted, setBidAccepted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleBid = async () => {
    if (!bidValue) {
      toast({
        title: "Valor obrigatório",
        description: "Informe o valor do lance.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Chamar o contrato para fazer um lance
      const success = await placeBid(Number(service.id), Number(bidValue))

      if (success) {
        setBidSubmitted(true)
        toast({
          title: "Lance enviado",
          description: "Seu lance foi enviado com sucesso.",
        })
      } else {
        toast({
          title: "Erro ao enviar lance",
          description: "Ocorreu um erro ao enviar o lance. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Erro ao fazer lance:", err)
      toast({
        title: "Erro ao enviar lance",
        description: err.message || "Ocorreu um erro ao enviar o lance.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAcceptBid = async (bidder: string) => {
    setIsSubmitting(true)

    try {
      // Chamar o contrato para aceitar um lance
      const success = await acceptBid(Number(service.id), bidder)

      if (success) {
        setBidAccepted(true)
        toast({
          title: "Lance aceito",
          description: "O lance foi aceito com sucesso.",
        })
      } else {
        toast({
          title: "Erro ao aceitar lance",
          description: "Ocorreu um erro ao aceitar o lance. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Erro ao aceitar lance:", err)
      toast({
        title: "Erro ao aceitar lance",
        description: err.message || "Ocorreu um erro ao aceitar o lance.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestService = async () => {
    setIsSubmitting(true)

    try {
      // Chamar o contrato do solicitante para solicitar o serviço
      const success = await requestService(Number(service.id))

      if (success) {
        toast({
          title: "Serviço solicitado",
          description: "O serviço foi solicitado com sucesso.",
        })
      } else {
        toast({
          title: "Erro ao solicitar serviço",
          description: "Ocorreu um erro ao solicitar o serviço. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Erro ao solicitar serviço:", err)
      toast({
        title: "Erro ao solicitar serviço",
        description: err.message || "Ocorreu um erro ao solicitar o serviço.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      className="overflow-hidden card-hover transition-all duration-300 animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="bg-gradient-to-r from-amber-50 to-zinc-50 pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span className="flex items-center">
            <Truck
              className={`h-4 w-4 mr-2 text-amber-500 transition-transform duration-500 ${isHovered ? "translate-x-1" : ""}`}
            />
            Serviço #{service.id}
          </span>
          <span className="text-sm font-normal text-green-600">{service.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start group">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Origem</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {service.origem}
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Destino</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {service.destino}
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <Package className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Carga</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {service.carga} - {service.peso} ({service.volume})
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <Calendar className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Data</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {service.data}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-amber-50 to-zinc-50 border-t border-zinc-100">
        {userRole === "transportador" ? (
          bidSubmitted ? (
            <div className="w-full text-center py-1 animate-pulse-slow">
              <p className="text-sm text-amber-600 font-medium">Lance enviado: R$ {bidValue}</p>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 btn-hover-effect">
                  Fazer Lance
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-slide-in">
                <DialogHeader>
                  <DialogTitle>Fazer Lance para Serviço #{service.id}</DialogTitle>
                  <DialogDescription>Informe o valor do seu lance para este serviço de frete.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bid-value">Valor do Lance (R$)</Label>
                    <Input
                      id="bid-value"
                      placeholder="Ex: 1500,00"
                      value={bidValue}
                      onChange={(e) => setBidValue(e.target.value)}
                      className="transition-all duration-300 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bid-notes">Observações (opcional)</Label>
                    <textarea
                      id="bid-notes"
                      className="w-full min-h-[80px] p-3 rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                      placeholder="Informações adicionais sobre seu lance"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleBid}
                    disabled={isSubmitting || !bidValue}
                    className="bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Enviar Lance"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        ) : bidAccepted ? (
          <div className="w-full text-center py-1 animate-pulse-slow">
            <p className="text-sm text-green-600 font-medium">Lance aceito! Aguardando coleta.</p>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full transition-all duration-300 transform hover:scale-105 btn-hover-effect">
                Ver Lances{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-slide-in">
              <DialogHeader>
                <DialogTitle>Lances para Serviço #{service.id}</DialogTitle>
                <DialogDescription>Selecione o melhor lance para seu serviço de frete.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="rounded-md border border-zinc-200 divide-y">
                    <div className="p-3 flex justify-between items-center hover:bg-zinc-50 transition-colors duration-300">
                      <div>
                        <p className="font-medium">João Silva</p>
                        <p className="text-sm text-zinc-600">Caminhão Baú - 3000kg</p>
                        <p className="text-sm text-amber-600 font-medium">R$ 1.850,00</p>
                      </div>
                      <Button
                        onClick={() => handleAcceptBid("0x1234567890123456789012345678901234567890")}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Aceitar"
                        )}
                      </Button>
                    </div>
                    <div className="p-3 flex justify-between items-center hover:bg-zinc-50 transition-colors duration-300">
                      <div>
                        <p className="font-medium">Maria Oliveira</p>
                        <p className="text-sm text-zinc-600">Van - 1500kg</p>
                        <p className="text-sm text-amber-600 font-medium">R$ 2.100,00</p>
                      </div>
                      <Button
                        onClick={() => handleAcceptBid("0x0987654321098765432109876543210987654321")}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Aceitar"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200">
                  <Button
                    onClick={handleRequestService}
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Solicitar Serviço"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}
