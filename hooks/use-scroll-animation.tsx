"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  delay = 0,
}: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true)
              setHasTriggered(true)
            }, delay)
          } else {
            setIsVisible(true)
            setHasTriggered(true)
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered])

  return { elementRef, isVisible }
}
