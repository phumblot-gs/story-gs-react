
import React from "react"
import { ButtonTextLarge } from "@/components/ui/button-text-large"

const ButtonTextLargeExample = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Button Text Large Component</h2>
      
      <div className="grid grid-cols-6 gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Primary</span>
          <ButtonTextLarge variant="primary">1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Black</span>
          <ButtonTextLarge variant="black">1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Blue</span>
          <ButtonTextLarge variant="blue">1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Grey</span>
          <ButtonTextLarge variant="grey">1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Secondary</span>
          <ButtonTextLarge variant="secondary">1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Disabled</span>
          <ButtonTextLarge disabled>1</ButtonTextLarge>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mt-8 mb-4">With Indicators</h3>
      <div className="grid grid-cols-6 gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Primary</span>
          <ButtonTextLarge variant="primary" indicator={1}>1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Black</span>
          <ButtonTextLarge variant="black" indicator={1}>1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Blue</span>
          <ButtonTextLarge variant="blue" indicator={1}>1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Grey</span>
          <ButtonTextLarge variant="grey" indicator={1}>1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Secondary</span>
          <ButtonTextLarge variant="secondary" indicator={1}>1</ButtonTextLarge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Disabled</span>
          <ButtonTextLarge disabled indicator={1}>1</ButtonTextLarge>
        </div>
      </div>
    </div>
  )
}

export default ButtonTextLargeExample
