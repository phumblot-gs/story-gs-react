
import React from "react"
import { Button } from "@/components/ui/button"
import { IconProvider } from "@/components/ui/icon-provider"
import { ButtonSmall } from "@/index"

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
              <Button className="p-0 w-6 h-6"><IconProvider icon="Plus" /></Button>
              <Button className="p-0 w-6 h-6"><IconProvider icon="Minus" /></Button>
              <Button className="p-0 w-6 h-6"><IconProvider icon="Check" /></Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <div className="flex gap-4">
              <Button className="p-0 w-6 h-6"><IconProvider icon="Plus" /></Button>
              <Button className="p-0 w-6 h-6"><IconProvider icon="Minus" /></Button>
              <Button className="p-0 w-6 h-6"><IconProvider icon="Check" /></Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <div className="flex gap-4">
              <Button className="p-0 w-6 h-6"><IconProvider icon="Plus" /></Button>
              <Button className="p-0 w-6 h-6"><IconProvider icon="Minus" /></Button>
              <Button className="p-0 w-6 h-6"><IconProvider icon="Check" /></Button>
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
              <Button className="p-0 w-6 h-6">A</Button>
              <Button className="p-0 w-6 h-6">B</Button>
              <Button className="p-0 w-6 h-6">C</Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <div className="flex gap-4">
              <Button className="p-0 w-6 h-6">A</Button>
              <Button className="p-0 w-6 h-6">B</Button>
              <Button className="p-0 w-6 h-6">C</Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <div className="flex gap-4">
              <Button className="p-0 w-6 h-6">A</Button>
              <Button className="p-0 w-6 h-6">B</Button>
              <Button className="p-0 w-6 h-6">C</Button>
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
              <Button className="p-1 w-4 h-4"><IconProvider icon="Plus" /></Button>
              <Button className="p-1 w-4 h-4">A</Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <div className="flex gap-4">
              <Button className="p-1 w-4 h-4"><IconProvider icon="Plus" /></Button>
              <Button className="p-1 w-4 h-4">A</Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <div className="flex gap-4">
              <Button className="p-1 w-4 h-4"><IconProvider icon="Plus" /></Button>
              <Button className="p-1 w-4 h-4">A</Button>
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
            <div className="relative">
              <Button className="p-0 w-6 h-6"><IconProvider icon="Bell" /></Button>
              <span className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Button className="p-0 w-6 h-6">N</Button>
              <span className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonVariantsExample
