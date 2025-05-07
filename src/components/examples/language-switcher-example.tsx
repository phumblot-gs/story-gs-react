
import React, { useState } from "react"
import { LanguageSwitcher, type Language } from "@/components/ui/language-switcher"

const languages: Language[] = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "FR", name: "Français" },
  { code: "IT", name: "Italiano" },
]

export const LanguageSwitcherExample: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[2]) // Default to French
  
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
        />
      </div>
      
      <div className="mt-8 p-6 border rounded w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Sample Content in {currentLanguage.name}</h2>
        <p>
          {currentLanguage.code === "EN" && "This is sample content in English."}
          {currentLanguage.code === "ES" && "Este es un contenido de muestra en Español."}
          {currentLanguage.code === "FR" && "Ceci est un exemple de contenu en Français."}
          {currentLanguage.code === "IT" && "Questo è un contenuto di esempio in Italiano."}
        </p>
      </div>
    </div>
  )
}

export default LanguageSwitcherExample
