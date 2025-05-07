
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export const ExamplesPage = () => {
  // List of example pages with their descriptions
  const examples = [
    {
      title: "Button Examples",
      description: "Various button components and their usage",
      path: "/examples/button-example"
    },
    {
      title: "Button Variants",
      description: "Different styles and variants of button components",
      path: "/examples/button-variants-example"
    },
    {
      title: "Button Circle Icons",
      description: "Circular buttons with various icon options",
      path: "/examples/button-circle-icons-example"
    },
    {
      title: "Language Switcher",
      description: "Component for switching between different languages",
      path: "/examples/language-switcher-example"
    },
    {
      title: "Workflow Example",
      description: "Workflow component for multistep processes",
      path: "/examples/workflow-example"
    },
    {
      title: "Page Header Example",
      description: "Page header component with various configurations",
      path: "/examples/page-header-example"
    },
    {
      title: "Notifications System",
      description: "Complete notifications system with ActivityPanel",
      path: "/examples/notifications-example"
    }
  ];

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Component Examples</h1>
        <p className="text-muted-foreground">
          This page showcases various components and their implementations. Click on any card to view the specific example.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <Link key={index} href={example.path} className="no-underline">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{example.description}</p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-primary">View example →</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExamplesPage;
