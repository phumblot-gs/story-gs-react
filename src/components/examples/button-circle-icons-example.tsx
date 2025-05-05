
import React from "react"
import { ButtonCircle } from "@/components/ui/button-circle"
import { Card, CardContent } from "@/components/ui/card"

const ButtonCircleIconsExample = () => {
  // Liste des pictogrammes fournis par l'utilisateur, à afficher en premier
  const userProvidedIcons = ["Tag", "Bell", "Check", "Plus", "Minus", "X", "Mail", "Heart", "Star", "Info", "AlertCircle", "Calendar", "Clock", "Pencil", "Sort", "Help", "Logout", "Filter", "Settings", "User", "Status", "Urgent"]
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pictogrammes disponibles pour ButtonCircle</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Pictogrammes fournis</h3>
          <div className="flex flex-wrap gap-4">
            {userProvidedIcons.map((icon) => (
              <div key={icon} className="flex flex-col items-center gap-2">
                <ButtonCircle icon={icon as any} />
                <span className="text-xs text-muted-foreground">{icon}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-4">Pictogrammes disponibles en taille large</h3>
          <div className="flex flex-wrap gap-4">
            {userProvidedIcons.map((icon) => (
              <div key={`large-${icon}`} className="flex flex-col items-center gap-2">
                <ButtonCircle size="large" icon={icon as any} />
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
                <ButtonCircle size="small" icon={icon as any} />
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
                <ButtonCircle icon={icon as any} indicator={true} />
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
                <ButtonCircle background="black" icon={icon as any} />
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
