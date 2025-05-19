"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, FileUp, Loader2, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { extractTextFromImage, parseDocumentText, zkVerifyProof } from "@/lib/document-verification"
import { useToast } from "@/hooks/use-toast"

export default function Verificacao() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const role = searchParams.get("role")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<Record<string, string> | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<"pendente" | "validando" | "validado">("pendente")
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simular carregamento para mostrar animações
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    if (!role) {
      router.push("/")
    }

    return () => clearTimeout(timer)
  }, [role, router])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null)
      return
    }

    setSelectedFile(e.target.files[0])
    setExtractedText(null)
    setDocumentData(null)
    setVerificationStatus("pendente")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const processImage = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)

    try {
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

      // Processar a imagem com OCR real
      const text = await extractTextFromImage(selectedFile)
      setExtractedText(text)

      // Analisar o texto para extrair informações
      const parsedData = parseDocumentText(text)
      setDocumentData(parsedData)

      clearInterval(progressInterval)
      setProgress(100)

      toast({
        title: "Documento processado",
        description: "O documento foi processado com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao processar imagem:", error)
      toast({
        title: "Erro ao processar documento",
        description: error.message || "Não foi possível processar o documento.",
        variant: "destructive",
      })
      setExtractedText("Erro ao processar documento. Por favor, tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const verifyZkProof = async () => {
    if (!documentData) return

    setVerificationStatus("validando")

    try {
      // Aqui chamamos a função placeholder de verificação ZK
      const isVerified = await zkVerifyProof(documentData)

      if (isVerified) {
        setVerificationStatus("validado")
        toast({
          title: "Verificação concluída",
          description: "Seu documento foi verificado com sucesso.",
        })

        // Redirecionar para o dashboard após validação
        setTimeout(() => {
          router.push(`/dashboard?role=${role}`)
        }, 1500)
      } else {
        throw new Error("Falha na verificação")
      }
    } catch (error: any) {
      setVerificationStatus("pendente")
      toast({
        title: "Erro na verificação",
        description: error.message || "Não foi possível verificar o documento.",
        variant: "destructive",
      })
    }
  }

  const roleTitle = role === "transportador" ? "Prestador de Serviço" : "Cliente do Frete"
  const documentType = role === "transportador" ? "CNH ou Identidade e documentos do veículo" : "CNH ou Identidade"

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300 rounded-full opacity-20 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div
        className={`max-w-md w-full transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <Button
          variant="ghost"
          className="mb-4 transition-all duration-300 hover:translate-x-[-5px]"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="shadow-lg border-zinc-200 gradient-border card-hover">
          <CardHeader>
            <CardTitle className="animate-fade-in">Verificação de {roleTitle}</CardTitle>
            <CardDescription className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Faça upload do seu {documentType} para verificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300
                ${preview ? "border-green-500 bg-green-50" : "border-zinc-300 hover:border-amber-500 hover:bg-amber-50"} 
                animate-fade-in`}
              style={{ animationDelay: "0.4s" }}
              onClick={triggerFileInput}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

              {preview ? (
                <div className="space-y-2 animate-fade-in">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview do documento"
                    className="max-h-48 mx-auto rounded-md"
                  />
                  <p className="text-sm text-green-600">Documento carregado</p>
                </div>
              ) : (
                <div className="py-8">
                  <FileUp className="h-12 w-12 mx-auto text-zinc-400 animate-float" />
                  <p className="mt-2 text-sm text-zinc-600">Clique para fazer upload do documento</p>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Processando documento...</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 animate-shimmer" />
              </div>
            )}

            {extractedText && !isProcessing && (
              <div className="bg-zinc-50 p-3 rounded-md border border-zinc-200 animate-slide-in">
                <h3 className="text-sm font-medium mb-1">Dados extraídos:</h3>
                {documentData ? (
                  <div className="text-xs text-zinc-600 space-y-1">
                    {Object.entries(documentData).map(([key, value]) => (
                      <p key={key}>
                        <span className="font-medium capitalize">{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 whitespace-pre-line">{extractedText}</p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            {selectedFile && !extractedText && !isProcessing && (
              <Button
                onClick={processImage}
                className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                Processar Documento
              </Button>
            )}

            {documentData && verificationStatus === "pendente" && (
              <Button
                onClick={verifyZkProof}
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              >
                <Shield className="mr-2 h-4 w-4" />
                ZkVerifyProof
              </Button>
            )}

            {verificationStatus === "validando" && (
              <Button disabled className="w-full animate-pulse-slow">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </Button>
            )}

            {verificationStatus === "validado" && (
              <Button disabled className="w-full bg-green-600 animate-pulse-slow">
                <Check className="mr-2 h-4 w-4" />
                Verificação Concluída
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
