
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ButtonNotificationsPage: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Button Notifications Test</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Button Notifications Component</CardTitle>
          <CardDescription>This component is available in the Storybook documentation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please refer to the Storybook documentation for testing this component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonNotificationsPage;
