
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import PageHeaderExample from "./page-header-example";
import LanguageSwitcherExample from "./language-switcher-example";
import WorkflowExample from "./workflow-example";
import ButtonExample from "./button-example";
import ButtonVariantsExample from "./button-variants-example";
import ButtonCircleIconsExample from "./button-circle-icons-example";

const ExamplesPage: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Component Examples</h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <Tabs defaultValue="page-header" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="page-header">Page Header</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="button-circle">Button Circle</TabsTrigger>
          <TabsTrigger value="button-variants">Button Variants</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="language">Language Switcher</TabsTrigger>
        </TabsList>

        <TabsContent value="page-header" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Page Header Examples</CardTitle>
              <CardDescription>Different configurations of the Page Header component</CardDescription>
            </CardHeader>
            <CardContent>
              <PageHeaderExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Button Examples</CardTitle>
              <CardDescription>Various button styles and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <ButtonExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="button-circle" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Button Circle Icon Examples</CardTitle>
              <CardDescription>Available icons for circle buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <ButtonCircleIconsExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="button-variants" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants Examples</CardTitle>
              <CardDescription>Different button variants and styles</CardDescription>
            </CardHeader>
            <CardContent>
              <ButtonVariantsExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Example</CardTitle>
              <CardDescription>Workflow component demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkflowExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Language Switcher Example</CardTitle>
              <CardDescription>Language switcher component demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcherExample />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamplesPage;
