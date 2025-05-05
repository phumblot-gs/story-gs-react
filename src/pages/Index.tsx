
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ButtonTextLargeExample from "@/components/examples/button-text-large-example"
import ButtonVariantsExample from "@/components/examples/button-variants-example"
import ButtonCircleIconsExample from "@/components/examples/button-circle-icons-example"
import { MediaStatus } from "@/utils/mediaStatus"
import ButtonStatus from "@/components/ButtonStatus"

const Index = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Component Library</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ButtonTextLarge Component</CardTitle>
          <CardDescription>
            A circular button component with text and optional indicator, available in multiple variants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonTextLargeExample />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>
            Additional button variants: small text buttons and circular buttons with icons or letters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonVariantsExample />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ButtonCircle Icons</CardTitle>
          <CardDescription>
            All available pictogram icons for ButtonCircle component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonCircleIconsExample />
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ButtonStatus Component</CardTitle>
          <CardDescription>
            Status buttons for media approval workflow with status-based coloring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 p-4">
            {/* Display all available media statuses for Check icon */}
            <div className="grid grid-cols-3 gap-8 w-full">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Default State</h3>
                {Object.values(MediaStatus).map((status) => (
                  <div key={`check-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="Check" />
                    <span className="text-xs">{status}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Active State</h3>
                {Object.values(MediaStatus).map((status) => (
                  <div key={`check-active-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="Check" isActive={true} />
                    <span className="text-xs">{status} (Active)</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Disabled State</h3>
                {Object.values(MediaStatus).map((status) => (
                  <div key={`check-disabled-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="Check" disabled={true} />
                    <span className="text-xs">{status} (Disabled)</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Display all available media statuses for X icon */}
            <div className="grid grid-cols-3 gap-8 w-full mt-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Default State (Reject)</h3>
                {Object.values(MediaStatus).map((status) => (
                  <div key={`x-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="X" />
                    <span className="text-xs">{status}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Active State (Reject)</h3>
                {Object.values(MediaStatus).map((status) => (
                  <div key={`x-active-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="X" isActive={true} />
                    <span className="text-xs">{status} (Active)</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Disabled State (Reject)</h3>
                {Object.values(MediaStatus).map((status) => (
                  <div key={`x-disabled-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="X" disabled={true} />
                    <span className="text-xs">{status} (Disabled)</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Small size examples */}
            <div className="w-full mt-8">
              <h3 className="text-lg font-medium mb-4">Small Size Examples</h3>
              <div className="flex flex-wrap gap-4">
                {Object.values(MediaStatus).slice(0, 5).map((status) => (
                  <div key={`small-${status}`} className="flex flex-col items-center gap-2">
                    <ButtonStatus status={status} icon="Check" size="small" />
                    <span className="text-xs">{status} (Small)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index
