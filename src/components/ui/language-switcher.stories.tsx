
import type { Meta, StoryObj } from "@storybook/react"
import { LanguageSwitcher } from "./language-switcher"
import { useState } from "react"

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
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the language switcher",
    },
  },
}

export default meta
type Story = StoryObj<typeof LanguageSwitcher>

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
