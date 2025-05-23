
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  const components = [
    {
      name: "ActivityPanel",
      description: "Panel for displaying activity notifications",
      path: "/test#activity-panel"
    },
    {
      name: "Button",
      description: "Standard button component with various styles",
      path: "/test#button"
    },
    {
      name: "ButtonCircle",
      description: "Circular button component with icon support",
      path: "/test#button-circle"
    },
    {
      name: "ButtonNotifications",
      description: "Button with notification indicator",
      path: "/test#button-notifications"
    },
    {
      name: "ButtonStatus",
      description: "Status-specific button component",
      path: "/test#button-status"
    },
    {
      name: "LanguageSwitcher",
      description: "Component for switching between languages",
      path: "/test#language-switcher"
    },
    {
      name: "MediaStatus",
      description: "Visual indicator for media status",
      path: "/test#media-status"
    },
    {
      name: "NotificationPanel",
      description: "Panel for displaying individual notifications",
      path: "/test#notification-panel"
    },
    {
      name: "PageHeader",
      description: "Header component for pages",
      path: "/test#page-header"
    },
    {
      name: "StatusIndicator",
      description: "Visual status indicator component",
      path: "/test#status-indicator"
    },
    {
      name: "ThemeProvider",
      description: "Context provider for theme management",
      path: "/theme-customizer"
    },
    {
      name: "Toaster",
      description: "Toast notification system",
      path: "/test#toaster"
    },
    {
      name: "TranslationProvider",
      description: "Context provider for internationalization",
      path: "/test#translation"
    },
    {
      name: "Workflow",
      description: "Workflow component for step-based processes",
      path: "/test#workflow"
    },
    {
      name: "WorkflowStep",
      description: "Individual step component for workflows",
      path: "/test#workflow-step"
    }
  ];

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-4xl font-bold my-8 text-center">
        GS Components Library
      </h1>

      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600 mb-4">
          Explore all available components and providers in our library
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <Card key={component.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{component.name}</CardTitle>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={component.path}>
                <Button className="w-full">View Component</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Testing</CardTitle>
            <CardDescription>
              Test all components with interactive controls and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/test">
              <Button size="lg">Go to Test Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
