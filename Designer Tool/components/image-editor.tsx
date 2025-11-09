"use client"

import { Button } from "@/components/ui/button"
import { DimensionControl } from "@/components/dimension-control"
import { RotationControl } from "@/components/rotation-control"
import { OpacityControl } from "@/components/opacity-control"
import { LayerOrderControls } from "@/components/layer-order-controls"
import { LockToggleButton } from "@/components/lock-toggle-button"

interface ImageEditorProps {
  image: any
  onUpdate: (updates: any) => void
  onDelete: () => void
  onBringForward?: () => void
  onSendBackward?: () => void
  onBringToFront?: () => void
  onSendToBack?: () => void
  onToggleLock?: () => void
}

export function ImageEditor({ image, onUpdate, onDelete, onBringForward, onSendBackward, onBringToFront, onSendToBack, onToggleLock }: ImageEditorProps) {
  return (
    <div className="space-y-4">
      <DimensionControl
        width={image.width}
        height={image.height}
        onWidthChange={(width) => onUpdate({ width })}
        onHeightChange={(height) => onUpdate({ height })}
      />

      <RotationControl
        value={image.rotation !== undefined ? image.rotation : 0}
        onChange={(rotation) => onUpdate({ rotation })}
      />

      <OpacityControl
        value={image.opacity !== undefined ? image.opacity : 100}
        onChange={(opacity) => onUpdate({ opacity })}
      />

      <LayerOrderControls
        onBringToFront={onBringToFront || (() => {})}
        onSendToBack={onSendToBack || (() => {})}
        onBringForward={onBringForward || (() => {})}
        onSendBackward={onSendBackward || (() => {})}
      />

      <LockToggleButton
        isLocked={image.locked || false}
        onToggle={onToggleLock || (() => {})}
      />

      <Button onClick={onDelete} className="w-full bg-red-500 hover:bg-red-600 text-white">
        Remove
      </Button>
    </div>
  )
}
