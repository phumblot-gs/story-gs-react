import type { Meta, StoryObj } from "@storybook/react"
import { Animated } from "./Animated"
import { Layout } from "@/components/layout/Layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Animated> = {
  title: "UI/Animated",
  component: Animated,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Le composant \`Animated\` permet d'afficher des animations pour illustrer le comportement de l'application.
Similaire au composant \`Icon\`, mais pour les animations.

## Features

- **Système de noms** : Utilise une prop \`name\` pour sélectionner l'animation, similaire aux \`Icon\`
- **Personnalisation** : Contrôle de la taille, des couleurs et du timing des animations
- **Réutilisable** : Structure extensible pour ajouter facilement de nouvelles animations

## Animations disponibles

- \`success\` : Animation de succès avec badge et coche

## Usage

\`\`\`tsx
// Animation de succès par défaut
<Animated name="success" />

// Avec taille personnalisée
<Animated name="success" size={60} />

// Avec couleurs personnalisées
<Animated name="success" size={60} color="white" bgColor="#2196F3" />

// Avec timing personnalisé
<Animated 
  name="success" 
  size={80} 
  duration={1.2} 
  checkDelay={1.0} 
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: ["success"],
      description: "Nom de l'animation à afficher",
      table: {
        type: { summary: "AnimatedName" },
        defaultValue: { summary: "success" },
      },
    },
    size: {
      control: { type: "number", min: 20, max: 200, step: 4 },
      description: "Taille de l'animation en pixels",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "44" },
      },
    },
    color: {
      control: "color",
      description: "Couleur du badge/icône",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "white" },
      },
    },
    bgColor: {
      control: "color",
      description: "Couleur de fond du cercle",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "#4CAF50 (pour success)" },
      },
    },
    duration: {
      control: { type: "number", min: 0.1, max: 3, step: 0.1 },
      description: "Durée de l'animation du badge en secondes",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0.8" },
      },
    },
    checkDelay: {
      control: { type: "number", min: 0, max: 3, step: 0.1 },
      description: "Délai avant l'apparition de la coche en secondes",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0.8" },
      },
    },
    className: {
      control: "text",
      description: "Classes CSS Tailwind additionnelles",
    },
    debug: {
      control: "boolean",
      description: "Mode debug : affiche un border rose et log les clics",
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Animated>

/**
 * Animation de succès par défaut avec les valeurs standard.
 */
export const Default: Story = {
  args: {
    name: "success",
    size: 44,
    color: "white",
    bgColor: "#4CAF50",
    duration: 0.8,
    checkDelay: 0.8,
  },
}

/**
 * Différentes tailles d'animation de succès.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" size={32} />
        <span className="text-xs text-grey-strongest">32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" size={44} />
        <span className="text-xs text-grey-strongest">44px (défaut)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" size={60} />
        <span className="text-xs text-grey-strongest">60px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" size={80} />
        <span className="text-xs text-grey-strongest">80px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" size={100} />
        <span className="text-xs text-grey-strongest">100px</span>
      </div>
    </div>
  ),
}

/**
 * Différentes variantes de couleurs pour l'animation de succès.
 */
export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Succès (vert)</h3>
        <Animated name="success" size={60} color="white" bgColor="#4CAF50" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Info (bleu)</h3>
        <Animated name="success" size={60} color="white" bgColor="#2196F3" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Warning (orange)</h3>
        <Animated name="success" size={60} color="white" bgColor="#FF9800" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Violet/Or</h3>
        <Animated name="success" size={60} color="#FFD700" bgColor="#764ba2" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Dark/Or</h3>
        <Animated name="success" size={60} color="#FFD700" bgColor="#333333" />
      </div>
    </div>
  ),
}

/**
 * Animation avec timing personnalisé.
 */
export const CustomTiming: Story = {
  render: () => {
    const [key, setKey] = useState(0)

    const restart = () => {
      setKey((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <Animated
          key={key}
          name="success"
          size={80}
          duration={1.2}
          checkDelay={1.0}
        />
        <Button onClick={restart} variant="secondary" size="small">
          Rejouer l'animation
        </Button>
      </div>
    )
  },
}

/**
 * Animation rapide et lente pour comparer les timings.
 */
export const TimingComparison: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Rapide</h3>
        <Animated name="success" size={60} duration={0.4} checkDelay={0.4} />
        <p className="text-xs text-grey-strongest mt-2">
          duration: 0.4s
          <br />
          checkDelay: 0.4s
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Normal</h3>
        <Animated name="success" size={60} duration={0.8} checkDelay={0.8} />
        <p className="text-xs text-grey-strongest mt-2">
          duration: 0.8s
          <br />
          checkDelay: 0.8s
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Lent</h3>
        <Animated name="success" size={60} duration={1.5} checkDelay={1.5} />
        <p className="text-xs text-grey-strongest mt-2">
          duration: 1.5s
          <br />
          checkDelay: 1.5s
        </p>
      </div>
    </div>
  ),
}

/**
 * Animation sur différents fonds pour tester la visibilité.
 */
export const AllBackgrounds: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">White Background</h3>
        <Layout bg="white" padding={6}>
          <div className="flex items-center gap-4">
            <Animated name="success" size={60} />
            <Animated name="success" size={60} bgColor="#2196F3" />
            <Animated name="success" size={60} bgColor="#FF9800" />
          </div>
        </Layout>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <div className="flex items-center gap-4">
            <Animated name="success" size={60} />
            <Animated name="success" size={60} bgColor="#2196F3" />
            <Animated name="success" size={60} bgColor="#FF9800" />
          </div>
        </Layout>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Black Background</h3>
        <Layout bg="black" padding={6}>
          <div className="flex items-center gap-4">
            <Animated name="success" size={60} />
            <Animated name="success" size={60} bgColor="#2196F3" />
            <Animated name="success" size={60} bgColor="#FF9800" />
          </div>
        </Layout>
      </div>
    </div>
  ),
}

/**
 * Mode debug activé pour voir les interactions.
 */
export const DebugMode: Story = {
  args: {
    name: "success",
    size: 60,
    debug: true,
  },
}

