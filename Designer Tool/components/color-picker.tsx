"use client"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  disabled?: boolean
}

export function ColorPicker({ color, onChange, disabled = false }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Color</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">{color}</span>
      </div>
    </div>
  )
}
