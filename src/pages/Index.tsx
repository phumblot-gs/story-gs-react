
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
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.VALIDATED} icon="check" />
              <span className="text-xs">Validate (Default)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.VALIDATED} icon="check" isActive={true} />
              <span className="text-xs">Validate (Active)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.VALIDATED} icon="check" disabled={true} />
              <span className="text-xs">Validate (Disabled)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.REFUSED_1} icon="x" />
              <span className="text-xs">Refuse (Default)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.REFUSED_1} icon="x" isActive={true} />
              <span className="text-xs">Refuse (Active)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.SUBMITTED_FOR_APPROVAL} icon="check" />
              <span className="text-xs">Submit (Default)</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <ButtonStatus status={MediaStatus.ERROR_DURING_BROADCAST} icon="x" />
              <span className="text-xs">Error (Default)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index
