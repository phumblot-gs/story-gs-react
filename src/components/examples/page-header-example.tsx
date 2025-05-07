
import React from "react";
import PageHeader from "@/components/PageHeader";
import { ButtonCircle } from "@/components/ui/button-circle";

// Custom logo component
const GsLogo = () => (
  <div className="flex items-center justify-center font-bold text-black text-lg">
    <span>GS</span>
  </div>
);

// Example workflow tabs for center content
const WorkflowTabs = () => (
  <div className="flex items-center gap-4">
    <div className="px-3 py-1">LIVE</div>
    <div className="px-3 py-1">PHASE 1</div>
    <div className="px-3 py-1">EXPORTS</div>
    <div className="px-3 py-1 bg-black text-white rounded-full">VALIDATION</div>
  </div>
);

// Right side content with buttons
const RightSideButtons = () => (
  <>
    <span className="text-sm font-medium">FR</span>
    <ButtonCircle icon="User" />
    <ButtonCircle icon="Settings" />
    <ButtonCircle icon="Help" />
    <ButtonCircle icon="Bell" indicator={true} />
    <ButtonCircle icon="Logout" />
  </>
);

export const PageHeaderExample = () => {
  return (
    <div className="w-full">
      <h2 className="text-xl mb-8">Page Header Component Example</h2>
      
      <div className="mb-8">
        <h3 className="text-lg mb-4">Default Page Header</h3>
        <PageHeader 
          title="Collection Femme Printemps 2025" 
          showTitleButton={true} 
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg mb-4">Page Header with Logo</h3>
        <PageHeader 
          logo={<GsLogo />}
          title="Collection Femme Printemps 2025" 
          showTitleButton={true}
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg mb-4">Complete Page Header</h3>
        <PageHeader 
          logo={<GsLogo />}
          title="Collection Femme Printemps 2025"
          showTitleButton={true}
          centerContent={<WorkflowTabs />}
          rightContent={<RightSideButtons />}
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg mb-4">Page Header without Title Button</h3>
        <PageHeader 
          logo={<GsLogo />}
          title="Collection Femme Printemps 2025"
          showTitleButton={false}
          centerContent={<WorkflowTabs />}
          rightContent={<RightSideButtons />}
        />
      </div>
      
      <div>
        <h3 className="text-lg mb-4">Page Header with Custom Title Button</h3>
        <PageHeader 
          logo={<GsLogo />}
          title="Collection Femme Printemps 2025"
          showTitleButton={true}
          titleButtonIcon="Plus"
          centerContent={<WorkflowTabs />}
          rightContent={<RightSideButtons />}
        />
      </div>
    </div>
  );
};

export default PageHeaderExample;
