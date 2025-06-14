"use client"

import React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({ children, staggerDelay = 100, className = "" }: StaggerContainerProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <div ref={elementRef} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: `all 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
            willChange: "transform, opacity",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
