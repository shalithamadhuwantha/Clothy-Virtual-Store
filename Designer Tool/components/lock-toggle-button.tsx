"use client"

import { Button } from "@/components/ui/button"
import { Lock, LockOpen } from "lucide-react"

interface LockToggleButtonProps {
  isLocked: boolean
  onToggle: () => void
  disabled?: boolean
}

export function LockToggleButton({ isLocked, onToggle, disabled = false }: LockToggleButtonProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Lock</label>
      <Button
        onClick={onToggle}
        className={`w-full disabled:opacity-50 disabled:cursor-not-allowed ${
          isLocked
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-500 hover:bg-gray-600 text-white"
        }`}
        size="sm"
        disabled={disabled}
      >
        {isLocked ? (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Unlock Layer
          </>
        ) : (
          <>
            <LockOpen className="w-4 h-4 mr-2" />
            Lock Layer
          </>
        )}
      </Button>
    </div>
  )
}
