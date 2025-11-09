"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Upload, Type } from "lucide-react"
import { useRef, useState } from "react"
import { SendToSellerDialog } from "@/components/send-to-seller-dialog"

interface ToolsPanelProps {
  canvasColor: string
  setCanvasColor: (color: string) => void
  addText: () => void
  onImageUpload: (file: File) => void
  onDownload: () => void
  texts: any[]
  images: any[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  designImage: string | null
}

export function ToolsPanel({
  canvasColor,
  setCanvasColor,
  addText,
  onImageUpload,
  onDownload,
  texts,
  images,
  selectedElement,
  onSelectElement,
  designImage,
}: ToolsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-8 overflow-y-auto shadow-sm">
      <div className="mb-7">
        
        <p className="text-lg font-bold text-gray-500 dark:text-gray-400 mt-0 text-center">T-Shirt Designer</p>
      </div>

      {/* Canvas Color */}
      <Card className="p-4 mb-6 bg-gray-50 dark:bg-gray-800 border-0">
        <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">Canvas Color</h3>
        <div className="flex gap-3">
          <input
            type="color"
            value={canvasColor}
            onChange={(e) => setCanvasColor(e.target.value)}
            className="w-14 h-12 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
          />
          <div className="flex-1">
            <input
              type="text"
              value={canvasColor}
              onChange={(e) => setCanvasColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </Card>

      {/* Image Upload */}
      <div className="mb-4">
        <Button
          onClick={handleImageUploadClick}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      {/* Add Text */}
      <Button onClick={addText} className="w-full mb-6 bg-emerald-500 hover:bg-emerald-600 text-white" size="lg">
        <Type className="w-4 h-4 mr-2" />
        Add Text
      </Button>

      {/* Elements List */}
      <Card className="p-4 mb-6 bg-gray-50 dark:bg-gray-800 border-0">
        <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">Elements</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {texts.length === 0 && images.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">No elements yet</p>
          )}
          {texts.map((text) => (
            <button
              key={text.id}
              onClick={() => onSelectElement(text.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                selectedElement === text.id
                  ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Type className="w-3 h-3 inline mr-2" />
              {text.text.substring(0, 20)}...
            </button>
          ))}
          {images.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => onSelectElement(image.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                selectedElement === image.id
                  ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Upload className="w-3 h-3 inline mr-2" />
              Image {idx + 1}
            </button>
          ))}
        </div>
      </Card>

      {/* Download */}
      <Button onClick={onDownload} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" size="lg">
        <Download className="w-4 h-4 mr-2" />
        Download Design
      </Button>

      {/* Send to Seller */}
      <div className="mt-4">
        <SendToSellerDialog designImage={designImage} />
      </div>
    </div>
  )
}
