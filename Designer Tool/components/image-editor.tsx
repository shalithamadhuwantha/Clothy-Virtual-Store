"use client"

import { Button } from "@/components/ui/button"

interface ImageEditorProps {
  image: any
  onUpdate: (updates: any) => void
  onDelete: () => void
}

export function ImageEditor({ image, onUpdate, onDelete }: ImageEditorProps) {
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
      <Button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white">
        Remove
      </Button>
    </div>
  )
}
