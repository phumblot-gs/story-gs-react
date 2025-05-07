
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useActivityStatusContext } from "@/contexts/ActivityStatusContext";

const Index = () => {
  const { isIdle, startRequest, endRequest } = useActivityStatusContext();

  const simulateRequest = () => {
    startRequest();
    setTimeout(() => {
      endRequest();
    }, 3000); // Simule une requête de 3 secondes
  };

  return (
    <div>
      <PageHeader 
        title="GS Components Library Demo"
        showTitleButton={false}
        isIdle={isIdle}
      />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thème</CardTitle>
              <CardDescription>Personnaliser les couleurs et les styles du thème</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSwitcher />
            </CardContent>
            <CardFooter>
              <Link to="/theme-customizer">
                <Button>Personnaliser le thème</Button>
              </Link>
              <Button onClick={simulateRequest} variant="outline">
                {isIdle ? "Simuler une requête (3s)" : "Simulation en cours..."}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Components Test</CardTitle>
              <CardDescription>Test and preview components with various settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Use this page to test components with different parameters and see how they behave when nested.</p>
            </CardContent>
            <CardFooter>
              <Link to="/test">
                <Button>Go to Test Page</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
