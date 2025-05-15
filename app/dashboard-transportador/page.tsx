"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Truck, LogOut, Filter, MapPin, Package, Calendar, Clock, DollarSign, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ZkVerifyBadge } from "@/components/zk-verify-badge"

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
  {
    id: "4",
    origem: "Salvador, BA",
    destino: "Recife, PE",
    distancia: "850 km",
    carga: "Têxteis",
    peso: "600 kg",
    dataColeta: "18/05/2025",
    prazoEntrega: "21/05/2025",
    valorEstimado: "R$ 1.800,00",
    cliente: "ModaExpress",
    status: "disponível",
  },
  {
    id: "5",
    origem: "Porto Alegre, RS",
    destino: "São Paulo, SP",
    distancia: "1100 km",
    carga: "Peças Automotivas",
    peso: "950 kg",
    dataColeta: "19/05/2025",
    prazoEntrega: "23/05/2025",
    valorEstimado: "R$ 2.500,00",
    cliente: "AutoParts",
    status: "disponível",
  },
]

// Dados simulados de check-ins validados
const checkinsValidados = [
  {
    id: "c1",
    freteId: "f101",
    data: "10/05/2025",
    hora: "08:45",
    local: "São Paulo, SP - Depósito Central",
    status: "validado",
    hash: "0x7f9e8d7c6b5a4321",
  },
  {
    id: "c2",
    freteId: "f102",
    data: "08/05/2025",
    hora: "14:30",
    local: "Campinas, SP - Terminal Logístico",
    status: "validado",
    hash: "0x1a2b3c4d5e6f7890",
  },
  {
    id: "c3",
    freteId: "f103",
    data: "05/05/2025",
    hora: "10:15",
    local: "Ribeirão Preto, SP - Centro de Distribuição",
    status: "validado",
    hash: "0xabcdef123456789",
  },
]

export default function DashboardTransportador() {
  const router = useRouter()
  const [prestadorData, setPrestadorData] = useState<any>(null)
  const [fretes, setFretes] = useState(fretesDisponiveis)
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroCidade, setFiltroCidade] = useState("")
  const [checkins, setCheckins] = useState(checkinsValidados)
  const [activeTab, setActiveTab] = useState("marketplace")
  const [loadingLance, setLoadingLance] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o usuário está logado e é um prestador
    const savedAccount = localStorage.getItem("walletAddress")
    const savedPrestadorData = localStorage.getItem("prestadorData")

    if (!savedAccount || !savedPrestadorData) {
      router.push("/")
      return
    }

    setPrestadorData(JSON.parse(savedPrestadorData))
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

  const fazerLance = async (freteId: string) => {
    try {
      setLoadingLance(freteId)
      // Simulando conexão com contrato inteligente
      console.log(`Conectando ao contrato inteligente para o frete #${freteId}...`)

      // Simulação de delay para representar a interação com a blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`Lance enviado para o frete #${freteId} através do contrato inteligente`)
    } catch (error) {
      console.error("Erro ao conectar com contrato inteligente:", error)
      alert("Erro ao processar lance. Por favor, tente novamente.")
    } finally {
      setLoadingLance(null)
    }
  }

  const exportarRelatorio = () => {
    alert("Relatório exportado em PDF")
  }

  const handleLogout = () => {
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("prestadorData")
    router.push("/")
  }

  if (!prestadorData) {
    return (
      <div className="min-h-screen bg-black bg-opacity-90 flex items-center justify-center">
        <div className="text-amber-50 text-center">
          <Truck className="animate-pulse h-12 w-12 mx-auto mb-4" />
          <p>Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black bg-opacity-90 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-blend-overlay bg-cover">
      <header className="bg-amber-800 text-amber-50 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Truck className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">FreteRacer</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-amber-200 text-amber-800">
                <AvatarFallback>{prestadorData.nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{prestadorData.nome}</p>
                <p className="text-xs text-amber-200">Transportador</p>
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

      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="marketplace" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="bg-amber-100 text-amber-800">
            <TabsTrigger
              value="marketplace"
              className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50"
            >
              Marketplace
            </TabsTrigger>
            <TabsTrigger
              value="checkins"
              className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50"
            >
              Check-ins Validados
            </TabsTrigger>
            <TabsTrigger value="perfil" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50">
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-6">
            <Card className="bg-amber-50 border-none shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Filtrar Fretes</CardTitle>
                <CardDescription>Encontre fretes disponíveis por localização</CardDescription>
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
                      <CardTitle className="text-lg">{frete.carga}</CardTitle>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {frete.status}
                      </Badge>
                    </div>
                    <CardDescription>{frete.cliente}</CardDescription>
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
                  <CardFooter>
                    <Button
                      onClick={() => fazerLance(frete.id)}
                      className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50"
                      disabled={loadingLance === frete.id}
                    >
                      {loadingLance === frete.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Fazer Lance"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {fretes.length === 0 && (
                <div className="col-span-full text-center p-8 bg-amber-50 rounded-lg">
                  <p className="text-amber-800">Nenhum frete encontrado com os filtros selecionados.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="checkins" className="mt-6">
            <Card className="bg-amber-50 border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Check-ins Validados</CardTitle>
                  <CardDescription>Histórico de check-ins validados com ZkVerify</CardDescription>
                </div>
                <Button
                  onClick={exportarRelatorio}
                  variant="outline"
                  className="border-amber-800 text-amber-800 hover:bg-amber-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkins.map((checkin) => (
                    <div key={checkin.id} className="p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">Frete #{checkin.freteId}</h3>
                          <p className="text-sm text-muted-foreground">{checkin.local}</p>
                        </div>
                        <ZkVerifyBadge />
                      </div>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-amber-800" />
                          <span>{checkin.data}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-amber-800" />
                          <span>{checkin.hora}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Hash: {checkin.hash}</span>
                      </div>
                    </div>
                  ))}

                  {checkins.length === 0 && (
                    <div className="text-center p-8">
                      <p className="text-amber-800">Nenhum check-in validado encontrado.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="mt-6">
            <Card className="bg-amber-50 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Meu Perfil</CardTitle>
                <CardDescription>Informações do seu cadastro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Nome</Label>
                      <Input value={prestadorData.nome} disabled className="bg-amber-100" />
                    </div>

                    <div>
                      <Label>CNPJ/CPF</Label>
                      <Input value={prestadorData.cnpjOuCpf} disabled className="bg-amber-100" />
                    </div>

                    <div>
                      <Label>Tipo de Veículo</Label>
                      <Input
                        value={prestadorData.tipoDeVeiculo.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        disabled
                        className="bg-amber-100"
                      />
                    </div>

                    <div>
                      <Label>Capacidade (Kg)</Label>
                      <Input value={prestadorData.capacidadeKg} disabled className="bg-amber-100" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Cidades Atendidas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {prestadorData.cidadesAtendidas.map((cidade: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {cidade}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Telefone</Label>
                      <Input value={prestadorData.telefone} disabled className="bg-amber-100" />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input value={prestadorData.email} disabled className="bg-amber-100" />
                    </div>

                    <div>
                      <Label>Carteira</Label>
                      <Input value={prestadorData.walletAddress} disabled className="bg-amber-100" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => router.push("/cadastro-prestador")}
                  variant="outline"
                  className="border-amber-800 text-amber-800 hover:bg-amber-100"
                >
                  Editar Perfil
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
