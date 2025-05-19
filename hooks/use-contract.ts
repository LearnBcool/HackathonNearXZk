"use client"

import { useState, useCallback } from "react"
import { getContract, getSolicitanteContract } from "@/lib/web3"

// Tipos para os serviços e lances
export interface Service {
  id: bigint
  client: string
  transporter: string
  origin: string
  destination: string
  cargoType: string
  weight: bigint
  volume: bigint
  pickupDate: bigint
  status: number // 0: Available, 1: InProgress, 2: InTransit, 3: Completed, 4: Cancelled
  acceptedBidAmount: bigint
}

export interface Bid {
  bidder: string
  amount: bigint
  accepted: boolean
}

export enum ServiceStatus {
  Available = 0,
  InProgress = 1,
  InTransit = 2,
  Completed = 3,
  Cancelled = 4,
}

// Enum para o status no contrato do solicitante
export enum SolicitanteServiceStatus {
  NotRequested = 0,
  Requested = 1,
  Accepted = 2,
  Completed = 3,
  Cancelled = 4,
}

export function useContract() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para criar um novo serviço
  const createService = useCallback(
    async (
      origin: string,
      destination: string,
      cargoType: string,
      weight: number,
      volume: number,
      pickupDate: number,
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const contract = await getContract(true)
        if (!contract) {
          throw new Error("Contrato não disponível")
        }

        const tx = await contract.createService(origin, destination, cargoType, weight, volume, pickupDate)

        await tx.wait()
        return true
      } catch (err: any) {
        setError(err.message || "Erro ao criar serviço")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Função para fazer um lance
  const placeBid = useCallback(async (serviceId: number, amount: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract(true)
      if (!contract) {
        throw new Error("Contrato não disponível")
      }

      const tx = await contract.placeBid(serviceId, amount)
      await tx.wait()
      return true
    } catch (err: any) {
      setError(err.message || "Erro ao fazer lance")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para aceitar um lance
  const acceptBid = useCallback(async (serviceId: number, bidder: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract(true)
      if (!contract) {
        throw new Error("Contrato não disponível")
      }

      const tx = await contract.acceptBid(serviceId, bidder)
      await tx.wait()
      return true
    } catch (err: any) {
      setError(err.message || "Erro ao aceitar lance")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para atualizar o status de um serviço
  const updateServiceStatus = useCallback(async (serviceId: number, status: ServiceStatus) => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract(true)
      if (!contract) {
        throw new Error("Contrato não disponível")
      }

      const tx = await contract.updateServiceStatus(serviceId, status)
      await tx.wait()
      return true
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar status")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para obter um serviço
  const getService = useCallback(async (serviceId: number): Promise<Service | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      if (!contract) {
        throw new Error("Contrato não disponível")
      }

      const service = await contract.getService(serviceId)
      return service
    } catch (err: any) {
      setError(err.message || "Erro ao obter serviço")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para obter todos os serviços
  const getAllServices = useCallback(async (): Promise<Service[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      if (!contract) {
        throw new Error("Contrato não disponível")
      }

      const count = await contract.getServicesCount()
      const services: Service[] = []

      // Converter bigint para number para o loop
      const countNumber = Number(count)

      for (let i = 0; i < countNumber; i++) {
        const service = await contract.getService(i)
        services.push(service)
      }

      return services
    } catch (err: any) {
      setError(err.message || "Erro ao obter serviços")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para obter os lances de um serviço
  const getBids = useCallback(async (serviceId: number): Promise<Bid[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      if (!contract) {
        throw new Error("Contrato não disponível")
      }

      const bids = await contract.getBids(serviceId)
      return bids
    } catch (err: any) {
      setError(err.message || "Erro ao obter lances")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // NOVAS FUNÇÕES PARA O CONTRATO DO SOLICITANTE

  // Função para solicitar um serviço
  const requestService = useCallback(async (serviceId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getSolicitanteContract(true)
      if (!contract) {
        throw new Error("Contrato do solicitante não disponível")
      }

      const tx = await contract.requestService(serviceId)
      await tx.wait()
      return true
    } catch (err: any) {
      setError(err.message || "Erro ao solicitar serviço")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para aceitar um serviço (pelo transportador)
  const acceptService = useCallback(async (serviceId: number, transporterAddress: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getSolicitanteContract(true)
      if (!contract) {
        throw new Error("Contrato do solicitante não disponível")
      }

      const tx = await contract.acceptService(serviceId, transporterAddress)
      await tx.wait()
      return true
    } catch (err: any) {
      setError(err.message || "Erro ao aceitar serviço")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para obter o status de um serviço no contrato do solicitante
  const getServiceStatusFromSolicitante = useCallback(async (serviceId: number): Promise<SolicitanteServiceStatus> => {
    setIsLoading(true)
    setError(null)

    try {
      const contract = await getSolicitanteContract()
      if (!contract) {
        throw new Error("Contrato do solicitante não disponível")
      }

      const status = await contract.getServiceStatus(serviceId)
      return Number(status)
    } catch (err: any) {
      setError(err.message || "Erro ao obter status do serviço")
      return SolicitanteServiceStatus.NotRequested
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para obter serviços em trânsito (aceitos pelo segundo contrato)
  const getServicesInTransit = useCallback(async (): Promise<Service[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const freteRacerContract = await getContract()
      const solicitanteContract = await getSolicitanteContract()

      if (!freteRacerContract || !solicitanteContract) {
        throw new Error("Contratos não disponíveis")
      }

      const count = await freteRacerContract.getServicesCount()
      const countNumber = Number(count)

      const servicesInTransit: Service[] = []

      for (let i = 0; i < countNumber; i++) {
        // Verificar status no contrato principal
        const service = await freteRacerContract.getService(i)

        // Verificar status no contrato do solicitante
        const solicitanteStatus = await solicitanteContract.getServiceStatus(i)

        // Apenas incluir serviços que estão em trânsito no contrato principal
        // E foram aceitos no contrato do solicitante
        if (
          service.status === ServiceStatus.InTransit &&
          Number(solicitanteStatus) === SolicitanteServiceStatus.Accepted
        ) {
          servicesInTransit.push(service)
        }
      }

      return servicesInTransit
    } catch (err: any) {
      setError(err.message || "Erro ao obter serviços em trânsito")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    createService,
    placeBid,
    acceptBid,
    updateServiceStatus,
    getService,
    getAllServices,
    getBids,
    // Novas funções
    requestService,
    acceptService,
    getServiceStatusFromSolicitante,
    getServicesInTransit,
  }
}
