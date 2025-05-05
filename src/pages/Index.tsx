
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ButtonTextLargeExample from "@/components/examples/button-text-large-example"

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
    </div>
  )
}

export default Index
