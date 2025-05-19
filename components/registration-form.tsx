"use client"

import type React from "react"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegistrationFormProps {
  role: string
  onComplete: () => void
  isComplete: boolean
}

export function RegistrationForm({ role, onComplete, isComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cnpjOuCpf: "",
    tipoDeVeiculo: "",
    capacidadeKg: "",
    cidadesAtendidas: "",
    telefone: "",
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulação de envio de dados
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete()
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium mb-2">Perfil Completo</h3>
        <p className="text-zinc-600 mb-6">Seu perfil está completo e você pode acessar todas as funcionalidades.</p>
        <Button
          variant="outline"
          onClick={() =>
            setFormData({
              nome: "",
              cnpjOuCpf: "",
              tipoDeVeiculo: "",
              capacidadeKg: "",
              cidadesAtendidas: "",
              telefone: "",
              email: "",
            })
          }
          className="border-amber-500 text-amber-700 hover:bg-amber-50 transition-all duration-300"
        >
          Editar Informações
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            placeholder="Digite seu nome completo"
            value={formData.nome}
            onChange={handleChange}
            required
            className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpjOuCpf">CPF ou CNPJ *</Label>
          <Input
            id="cnpjOuCpf"
            placeholder="Digite seu CPF ou CNPJ"
            value={formData.cnpjOuCpf}
            onChange={handleChange}
            required
            className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {role === "transportador" && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoDeVeiculo">Tipo de Veículo *</Label>
              <Select
                value={formData.tipoDeVeiculo}
                onValueChange={(value) => handleSelectChange("tipoDeVeiculo", value)}
              >
                <SelectTrigger id="tipoDeVeiculo" className="transition-all duration-300 focus:ring-amber-500">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="caminhao_pequeno">Caminhão Pequeno</SelectItem>
                  <SelectItem value="caminhao_medio">Caminhão Médio</SelectItem>
                  <SelectItem value="caminhao_grande">Caminhão Grande</SelectItem>
                  <SelectItem value="carreta">Carreta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidadeKg">Capacidade (kg) *</Label>
              <Input
                id="capacidadeKg"
                placeholder="Ex: 3000"
                value={formData.capacidadeKg}
                onChange={handleChange}
                required
                className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidadesAtendidas">Cidades Atendidas *</Label>
            <Input
              id="cidadesAtendidas"
              placeholder="Digite as cidades separadas por vírgula"
              value={formData.cidadesAtendidas}
              onChange={handleChange}
              required
              className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="transition-all duration-300 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Informações"
          )}
        </Button>
      </div>
    </div>
  )
}
