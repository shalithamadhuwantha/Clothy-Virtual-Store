"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TextEditorProps {
  text: any
  onUpdate: (updates: any) => void
  onDelete: () => void
}

export function TextEditor({ text, onUpdate, onDelete }: TextEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Text</label>
        <Input value={text.text} onChange={(e) => onUpdate({ text: e.target.value })} className="text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input
          type="range"
          min="8"
          max="72"
          value={text.size}
          onChange={(e) => onUpdate({ size: Number.parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">{text.size}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font</label>
        <select
          value={text.font}
          onChange={(e) => onUpdate({ font: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
        >
          <option>Arial</option>
          <option>Georgia</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
          <option>Verdana</option>
          <option>Comic Sans MS</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ bold: !text.bold })}
            className={`flex-1 px-3 py-2 border rounded-md text-sm font-bold transition ${
              text.bold
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            B
          </button>
          <button
            onClick={() => onUpdate({ italic: !text.italic })}
            className={`flex-1 px-3 py-2 border rounded-md text-sm italic transition ${
              text.italic
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            I
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={text.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">{text.color}</span>
        </div>
      </div>
      <Button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white">
        Delete
      </Button>
    </div>
  )
}
