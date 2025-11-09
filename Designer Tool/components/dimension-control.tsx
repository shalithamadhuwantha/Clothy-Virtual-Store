"use client"

interface DimensionControlProps {
  width: number
  height: number
  onWidthChange: (value: number) => void
  onHeightChange: (value: number) => void
  disabled?: boolean
}

export function DimensionControl({
  width,
  height,
  onWidthChange,
  onHeightChange,
  disabled = false,
}: DimensionControlProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <input
          type="number"
          min="50"
          value={width}
          onChange={(e) => onWidthChange(Math.max(50, Number.parseInt(e.target.value)))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Height</label>
        <input
          type="number"
          min="50"
          value={height}
          onChange={(e) => onHeightChange(Math.max(50, Number.parseInt(e.target.value)))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
      </div>
    </>
  )
}
