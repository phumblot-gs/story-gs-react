
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  const components = [
    {
      name: "ActivityPanel",
      description: "Panel for displaying activity notifications",
      path: "/activity-panel"
    },
    {
      name: "Button",
      description: "Standard button component with various styles",
      path: "/button"
    },
    {
      name: "ButtonCircle",
      description: "Circular button component with icon support",
      path: "/button-circle"
    },
    {
      name: "ButtonNotifications",
      description: "Button with notification indicator",
      path: "/button-notifications"
    },
    {
      name: "ButtonStatus",
      description: "Status-specific button component",
      path: "/button-status"
    },
    {
      name: "LanguageSwitcher",
      description: "Component for switching between languages",
      path: "/language-switcher"
    },
    {
      name: "MediaStatus",
      description: "Visual indicator for media status",
      path: "/media-status"
    },
    {
      name: "NotificationPanel",
      description: "Panel for displaying individual notifications",
      path: "/notification-panel"
    },
    {
      name: "PageHeader",
      description: "Header component for pages",
      path: "/page-header"
    },
    {
      name: "StatusIndicator",
      description: "Visual status indicator component",
      path: "/status-indicator"
    },
    {
      name: "ThemeProvider",
      description: "Context provider for theme management",
      path: "/theme-customizer"
    },
    {
      name: "Toaster",
      description: "Toast notification system",
      path: "/toaster"
    },
    {
      name: "TranslationProvider",
      description: "Context provider for internationalization",
      path: "/translation-provider"
    },
    {
      name: "Workflow",
      description: "Workflow component for step-based processes",
      path: "/workflow"
    },
    {
      name: "WorkflowStep",
      description: "Individual step component for workflows",
      path: "/workflow-step"
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
            <CardTitle>All Components Test Page</CardTitle>
            <CardDescription>
              View all components together with interactive controls and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/test">
              <Button size="lg">Go to Combined Test Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
