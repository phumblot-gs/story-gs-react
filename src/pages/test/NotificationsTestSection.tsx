
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Workflow } from "@/components/ui/workflow";
import PageHeader from "@/components/PageHeader";
import { LanguageSwitcher, type Language } from "@/components/ui/language-switcher";
import { ButtonCircle } from "@/components/ui/button-circle";
import ButtonNotifications from "@/components/ButtonNotifications";

const NotificationsTestSection: React.FC = () => {
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

  // Custom logo component
  const GsLogo = () => (
    <div className="flex items-center justify-center font-bold text-black text-lg">
      <span>GS</span>
    </div>
  );

  // Center content with workflow tabs
  const WorkflowTabs = () => (
    <Workflow
      steps={[
        { bench_id: "1", label: "LIVE", onClick: () => console.log("LIVE clicked") },
        { bench_id: "2", label: "PHASE 1", onClick: () => console.log("PHASE 1 clicked") },
        { bench_id: "3", label: "EXPORTS", onClick: () => console.log("EXPORTS clicked") },
        { bench_id: "4", label: "VALIDATION", isActive: true },
      ]}
      bench_root_id={1001}
    />
  );

  // Right side content with buttons including ButtonNotifications
  const RightSideContent = () => (
    <>
      <LanguageSwitcher 
        languages={languages} 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange} 
      />
      <ButtonCircle icon="User" size="large" background="white" />
      <ButtonCircle icon="Settings" size="large" background="white" />
      <ButtonCircle icon="Help" size="large" background="white" />
      <ButtonCircle icon="Logout" size="large" background="white" />
      <ButtonNotifications />
    </>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notifications Test</CardTitle>
          <CardDescription>Test the ButtonNotifications component integrated in a PageHeader</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden mb-4">
            <PageHeader 
              logo={<GsLogo />}
              title="Collection Femme Printemps 2025"
              showTitleButton={true}
              titleButtonIcon="Pencil"
              centerContent={<WorkflowTabs />}
              rightContent={<RightSideContent />}
            />
          </div>
          <div className="text-sm text-gray-500 italic mt-2">
            Note: The header is designed for wider screens (min-width: 1280px). Click on the bell icon to open the notifications panel.
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">ButtonNotifications Component</h3>
            <p className="mb-4">The ButtonNotifications component displays a notification panel when clicked. Key features:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Shows notification count indicator for unread items</li>
              <li>Opens a slide-in panel displaying recent notifications</li>
              <li>Groups notifications by date with most recent on top</li>
              <li>Visually distinguishes between read and unread notifications</li>
              <li>Includes a "Mark all as read" option</li>
            </ul>

            <div className="flex flex-wrap gap-8 mt-8">
              <div className="flex flex-col items-center">
                <h4 className="text-md font-medium mb-2">Standalone Component</h4>
                <div className="p-6 bg-gray-50 rounded-lg flex items-center justify-center">
                  <ButtonNotifications />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default NotificationsTestSection;
