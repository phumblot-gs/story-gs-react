
import React, { useState } from "react"
import { ButtonCircle } from "@/components/ui/button-circle"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { IconProvider } from "@/components/ui/icon-provider"

export type Language = {
  code: string
  name: string
}

export interface LanguageSwitcherProps {
  languages: Language[]
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
  className?: string
  disabled?: boolean
  debug?: boolean
}

export const LanguageSwitcher = ({
  languages,
  currentLanguage,
  onLanguageChange,
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

  return (
    <Popover open={disabled ? false : isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          <ButtonCircle
            className={className}
            disabled={disabled}
            background="white"
            size="large"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            data-active={isOpen}
            style={{
              backgroundColor: isOpen ? "var(--text-blue-primary, #CDEDFF)" : undefined
            }}
          >
            {isOpen ? (
              <IconProvider 
                icon="X" 
                className="text-black" // Always keep the X icon black
                size={12}
              />
            ) : (
              <span className="text-xs">{currentLanguage.code}</span>
            )}
          </ButtonCircle>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[136px] p-0 bg-[#292828] border-0 rounded-[2px]" 
        align="end"
        sideOffset={10}
      >
        <div className="flex flex-col w-full p-[10px] gap-[10px]">
          {languages.map((language) => (
            <button
              key={language.code}
              className={cn(
                "w-full px-4 py-2 text-white text-left hover:bg-white hover:text-black active:bg-blue-primary active:text-black text-sm whitespace-nowrap",
                currentLanguage.code === language.code ? "bg-grey-strongest" : "bg-grey-strongest/90"
              )}
              onClick={() => handleSelect(language)}
            >
              {language.code} - {language.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
