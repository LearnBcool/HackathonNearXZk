interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (request: { method: string; params?: any[] }) => Promise<any>
    on: (eventName: string, callback: (...args: any[]) => void) => void
  }
}

interface FreteProps {
  id: string
  origem: string
  destino: string
  distancia: string
  carga: string
  peso: string
  dataColeta: string
  prazoEntrega: string
  valorEstimado: string
  cliente?: string
  status: string
  lances?: LanceProps[]
}

interface LanceProps {
  id: string
  transportador: string
  valor: string
}

interface PrestadorProps {
  nome: string
  cnpjOuCpf: string
  tipoDeVeiculo: string
  capacidadeKg: string
  cidadesAtendidas: string[]
  walletAddress: string
  telefone: string
  email: string
}

interface CheckinProps {
  id: string
  freteId: string
  data: string
  hora: string
  local: string
  status: string
  hash: string
}
