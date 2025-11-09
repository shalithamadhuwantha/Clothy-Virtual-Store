"use client"

interface RotationControlProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function RotationControl({ value, onChange, disabled = false }: RotationControlProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Rotation (°)</label>
      <input
        type="number"
        min="0"
        max="360"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value) % 360)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
    </div>
  )
}
