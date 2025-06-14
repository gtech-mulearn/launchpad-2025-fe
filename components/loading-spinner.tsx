"use client"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-primary-500/20 rounded-full animate-spin`}
          style={{
            borderTopColor: "#FF6B35",
            animationDuration: "1s",
          }}
        />

        {/* Inner ring */}
        <div
          className={`absolute inset-2 border-2 border-transparent rounded-full animate-spin`}
          style={{
            borderRightColor: "#FF6B35",
            borderBottomColor: "#FF6B35",
            animationDuration: "0.75s",
            animationDirection: "reverse",
          }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
      </div>

      {text && (
        <div className="text-center">
          <p className={`text-white font-medium uppercase tracking-widest ${textSizeClasses[size]}`}>{text}</p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  )
}
