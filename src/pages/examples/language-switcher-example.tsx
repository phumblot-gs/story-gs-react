
import React, { useState } from "react"
import { LanguageSwitcher, type Language } from "@/components/ui/language-switcher"

const languages: Language[] = [
  { code: "EN", name: "English" },
  { code: "FR", name: "Français" },
]

export const LanguageSwitcherExample: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[1]) // Default to French
  
  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    console.log(`Language changed to: ${language.code} - ${language.name}`)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-10">
      <div className="flex items-center gap-4">
        <span className="text-sm">Current Language:</span>
        <LanguageSwitcher
          languages={languages}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          debug={true}
        />
      </div>
      
      <div className="mt-8 p-6 border rounded w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Sample Content in {currentLanguage.name}</h2>
        <p>
          {currentLanguage.code === "EN" && "This is sample content in English."}
          {currentLanguage.code === "FR" && "Ceci est un exemple de contenu en Français."}
        </p>
      </div>
    </div>
  )
}

export default LanguageSwitcherExample
