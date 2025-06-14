"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface TextRevealAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function TextRevealAnimation({
  children,
  className = "",
  delay = 0,
  duration = 1000,
}: TextRevealAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay, hasAnimated])

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
      <div
        className={`transition-all ease-out ${
          isVisible ? "transform translate-y-0 opacity-100" : "transform translate-y-8 opacity-0"
        }`}
        style={{ transitionDuration: `${duration}ms` }}
      >
        {children}
      </div>

      {/* Reveal curtain effect */}
      <div
        className={`absolute inset-0 bg-primary-500 transition-transform ease-out ${
          isVisible ? "transform translate-x-full" : "transform translate-x-0"
        }`}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}
