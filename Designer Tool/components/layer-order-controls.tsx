"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react"

interface LayerOrderControlsProps {
  onBringToFront: () => void
  onSendToBack: () => void
  onBringForward: () => void
  onSendBackward: () => void
  disabled?: boolean
}

export function LayerOrderControls({
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  disabled = false,
}: LayerOrderControlsProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Layer Order</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={onBringToFront}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            title="Bring to Front"
            disabled={disabled}
          >
            <ChevronsUp className="w-4 h-4 mr-1" />
            Front
          </Button>
          <Button
            onClick={onSendToBack}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            title="Send to Back"
            disabled={disabled}
          >
            <ChevronsDown className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onBringForward}
            className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            title="Bring Forward"
            disabled={disabled}
          >
            <ArrowUp className="w-4 h-4 mr-1" />
            Up
          </Button>
          <Button
            onClick={onSendBackward}
            className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            title="Send Backward"
            disabled={disabled}
          >
            <ArrowDown className="w-4 h-4 mr-1" />
            Down
          </Button>
        </div>
      </div>
    </div>
  )
}
