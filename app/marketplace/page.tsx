"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Filter, MapPin, Package, Calendar, DollarSign, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AnimatedBackground } from "@/components/animated-background"

// Dados simulados de fretes disponíveis
const fretesDisponiveis = [
  {
    id: "1",
    origem: "São Paulo, SP",
    destino: "Rio de Janeiro, RJ",
    distancia: "430 km",
    carga: "Eletrônicos",
    peso: "500 kg",
    dataColeta: "15/05/2025",
    prazoEntrega: "17/05/2025",
    valorEstimado: "R$ 1.200,00",
    cliente: "TechCorp",
    status: "disponível",
  },
  {
    id: "2",
    origem: "Belo Horizonte, MG",
    destino: "Brasília, DF",
    distancia: "740 km",
    carga: "Móveis",
    peso: "1200 kg",
    dataColeta: "16/05/2025",
    prazoEntrega: "19/05/2025",
    valorEstimado: "R$ 2.100,00",
    cliente: "MoveisExpress",
    status: "disponível",
  },
  {
    id: "3",
    origem: "Curitiba, PR",
    destino: "Florianópolis, SC",
    distancia: "300 km",
    carga: "Alimentos",
    peso: "800 kg",
    dataColeta: "17/05/2025",
    prazoEntrega: "18/05/2025",
    valorEstimado: "R$ 950,00",
    cliente: "FoodDistribuidora",
    status: "disponível",
  },
]

// Dados simulados de fretes do cliente
const meusFretesIniciais = [
  {
    id: "c1",
    origem: "São Paulo, SP",
    destino: "Campinas, SP",
    distancia: "100 km",
    carga: "Material de Escritório",
    peso: "300 kg",
    dataColeta: "20/05/2025",
    prazoEntrega: "21/05/2025",
    valorEstimado: "R$ 600,00",
    status: "aguardando lances",
    lances: [
      { id: "l1", transportador: "Transportes Rápidos", valor: "R$ 580,00" },
      { id: "l2", transportador: "Frete Seguro", valor: "R$ 620,00" },
    ],
  },
]

export default function Marketplace() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState("")
  const [fretes, setFretes] = useState(fretesDisponiveis)
  const [meusFretes, setMeusFretes] = useState(meusFretesIniciais)
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroCidade, setFiltroCidade] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [novoFrete, setNovoFrete] = useState({
    origem: "",
    destino: "",
    carga: "",
    peso: "",
    dataColeta: "",
    prazoEntrega: "",
    valorEstimado: "",
    descricao: "",
  })
  const [errors, setErrors] = useState({} as Record<string, boolean>)
  const [loadingAceite, setLoadingAceite] = useState<{ freteId: string; lanceId: string } | null>(null)

  useEffect(() => {
    // Verificar se o usuário está logado
    const savedAccount = localStorage.getItem("walletAddress")

    if (!savedAccount) {
      router.push("/")
      return
    }

    setWalletAddress(savedAccount)
  }, [router])

  const filtrarFretes = () => {
    let fretesFiltered = [...fretesDisponiveis]

    if (filtroEstado) {
      fretesFiltered = fretesFiltered.filter(
        (frete) => frete.origem.includes(filtroEstado) || frete.destino.includes(filtroEstado),
      )
    }

    if (filtroCidade) {
      fretesFiltered = fretesFiltered.filter(
        (frete) => frete.origem.includes(filtroCidade) || frete.destino.includes(filtroCidade),
      )
    }

    setFretes(fretesFiltered)
  }

  const limparFiltros = () => {
    setFiltroEstado("")
    setFiltroCidade("")
    setFretes(fretesDisponiveis)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovoFrete({
      ...novoFrete,
      [name]: value,
    })

    // Limpar erro ao digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false,
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    const requiredFields = ["origem", "destino", "carga", "peso", "dataColeta", "prazoEntrega", "valorEstimado"]

    requiredFields.forEach((field) => {
      if (!novoFrete[field as keyof typeof novoFrete]) {
        newErrors[field] = true
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitFrete = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulando envio para API
    setTimeout(() => {
      const novoFreteObj = {
        id: `c${meusFretes.length + 1}`,
        ...novoFrete,
        distancia: "Calculando...",
        status: "aguardando lances",
        lances: [],
      }

      setMeusFretes([...meusFretes, novoFreteObj])

      // Resetar formulário
      setNovoFrete({
        origem: "",
        destino: "",
        carga: "",
        peso: "",
        dataColeta: "",
        prazoEntrega: "",
        valorEstimado: "",
        descricao: "",
      })

      setIsSubmitting(false)
    }, 1500)
  }

  const aceitarLance = async (freteId: string, lanceId: string) => {
    try {
      setLoadingAceite({ freteId, lanceId })

      // Simulando conexão com contrato inteligente
      console.log(`Conectando ao contrato inteligente para aceitar lance #${lanceId} do frete #${freteId}...`)

      // Simulação de delay para representar a interação com a blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`Lance ${lanceId} aceito para o frete #${freteId} através do contrato inteligente`)

      // Atualizar o estado do frete para "contratado"
      const fretesAtualizados = meusFretes.map((frete) => {
        if (frete.id === freteId) {
          return {
            ...frete,
            status: "contratado",
            lanceAceito: lanceId,
          }
        }
        return frete
      })

      setMeusFretes(fretesAtualizados)
    } catch (error) {
      console.error("Erro ao conectar com contrato inteligente:", error)
      alert("Erro ao aceitar lance. Por favor, tente novamente.")
    } finally {
      setLoadingAceite(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("walletAddress")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-amber-800 text-amber-50 p-4 shadow-md z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <User className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">FreteRacer</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-amber-200 text-amber-800">
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Cliente</p>
                <p className="text-xs text-amber-200">
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-amber-200 text-amber-200 hover:bg-amber-700"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Desconectar
            </Button>
          </div>
        </div>
      </header>

      <AnimatedBackground className="flex-1">
        <div className="max-w-7xl mx-auto p-4">
          <Tabs defaultValue="meus-fretes" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-amber-100 text-amber-800">
                <TabsTrigger
                  value="meus-fretes"
                  className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50"
                >
                  Meus Fretes
                </TabsTrigger>
                <TabsTrigger
                  value="marketplace"
                  className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50"
                >
                  Transportadores
                </TabsTrigger>
              </TabsList>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Frete
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-amber-50 sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Solicitar Novo Frete</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do frete para receber lances dos transportadores.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="origem" className={errors.origem ? "text-red-500" : ""}>
                        Origem *
                      </Label>
                      <Input
                        id="origem"
                        name="origem"
                        value={novoFrete.origem}
                        onChange={handleInputChange}
                        placeholder="Cidade, Estado"
                        className={errors.origem ? "border-red-500" : ""}
                      />
                      {errors.origem && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destino" className={errors.destino ? "text-red-500" : ""}>
                        Destino *
                      </Label>
                      <Input
                        id="destino"
                        name="destino"
                        value={novoFrete.destino}
                        onChange={handleInputChange}
                        placeholder="Cidade, Estado"
                        className={errors.destino ? "border-red-500" : ""}
                      />
                      {errors.destino && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carga" className={errors.carga ? "text-red-500" : ""}>
                        Tipo de Carga *
                      </Label>
                      <Input
                        id="carga"
                        name="carga"
                        value={novoFrete.carga}
                        onChange={handleInputChange}
                        placeholder="Ex: Eletrônicos, Móveis"
                        className={errors.carga ? "border-red-500" : ""}
                      />
                      {errors.carga && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="peso" className={errors.peso ? "text-red-500" : ""}>
                        Peso *
                      </Label>
                      <Input
                        id="peso"
                        name="peso"
                        value={novoFrete.peso}
                        onChange={handleInputChange}
                        placeholder="Ex: 500 kg"
                        className={errors.peso ? "border-red-500" : ""}
                      />
                      {errors.peso && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataColeta" className={errors.dataColeta ? "text-red-500" : ""}>
                        Data de Coleta *
                      </Label>
                      <Input
                        id="dataColeta"
                        name="dataColeta"
                        value={novoFrete.dataColeta}
                        onChange={handleInputChange}
                        placeholder="DD/MM/AAAA"
                        className={errors.dataColeta ? "border-red-500" : ""}
                      />
                      {errors.dataColeta && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prazoEntrega" className={errors.prazoEntrega ? "text-red-500" : ""}>
                        Prazo de Entrega *
                      </Label>
                      <Input
                        id="prazoEntrega"
                        name="prazoEntrega"
                        value={novoFrete.prazoEntrega}
                        onChange={handleInputChange}
                        placeholder="DD/MM/AAAA"
                        className={errors.prazoEntrega ? "border-red-500" : ""}
                      />
                      {errors.prazoEntrega && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valorEstimado" className={errors.valorEstimado ? "text-red-500" : ""}>
                        Valor Estimado *
                      </Label>
                      <Input
                        id="valorEstimado"
                        name="valorEstimado"
                        value={novoFrete.valorEstimado}
                        onChange={handleInputChange}
                        placeholder="Ex: R$ 1.200,00"
                        className={errors.valorEstimado ? "border-red-500" : ""}
                      />
                      {errors.valorEstimado && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao">Descrição Adicional</Label>
                      <Textarea
                        id="descricao"
                        name="descricao"
                        value={novoFrete.descricao}
                        onChange={handleInputChange}
                        placeholder="Detalhes adicionais sobre a carga ou requisitos especiais"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSubmitFrete}
                      className="bg-amber-800 hover:bg-amber-900 text-amber-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Publicar Frete"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="meus-fretes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meusFretes.map((frete) => (
                  <Card key={frete.id} className="bg-amber-50 border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{frete.carga}</CardTitle>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          {frete.status}
                        </Badge>
                      </div>
                      <CardDescription>Frete #{frete.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-amber-800 shrink-0" />
                          <div>
                            <p className="font-medium">Origem: {frete.origem}</p>
                            <p className="font-medium">Destino: {frete.destino}</p>
                            <p className="text-xs text-muted-foreground">{frete.distancia}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-amber-800 shrink-0" />
                          <p>{frete.peso}</p>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-amber-800 shrink-0" />
                          <div>
                            <p>Coleta: {frete.dataColeta}</p>
                            <p>Entrega: {frete.prazoEntrega}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-amber-800 shrink-0" />
                          <p className="font-medium">{frete.valorEstimado}</p>
                        </div>

                        {frete.lances && frete.lances.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Lances Recebidos:</h4>
                            <div className="space-y-2">
                              {frete.lances.map((lance) => (
                                <div
                                  key={lance.id}
                                  className="flex justify-between items-center p-2 bg-white rounded-md"
                                >
                                  <div>
                                    <p className="font-medium">{lance.transportador}</p>
                                    <p className="text-sm text-amber-800">{lance.valor}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => aceitarLance(frete.id, lance.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={
                                      loadingAceite?.freteId === frete.id && loadingAceite?.lanceId === lance.id
                                    }
                                  >
                                    {loadingAceite?.freteId === frete.id && loadingAceite?.lanceId === lance.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Aceitar"
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {(!frete.lances || frete.lances.length === 0) && (
                        <p className="text-sm text-muted-foreground">Aguardando lances de transportadores...</p>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                {meusFretes.length === 0 && (
                  <div className="col-span-full text-center p-8 bg-amber-50 rounded-lg">
                    <p className="text-amber-800">Você ainda não tem fretes cadastrados.</p>
                    <Button
                      className="mt-4 bg-amber-800 hover:bg-amber-900 text-amber-50"
                      onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="true"]')?.click()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Novo Frete
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="mt-6">
              <Card className="bg-amber-50 border-none shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Filtrar Transportadores</CardTitle>
                  <CardDescription>Encontre transportadores disponíveis por localização</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                        <SelectTrigger id="estado">
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={filtroCidade}
                        onChange={(e) => setFiltroCidade(e.target.value)}
                        placeholder="Digite uma cidade"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <Button onClick={filtrarFretes} className="bg-amber-800 hover:bg-amber-900 text-amber-50">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrar
                      </Button>
                      <Button variant="outline" onClick={limparFiltros}>
                        Limpar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fretes.map((frete) => (
                  <Card key={frete.id} className="bg-amber-50 border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{frete.cliente}</CardTitle>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {frete.status}
                        </Badge>
                      </div>
                      <CardDescription>{frete.carga}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-amber-800 shrink-0" />
                          <div>
                            <p className="font-medium">Origem: {frete.origem}</p>
                            <p className="font-medium">Destino: {frete.destino}</p>
                            <p className="text-xs text-muted-foreground">{frete.distancia}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-amber-800 shrink-0" />
                          <p>{frete.peso}</p>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-amber-800 shrink-0" />
                          <div>
                            <p>Coleta: {frete.dataColeta}</p>
                            <p>Entrega: {frete.prazoEntrega}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-amber-800 shrink-0" />
                          <p className="font-medium">{frete.valorEstimado}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fretes.length === 0 && (
                  <div className="col-span-full text-center p-8 bg-amber-50 rounded-lg">
                    <p className="text-amber-800">Nenhum transportador encontrado com os filtros selecionados.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedBackground>
    </div>
  )
}
