
import React from "react"
import { Button } from "@/components/ui/button-default"
import { ButtonSmall } from "@/index" // Import ButtonSmall from index instead of non-existent file
import { ButtonCircle } from "@/components/ui/button-circle"

const ButtonVariantsExample = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Button Variants</h2>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Button Small</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">White Background</span>
            <ButtonSmall background="white">Small button</ButtonSmall>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <ButtonSmall background="black">Small button</ButtonSmall>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <ButtonSmall background="grey">Small button</ButtonSmall>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Button Circle with Icons</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">White Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="white" icon="Plus" />
              <ButtonCircle background="white" icon="Minus" />
              <ButtonCircle background="white" icon="Check" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="black" icon="Plus" />
              <ButtonCircle background="black" icon="Minus" />
              <ButtonCircle background="black" icon="Check" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="grey" icon="Plus" />
              <ButtonCircle background="grey" icon="Minus" />
              <ButtonCircle background="grey" icon="Check" />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Button Circle with Letters</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">White Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="white" letter="A" />
              <ButtonCircle background="white" letter="B" />
              <ButtonCircle background="white" letter="C" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="black" letter="A" />
              <ButtonCircle background="black" letter="B" />
              <ButtonCircle background="black" letter="C" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="grey" letter="A" />
              <ButtonCircle background="grey" letter="B" />
              <ButtonCircle background="grey" letter="C" />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Small Button Circles</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">White Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="white" size="small" icon="Plus" />
              <ButtonCircle background="white" size="small" letter="A" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="black" size="small" icon="Plus" />
              <ButtonCircle background="black" size="small" letter="A" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <div className="flex gap-4">
              <ButtonCircle background="grey" size="small" icon="Plus" />
              <ButtonCircle background="grey" size="small" letter="A" />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Buttons with Indicators</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2">
            <ButtonSmall indicator={true}>Small button</ButtonSmall>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <ButtonCircle icon="Bell" indicator={true} />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <ButtonCircle letter="N" indicator={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonVariantsExample
