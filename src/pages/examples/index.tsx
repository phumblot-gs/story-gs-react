
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import example components
import ButtonExample from "./button-example";
import ButtonVariantsExample from "./button-variants-example";
import ButtonCircleIconsExample from "./button-circle-icons-example";
import PageHeaderExample from "./page-header-example";
import WorkflowExample from "./workflow-example";
import NotificationsExample from "./notifications-example";
import LanguageSwitcherExample from "./language-switcher-example";
import TranslationExample from "./translation-example"; // Add the new example

const ExamplesLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/examples">
            <Button variant="ghost" size="sm">
              All Examples
            </Button>
          </Link>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};

const ExamplesList: React.FC = () => {
  const examples = [
    { path: "button", label: "Button Example" },
    { path: "button-variants", label: "Button Variants" },
    { path: "button-circle-icons", label: "Button Circle Icons" },
    { path: "page-header", label: "Page Header" },
    { path: "workflow", label: "Workflow" },
    { path: "notifications", label: "Notifications" },
    { path: "language-switcher", label: "Language Switcher" },
    { path: "translation", label: "Translation System" }, // Add the new example
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Component Examples</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example) => (
          <Link key={example.path} to={example.path}>
            <div className="border rounded-lg p-6 hover:bg-slate-50 transition-colors">
              <h2 className="text-xl font-semibold">{example.label}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                View example
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ExamplesPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExamplesLayout><ExamplesList /></ExamplesLayout>} />
      <Route path="/button" element={<ExamplesLayout><ButtonExample /></ExamplesLayout>} />
      <Route path="/button-variants" element={<ExamplesLayout><ButtonVariantsExample /></ExamplesLayout>} />
      <Route path="/button-circle-icons" element={<ExamplesLayout><ButtonCircleIconsExample /></ExamplesLayout>} />
      <Route path="/page-header" element={<ExamplesLayout><PageHeaderExample /></ExamplesLayout>} />
      <Route path="/workflow" element={<ExamplesLayout><WorkflowExample /></ExamplesLayout>} />
      <Route path="/notifications" element={<ExamplesLayout><NotificationsExample /></ExamplesLayout>} />
      <Route path="/language-switcher" element={<ExamplesLayout><LanguageSwitcherExample /></ExamplesLayout>} />
      <Route path="/translation" element={<ExamplesLayout><TranslationExample /></ExamplesLayout>} /> {/* Add route for new example */}
    </Routes>
  );
};

export default ExamplesPage;
