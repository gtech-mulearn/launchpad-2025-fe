"use client"

import { useEffect, useState } from "react"

interface GlitchTextProps {
  text: string
  className?: string
  glitchIntensity?: number
  triggerOnHover?: boolean
}

export function GlitchText({ text, className = "", glitchIntensity = 3, triggerOnHover = false }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)

  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const createGlitch = () => {
    let result = ""
    for (let i = 0; i < text.length; i++) {
      if (Math.random() < 0.1 * glitchIntensity) {
        result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        result += text[i]
      }
    }
    return result
  }

  useEffect(() => {
    if (!triggerOnHover) {
      const interval = setInterval(() => {
        setIsGlitching(true)
        setGlitchText(createGlitch())

        setTimeout(() => {
          setGlitchText(text)
          setIsGlitching(false)
        }, 100)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [text, triggerOnHover, glitchIntensity])

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setIsGlitching(true)
      const glitchInterval = setInterval(() => {
        setGlitchText(createGlitch())
      }, 50)

      setTimeout(() => {
        clearInterval(glitchInterval)
        setGlitchText(text)
        setIsGlitching(false)
      }, 300)
    }
  }

  return (
    <span
      className={`relative inline-block ${className} ${triggerOnHover ? "cursor-pointer" : ""}`}
      onMouseEnter={handleMouseEnter}
      style={{
        textShadow: isGlitching
          ? `
            2px 0 #ff6b35,
            -2px 0 #1a1a1a,
            0 2px #ff6b35,
            0 -2px #1a1a1a
          `
          : "none",
      }}
    >
      {glitchText}
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-primary-500 opacity-80"
            style={{
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            }}
          >
            {glitchText}
          </span>
          <span
            className="absolute top-0 left-0 text-secondary-900 opacity-80"
            style={{
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
              clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
            }}
          >
            {glitchText}
          </span>
        </>
      )}
    </span>
  )
}
