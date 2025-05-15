"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Truck, Save, ArrowLeft, Plus, Minus, Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedBackground } from "@/components/animated-background"

export default function CadastroPrestador() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [novaCidade, setNovaCidade] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    cnpjOuCpf: "",
    tipoDeVeiculo: "",
    capacidadeKg: "",
    cidadesAtendidas: [] as string[],
    telefone: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    nome: false,
    cnpjOuCpf: false,
    tipoDeVeiculo: false,
    capacidadeKg: false,
    cidadesAtendidas: false,
    telefone: false,
    email: false,
  })

  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAddress")
    if (!savedAccount) {
      router.push("/")
      return
    }
    setWalletAddress(savedAccount)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpar erro ao digitar
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      tipoDeVeiculo: value,
    })

    if (errors.tipoDeVeiculo) {
      setErrors({
        ...errors,
        tipoDeVeiculo: false,
      })
    }
  }

  const adicionarCidade = () => {
    if (novaCidade.trim() !== "" && !formData.cidadesAtendidas.includes(novaCidade.trim())) {
      setFormData({
        ...formData,
        cidadesAtendidas: [...formData.cidadesAtendidas, novaCidade.trim()],
      })
      setNovaCidade("")

      if (errors.cidadesAtendidas) {
        setErrors({
          ...errors,
          cidadesAtendidas: false,
        })
      }
    }
  }

  const removerCidade = (cidade: string) => {
    setFormData({
      ...formData,
      cidadesAtendidas: formData.cidadesAtendidas.filter((c) => c !== cidade),
    })
  }

  const validateForm = () => {
    const newErrors = {
      nome: formData.nome.trim() === "",
      cnpjOuCpf: formData.cnpjOuCpf.trim() === "",
      tipoDeVeiculo: formData.tipoDeVeiculo === "",
      capacidadeKg: formData.capacidadeKg === "",
      cidadesAtendidas: formData.cidadesAtendidas.length === 0,
      telefone: formData.telefone.trim() === "",
      email: formData.email.trim() === "" || !formData.email.includes("@"),
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulando envio para API
    setTimeout(() => {
      // Salvar dados no localStorage para demonstração
      localStorage.setItem(
        "prestadorData",
        JSON.stringify({
          ...formData,
          walletAddress,
        }),
      )

      setIsSubmitting(false)
      router.push("/dashboard-transportador")
    }, 1500)
  }

  const handleLogout = () => {
    localStorage.removeItem("walletAddress")
    router.push("/")
  }

  return (
    <AnimatedBackground className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-amber-50 hover:text-amber-200 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-amber-50 text-amber-50 hover:bg-transparent hover:text-amber-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar
          </Button>
        </div>

        <Card className="bg-amber-50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Truck className="mr-2 h-6 w-6" />
              Cadastro de Transportador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className={errors.nome ? "text-red-500" : ""}>
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
                </div>

                <div>
                  <Label htmlFor="cnpjOuCpf" className={errors.cnpjOuCpf ? "text-red-500" : ""}>
                    CNPJ ou CPF *
                  </Label>
                  <Input
                    id="cnpjOuCpf"
                    name="cnpjOuCpf"
                    value={formData.cnpjOuCpf}
                    onChange={handleInputChange}
                    className={errors.cnpjOuCpf ? "border-red-500" : ""}
                  />
                  {errors.cnpjOuCpf && <p className="text-red-500 text-xs mt-1">CNPJ ou CPF é obrigatório</p>}
                </div>

                <div>
                  <Label htmlFor="tipoDeVeiculo" className={errors.tipoDeVeiculo ? "text-red-500" : ""}>
                    Tipo de Veículo *
                  </Label>
                  <Select onValueChange={handleSelectChange} value={formData.tipoDeVeiculo}>
                    <SelectTrigger className={errors.tipoDeVeiculo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="caminhao_pequeno">Caminhão Pequeno</SelectItem>
                      <SelectItem value="caminhao_medio">Caminhão Médio</SelectItem>
                      <SelectItem value="caminhao_grande">Caminhão Grande</SelectItem>
                      <SelectItem value="carreta">Carreta</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoDeVeiculo && <p className="text-red-500 text-xs mt-1">Tipo de veículo é obrigatório</p>}
                </div>

                <div>
                  <Label htmlFor="capacidadeKg" className={errors.capacidadeKg ? "text-red-500" : ""}>
                    Capacidade (Kg) *
                  </Label>
                  <Input
                    id="capacidadeKg"
                    name="capacidadeKg"
                    type="number"
                    value={formData.capacidadeKg}
                    onChange={handleInputChange}
                    className={errors.capacidadeKg ? "border-red-500" : ""}
                  />
                  {errors.capacidadeKg && <p className="text-red-500 text-xs mt-1">Capacidade é obrigatória</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cidadesAtendidas" className={errors.cidadesAtendidas ? "text-red-500" : ""}>
                    Cidades Atendidas *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="novaCidade"
                      value={novaCidade}
                      onChange={(e) => setNovaCidade(e.target.value)}
                      placeholder="Adicionar cidade"
                      className={errors.cidadesAtendidas ? "border-red-500" : ""}
                    />
                    <Button type="button" onClick={adicionarCidade} variant="outline" className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.cidadesAtendidas && (
                    <p className="text-red-500 text-xs mt-1">Adicione pelo menos uma cidade</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.cidadesAtendidas.map((cidade, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {cidade}
                        <button
                          type="button"
                          onClick={() => removerCidade(cidade)}
                          className="ml-1 h-4 w-4 rounded-full hover:bg-amber-200 inline-flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="telefone" className={errors.telefone ? "text-red-500" : ""}>
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone && <p className="text-red-500 text-xs mt-1">Telefone é obrigatório</p>}
                </div>

                <div>
                  <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">Email válido é obrigatório</p>}
                </div>

                <div>
                  <Label>Carteira Conectada</Label>
                  <Input value={walletAddress} disabled className="bg-amber-100" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-amber-800 hover:bg-amber-900 text-amber-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Cadastro
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  )
}
