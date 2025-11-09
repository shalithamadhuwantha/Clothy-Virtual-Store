"use client"

import { useState, useRef } from "react"
import { DesignCanvas } from "@/components/design-canvas"
import { ToolsPanel } from "@/components/tools-panel"
import { texts, images } from "@/data" // Assuming texts and images are imported from a data file
import { Header } from "@/components/header"
import { TextEditor } from "@/components/text-editor"
import { ImageEditor } from "@/components/image-editor"

export default function Home() {
  const [canvasColor, setCanvasColor] = useState("#FFFFFF")
  const [localTexts, setLocalTexts] =
    useState<
      Array<{
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
    >(texts)
  const [localImages, setLocalImages] =
    useState<Array<{ id: string; src: string; x: number; y: number; width: number; height: number; opacity?: number; zIndex?: number; rotation?: number; locked?: boolean }>>(images)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [designImage, setDesignImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const addText = () => {
    const newText = {
      id: Date.now().toString(),
      text: "New Text",
      x: 100,
      y: 100,
      color: "#000000",
      font: "Arial",
      size: 24,
      bold: false,
      italic: false,
    }
    setLocalTexts([...localTexts, newText])
    setSelectedElement(newText.id)
  }

  const updateText = (id: string, updates: Partial<(typeof localTexts)[0]>) => {
    setLocalTexts(localTexts.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteText = (id: string) => {
    setLocalTexts(localTexts.filter((t) => t.id !== id))
    setSelectedElement(null)
  }

  const bringTextForward = (id: string) => {
    const textIndex = localTexts.findIndex((t) => t.id === id)
    if (textIndex === localTexts.length - 1) return
    const newTexts = [...localTexts]
    ;[newTexts[textIndex], newTexts[textIndex + 1]] = [newTexts[textIndex + 1], newTexts[textIndex]]
    setLocalTexts(newTexts)
  }

  const sendTextBackward = (id: string) => {
    const textIndex = localTexts.findIndex((t) => t.id === id)
    if (textIndex === 0) return
    const newTexts = [...localTexts]
    ;[newTexts[textIndex], newTexts[textIndex - 1]] = [newTexts[textIndex - 1], newTexts[textIndex]]
    setLocalTexts(newTexts)
  }

  const bringTextToFront = (id: string) => {
    const textIndex = localTexts.findIndex((t) => t.id === id)
    if (textIndex === localTexts.length - 1) return
    const newTexts = [...localTexts]
    const element = newTexts.splice(textIndex, 1)[0]
    newTexts.push(element)
    setLocalTexts(newTexts)
  }

  const sendTextToBack = (id: string) => {
    const textIndex = localTexts.findIndex((t) => t.id === id)
    if (textIndex === 0) return
    const newTexts = [...localTexts]
    const element = newTexts.splice(textIndex, 1)[0]
    newTexts.unshift(element)
    setLocalTexts(newTexts)
  }

  const toggleTextLock = (id: string) => {
    setLocalTexts(localTexts.map((t) => (t.id === id ? { ...t, locked: !t.locked } : t)))
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const newImage = {
        id: Date.now().toString(),
        src,
        x: 100,
        y: 100,
        width: 150,
        height: 150,
      }
      setLocalImages([...localImages, newImage])
      setSelectedElement(newImage.id)
    }
    reader.readAsDataURL(file)
  }

  const updateImage = (id: string, updates: Partial<(typeof localImages)[0]>) => {
    setLocalImages(localImages.map((img) => (img.id === id ? { ...img, ...updates } : img)))
  }

  const deleteImage = (id: string) => {
    setLocalImages(localImages.filter((img) => img.id !== id))
    setSelectedElement(null)
  }

  const bringImageForward = (id: string) => {
    const imageIndex = localImages.findIndex((img) => img.id === id)
    if (imageIndex === localImages.length - 1) return
    const newImages = [...localImages]
    ;[newImages[imageIndex], newImages[imageIndex + 1]] = [newImages[imageIndex + 1], newImages[imageIndex]]
    setLocalImages(newImages)
  }

  const sendImageBackward = (id: string) => {
    const imageIndex = localImages.findIndex((img) => img.id === id)
    if (imageIndex === 0) return
    const newImages = [...localImages]
    ;[newImages[imageIndex], newImages[imageIndex - 1]] = [newImages[imageIndex - 1], newImages[imageIndex]]
    setLocalImages(newImages)
  }

  const bringImageToFront = (id: string) => {
    const imageIndex = localImages.findIndex((img) => img.id === id)
    if (imageIndex === localImages.length - 1) return
    const newImages = [...localImages]
    const element = newImages.splice(imageIndex, 1)[0]
    newImages.push(element)
    setLocalImages(newImages)
  }

  const sendImageToBack = (id: string) => {
    const imageIndex = localImages.findIndex((img) => img.id === id)
    if (imageIndex === 0) return
    const newImages = [...localImages]
    const element = newImages.splice(imageIndex, 1)[0]
    newImages.unshift(element)
    setLocalImages(newImages)
  }

  const toggleImageLock = (id: string) => {
    setLocalImages(localImages.map((img) => (img.id === id ? { ...img, locked: !img.locked } : img)))
  }

  const downloadDesign = async () => {
    if (!canvasRef.current) return

    // Use higher resolution for better quality (2x the display size)
    const CANVAS_SIZE = 768
    const DISPLAY_SIZE = 384
    const scale = CANVAS_SIZE / DISPLAY_SIZE

    const canvas = document.createElement("canvas")
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set higher DPI for better quality
    ctx.scale(scale, scale)

    // Draw background
    ctx.fillStyle = canvasColor
    ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE)

    // Sort images by zIndex for proper layering
    const sortedImages = [...localImages].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))

    const imagePromises = sortedImages.map(
      (img) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.crossOrigin = "anonymous"
          image.onload = () => {
            ctx.save()
            ctx.globalAlpha = (img.opacity !== undefined ? img.opacity : 100) / 100
            
            // Apply rotation if it exists
            const rotation = (img as any).rotation || 0
            if (rotation !== 0) {
              const centerX = img.x + img.width / 2
              const centerY = img.y + img.height / 2
              ctx.translate(centerX, centerY)
              ctx.rotate((rotation * Math.PI) / 180)
              ctx.translate(-centerX, -centerY)
            }
            
            ctx.drawImage(image, img.x, img.y, img.width, img.height)
            ctx.restore()
            resolve()
          }
          image.onerror = () => resolve() // Continue if image fails
          image.src = img.src
        }),
    )

    await Promise.all(imagePromises)

    // Sort texts by zIndex for proper layering
    const sortedTexts = [...localTexts].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))

    // Draw text
    for (const textItem of sortedTexts) {
      ctx.save()
      ctx.globalAlpha = (textItem.opacity !== undefined ? textItem.opacity : 100) / 100
      ctx.fillStyle = textItem.color
      let fontString = `${textItem.size}px ${textItem.font}`
      if (textItem.bold) {
        fontString = `bold ${fontString}`
      }
      if (textItem.italic) {
        fontString = `italic ${fontString}`
      }
      ctx.font = fontString
      ctx.fillText(textItem.text, textItem.x, textItem.y + textItem.size)
      ctx.restore()
    }

    ctx.globalAlpha = 1

    // Get the canvas image data
    const imageData = canvas.toDataURL("image/png")
    setDesignImage(imageData)

    // Download
    const link = document.createElement("a")
    link.href = imageData
    link.download = "tshirt-design.png"
    link.click()
  }

  return (
    <main className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Left Panel - Tools */}
      <ToolsPanel
        canvasColor={canvasColor}
        setCanvasColor={setCanvasColor}
        addText={addText}
        onImageUpload={handleImageUpload}
        onDownload={downloadDesign}
        texts={localTexts}
        images={localImages}
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
        designImage={designImage}
      />

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 pt-20">
        <DesignCanvas
          ref={canvasRef}
          canvasColor={canvasColor}
          texts={localTexts}
          images={localImages}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onUpdateText={updateText}
          onUpdateImage={updateImage}
          onDeleteText={deleteText}
          onDeleteImage={deleteImage}
        />
      </div>

      {/* Right Panel - Element Editor */}
      <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">Element Properties</h3>
        {selectedElement ? (
          localTexts.find((t) => t.id === selectedElement) ? (
            <TextEditor
              text={localTexts.find((t) => t.id === selectedElement)!}
              onUpdate={(updates) => updateText(selectedElement, updates)}
              onDelete={() => deleteText(selectedElement)}
              onBringForward={() => bringTextForward(selectedElement)}
              onSendBackward={() => sendTextBackward(selectedElement)}
              onBringToFront={() => bringTextToFront(selectedElement)}
              onSendToBack={() => sendTextToBack(selectedElement)}
              onToggleLock={() => toggleTextLock(selectedElement)}
            />
          ) : (
            <ImageEditor
              image={localImages.find((i) => i.id === selectedElement)!}
              onUpdate={(updates) => updateImage(selectedElement, updates)}
              onDelete={() => deleteImage(selectedElement)}
              onBringForward={() => bringImageForward(selectedElement)}
              onSendBackward={() => sendImageBackward(selectedElement)}
              onBringToFront={() => bringImageToFront(selectedElement)}
              onSendToBack={() => sendImageToBack(selectedElement)}
              onToggleLock={() => toggleImageLock(selectedElement)}
            />
          )
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Select an element to edit</p>
        )}
      </div>
    </main>
  )
}
