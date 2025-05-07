
import React from "react";
import PageHeader from "@/components/PageHeader";
import { ButtonCircle } from "@/components/ui/button-circle";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
        <h3 className="text-lg mb-4">Default Page Header with Theme Logo</h3>
        <PageHeader 
          title="Collection Femme Printemps 2025" 
          showTitleButton={true} 
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg mb-4">Page Header with Custom Logo</h3>
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
      
      <div className="mb-8">
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
      
      <div className="mb-8">
        <h3 className="text-lg mb-4">Page Header with Custom Theme Logo</h3>
        <ThemeProvider
          initialCustomization={{
            text: {
              brandName: "Custom Logo Demo"
            },
            assets: {
              logo: `<svg width="25" height="14" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.32271 0.519775C4.47411 0.519775 0.784544 3.41519 0.106003 6.96598C-0.233268 8.7267 0.212025 10.37 1.33586 11.6123C2.43849 12.8253 4.07123 13.4904 5.93722 13.4904C7.50634 13.4904 9.07547 13.0209 10.475 12.1405C10.581 12.0819 10.6446 11.9743 10.6658 11.8667L11.4186 7.93437L10.4219 8.7267L9.87063 11.6123C8.66198 12.3362 7.3155 12.7177 5.99023 12.7177C4.36809 12.7177 2.94739 12.1405 1.9932 11.0939C1.01779 10.0179 0.636113 8.57997 0.932975 7.04423C1.5479 3.87493 4.83459 1.29254 8.2697 1.29254C9.62678 1.29254 10.8354 1.69359 11.7578 2.43701L12.1077 2.72068L12.2773 1.80119L12.1607 1.71315C11.1217 0.940392 9.78582 0.519775 8.32271 0.519775Z" fill="#0EA5E9"/>
                <path d="M15.4369 4.39315C14.9598 6.85816 17.4513 7.65049 19.2643 8.22761C20.7168 8.68736 21.7346 9.05907 21.6285 9.60685C21.5119 10.2231 20.4835 10.898 19.19 10.898C18.204 10.898 17.3134 10.585 16.6667 10.0079L14.3342 11.8567L14.4933 12.0132C15.5641 12.9718 17.059 13.5 18.6917 13.5C21.4483 13.5 24.0246 11.7588 24.4381 9.60685C24.9152 7.13205 22.4237 6.33973 20.6107 5.7626C19.1688 5.30286 18.151 4.93115 18.257 4.39315C18.3737 3.7769 19.4021 3.10196 20.6956 3.10196H24.5123L25.0106 0.509781H21.1939C18.4373 0.509781 15.8609 2.25094 15.4475 4.40293L15.4369 4.39315Z" fill="#F97316"/>
              </svg>`
            }
          }}
        >
          <PageHeader 
            title="Collection Femme Printemps 2025"
            showTitleButton={true}
            centerContent={<WorkflowTabs />}
            rightContent={<RightSideButtons />}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default PageHeaderExample;
