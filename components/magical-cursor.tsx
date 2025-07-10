"use client"

import { useEffect, useState } from "react"

export function MagicalCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [trail, setTrail] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Disable on small/mobile devices
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setEnabled(true)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      const target = e.target as HTMLElement
      const isInteractive = target.closest('button, a, [role="button"], input, textarea, select')
      setIsHovering(!!isInteractive)

      const newTrailPoint = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        opacity: 0.6,
      }

      setTrail((prev) => [...prev.slice(-1), newTrailPoint])
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)

    document.body.style.cursor = "none"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.body.style.cursor = "auto"
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((point) => ({ ...point, opacity: point.opacity - 0.3 }))
          .filter((point) => point.opacity > 0),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [enabled])

  if (!enabled || !isVisible) return null

  return (
    <>
      {trail.map((point) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[999]"
          style={{
            left: point.x,
            top: point.y,
            transform: "translate(-50%, -50%)",
            opacity: point.opacity * 0.4,
          }}
        >
          <div className="w-1 h-1 bg-primary-500 rounded-full" />
        </div>
      ))}

      <div
        className="fixed pointer-events-none z-[999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.5 : 1})`,
        }}
      >
        <div
          className={`w-8 h-8 border border-primary-500/60 rounded-full transition-transform duration-75 ${
            isHovering ? "border-primary-500 bg-primary-500/10" : ""
          } ${isClicking ? "border-primary-600 bg-primary-500/20" : ""}`}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
            isClicking ? "bg-primary-600 scale-150" : "bg-primary-500"
          }`}
          style={{
            boxShadow: isHovering ? "0 0 8px rgba(255, 107, 53, 0.6)" : "0 0 4px rgba(255, 107, 53, 0.3)",
          }}
        />
        {isHovering && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-primary-500/30 rounded-full"
            style={{
              animation: "ping 0.5s cubic-bezier(0, 0, 0.2, 1)",
            }}
          />
        )}
      </div>

      {isClicking && (
        <div
          className="fixed pointer-events-none z-[999]"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-16 h-16 border border-primary-500/40 rounded-full"
            style={{
              animation: "ping 0.5s cubic-bezier(0, 0, 0.2, 1)",
            }}
          />
        </div>
      )}

      <style jsx global>{`
        @keyframes ping {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
