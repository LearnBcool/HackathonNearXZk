"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText, Package, Search, Truck, User, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedMap } from "@/components/animated-map"
import { AnimatedPlaceholder } from "@/components/animated-placeholder"
import { DashboardHeader } from "@/components/dashboard-header"
import { MarketplaceCard } from "@/components/marketplace-card"
import { TransitCard } from "@/components/transit-card"
import { RegistrationForm } from "@/components/registration-form"
import { useContract, type Service, ServiceStatus } from "@/hooks/use-contract"
import { checkConnection } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"

const estados = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
]

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "cliente"
  const { toast } = useToast()
  const { getAllServices, isLoading, error, getServicesInTransit, createService } = useContract()

  const [account, setAccount] = useState<string | null>(null)
  const [selectedEstado, setSelectedEstado] = useState<string>("")
  const [selectedCidade, setSelectedCidade] = useState<string>("")
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState("marketplace")
  const [servicesInTransit, setServicesInTransit] = useState<Service[]>([])
  const [isSubmittingService, setIsSubmittingService] = useState(false)

  // Formulário de cadastro de serviço
  const [formData, setFormData] = useState({
    estadoOrigem: "",
    cidadeOrigem: "",
    estadoDestino: "",
    cidadeDestino: "",
    tipoCarga: "",
    peso: "",
    volume: "",
    dataColeta: "",
    dataEntrega: "",
    observacoes: "",
  })

  useEffect(() => {
    // Verificar se o usuário está conectado
    const checkWalletConnection = async () => {
      const connectedAccount = await checkConnection()
      setAccount(connectedAccount)

      if (!connectedAccount) {
        router.push("/")
      }
    }

    checkWalletConnection()

    // Verificar se o perfil está completo (simulação)
    const checkProfileStatus = () => {
      const profileStatus = localStorage.getItem("profileComplete")
      setIsProfileComplete(profileStatus === "true")
    }

    checkProfileStatus()
  }, [router])

  useEffect(() => {
    // Carregar serviços do contrato
    const fetchServices = async () => {
      if (account) {
        const allServices = await getAllServices()
        setServices(allServices)
      }
    }

    fetchServices()
  }, [account, getAllServices])

  useEffect(() => {
    const fetchServicesInTransit = async () => {
      if (account) {
        const transitServices = await getServicesInTransit()
        setServicesInTransit(transitServices)
      }
    }

    if (activeTab === "transito") {
      fetchServicesInTransit()
    }
  }, [account, activeTab, getServicesInTransit])

  const handleProfileComplete = () => {
    localStorage.setItem("profileComplete", "true")
    setIsProfileComplete(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitService = async () => {
    if (!isProfileComplete) {
      toast({
        title: "Perfil incompleto",
        description: "Complete seu perfil antes de cadastrar um serviço.",
        variant: "destructive",
      })
      setActiveTab("perfil")
      return
    }

    // Validar campos obrigatórios
    if (
      !formData.estadoOrigem ||
      !formData.cidadeOrigem ||
      !formData.estadoDestino ||
      !formData.cidadeDestino ||
      !formData.tipoCarga ||
      !formData.peso ||
      !formData.volume ||
      !formData.dataColeta
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingService(true)

    try {
      // Formatar origem e destino
      const origin = `${formData.cidadeOrigem}, ${formData.estadoOrigem}`
      const destination = `${formData.cidadeDestino}, ${formData.estadoDestino}`

      // Converter data para timestamp (segundos desde epoch)
      const pickupDate = Math.floor(new Date(formData.dataColeta).getTime() / 1000)

      // Chamar o contrato
      const success = await createService(
        origin,
        destination,
        formData.tipoCarga,
        Number(formData.peso),
        Number(formData.volume),
        pickupDate,
      )

      if (success) {
        toast({
          title: "Serviço cadastrado",
          description: "Seu serviço foi cadastrado com sucesso no marketplace.",
        })

        // Limpar formulário
        setFormData({
          estadoOrigem: "",
          cidadeOrigem: "",
          estadoDestino: "",
          cidadeDestino: "",
          tipoCarga: "",
          peso: "",
          volume: "",
          dataColeta: "",
          dataEntrega: "",
          observacoes: "",
        })

        // Atualizar lista de serviços
        const allServices = await getAllServices()
        setServices(allServices)

        // Mudar para a aba marketplace
        setActiveTab("marketplace")
      } else {
        toast({
          title: "Erro ao cadastrar",
          description: "Ocorreu um erro ao cadastrar o serviço. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Erro ao cadastrar serviço:", err)
      toast({
        title: "Erro ao cadastrar",
        description: err.message || "Ocorreu um erro ao cadastrar o serviço.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingService(false)
    }
  }

  const filterServices = () => {
    // Filtrar serviços por estado e cidade
    if (!services.length) return []

    let filtered = [...services]

    if (selectedEstado) {
      filtered = filtered.filter(
        (service) => service.origin.includes(selectedEstado) || service.destination.includes(selectedEstado),
      )
    }

    if (selectedCidade) {
      filtered = filtered.filter(
        (service) => service.origin.includes(selectedCidade) || service.destination.includes(selectedCidade),
      )
    }

    // Converter para o formato esperado pelo MarketplaceCard
    return filtered.map((service) => ({
      id: String(service.id),
      origem: service.origin,
      destino: service.destination,
      carga: service.cargoType,
      peso: `${String(service.weight)}kg`,
      volume: `${String(service.volume)}m³`,
      data: new Date(Number(service.pickupDate) * 1000).toLocaleDateString("pt-BR"),
      status: getStatusText(service.status),
    }))
  }

  // Função auxiliar para converter o status numérico em texto
  const getStatusText = (status: number) => {
    switch (status) {
      case ServiceStatus.Available:
        return "Disponível"
      case ServiceStatus.InProgress:
        return "Em Progresso"
      case ServiceStatus.InTransit:
        return "Em Trânsito"
      case ServiceStatus.Completed:
        return "Concluído"
      case ServiceStatus.Cancelled:
        return "Cancelado"
      default:
        return "Desconhecido"
    }
  }

  const filterTransits = () => {
    if (!servicesInTransit.length) return []

    // Converter os serviços em trânsito para o formato esperado pelo TransitCard
    const realTransits = servicesInTransit.map((service) => ({
      id: String(service.id),
      transportador:
        service.transporter.substring(0, 6) + "..." + service.transporter.substring(service.transporter.length - 4),
      origem: service.origin,
      destino: service.destination,
      capacidadeDisponivel: `${String(service.weight)}kg`,
      dataPartida: new Date(Number(service.pickupDate) * 1000).toLocaleDateString("pt-BR"),
      dataChegada: "Em andamento", // Poderia ser calculado com base em alguma lógica de negócio
      status: "Em trânsito",
    }))

    // Aplicar filtros se necessário
    if (selectedEstado) {
      return realTransits.filter(
        (transit) => transit.origem.includes(selectedEstado) || transit.destino.includes(selectedEstado),
      )
    }

    return realTransits
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-zinc-50 to-zinc-100">
      <DashboardHeader role={role} />

      <div className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden md:block">
          <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden sticky top-20 shadow-md">
            <div className="p-4 border-b border-zinc-200 bg-gradient-to-r from-amber-50 to-zinc-50">
              <div className="flex items-center mb-2">
                <AnimatedPlaceholder width={40} height={40} className="mr-2" />
                <h2 className="font-medium">
                  {role === "transportador" ? "Prestador de Serviço" : "Cliente do Frete"}
                </h2>
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                Carteira:{" "}
                {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Não conectado"}
              </p>
            </div>
            <nav className="p-2">
              <Button
                variant={activeTab === "marketplace" ? "default" : "ghost"}
                className={`w-full justify-start mb-1 transition-all duration-300 ${
                  activeTab === "marketplace" ? "bg-gradient-to-r from-amber-500 to-amber-600" : "hover:bg-amber-50"
                }`}
                onClick={() => setActiveTab("marketplace")}
              >
                <Package className="mr-2 h-4 w-4" />
                Marketplace
              </Button>
              <Button
                variant={activeTab === "transito" ? "default" : "ghost"}
                className={`w-full justify-start mb-1 transition-all duration-300 ${
                  activeTab === "transito" ? "bg-gradient-to-r from-amber-500 to-amber-600" : "hover:bg-amber-50"
                }`}
                onClick={() => setActiveTab("transito")}
              >
                <Truck className="mr-2 h-4 w-4" />
                Em Trânsito
              </Button>
              {role === "cliente" && (
                <Button
                  variant={activeTab === "cadastrar" ? "default" : "ghost"}
                  className={`w-full justify-start mb-1 transition-all duration-300 ${
                    activeTab === "cadastrar" ? "bg-gradient-to-r from-amber-500 to-amber-600" : "hover:bg-amber-50"
                  }`}
                  onClick={() => setActiveTab("cadastrar")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Cadastrar Serviço
                </Button>
              )}
              <Button
                variant={activeTab === "perfil" ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-300 ${
                  activeTab === "perfil" ? "bg-gradient-to-r from-amber-500 to-amber-600" : "hover:bg-amber-50"
                }`}
                onClick={() => setActiveTab("perfil")}
              >
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </Button>
            </nav>
          </div>
        </aside>

        <main>
          {!isProfileComplete && activeTab !== "perfil" ? (
            <Card className="mb-6 shadow-md border-amber-200 bg-gradient-to-r from-amber-50 to-zinc-50">
              <CardHeader>
                <CardTitle>Complete seu perfil</CardTitle>
                <CardDescription>Para acessar todas as funcionalidades, complete seu cadastro.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => setActiveTab("perfil")}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  Completar Perfil
                </Button>
              </CardFooter>
            </Card>
          ) : null}

          {isLoading && (
            <Card className="mb-6 shadow-md">
              <CardContent className="p-6 flex justify-center items-center">
                <p>Carregando dados do contrato...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="mb-6 shadow-md border-red-200">
              <CardContent className="p-6">
                <p className="text-red-500">{error}</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "marketplace" && !isLoading && !error && (
            <div className="space-y-6">
              <Card className="shadow-md overflow-hidden border-zinc-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-zinc-50 border-b border-zinc-200">
                  <CardTitle>Marketplace de Fretes</CardTitle>
                  <CardDescription>Encontre serviços disponíveis ou faça lances como transportador</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6 overflow-hidden rounded-lg border border-zinc-200">
                    <AnimatedMap className="w-full h-48" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                        <SelectTrigger id="estado" className="transition-all duration-300 focus:ring-amber-500">
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os estados</SelectItem>
                          {estados.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        placeholder="Digite uma cidade"
                        value={selectedCidade}
                        onChange={(e) => setSelectedCidade(e.target.value)}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 hover:shadow-lg">
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="disponivel" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="disponivel">Disponíveis</TabsTrigger>
                      <TabsTrigger value="meus">Meus Fretes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="disponivel" className="mt-4">
                      {filterServices().length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {filterServices().map((service) => (
                            <MarketplaceCard key={service.id} service={service} userRole={role} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-zinc-500">
                          <p>Nenhum serviço disponível com os filtros selecionados.</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="meus" className="mt-4">
                      <div className="text-center py-8 text-zinc-500">
                        <p>Você ainda não tem fretes cadastrados.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "transito" && (
            <div className="space-y-6">
              <Card className="shadow-md overflow-hidden border-zinc-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-zinc-50 border-b border-zinc-200">
                  <CardTitle>Fretes em Trânsito</CardTitle>
                  <CardDescription>Transportadores em rota com espaço disponível</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6 overflow-hidden rounded-lg border border-zinc-200">
                    <AnimatedMap className="w-full h-48" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="estado-transito">Estado</Label>
                      <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                        <SelectTrigger
                          id="estado-transito"
                          className="transition-all duration-300 focus:ring-amber-500"
                        >
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os estados</SelectItem>
                          {estados.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cidade-transito">Cidade</Label>
                      <Input
                        id="cidade-transito"
                        placeholder="Digite uma cidade"
                        value={selectedCidade}
                        onChange={(e) => setSelectedCidade(e.target.value)}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 hover:shadow-lg">
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {filterTransits().length > 0 ? (
                      filterTransits().map((transit) => (
                        <TransitCard key={transit.id} transit={transit} userRole={role} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-zinc-500">
                        <p>Nenhum frete em trânsito encontrado.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "cadastrar" && role === "cliente" && (
            <Card className="shadow-md overflow-hidden border-zinc-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-zinc-50 border-b border-zinc-200">
                <CardTitle>Cadastrar Novo Serviço</CardTitle>
                <CardDescription>Preencha os dados para solicitar um novo serviço de frete</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 overflow-hidden rounded-lg border border-zinc-200">
                  <AnimatedMap className="w-full h-48" />
                </div>

                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estadoOrigem">Estado de Origem</Label>
                      <Select
                        value={formData.estadoOrigem}
                        onValueChange={(value) => handleSelectChange("estadoOrigem", value)}
                      >
                        <SelectTrigger id="estadoOrigem" className="transition-all duration-300 focus:ring-amber-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cidadeOrigem">Cidade de Origem</Label>
                      <Input
                        id="cidadeOrigem"
                        placeholder="Digite a cidade"
                        value={formData.cidadeOrigem}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estadoDestino">Estado de Destino</Label>
                      <Select
                        value={formData.estadoDestino}
                        onValueChange={(value) => handleSelectChange("estadoDestino", value)}
                      >
                        <SelectTrigger id="estadoDestino" className="transition-all duration-300 focus:ring-amber-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cidadeDestino">Cidade de Destino</Label>
                      <Input
                        id="cidadeDestino"
                        placeholder="Digite a cidade"
                        value={formData.cidadeDestino}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tipoCarga">Tipo de Carga</Label>
                      <Input
                        id="tipoCarga"
                        placeholder="Ex: Eletrônicos, Móveis"
                        value={formData.tipoCarga}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input
                        id="peso"
                        type="number"
                        placeholder="Ex: 500"
                        value={formData.peso}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="volume">Volume (m³)</Label>
                      <Input
                        id="volume"
                        type="number"
                        placeholder="Ex: 2"
                        value={formData.volume}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataColeta">Data de Coleta</Label>
                      <Input
                        id="dataColeta"
                        type="date"
                        value={formData.dataColeta}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataEntrega">Data de Entrega Desejada</Label>
                      <Input
                        id="dataEntrega"
                        type="date"
                        value={formData.dataEntrega}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      className="w-full min-h-[100px] p-3 rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                      placeholder="Informações adicionais sobre a carga ou requisitos especiais"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-zinc-50 to-amber-50 border-t border-zinc-200">
                <Button
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 hover:shadow-lg"
                  onClick={handleSubmitService}
                  disabled={isSubmittingService}
                >
                  {isSubmittingService ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar Serviço"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "perfil" && (
            <Card className="shadow-md overflow-hidden border-zinc-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-zinc-50 border-b border-zinc-200">
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>
                  {role === "transportador"
                    ? "Complete seu cadastro como prestador de serviço"
                    : "Complete seu cadastro como cliente"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <RegistrationForm role={role} onComplete={handleProfileComplete} isComplete={isProfileComplete} />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
