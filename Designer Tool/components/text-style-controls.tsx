"use client"

interface TextStyleControlsProps {
  bold: boolean
  italic: boolean
  onBoldToggle: () => void
  onItalicToggle: () => void
  disabled?: boolean
}

export function TextStyleControls({
  bold,
  italic,
  onBoldToggle,
  onItalicToggle,
  disabled = false,
}: TextStyleControlsProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Text Style</label>
      <div className="flex gap-2">
        <button
          onClick={onBoldToggle}
          disabled={disabled}
          className={`flex-1 px-3 py-2 border rounded-md text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
            bold
              ? "bg-emerald-500 text-white border-emerald-500"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          B
        </button>
        <button
          onClick={onItalicToggle}
          disabled={disabled}
          className={`flex-1 px-3 py-2 border rounded-md text-sm italic transition disabled:opacity-50 disabled:cursor-not-allowed ${
            italic
              ? "bg-emerald-500 text-white border-emerald-500"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          I
        </button>
      </div>
    </div>
  )
}
