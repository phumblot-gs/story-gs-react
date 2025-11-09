import React from "react"
import { cn } from "@/lib/utils"

export interface SuccessAnimationProps {
  color: string
  bgColor?: string
  duration?: number
  checkDelay?: number
  className?: string
}

/**
 * Success animation with badge and checkmark
 * 
 * Displays an animated badge with a checkmark that appears after the contour animation.
 */
export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  color = "white",
  bgColor = "var(--color-green)",
  duration = 0.8,
  checkDelay = 0.8,
  className,
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  }

  return (
    <div
      style={containerStyle}
      className={cn("w-full h-full", className)}
    >
      <svg
        className="w-2/3 h-2/3"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: "translate(2%, 2%)",
        }}
      >
        <g clipPath="url(#clip0_2506_9549)">
          {/* Contour du badge */}
          <path
            d="M10.65 3.9L9.29999 3.03L9.21999 1.43L7.61999 1.35L6.74999 0L5.31999 0.73L3.88999 0L3.01999 1.35L1.41999 1.43L1.33999 3.03L-0.0100098 3.9L0.71999 5.33L-0.0100098 6.76L1.33999 7.63L1.41999 9.23L3.01999 9.31L3.88999 10.66L5.31999 9.93L6.74999 10.66L7.61999 9.31L9.21999 9.23L9.29999 7.63L10.65 6.76L9.91999 5.33L10.65 3.9ZM9.99999 6.58L8.81999 7.34L8.74999 8.75L7.33999 8.82L6.57999 10L5.32999 9.36L4.07999 10L3.31999 8.82L1.90999 8.75L1.83999 7.34L0.65999 6.58L1.29999 5.33L0.65999 4.08L1.83999 3.32L1.90999 1.91L3.31999 1.84L4.07999 0.66L5.32999 1.3L6.57999 0.66L7.33999 1.84L8.74999 1.91L8.81999 3.32L9.99999 4.08L9.35999 5.33L9.99999 6.58Z"
            fill={color}
            stroke={color}
            strokeWidth="0.3"
            strokeDasharray="50"
            strokeDashoffset="50"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="50"
              to="0"
              dur={`${duration}s`}
              fill="freeze"
            />
          </path>

          {/* Coche intérieure */}
          <path
            d="M6.95998 4.04L4.91998 6.08L3.68998 4.85C3.58998 4.75 3.42998 4.75 3.33998 4.85C3.24998 4.95 3.23998 5.11 3.33998 5.2L4.74998 6.61C4.74998 6.61 4.85998 6.68 4.92998 6.68C4.99998 6.68 5.05998 6.66 5.10998 6.61L7.31998 4.4C7.41998 4.3 7.41998 4.14 7.31998 4.05C7.21998 3.96 7.05998 3.95 6.96998 4.05L6.95998 4.04Z"
            fill={color}
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              begin={`${checkDelay}s`}
              dur="0.3s"
              fill="freeze"
            />
          </path>
        </g>
        <defs>
          <clipPath id="clip0_2506_9549">
            <rect width="10.65" height="10.65" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

SuccessAnimation.displayName = "SuccessAnimation"

