"use client"

interface FontSelectorProps {
  value: string
  onChange: (font: string) => void
  disabled?: boolean
}

export function FontSelector({ value, onChange, disabled = false }: FontSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Font</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <option>Arial</option>
        <option>Georgia</option>
        <option>Times New Roman</option>
        <option>Courier New</option>
        <option>Verdana</option>
        <option>Comic Sans MS</option>
      </select>
    </div>
  )
}
