"use client"

interface OpacityControlProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function OpacityControl({ value, onChange, disabled = false }: OpacityControlProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Opacity</label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">{value}%</span>
    </div>
  )
}
