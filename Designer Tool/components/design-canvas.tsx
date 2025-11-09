"use client"

import type React from "react"

import { forwardRef, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface DesignCanvasProps {
  canvasColor: string
  texts: Array<{
    id: string
    text: string
    x: number
    y: number
    color: string
    font: string
    size: number
    bold?: boolean
    italic?: boolean
    opacity?: number
    zIndex?: number
    locked?: boolean
  }>
  images: Array<{ id: string; src: string; x: number; y: number; width: number; height: number; opacity?: number; zIndex?: number; rotation?: number; locked?: boolean }>
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onUpdateText: (id: string, updates: any) => void
  onUpdateImage: (id: string, updates: any) => void
  onDeleteText: (id: string) => void
  onDeleteImage: (id: string) => void
}

export const DesignCanvas = forwardRef<HTMLCanvasElement, DesignCanvasProps>(
  (
    {
      canvasColor,
      texts,
      images,
      selectedElement,
      onSelectElement,
      onUpdateText,
      onUpdateImage,
      onDeleteText,
      onDeleteImage,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [resizing, setResizing] = useState<{ elementId: string; handle: string } | null>(null)
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, size: 0 })
    const [rotating, setRotating] = useState<string | null>(null)
    const [rotationStart, setRotationStart] = useState({ x: 0, y: 0, rotation: 0 })

    const handleMouseDown = (e: React.MouseEvent, elementId: string, elementType: "text" | "image") => {
      e.stopPropagation()
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      if (elementType === "text") {
        const textItem = texts.find((t) => t.id === elementId)
        if (!textItem || textItem.locked) return // Prevent interaction with locked elements
      } else if (elementType === "image") {
        const imageItem = images.find((img) => img.id === elementId)
        if (!imageItem || imageItem.locked) return // Prevent interaction with locked elements
      }

      const x = e.clientX - canvasRect.left
      const y = e.clientY - canvasRect.top

      if (elementType === "text") {
        const textItem = texts.find((t) => t.id === elementId)
        if (textItem) {
          setDragging(elementId)
          setDragOffset({ x: x - textItem.x, y: y - textItem.y })
        }
      } else if (elementType === "image") {
        const imageItem = images.find((img) => img.id === elementId)
        if (imageItem) {
          setDragging(elementId)
          setDragOffset({ x: x - imageItem.x, y: y - imageItem.y })
        }
      }

      onSelectElement(elementId)
    }

    const handleMouseUp = () => {
      setDragging(null)
      setResizing(null)
      setRotating(null)
    }

    const handleCanvasClick = (e: React.MouseEvent) => {
      // Check if click is on the canvas background (not on any element)
      if (e.target === canvasRef.current || (e.currentTarget as HTMLElement).className.includes("Card")) {
        onSelectElement(null)
      }
    }

    const handleClickOutside = () => {
      onSelectElement(null)
    }

    const handleResizeStart = (
      e: React.MouseEvent,
      elementId: string,
      handle: string,
      elementType: "text" | "image",
    ) => {
      e.stopPropagation()
      const element = elementType === "image" ? images.find((img) => img.id === elementId) : texts.find((t) => t.id === elementId)

      if (!element) return

      setResizing({ elementId, handle })
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: (element as any).width || 100,
        height: (element as any).height || 50,
        size: (element as any).size || 16,
      })
    }

    const handleRotationStart = (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation()
      const imageItem = images.find((img) => img.id === elementId)
      if (!imageItem) return

      setRotating(elementId)
      setRotationStart({
        x: e.clientX,
        y: e.clientY,
        rotation: imageItem.rotation || 0,
      })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (rotating && canvasRef.current) {
        const deltaX = e.clientX - rotationStart.x
        const newRotation = (rotationStart.rotation + deltaX) % 360
        onUpdateImage(rotating, { rotation: newRotation })
        return
      }

      if (resizing && canvasRef.current) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newSize = resizeStart.size

        const { handle, elementId } = resizing
        const imageItem = images.find((img) => img.id === elementId)
        const textItem = texts.find((t) => t.id === elementId)

        if (imageItem) {
          // Resize image dimensions
          if (handle.includes("e")) newWidth = Math.max(50, resizeStart.width + deltaX)
          if (handle.includes("s")) newHeight = Math.max(50, resizeStart.height + deltaY)
          if (handle.includes("w")) newWidth = Math.max(50, resizeStart.width - deltaX)
          if (handle.includes("n")) newHeight = Math.max(50, resizeStart.height - deltaY)
          onUpdateImage(elementId, { width: newWidth, height: newHeight })
        } else if (textItem) {
          // Resize text by changing font size
          if (handle.includes("e") || handle.includes("s") || handle.includes("se")) {
            newSize = Math.max(8, resizeStart.size + deltaX)
            onUpdateText(elementId, { size: newSize })
          }
        }
        return
      }

      if (!dragging || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const canvasWidth = rect.width
      const canvasHeight = rect.height

      let x = e.clientX - rect.left - dragOffset.x
      let y = e.clientY - rect.top - dragOffset.y

      const textItem = texts.find((t) => t.id === dragging)
      if (textItem) {
        // Constrain text within canvas bounds
        x = Math.max(0, Math.min(x, canvasWidth - 50))
        y = Math.max(0, Math.min(y, canvasHeight - 20))
        onUpdateText(dragging, { x, y })
        return
      }

      const imageItem = images.find((img) => img.id === dragging)
      if (imageItem) {
        // Constrain image within canvas bounds
        x = Math.max(0, Math.min(x, canvasWidth - imageItem.width))
        y = Math.max(0, Math.min(y, canvasHeight - imageItem.height))
        onUpdateImage(dragging, { x, y })
      }
    }

    return (
      <Card
        ref={canvasRef}
        className="relative w-96 h-96 shadow-lg overflow-hidden dark:shadow-lg dark:shadow-emerald-500/20"
        style={{ backgroundColor: canvasColor }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={(e) => {
          if (e.target === canvasRef.current) {
            handleClickOutside()
          }
        }}
      >
        {/* Images Layer - Now draggable and resizable */}
        {images.map((image) => (
          <div
            key={image.id}
            className={`absolute border-2 pointer-events-auto ${
              selectedElement === image.id ? "border-emerald-500" : "border-transparent"
            } ${image.locked ? "cursor-not-allowed" : "cursor-move"}`}
            style={{
              left: `${image.x}px`,
              top: `${image.y}px`,
              width: `${image.width}px`,
              height: `${image.height}px`,
              opacity: (image.opacity !== undefined ? image.opacity : 100) / 100,
              zIndex: image.zIndex !== undefined ? image.zIndex : images.indexOf(image),
              transform: `rotate(${image.rotation || 0}deg)`,
              transformOrigin: 'center center',
            }}
            onMouseDown={(e) => handleMouseDown(e, image.id, "image")}
            onClick={() => onSelectElement(image.id)}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt="design element"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Lock Indicator */}
            {image.locked && (
              <div
                className="absolute w-5 h-5 bg-red-500 rounded-full flex items-center justify-center pointer-events-none"
                style={{ top: "-10px", right: "-10px" }}
                title="Locked"
              >
                <span className="text-white text-xs font-bold">🔒</span>
              </div>
            )}

            {/* Resize Handles */}
            {selectedElement === image.id && !image.locked && (
              <>
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-nwse-resize"
                  style={{ top: "-4px", left: "-4px" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "nw", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-ns-resize"
                  style={{ top: "-4px", left: "50%", transform: "translateX(-50%)" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "n", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-nesw-resize"
                  style={{ top: "-4px", right: "-4px" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "ne", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-ew-resize"
                  style={{ top: "50%", left: "-4px", transform: "translateY(-50%)" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "w", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-ew-resize"
                  style={{ top: "50%", right: "-4px", transform: "translateY(-50%)" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "e", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-swne-resize"
                  style={{ bottom: "-4px", left: "-4px" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "sw", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-ns-resize"
                  style={{ bottom: "-4px", left: "50%", transform: "translateX(-50%)" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "s", "image")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-nwse-resize"
                  style={{ bottom: "-4px", right: "-4px" }}
                  onMouseDown={(e) => handleResizeStart(e, image.id, "se", "image")}
                />
                {/* Rotation Handle - Top center */}
                <div
                  className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-grab hover:bg-blue-600 active:cursor-grabbing"
                  style={{ 
                    top: "-20px", 
                    left: "50%", 
                    transform: "translateX(-50%)",
                    border: "2px solid white"
                  }}
                  onMouseDown={(e) => handleRotationStart(e, image.id)}
                  title="Drag to rotate"
                />
              </>
            )}
          </div>
        ))}

        {/* Text Layer - Draggable and Resizable */}
        {texts.map((textItem) => (
          <div
            key={textItem.id}
            className={`absolute px-2 py-1 border-2 relative whitespace-nowrap inline-block ${
              selectedElement === textItem.id ? "border-emerald-500" : "border-transparent"
            } ${textItem.locked ? "cursor-not-allowed" : "cursor-move"}`}
            style={{
              left: `${textItem.x}px`,
              top: `${textItem.y}px`,
              color: textItem.color,
              fontFamily: textItem.font,
              fontSize: `${textItem.size}px`,
              fontWeight: textItem.bold ? "bold" : "normal",
              fontStyle: textItem.italic ? "italic" : "normal",
              opacity: (textItem.opacity !== undefined ? textItem.opacity : 100) / 100,
              zIndex: textItem.zIndex !== undefined ? textItem.zIndex : texts.indexOf(textItem),
              width: 'fit-content',
            }}
            onMouseDown={(e) => handleMouseDown(e, textItem.id, "text")}
            onClick={() => onSelectElement(textItem.id)}
          >
            {textItem.text}

            {/* Lock Indicator */}
            {textItem.locked && (
              <div
                className="absolute w-5 h-5 bg-red-500 rounded-full flex items-center justify-center pointer-events-none"
                style={{ top: "-10px", right: "-10px" }}
                title="Locked"
              >
                <span className="text-white text-xs font-bold">🔒</span>
              </div>
            )}

            {/* Resize Handles for Text */}
            {selectedElement === textItem.id && !textItem.locked && (
              <>
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-ew-resize"
                  style={{ top: "50%", right: "-4px", transform: "translateY(-50%)" }}
                  onMouseDown={(e) => handleResizeStart(e, textItem.id, "e", "text")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-nwse-resize"
                  style={{ bottom: "-4px", right: "-4px" }}
                  onMouseDown={(e) => handleResizeStart(e, textItem.id, "se", "text")}
                />
                <div
                  className="absolute w-2 h-2 bg-emerald-500 rounded-full cursor-ns-resize"
                  style={{ bottom: "-4px", left: "50%", transform: "translateX(-50%)" }}
                  onMouseDown={(e) => handleResizeStart(e, textItem.id, "s", "text")}
                />
              </>
            )}
          </div>
        ))}

        <canvas ref={ref} className="hidden" />
      </Card>
    )
  },
)

DesignCanvas.displayName = "DesignCanvas"
