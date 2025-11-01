
import React from "react"
import { Button } from "@/components/ui/button"
import { IconProvider } from "@/components/ui/icon-provider"
import { Card, CardContent } from "@/components/ui/card"
import { IconName } from "@/components/ui/icons/types"

const ButtonCircleIconsExample = () => {
  // Liste des pictogrammes fournis par l'utilisateur, à afficher en premier
  const userProvidedIcons = ["Tag", "Bell", "Check", "Plus", "Minus", "X", "Mail", "Heart", "Star", "Info", "AlertCircle", "Calendar", "Clock", "Pencil", "Sort", "Help", "Logout", "Filter", "Settings", "User", "Status", "Urgent", "Vedette", "Comment", "Alert", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pictogrammes disponibles pour Button</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Pictogrammes fournis</h3>
          <div className="flex flex-wrap gap-4">
            {userProvidedIcons.map((icon) => (
              <div key={icon} className="flex flex-col items-center gap-2">
                <Button className="p-0 w-6 h-6"><IconProvider icon={icon as IconName} /></Button>
                <span className="text-xs text-muted-foreground">{icon}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-4">Pictogrammes disponibles en taille medium</h3>
          <div className="flex flex-wrap gap-4">
            {userProvidedIcons.map((icon) => (
              <div key={`medium-${icon}`} className="flex flex-col items-center gap-2">
                <Button className="p-0 w-6 h-6"><IconProvider icon={icon as IconName} /></Button>
                <span className="text-xs text-muted-foreground">{icon}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Pictogrammes disponibles en taille small</h3>
          <div className="flex flex-wrap gap-4">
            {userProvidedIcons.map((icon) => (
              <div key={`small-${icon}`} className="flex flex-col items-center gap-2">
                <Button className="p-1 w-4 h-4"><IconProvider icon={icon as IconName} /></Button>
                <span className="text-xs text-muted-foreground">{icon}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Variations avec indicateur</h3>
          <div className="flex flex-wrap gap-4">
            {userProvidedIcons.slice(0, 6).map((icon) => (
              <div key={`indicator-${icon}`} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Button className="p-0 w-6 h-6"><IconProvider icon={icon as IconName} /></Button>
                  <span className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow" />
                </div>
                <span className="text-xs text-muted-foreground">{icon} + indicator</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Variations sur fond noir</h3>
          <div className="bg-black p-6 rounded-md flex flex-wrap gap-4">
            {userProvidedIcons.slice(0, 6).map((icon) => (
              <div key={`black-${icon}`} className="flex flex-col items-center gap-2">
                <Button className="p-0 w-6 h-6"><IconProvider icon={icon as IconName} /></Button>
                <span className="text-xs text-white">{icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonCircleIconsExample
