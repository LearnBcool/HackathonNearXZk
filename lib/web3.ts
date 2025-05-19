import { ethers } from "ethers"
import FreteRacerABI from "./FreteRacerABI.json"
import SolicitanteABI from "./SolicitanteABI.json"

// Endereço do contrato principal (FreteRacer)
export const CONTRACT_ADDRESS = "0x0D6084048C239E2a1073979c616408cC339ad571"

// Endereço do contrato do solicitante (a ser preenchido)
export const SOLICITANTE_CONTRACT_ADDRESS = "0xD49d50091afdae97D2dE1b7d45778CF72CD25448" // Substitua pelo endereço real

// Função para obter o provider da MetaMask
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}

// Função para obter o signer (usuário conectado)
export const getSigner = async () => {
  const provider = getProvider()
  if (!provider) return null
  return await provider.getSigner()
}

// Função para obter o contrato principal (FreteRacer)
export const getContract = async (withSigner = false) => {
  const provider = getProvider()
  if (!provider) return null

  if (withSigner) {
    const signer = await getSigner()
    if (!signer) return null
    return new ethers.Contract(CONTRACT_ADDRESS, FreteRacerABI, signer)
  }

  return new ethers.Contract(CONTRACT_ADDRESS, FreteRacerABI, provider)
}

// Função para obter o contrato do solicitante
export const getSolicitanteContract = async (withSigner = false) => {
  const provider = getProvider()
  if (!provider) return null

  if (withSigner) {
    const signer = await getSigner()
    if (!signer) return null
    return new ethers.Contract(SOLICITANTE_CONTRACT_ADDRESS, SolicitanteABI, signer)
  }

  return new ethers.Contract(SOLICITANTE_CONTRACT_ADDRESS, SolicitanteABI, provider)
}

// Função para conectar à MetaMask
export const connectWallet = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      return accounts[0]
    } catch (error) {
      console.error("Erro ao conectar com MetaMask:", error)
      throw error
    }
  } else {
    throw new Error("MetaMask não encontrada. Por favor, instale a extensão.")
  }
}

// Função para verificar se o usuário está conectado
export const checkConnection = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })
      return accounts.length > 0 ? accounts[0] : null
    } catch (error) {
      console.error("Erro ao verificar conexão:", error)
      return null
    }
  }
  return null
}

// Função para escutar mudanças de conta
export const listenToAccountChanges = (callback: (account: string | null) => void) => {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      callback(accounts.length > 0 ? accounts[0] : null)
    })

    // Retorna uma função para remover o listener
    return () => {
      window.ethereum.removeListener("accountsChanged", callback)
    }
  }
  return () => {}
}

// Função para escutar mudanças de rede
export const listenToChainChanges = (callback: (chainId: string) => void) => {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on("chainChanged", callback)

    // Retorna uma função para remover o listener
    return () => {
      window.ethereum.removeListener("chainChanged", callback)
    }
  }
  return () => {}
}
