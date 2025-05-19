"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, DollarSign, Package, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContract, type Service, ServiceStatus } from "@/hooks/use-contract"
import { checkConnection } from "@/lib/web3"

// Cores para o gráfico de pizza
const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"]

export default function AnalyticsDashboard() {
  const router = useRouter()
  const { getAllServices, isLoading, error } = useContract()
  const [account, setAccount] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState("overview")

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

  useEffect(() => {
    const fetchServices = async () => {
      if (account) {
        const allServices = await getAllServices()
        setServices(allServices)
      }
    }

    fetchServices()
  }, [account, getAllServices])

  // Dados para o gráfico de status
  const statusData = [
    { name: "Disponível", value: services.filter((s) => s.status === ServiceStatus.Available).length },
    { name: "Em Progresso", value: services.filter((s) => s.status === ServiceStatus.InProgress).length },
    { name: "Em Trânsito", value: services.filter((s) => s.status === ServiceStatus.InTransit).length },
    { name: "Concluído", value: services.filter((s) => s.status === ServiceStatus.Completed).length },
    { name: "Cancelado", value: services.filter((s) => s.status === ServiceStatus.Cancelled).length },
  ]

  // Dados para o gráfico de volume por origem
  const originData = services.reduce((acc: any[], service) => {
    const origin = service.origin.split(",")[0].trim() // Pega apenas a cidade
    const existingOrigin = acc.find((item) => item.name === origin)
    const volumeNumber = Number(service.volume) // Converter bigint para number

    if (existingOrigin) {
      existingOrigin.value += volumeNumber
    } else {
      acc.push({ name: origin, value: volumeNumber })
    }

    return acc
  }, [])

  // Dados para o gráfico de volume por destino
  const destinationData = services.reduce((acc: any[], service) => {
    const destination = service.destination.split(",")[0].trim() // Pega apenas a cidade
    const existingDestination = acc.find((item) => item.name === destination)
    const volumeNumber = Number(service.volume) // Converter bigint para number

    if (existingDestination) {
      existingDestination.value += volumeNumber
    } else {
      acc.push({ name: destination, value: volumeNumber })
    }

    return acc
  }, [])

  // Estatísticas gerais
  const totalServices = services.length
  const completedServices = services.filter((s) => s.status === ServiceStatus.Completed).length
  const inTransitServices = services.filter((s) => s.status === ServiceStatus.InTransit).length
  const totalVolume = services.reduce((sum, service) => sum + Number(service.volume), 0) // Converter bigint para number

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Análise</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Voltar ao Dashboard
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Total de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-amber-500 mr-2" />
                  <span className="text-3xl font-bold">{totalServices}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Serviços Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-3xl font-bold">{completedServices}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Em Trânsito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-3xl font-bold">{inTransitServices}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Volume Total (m³)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500 mr-2" />
                  <span className="text-3xl font-bold">{totalVolume}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="origins">Origens</TabsTrigger>
              <TabsTrigger value="destinations">Destinos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Serviços</CardTitle>
                  <CardDescription>Distribuição dos serviços por status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="origins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Volume por Origem</CardTitle>
                  <CardDescription>Volume de carga por cidade de origem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={originData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Volume (m³)" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="destinations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Volume por Destino</CardTitle>
                  <CardDescription>Volume de carga por cidade de destino</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={destinationData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Volume (m³)" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
