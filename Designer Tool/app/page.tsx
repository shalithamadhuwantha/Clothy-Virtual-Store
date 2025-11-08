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
      }>
    >(texts)
  const [localImages, setLocalImages] =
    useState<Array<{ id: string; src: string; x: number; y: number; width: number; height: number }>>(images)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
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

  const downloadDesign = async () => {
    if (!canvasRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = 384
    canvas.height = 384
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Draw background
    ctx.fillStyle = canvasColor
    ctx.fillRect(0, 0, 384, 384)

    const imagePromises = localImages.map(
      (img) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.crossOrigin = "anonymous"
          image.onload = () => {
            ctx.drawImage(image, img.x, img.y, img.width, img.height)
            resolve()
          }
          image.onerror = () => resolve() // Continue if image fails
          image.src = img.src
        }),
    )

    await Promise.all(imagePromises)

    // Draw text
    for (const textItem of localTexts) {
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
    }

    // Download
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
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
            />
          ) : (
            <ImageEditor
              image={localImages.find((i) => i.id === selectedElement)!}
              onUpdate={(updates) => updateImage(selectedElement, updates)}
              onDelete={() => deleteImage(selectedElement)}
            />
          )
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Select an element to edit</p>
        )}
      </div>
    </main>
  )
}
