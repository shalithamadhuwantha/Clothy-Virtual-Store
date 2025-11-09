"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FontSizeControl } from "@/components/font-size-control"
import { FontSelector } from "@/components/font-selector"
import { TextStyleControls } from "@/components/text-style-controls"
import { ColorPicker } from "@/components/color-picker"
import { OpacityControl } from "@/components/opacity-control"
import { LayerOrderControls } from "@/components/layer-order-controls"
import { LockToggleButton } from "@/components/lock-toggle-button"

interface TextEditorProps {
  text: any
  onUpdate: (updates: any) => void
  onDelete: () => void
  onBringForward?: () => void
  onSendBackward?: () => void
  onBringToFront?: () => void
  onSendToBack?: () => void
  onToggleLock?: () => void
}

export function TextEditor({ text, onUpdate, onDelete, onBringForward, onSendBackward, onBringToFront, onSendToBack, onToggleLock }: TextEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Text</label>
        <Input value={text.text} onChange={(e) => onUpdate({ text: e.target.value })} className="text-sm" />
      </div>

      <FontSizeControl
        size={text.size}
        onChange={(size) => onUpdate({ size })}
      />

      <FontSelector
        value={text.font}
        onChange={(font) => onUpdate({ font })}
      />

      <TextStyleControls
        bold={text.bold || false}
        italic={text.italic || false}
        onBoldToggle={() => onUpdate({ bold: !text.bold })}
        onItalicToggle={() => onUpdate({ italic: !text.italic })}
      />

      <ColorPicker
        color={text.color}
        onChange={(color) => onUpdate({ color })}
      />

      <OpacityControl
        value={text.opacity !== undefined ? text.opacity : 100}
        onChange={(opacity) => onUpdate({ opacity })}
      />

      <LayerOrderControls
        onBringToFront={onBringToFront || (() => {})}
        onSendToBack={onSendToBack || (() => {})}
        onBringForward={onBringForward || (() => {})}
        onSendBackward={onSendBackward || (() => {})}
      />

      <LockToggleButton
        isLocked={text.locked || false}
        onToggle={onToggleLock || (() => {})}
      />

      <Button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white">
        Delete
      </Button>
    </div>
  )
}
