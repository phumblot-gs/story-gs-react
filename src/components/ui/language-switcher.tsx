
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
  size = "medium",
  className,
  disabled = false,
  debug = false,
}: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Debug: vérifier que currentLanguage existe
  React.useEffect(() => {
    if (debug) {
      console.log("[LanguageSwitcher] currentLanguage:", currentLanguage)
      console.log("[LanguageSwitcher] currentLanguage?.code:", currentLanguage?.code)
    }
  }, [debug, currentLanguage])

  const handleSelect = (language: Language) => {
    if (debug) {
      console.log(`LanguageSwitcher: Language changed from ${currentLanguage.code} to ${language.code}`);
    }
    onLanguageChange(language)
    setIsOpen(false)
  }

  // Déterminer les dimensions du bouton selon le size
  // Pour les boutons icône uniquement :
  // - small: p-1 w-4 h-4 + icon size={10}
  // - medium: p-0 w-6 h-6 + icon size={14}
  // - large: p-0 w-8 h-8 + icon size={14}
  const buttonSizeClasses = size === "small" ? "p-1 w-4 h-4" : size === "large" ? "p-0 w-8 h-8" : "p-0 w-6 h-6"
  const iconSize = size === "small" ? 10 : 14

  // Vérification de sécurité pour currentLanguage et extraction du code
  const languageCode = currentLanguage?.code
  const isValidLanguage = currentLanguage && 
    languageCode && 
    typeof languageCode === "string" && 
    languageCode.trim().length > 0
  
  // Debug: log détaillé pour comprendre le problème
  React.useEffect(() => {
    if (debug) {
      console.log("[LanguageSwitcher] Render check:", {
        currentLanguage,
        languageCode,
        isValidLanguage,
        codeType: typeof languageCode,
        codeLength: languageCode?.length,
        codeTrimmed: languageCode?.trim(),
        codeTrimmedLength: languageCode?.trim()?.length,
        currentLanguageKeys: currentLanguage ? Object.keys(currentLanguage) : []
      })
    }
  }, [debug, currentLanguage, languageCode, isValidLanguage])
  
  if (!isValidLanguage) {
    if (debug) {
      console.warn("[LanguageSwitcher] currentLanguage is missing or invalid - returning null:", {
        currentLanguage,
        code: currentLanguage?.code,
        codeType: typeof currentLanguage?.code,
        codeLength: currentLanguage?.code?.length,
        type: typeof currentLanguage,
        keys: currentLanguage ? Object.keys(currentLanguage) : []
      })
    }
    return null
  }

  // Contenu du bouton avec vérification supplémentaire
  const buttonContent = isOpen ? (
    <Icon name="X" size={iconSize} />
  ) : (
    languageCode && languageCode.trim().length > 0 ? (
      <span className={size === "small" ? "text-[9px]" : "text-xs"}>
        {languageCode}
      </span>
    ) : (
      debug && (
        <span className={size === "small" ? "text-[9px] text-red-500" : "text-xs text-red-500"}>
          {"?"}
        </span>
      )
    )
  )

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
          asChild={false}
        >
          {buttonContent}
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
