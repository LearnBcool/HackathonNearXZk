import { CheckCircle, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ZkVerifyBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 flex items-center gap-1 cursor-help">
            <Shield className="h-3 w-3" />
            <CheckCircle className="h-3 w-3" />
            <span>ZkVerify</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-[200px]">
            Este check-in foi validado com tecnologia ZkVerify, garantindo autenticidade e privacidade dos dados.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
