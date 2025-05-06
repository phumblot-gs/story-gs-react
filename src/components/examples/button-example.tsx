
import React from "react"
import { Button } from "@/components/ui/button-default"

const ButtonExample = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Button Component</h2>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Variants</h3>
        <div className="grid grid-cols-6 gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Primary</span>
            <Button variant="primary">Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Black</span>
            <Button variant="black">Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Blue</span>
            <Button variant="blue">Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Grey</span>
            <Button variant="grey">Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Secondary</span>
            <Button variant="secondary">Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Disabled</span>
            <Button disabled>Simple button</Button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">With Indicators</h3>
        <div className="grid grid-cols-6 gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Primary</span>
            <Button variant="primary" indicator={true}>Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Black</span>
            <Button variant="black" indicator={true}>Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Blue</span>
            <Button variant="blue" indicator={true}>Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Grey</span>
            <Button variant="grey" indicator={true}>Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Secondary</span>
            <Button variant="secondary" indicator={true}>Simple button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">Disabled</span>
            <Button disabled indicator={true}>Simple button</Button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Background Adaptive</h3>
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">White Background</h4>
            <div className="flex gap-4">
              <Button background="white">Simple button</Button>
              <Button background="white" indicator={true}>Simple button</Button>
              <Button background="white" featured={true}>Featured button</Button>
            </div>
          </div>
          
          <div className="bg-black p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4 text-white">Black Background</h4>
            <div className="flex gap-4">
              <Button background="black">Simple button</Button>
              <Button background="black" indicator={true}>Simple button</Button>
              <Button background="black" featured={true}>Featured button</Button>
            </div>
          </div>
          
          <div className="bg-grey p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">Grey Background</h4>
            <div className="flex gap-4">
              <Button background="grey">Simple button</Button>
              <Button background="grey" indicator={true}>Simple button</Button>
              <Button background="grey" featured={true}>Featured button</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Featured Buttons</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">White Background</span>
            <Button background="white" featured={true}>Featured button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg">
            <span className="text-sm text-white">Black Background</span>
            <Button background="black" featured={true}>Featured button</Button>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-grey p-4 rounded-lg">
            <span className="text-sm text-muted-foreground">Grey Background</span>
            <Button background="grey" featured={true}>Featured button</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonExample
