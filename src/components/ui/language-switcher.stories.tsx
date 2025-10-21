
import type { Meta, StoryObj } from "@storybook/react"
import { LanguageSwitcher } from "./language-switcher"
import { useState, useEffect } from "react"

const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "FR", name: "Français" },
  { code: "IT", name: "Italiano" },
]

const meta: Meta<typeof LanguageSwitcher> = {
  title: "UI/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A language switcher component that allows users to change the application language.

## Features
- Supports multiple languages
- Can detect browser language
- Can store selected language in localStorage
- Customizable styling
- Disabled state
- Debug mode for development

## Usage Example with Browser Detection and LocalStorage

\`\`\`tsx
import { useEffect, useState } from 'react';
import { LanguageSwitcher, type Language } from './language-switcher';

const languages: Language[] = [
  { code: "EN", name: "English" },
  { code: "FR", name: "Français" },
];

export const MyLanguageSwitcher = () => {
  // Function to get the initial language based on browser preference or localStorage
  const getInitialLanguage = (): Language => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const parsedLanguage = JSON.parse(savedLanguage);
      // Validate the saved language is in our supported languages
      if (languages.some(lang => lang.code === parsedLanguage.code)) {
        return parsedLanguage;
      }
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    const matchedLanguage = languages.find(lang => 
      lang.code === browserLang
    );
    
    // Return matched language or default to first language
    return matchedLanguage || languages[0];
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  
  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // Store in localStorage
    localStorage.setItem('preferredLanguage', JSON.stringify(language));
    console.log(\`Language changed to: \${language.code} - \${language.name}\`);
  };

  return (
    <LanguageSwitcher
      languages={languages}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
      debug={true}
    />
  );
};
\`\`\`
`
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "large"],
      description: "Taille du bouton (small: w-4 h-4, large: w-6 h-6)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the language switcher",
    },
    debug: {
      control: "boolean",
      description: "Enables debug logging to the console",
    },
    className: {
      control: "text",
      description: "Classes CSS Tailwind additionnelles",
    },
    languages: {
      description: "Array of language options",
    },
    currentLanguage: {
      description: "The currently selected language",
    },
    onLanguageChange: {
      description: "Callback function triggered when a language is selected",
    },
  },
}

export default meta
type Story = StoryObj<typeof LanguageSwitcher>

// Simple example template
const LanguageSwitcherTemplate = (args: any) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[2]) // Default to French
  
  return (
    <div className="p-12 flex flex-col items-center gap-10">
      <LanguageSwitcher 
        {...args}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      <div className="mt-8 p-4 border rounded">
        Current Language: {currentLanguage.code} - {currentLanguage.name}
      </div>
    </div>
  )
}

// Example with browser detection and localStorage
const LanguageSwitcherWithBrowserDetection = (args: any) => {
  // Function to get the initial language based on browser preference or localStorage
  const getInitialLanguage = (): typeof LANGUAGES[0] => {
    // Check if we're in a browser environment (important for Storybook)
    if (typeof window === 'undefined') {
      return LANGUAGES[0];
    }
    
    // Check localStorage first
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      try {
        const parsedLanguage = JSON.parse(savedLanguage);
        // Validate the saved language is in our supported languages
        if (LANGUAGES.some(lang => lang.code === parsedLanguage.code)) {
          return parsedLanguage;
        }
      } catch (e) {
        console.error('Error parsing language from localStorage', e);
      }
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    const matchedLanguage = LANGUAGES.find(lang => lang.code === browserLang);
    
    // Return matched language or default to English
    return matchedLanguage || LANGUAGES[0];
  };

  const [currentLanguage, setCurrentLanguage] = useState(() => getInitialLanguage());
  
  const handleLanguageChange = (language: typeof LANGUAGES[0]) => {
    setCurrentLanguage(language);
    // Store in localStorage
    localStorage.setItem('preferredLanguage', JSON.stringify(language));
  };

  return (
    <div className="p-12 flex flex-col items-center gap-10">
      <LanguageSwitcher 
        {...args}
        languages={LANGUAGES}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        debug={true}
      />
      <div className="mt-8 p-4 border rounded flex flex-col gap-2">
        <div>Current Language: {currentLanguage.code} - {currentLanguage.name}</div>
        <div className="text-sm text-gray-500">
          (Your selection will be stored in localStorage)
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <LanguageSwitcherTemplate {...args} />,
  args: {
    languages: LANGUAGES,
  },
}

export const Disabled: Story = {
  render: (args) => <LanguageSwitcherTemplate {...args} />,
  args: {
    languages: LANGUAGES,
    disabled: true,
  },
}

export const WithFewLanguages: Story = {
  render: (args) => <LanguageSwitcherTemplate {...args} />,
  args: {
    languages: LANGUAGES.slice(0, 2), // Only English and Spanish
  },
}

export const WithBrowserDetectionAndStorage: Story = {
  render: (args) => <LanguageSwitcherWithBrowserDetection {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'This example demonstrates browser language detection and localStorage persistence.'
      }
    }
  }
}
