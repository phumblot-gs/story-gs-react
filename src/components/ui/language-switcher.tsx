
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
}

export const LanguageSwitcher = ({
  languages,
  currentLanguage,
  onLanguageChange,
  className,
  disabled = false,
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (language: Language) => {
    onLanguageChange(language)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          <ButtonCircle
            className={className}
            disabled={disabled}
            background="white"
            size="large"
            onClick={() => setIsOpen(!isOpen)}
            data-active={isOpen}
            style={{
              backgroundColor: isOpen ? "var(--text-blue-primary, #CDEDFF)" : undefined
            }}
          >
            {isOpen ? (
              <IconProvider 
                icon="X" 
                className="hover:text-blue" 
                size={12}
              />
            ) : (
              <span style={{ fontSize: '11px' }} className="font-normal">{currentLanguage.code}</span>
            )}
          </ButtonCircle>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[136px] p-0 bg-[#292828] border-0 rounded-[2px]" 
        align="end"
        sideOffset={10}
      >
        <div className="flex flex-col w-full">
          {languages.map((language) => (
            <button
              key={language.code}
              className={cn(
                "w-full p-4 text-white text-left hover:bg-white hover:text-black active:bg-blue-primary active:text-black",
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
