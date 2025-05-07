
import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  logo?: string;
  width?: number;
  height?: number;
  className?: string;
}

// Helper to check if a string is an SVG
const isSvgString = (str?: string): boolean => {
  return !!str && str.trim().startsWith("<svg");
};

// Helper to check if a string is a URL
const isImageUrl = (str?: string): boolean => {
  if (!str) return false;
  const trimmed = str.trim().toLowerCase();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.endsWith(".jpg") ||
    trimmed.endsWith(".jpeg") ||
    trimmed.endsWith(".png") ||
    trimmed.endsWith(".gif") ||
    trimmed.endsWith(".webp") ||
    trimmed.endsWith(".svg")
  );
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  logo,
  width = 25,
  height = 14,
  className
}) => {
  // Default SVG logo
  const DEFAULT_SVG_LOGO = `<svg width="25" height="14" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.32271 0.519775C4.47411 0.519775 0.784544 3.41519 0.106003 6.96598C-0.233268 8.7267 0.212025 10.37 1.33586 11.6123C2.43849 12.8253 4.07123 13.4904 5.93722 13.4904C7.50634 13.4904 9.07547 13.0209 10.475 12.1405C10.581 12.0819 10.6446 11.9743 10.6658 11.8667L11.4186 7.93437L10.4219 8.7267L9.87063 11.6123C8.66198 12.3362 7.3155 12.7177 5.99023 12.7177C4.36809 12.7177 2.94739 12.1405 1.9932 11.0939C1.01779 10.0179 0.636113 8.57997 0.932975 7.04423C1.5479 3.87493 4.83459 1.29254 8.2697 1.29254C9.62678 1.29254 10.8354 1.69359 11.7578 2.43701L12.1077 2.72068L12.2773 1.80119L12.1607 1.71315C11.1217 0.940392 9.78582 0.519775 8.32271 0.519775Z" fill="#292828"/>
    <path d="M15.4369 4.39315C14.9598 6.85816 17.4513 7.65049 19.2643 8.22761C20.7168 8.68736 21.7346 9.05907 21.6285 9.60685C21.5119 10.2231 20.4835 10.898 19.19 10.898C18.204 10.898 17.3134 10.585 16.6667 10.0079L14.3342 11.8567L14.4933 12.0132C15.5641 12.9718 17.059 13.5 18.6917 13.5C21.4483 13.5 24.0246 11.7588 24.4381 9.60685C24.9152 7.13205 22.4237 6.33973 20.6107 5.7626C19.1688 5.30286 18.151 4.93115 18.257 4.39315C18.3737 3.7769 19.4021 3.10196 20.6956 3.10196H24.5123L25.0106 0.509781H21.1939C18.4373 0.509781 15.8609 2.25094 15.4475 4.40293L15.4369 4.39315Z" fill="#292828"/>
  </svg>`;
  
  if (!logo) {
    // Render default SVG
    return (
      <div 
        className={cn("flex items-center justify-center", className)}
        style={{ width, height }}
        dangerouslySetInnerHTML={{ __html: DEFAULT_SVG_LOGO }}
      />
    );
  }
  
  if (isSvgString(logo)) {
    // Render provided SVG string
    return (
      <div 
        className={cn("flex items-center justify-center", className)}
        style={{ width, height }}
        dangerouslySetInnerHTML={{ __html: logo }}
      />
    );
  }
  
  if (isImageUrl(logo)) {
    // Render image from URL
    return (
      <img 
        src={logo} 
        alt="Brand Logo" 
        className={cn("object-contain", className)}
        style={{ width, height }}
      />
    );
  }
  
  // Fallback to default SVG if format is unknown
  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: DEFAULT_SVG_LOGO }}
    />
  );
};

export default BrandLogo;
