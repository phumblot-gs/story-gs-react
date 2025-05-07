
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-4xl font-bold my-8 text-center">
        GS Components Library
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Components</CardTitle>
            <CardDescription>Interactive playground for component testing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Test various components with interactive controls and see how they behave.</p>
            <Link to="/test">
              <Button>Go to Test Page</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Examples</CardTitle>
            <CardDescription>View example implementations of all components</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Browse through examples of all available components in the library.</p>
            <Link to="/examples">
              <Button>View Examples</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Customizer</CardTitle>
            <CardDescription>Customize the theme for the component library</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Adjust theme settings to see how components look with different configurations.</p>
            <Link to="/theme-customizer">
              <Button>Open Theme Customizer</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
