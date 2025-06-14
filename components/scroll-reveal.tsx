"use client"

import type React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade"
  delay?: number
  duration?: number
  distance?: number
  className?: string
  triggerOnce?: boolean
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  distance = 50,
  className = "",
  triggerOnce = true,
}: ScrollRevealProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce,
    delay,
  })

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)"

    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0) scale(1)`
      case "down":
        return `translate3d(0, -${distance}px, 0) scale(1)`
      case "left":
        return `translate3d(${distance}px, 0, 0) scale(1)`
      case "right":
        return `translate3d(-${distance}px, 0, 0) scale(1)`
      case "scale":
        return `translate3d(0, 0, 0) scale(0.8)`
      case "fade":
      default:
        return "translate3d(0, 0, 0) scale(1)"
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  )
}
