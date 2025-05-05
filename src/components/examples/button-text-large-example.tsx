
import React from "react"
import { ButtonTextLarge } from "@/components/ui/button-text-large"

const ButtonTextLargeExample = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Button Text Large Component</h2>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Variants</h3>
        <div className="grid grid-cols-6 gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Primary</span>
            <ButtonTextLarge variant="primary">Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Black</span>
            <ButtonTextLarge variant="black">Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Blue</span>
            <ButtonTextLarge variant="blue">Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Grey</span>
            <ButtonTextLarge variant="grey">Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Secondary</span>
            <ButtonTextLarge variant="secondary">Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Disabled</span>
            <ButtonTextLarge disabled>Simple button</ButtonTextLarge>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">With Indicators</h3>
        <div className="grid grid-cols-6 gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Primary</span>
            <ButtonTextLarge variant="primary" indicator={true}>Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Black</span>
            <ButtonTextLarge variant="black" indicator={true}>Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Blue</span>
            <ButtonTextLarge variant="blue" indicator={true}>Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Grey</span>
            <ButtonTextLarge variant="grey" indicator={true}>Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Secondary</span>
            <ButtonTextLarge variant="secondary" indicator={true}>Simple button</ButtonTextLarge>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Disabled</span>
            <ButtonTextLarge disabled indicator={true}>Simple button</ButtonTextLarge>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Background Adaptive</h3>
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">White Background</h4>
            <div className="flex gap-4">
              <ButtonTextLarge background="white">Simple button</ButtonTextLarge>
              <ButtonTextLarge background="white" indicator={true}>Simple button</ButtonTextLarge>
            </div>
          </div>
          
          <div className="bg-black p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4 text-white">Black Background</h4>
            <div className="flex gap-4">
              <ButtonTextLarge background="black">Simple button</ButtonTextLarge>
              <ButtonTextLarge background="black" indicator={true}>Simple button</ButtonTextLarge>
            </div>
          </div>
          
          <div className="bg-grey p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">Grey Background</h4>
            <div className="flex gap-4">
              <ButtonTextLarge background="grey">Simple button</ButtonTextLarge>
              <ButtonTextLarge background="grey" indicator={true}>Simple button</ButtonTextLarge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonTextLargeExample
