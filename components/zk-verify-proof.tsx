"use client"

import { useState } from "react"
import { Shield, Loader2, Check, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ZkVerifyProofProps } from "@/lib/document-verification"

export function ZkVerifyProofComponent({ documentData, onVerificationComplete, onError }: ZkVerifyProofProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const startVerification = async () => {
    setIsVerifying(true)
    setStatus("verifying")
    setProgress(0)
    setErrorMessage(null)

    // Simulação de progresso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      // Aqui você implementaria a lógica real de verificação ZK
      // Por enquanto, apenas simulamos um atraso e um resultado bem-sucedido
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setProgress(100)
      setStatus("success")
      onVerificationComplete(true)
    } catch (error: any) {
      clearInterval(progressInterval)
      setStatus("error")
      setErrorMessage(error.message || "Erro na verificação")
      onError(error.message || "Erro na verificação")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="shadow-md border-zinc-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-amber-500" />
          Verificação ZK Proof
        </CardTitle>
        <CardDescription>Verificação segura e privada de documentos usando Zero-Knowledge Proofs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-zinc-50 p-3 rounded-md border border-zinc-200">
          <h3 className="text-sm font-medium mb-2">Dados para verificação:</h3>
          <div className="text-xs text-zinc-600 space-y-1">
            {Object.entries(documentData).map(([key, value]) => (
              <p key={key}>
                <span className="font-medium capitalize">{key}:</span> {value}
              </p>
            ))}
          </div>
        </div>

        {status === "verifying" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Verificando documento...</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 animate-shimmer" />
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">Erro na verificação</h3>
              <p className="text-xs text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800 mb-1">Verificação concluída</h3>
              <p className="text-xs text-green-600">
                Seu documento foi verificado com sucesso usando Zero-Knowledge Proofs.
              </p>
            </div>
          </div>
        )}

        {/* Aqui você pode adicionar mais informações sobre o processo de verificação ZK */}
        <div className="text-xs text-zinc-500 italic">
          <p>
            A verificação ZK permite comprovar a autenticidade do documento sem revelar informações sensíveis. Este
            componente pode ser expandido para implementar a lógica real de verificação ZK.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {status === "idle" && (
          <Button
            onClick={startVerification}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300"
          >
            <Shield className="mr-2 h-4 w-4" />
            Iniciar Verificação ZK
          </Button>
        )}

        {status === "verifying" && (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
          </Button>
        )}

        {(status === "success" || status === "error") && (
          <Button
            onClick={() => setStatus("idle")}
            variant={status === "error" ? "destructive" : "outline"}
            className="w-full"
          >
            {status === "error" ? "Tentar novamente" : "Nova verificação"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
