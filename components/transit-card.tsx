"use client"

import { useState } from "react"
import { Calendar, Check, MapPin, Package, Truck, User, Loader2 } from "lucide-react"

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

interface TransitCardProps {
  transit: {
    id: string
    transportador: string
    origem: string
    destino: string
    capacidadeDisponivel: string
    dataPartida: string
    dataChegada: string
    status: string
  }
  userRole: string
}

export function TransitCard({ transit, userRole }: TransitCardProps) {
  const { updateServiceStatus } = useContract()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleRequest = () => {
    setIsSubmitting(true)

    // Simulação de chamada ao contrato inteligente
    setTimeout(() => {
      setIsSubmitting(false)
      setRequestSubmitted(true)
    }, 2000)
  }

  const handleVerifyPayment = async () => {
    setIsSubmitting(true)

    try {
      // Atualizar o status do serviço para "Completed" (3) no contrato principal
      // Isso seria feito após a verificação ZK Proof
      const serviceId = Number.parseInt(transit.id)
      await updateServiceStatus(serviceId, 3) // 3 = Completed
      setPaymentVerified(true)
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error)
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
            Em Trânsito #{transit.id}
          </span>
          <span className="text-sm font-normal text-amber-600">{transit.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start group">
            <User className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Transportador</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {transit.transportador}
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Rota</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {transit.origem} → {transit.destino}
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <Package className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Capacidade Disponível</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {transit.capacidadeDisponivel}
              </p>
            </div>
          </div>

          <div className="flex items-start group">
            <Calendar className="h-4 w-4 mr-2 mt-0.5 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" />
            <div>
              <p className="text-sm font-medium">Período</p>
              <p className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300">
                {transit.dataPartida} a {transit.dataChegada}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-amber-50 to-zinc-50 border-t border-zinc-100">
        {userRole === "cliente" ? (
          requestSubmitted ? (
            <div className="w-full text-center py-1 animate-pulse-slow">
              <p className="text-sm text-amber-600 font-medium">Solicitação enviada</p>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 btn-hover-effect">
                  Solicitar Transporte
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-slide-in">
                <DialogHeader>
                  <DialogTitle>Solicitar Transporte em Trânsito #{transit.id}</DialogTitle>
                  <DialogDescription>Informe os detalhes da sua carga para solicitar o transporte.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo-type">Tipo de Carga</Label>
                    <Input
                      id="cargo-type"
                      placeholder="Ex: Eletrônicos"
                      className="transition-all duration-300 focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo-weight">Peso (kg)</Label>
                      <Input
                        id="cargo-weight"
                        placeholder="Ex: 500"
                        className="transition-all duration-300 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo-volume">Volume (m³)</Label>
                      <Input
                        id="cargo-volume"
                        placeholder="Ex: 2"
                        className="transition-all duration-300 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickup-address">Endereço de Coleta</Label>
                    <Input
                      id="pickup-address"
                      placeholder="Endereço completo"
                      className="transition-all duration-300 focus:border-amber-500"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleRequest}
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Enviar Solicitação"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        ) : paymentVerified ? (
          <div className="w-full text-center py-1 animate-pulse-slow">
            <p className="text-sm text-green-600 font-medium flex items-center justify-center">
              <Check className="h-4 w-4 mr-1" />
              Pagamento verificado
            </p>
          </div>
        ) : (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 btn-hover-effect"
            onClick={handleVerifyPayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "ZkProofPayment"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
