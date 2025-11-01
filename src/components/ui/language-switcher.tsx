
import React, { useState } from "react"
import { Button, ButtonSize } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { VStack } from "@/components/layout"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type Language = {
  code: string
  name: string
}

export interface LanguageSwitcherProps {
  languages: Language[]
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
  size?: ButtonSize
  className?: string
  disabled?: boolean
  debug?: boolean
}

export const LanguageSwitcher = ({
  languages,
  currentLanguage,
  onLanguageChange,
  size = "large",
  className,
  disabled = false,
  debug = false,
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (language: Language) => {
    if (debug) {
      console.log(`LanguageSwitcher: Language changed from ${currentLanguage.code} to ${language.code}`);
    }
    onLanguageChange(language)
    setIsOpen(false)
  }

  // Déterminer les dimensions du bouton selon le size
  const buttonSizeClasses = size === "small" ? "p-1 w-4 h-4" : "p-0 w-6 h-6"
  const iconSize = size === "small" ? 8 : 12

  return (
    <Popover open={disabled ? false : isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className={cn(
            buttonSizeClasses,
            "rounded-full",
            isOpen && "!bg-blue-primary !text-black",
            className
          )}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          data-active={isOpen}
        >
          {isOpen ? (
            <Icon name="X" size={iconSize} />
          ) : (
            <span className={size === "small" ? "text-[9px]" : "text-xs"}>{currentLanguage.code}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[136px] p-0 bg-black border-0 rounded-sm"
        align="end"
        sideOffset={10}
      >
        <VStack gap={2} padding={2}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={cn(
                "w-full px-4 py-2 text-white text-left hover:bg-white hover:text-black active:bg-blue-primary active:text-black text-sm whitespace-nowrap rounded-sm",
                currentLanguage.code === language.code ? "bg-grey-strongest" : "bg-grey-strongest/90"
              )}
              onClick={() => handleSelect(language)}
            >
              {language.code} - {language.name}
            </button>
          ))}
        </VStack>
      </PopoverContent>
    </Popover>
  )
}
