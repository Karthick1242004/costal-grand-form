"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SignaturePadProps extends React.HTMLAttributes<HTMLCanvasElement> {
  value?: string // Base64 image data
  onChange?: (value: string | null) => void
  disabled?: boolean
}

const SignaturePad = React.forwardRef<HTMLCanvasElement, SignaturePadProps>(
  ({ value, onChange, disabled, className, ...props }, ref) => {
    const { theme, resolvedTheme } = useTheme()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const internalRef = useRef<HTMLCanvasElement>(null) // Use an internal ref for canvas operations
    const combinedRef = (el: HTMLCanvasElement) => {
      internalRef.current = el
      if (typeof ref === "function") {
        ref(el)
      } else if (ref) {
        ref.current = el
      }
    }

    const [isDrawing, setIsDrawing] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Handle mounting to avoid hydration issues
    useEffect(() => {
      setMounted(true)
    }, [])

    const getStrokeColor = useCallback(() => {
      if (!mounted) return "#1e293b" // Default color during SSR

      // Use resolvedTheme to get the actual theme (handles system preference)
      const currentTheme = resolvedTheme || theme
      return currentTheme === "dark" ? "#ffffff" : "#1e293b"
    }, [theme, resolvedTheme, mounted])

    const getContext = useCallback(() => {
      const canvas = internalRef.current
      if (!canvas) return null
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = getStrokeColor()
      }
      return ctx
    }, [getStrokeColor])

    const clearCanvas = useCallback(() => {
      const ctx = getContext()
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        setIsEmpty(true)
        onChange?.(null)
      }
    }, [getContext, onChange])

    const saveSignature = useCallback(() => {
      const canvas = internalRef.current
      if (canvas && !isEmpty) {
        onChange?.(canvas.toDataURL())
      } else if (isEmpty) {
        onChange?.(null)
      }
    }, [internalRef, isEmpty, onChange])

    // Update stroke color when theme changes
    useEffect(() => {
      const ctx = getContext()
      if (ctx) {
        ctx.strokeStyle = getStrokeColor()
      }
    }, [getContext, getStrokeColor])

    useEffect(() => {
      const canvas = internalRef.current
      if (!canvas || !mounted) return

      // Set canvas dimensions for high DPI screens
      const dpi = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpi
      canvas.height = rect.height * dpi
      const ctx = getContext()
      if (ctx) {
        ctx.scale(dpi, dpi)
      }

      // Load initial value if provided
      if (value && value !== "data:,") {
        // "data:," is an empty data URL
        const img = new Image()
        img.crossOrigin = "anonymous" // Add this to avoid CORS issues
        img.onload = () => {
          const ctx = getContext()
          if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(img, 0, 0, rect.width, rect.height)
            setIsEmpty(false)
          }
        }
        img.src = value
      } else {
        clearCanvas() // Ensure canvas is clear if value is empty or invalid
      }
    }, [value, getContext, clearCanvas, mounted])

    const startDrawing = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (disabled || !mounted) return
        setIsDrawing(true)
        const ctx = getContext()
        if (ctx) {
          const canvas = internalRef.current!
          const rect = canvas.getBoundingClientRect()
          let clientX, clientY

          if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
          } else {
            clientX = e.clientX
            clientY = e.clientY
          }

          ctx.beginPath()
          ctx.moveTo(clientX - rect.left, clientY - rect.top)
          setIsEmpty(false)
        }
      },
      [getContext, disabled, mounted],
    )

    const draw = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || disabled || !mounted) return
        const ctx = getContext()
        if (ctx) {
          const canvas = internalRef.current!
          const rect = canvas.getBoundingClientRect()
          let clientX, clientY

          if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
          } else {
            clientX = e.clientX
            clientY = e.clientY
          }

          ctx.lineTo(clientX - rect.left, clientY - rect.top)
          ctx.stroke()
        }
      },
      [isDrawing, getContext, disabled, mounted],
    )

    const stopDrawing = useCallback(() => {
      if (disabled || !mounted) return
      setIsDrawing(false)
      saveSignature()
    }, [disabled, saveSignature, mounted])

    if (!mounted) {
      // Return a placeholder during SSR
      return (
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-48 border-2 border-dashed rounded-xl bg-muted animate-pulse" />
          <Button type="button" variant="outline" size="sm" className="w-fit bg-transparent" disabled>
            Clear Signature
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "relative w-full h-48 border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800",
            className,
          )}
        >
          <canvas
            ref={combinedRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
            className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            {...props}
          />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 text-base pointer-events-none">
              <div className="text-center">
                <div className="text-2xl mb-2">✍️</div>
                <div>Draw your signature here</div>
                <div className="text-sm mt-1 opacity-75">
                  Signature will be {resolvedTheme === "dark" ? "white" : "black"}
                </div>
              </div>
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={clearCanvas}
          disabled={disabled || isEmpty}
          variant="outline"
          size="sm"
          className="w-fit bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800"
        >
          Clear Signature
        </Button>
      </div>
    )
  },
)

SignaturePad.displayName = "SignaturePad"

export { SignaturePad }
