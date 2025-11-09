"use client"

interface FontSizeControlProps {
  size: number
  onChange: (size: number) => void
  disabled?: boolean
  min?: number
  max?: number
}

export function FontSizeControl({
  size,
  onChange,
  disabled = false,
  min = 8,
  max = 72,
}: FontSizeControlProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Font Size</label>
      <input
        type="range"
        min={min}
        max={max}
        value={size}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">{size}px</span>
    </div>
  )
}
