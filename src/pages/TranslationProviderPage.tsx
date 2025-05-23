
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TranslationProviderPage: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Translation Provider Test</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Translation Provider</CardTitle>
          <CardDescription>Context provider for internationalization and translations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This provider is already active in the application and manages translations throughout the component library.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationProviderPage;
