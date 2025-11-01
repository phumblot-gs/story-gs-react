
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconProvider } from "@/components/ui/icon-provider";
import { Workflow } from "@/components/ui/workflow";
import { LanguageSwitcher, type Language } from "@/components/ui/language-switcher";
import ButtonNotifications from "@/components/ButtonNotifications";

const PageHeaderConfigDemo: React.FC = () => {
  const [title, setTitle] = useState("Collection Femme Printemps 2025");
  const [showBackButton, setShowBackButton] = useState(false);
  const [showTitleButton, setShowTitleButton] = useState(true);
  const [titleButtonIcon, setTitleButtonIcon] = useState<"Pencil" | "Plus" | "Settings">("Pencil");
  const [showLogo, setShowLogo] = useState(true);
  const [showCenterContent, setShowCenterContent] = useState(true);
  const [showRightContent, setShowRightContent] = useState(false);

  // Sample languages for the LanguageSwitcher component
  const languages = [
    { code: "FR", name: "Français" },
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
  ];
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  // Handler for language change
  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    console.log(`Language changed to: ${language.code} - ${language.name}`);
  };

  // Handler for back button click
  const handleBackButtonClick = () => {
    console.log("Back button clicked");
  };

  // Custom logo component
  const GsLogo = () => (
    <div className="flex items-center justify-center font-bold text-black text-lg">
      <span>GS</span>
    </div>
  );

  // Updated to use Workflow component as center content
  const WorkflowTabs = () => (
    <Workflow
      steps={[
        { bench_id: 1, label: "LIVE", onClick: () => console.log("LIVE clicked") },
        { bench_id: 2, label: "PHASE 1", onClick: () => console.log("PHASE 1 clicked") },
        { bench_id: 3, label: "EXPORTS", onClick: () => console.log("EXPORTS clicked") },
        { bench_id: 4, label: "VALIDATION", state: "current" },
      ]}
      bench_root_id={1001}
    />
  );

  // Right side buttons component - Updated to use LanguageSwitcher and ButtonNotifications
  const RightSideButtons = () => (
    <>
      <LanguageSwitcher 
        languages={languages} 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange} 
      />
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="User" /></Button>
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="Settings" /></Button>
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="Help" /></Button>
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="Logout" /></Button>
      <ButtonNotifications />
    </>
  );

  return (
    <>
      {/* Preview now displayed above the form */}
      <div className="border rounded-lg overflow-hidden mb-4">
        <PageHeader 
          logo={showLogo ? <GsLogo /> : undefined}
          title={title}
          showBackButton={showBackButton}
          onBackButtonClick={handleBackButtonClick}
          showTitleButton={showTitleButton}
          titleButtonIcon={titleButtonIcon}
          centerContent={showCenterContent ? <WorkflowTabs /> : undefined}
          rightContent={showRightContent ? <RightSideButtons /> : undefined}
        />
      </div>
      <div className="text-sm text-gray-500 italic">Note: The header is designed for wider screens (min-width: 1280px)</div>

      {/* Form controls now displayed in a 2-column layout below the preview */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="header-title">Title</Label>
            <Input 
              id="header-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title-button-icon">Title Button Icon</Label>
            <Select 
              value={titleButtonIcon} 
              onValueChange={(value) => setTitleButtonIcon(value as any)}>
              <SelectTrigger id="title-button-icon">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pencil">Pencil</SelectItem>
                <SelectItem value="Plus">Plus</SelectItem>
                <SelectItem value="Settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-back-button"
              checked={showBackButton}
              onCheckedChange={(checked) => setShowBackButton(!!checked)}
            />
            <Label htmlFor="show-back-button">Show Back Button</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-title-button"
              checked={showTitleButton}
              onCheckedChange={(checked) => setShowTitleButton(!!checked)}
            />
            <Label htmlFor="show-title-button">Show Title Button</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-logo"
              checked={showLogo}
              onCheckedChange={(checked) => setShowLogo(!!checked)}
            />
            <Label htmlFor="show-logo">Show Logo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-center-content"
              checked={showCenterContent}
              onCheckedChange={(checked) => setShowCenterContent(!!checked)}
            />
            <Label htmlFor="show-center-content">Show Workflow in Center</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-right-content"
              checked={showRightContent}
              onCheckedChange={(checked) => setShowRightContent(!!checked)}
            />
            <Label htmlFor="show-right-content">Show Right Content</Label>
          </div>
        </div>
      </div>
    </>
  );
};

const PageHeaderTestSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Page Header Demo</CardTitle>
        <CardDescription>Configure and test the Page Header component with different options</CardDescription>
      </CardHeader>
      <CardContent>
        <PageHeaderConfigDemo />
      </CardContent>
    </Card>
  );
};

export default PageHeaderTestSection;
