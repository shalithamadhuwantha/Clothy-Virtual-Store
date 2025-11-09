"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"

interface ImageEditorProps {
  image: any
  onUpdate: (updates: any) => void
  onDelete: () => void
  onBringForward?: () => void
  onSendBackward?: () => void
}

export function ImageEditor({ image, onUpdate, onDelete, onBringForward, onSendBackward }: ImageEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <input
          type="number"
          min="50"
          value={image.width}
          onChange={(e) => onUpdate({ width: Math.max(50, Number.parseInt(e.target.value)) })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Height</label>
        <input
          type="number"
          min="50"
          value={image.height}
          onChange={(e) => onUpdate({ height: Math.max(50, Number.parseInt(e.target.value)) })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Opacity</label>
        <input
          type="range"
          min="0"
          max="100"
          value={image.opacity !== undefined ? image.opacity : 100}
          onChange={(e) => onUpdate({ opacity: Number.parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">{image.opacity !== undefined ? image.opacity : 100}%</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Layer Order</label>
        <div className="flex gap-2">
          <Button
            onClick={onBringForward}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            size="sm"
          >
            <ArrowUp className="w-4 h-4 mr-1" />
            Forward
          </Button>
          <Button
            onClick={onSendBackward}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            size="sm"
          >
            <ArrowDown className="w-4 h-4 mr-1" />
            Backward
          </Button>
        </div>
      </div>

      <Button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white">
        Remove
      </Button>
    </div>
  )
}
