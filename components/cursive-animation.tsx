"use client"

import { useEffect, useState } from "react"

interface CursiveAnimationProps {
  text: string
  className?: string
  speed?: number
  showCursor?: boolean
  onComplete?: () => void
}

export function CursiveAnimation({
  text,
  className = "",
  speed = 100,
  showCursor = true,
  onComplete,
}: CursiveAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  return (
    <div className={`relative inline-block ${className}`}>
      <span
        className="font-cursive text-primary-500"
        style={{
          fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
          textShadow: "0 0 10px rgba(255, 107, 53, 0.3)",
        }}
      >
        {displayedText}
      </span>
      {showCursor && !isComplete && (
        <span
          className="inline-block w-0.5 h-6 bg-primary-500 ml-1 animate-pulse"
          style={{
            animation: "blink 1s infinite",
          }}
        />
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
