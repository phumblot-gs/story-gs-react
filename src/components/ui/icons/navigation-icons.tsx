
import React from "react"
import { CustomIconProps } from "./types"

export const CustomArrowRightIcon: React.FC<CustomIconProps> = ({ size = 12, strokeWidth = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.83247 0.784454L7.05371 4.99432L2.83247 9.21555" stroke="currentColor" strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
)

export const CustomArrowLeftIcon: React.FC<CustomIconProps> = ({ size = 12, strokeWidth = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.16753 0.784454L2.94629 4.99432L7.16753 9.21555" stroke="currentColor" strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
)

export const CustomArrowUpIcon: React.FC<CustomIconProps> = ({ size = 12, strokeWidth = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 10 6" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.784424 5.1675L4.99429 0.946259L9.21552 5.1675" stroke="currentColor" strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
)

export const CustomArrowDownIcon: React.FC<CustomIconProps> = ({ size = 12, strokeWidth = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 10 6" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.784424 0.832489L4.99429 5.04235L9.21552 0.832489" stroke="currentColor" strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round"/>
  </svg>
)
