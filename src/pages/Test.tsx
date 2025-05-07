
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ButtonCircle } from "@/components/ui/button-circle";
import { ButtonStatus } from "@/components/ButtonStatus";
import { StatusIndicator } from "@/components/StatusIndicator";
import { MediaStatus } from "@/utils/mediaStatus";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Workflow } from "@/components/ui/workflow";
import { WorkflowExample } from "@/components/examples/workflow-example";

const Test: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Components Test Page</h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <Tabs defaultValue="page-header" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="page-header">Page Header</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="status">Status Components</TabsTrigger>
          <TabsTrigger value="nested">Nested Components</TabsTrigger>
        </TabsList>

        <TabsContent value="page-header" className="space-y-8">
          <PageHeaderTestSection />
        </TabsContent>

        <TabsContent value="buttons" className="space-y-8">
          <ButtonTestSection />
        </TabsContent>

        <TabsContent value="status" className="space-y-8">
          <StatusComponentsTestSection />
        </TabsContent>

        <TabsContent value="nested" className="space-y-8">
          <NestedComponentsTestSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PageHeaderTestSection: React.FC = () => {
  const [title, setTitle] = useState("Collection Femme Printemps 2025");
  const [showTitleButton, setShowTitleButton] = useState(true);
  // Updated to only use valid AllowedPictogram values
  const [titleButtonIcon, setTitleButtonIcon] = useState<"Pencil" | "Plus" | "Settings">("Pencil");
  const [showLogo, setShowLogo] = useState(true);
  const [showCenterContent, setShowCenterContent] = useState(false);
  const [showRightContent, setShowRightContent] = useState(false);

  // Custom logo component
  const GsLogo = () => (
    <div className="flex items-center justify-center font-bold text-black text-lg">
      <span>GS</span>
    </div>
  );

  // Center content component
  const WorkflowTabs = () => (
    <div className="flex items-center gap-4">
      <div className="px-3 py-1">LIVE</div>
      <div className="px-3 py-1">PHASE 1</div>
      <div className="px-3 py-1">EXPORTS</div>
      <div className="px-3 py-1 bg-black text-white rounded-full">VALIDATION</div>
    </div>
  );

  // Right side buttons component
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Header Component</CardTitle>
        <CardDescription>Test the page header component with different configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                id="show-title-button"
                checked={showTitleButton}
                onCheckedChange={(checked) => setShowTitleButton(!!checked)}
              />
              <Label htmlFor="show-title-button">Show Title Button</Label>
            </div>

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
              <Label htmlFor="show-center-content">Show Center Content</Label>
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

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="border rounded-lg overflow-hidden">
              <PageHeader 
                logo={showLogo ? <GsLogo /> : undefined}
                title={title}
                showTitleButton={showTitleButton}
                titleButtonIcon={titleButtonIcon}
                centerContent={showCenterContent ? <WorkflowTabs /> : undefined}
                rightContent={showRightContent ? <RightSideButtons /> : undefined}
              />
            </div>
            <div className="text-sm text-gray-500 italic">Note: The header is designed for wider screens (min-width: 1280px)</div>
          </div>
        </div>

        {/* Add Workflow component section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Workflow Component</h3>
          <div className="border rounded-lg p-6 bg-gray-50">
            <Workflow
              steps={[
                { id: "1", label: "LIVE", onClick: () => console.log("LIVE clicked") },
                { id: "2", label: "PHASE 1", onClick: () => console.log("PHASE 1 clicked") },
                { id: "3", label: "EXPORTS", onClick: () => console.log("EXPORTS clicked") },
                { id: "4", label: "VALIDATION", isActive: true },
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ButtonTestSection: React.FC = () => {
  const [buttonVariant, setButtonVariant] = useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link">("default");
  const [buttonSize, setButtonSize] = useState<"default" | "sm" | "lg" | "icon">("default");
  const [buttonText, setButtonText] = useState("Button");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [circleButtonSize, setCircleButtonSize] = useState<"small" | "large">("large");
  const [circleButtonBackground, setCircleButtonBackground] = useState<"white" | "black" | "grey">("white");
  const [circleButtonFeatured, setCircleButtonFeatured] = useState(false);
  const [circleButtonDisabled, setCircleButtonDisabled] = useState(false);
  const [circleButtonIndicator, setCircleButtonIndicator] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Standard Button</CardTitle>
          <CardDescription>Test the standard button component with different variants and sizes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="button-text">Button Text</Label>
                <Input 
                  id="button-text" 
                  value={buttonText} 
                  onChange={(e) => setButtonText(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-variant">Variant</Label>
                <Select 
                  value={buttonVariant} 
                  onValueChange={(value) => setButtonVariant(value as any)}>
                  <SelectTrigger id="button-variant">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-size">Size</Label>
                <Select 
                  value={buttonSize} 
                  onValueChange={(value) => setButtonSize(value as any)}>
                  <SelectTrigger id="button-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="icon">Icon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="button-disabled"
                  checked={buttonDisabled}
                  onCheckedChange={(checked) => setButtonDisabled(!!checked)}
                />
                <Label htmlFor="button-disabled">Disabled</Label>
              </div>
            </div>

            <div className="flex flex-col space-y-4 items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium">Preview</h3>
              <Button
                variant={buttonVariant}
                size={buttonSize}
                disabled={buttonDisabled}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Circle Button</CardTitle>
          <CardDescription>Test the circle button component with different options.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="circle-button-size">Size</Label>
                <Select 
                  value={circleButtonSize} 
                  onValueChange={(value) => setCircleButtonSize(value as any)}>
                  <SelectTrigger id="circle-button-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="circle-button-bg">Background</Label>
                <Select 
                  value={circleButtonBackground} 
                  onValueChange={(value) => setCircleButtonBackground(value as any)}>
                  <SelectTrigger id="circle-button-bg">
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="grey">Grey</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="circle-button-featured"
                  checked={circleButtonFeatured}
                  onCheckedChange={(checked) => setCircleButtonFeatured(!!checked)}
                />
                <Label htmlFor="circle-button-featured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="circle-button-disabled"
                  checked={circleButtonDisabled}
                  onCheckedChange={(checked) => setCircleButtonDisabled(!!checked)}
                />
                <Label htmlFor="circle-button-disabled">Disabled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="circle-button-indicator"
                  checked={circleButtonIndicator}
                  onCheckedChange={(checked) => setCircleButtonIndicator(!!checked)}
                />
                <Label htmlFor="circle-button-indicator">Show Indicator</Label>
              </div>
            </div>

            <div className="flex flex-col space-y-4 items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium">Preview</h3>
              <ButtonCircle
                size={circleButtonSize}
                background={circleButtonBackground}
                featured={circleButtonFeatured}
                disabled={circleButtonDisabled}
                indicator={circleButtonIndicator}
                icon="Check"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const StatusComponentsTestSection: React.FC = () => {
  // Using valid MediaStatus values from the enum
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus>(MediaStatus.VALIDATED);
  const [statusSize, setStatusSize] = useState<"sm" | "md" | "lg">("md");
  const [buttonIcon, setButtonIcon] = useState<"Check" | "X">("Check");
  const [buttonActive, setButtonActive] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonSize, setButtonSize] = useState<"small" | "large">("large");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Status Indicator</CardTitle>
          <CardDescription>Test the status indicator component with different statuses and sizes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status-type">Status</Label>
                <Select 
                  value={selectedStatus.toString()} 
                  onValueChange={(value) => setSelectedStatus(parseInt(value))}>
                  <SelectTrigger id="status-type">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MediaStatus.VALIDATED.toString()}>Validated</SelectItem>
                    <SelectItem value={MediaStatus.ERROR_DURING_BROADCAST.toString()}>Error</SelectItem>
                    <SelectItem value={MediaStatus.SELECTED.toString()}>Selected</SelectItem>
                    <SelectItem value={MediaStatus.REFUSED_1.toString()}>Refused</SelectItem>
                    <SelectItem value={MediaStatus.SUBMITTED_FOR_APPROVAL.toString()}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-size">Size</Label>
                <Select 
                  value={statusSize} 
                  onValueChange={(value) => setStatusSize(value as any)}>
                  <SelectTrigger id="status-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col space-y-4 items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium">Preview</h3>
              <StatusIndicator status={selectedStatus} size={statusSize} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Button</CardTitle>
          <CardDescription>Test the status button component with different statuses and properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="button-status-type">Status</Label>
                <Select 
                  value={selectedStatus.toString()} 
                  onValueChange={(value) => setSelectedStatus(parseInt(value))}>
                  <SelectTrigger id="button-status-type">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MediaStatus.VALIDATED.toString()}>Validated</SelectItem>
                    <SelectItem value={MediaStatus.ERROR_DURING_BROADCAST.toString()}>Error</SelectItem>
                    <SelectItem value={MediaStatus.SELECTED.toString()}>Selected</SelectItem>
                    <SelectItem value={MediaStatus.REFUSED_1.toString()}>Refused</SelectItem>
                    <SelectItem value={MediaStatus.SUBMITTED_FOR_APPROVAL.toString()}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-icon">Icon</Label>
                <Select 
                  value={buttonIcon} 
                  onValueChange={(value) => setButtonIcon(value as any)}>
                  <SelectTrigger id="button-icon">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="X">X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-status-size">Size</Label>
                <Select 
                  value={buttonSize} 
                  onValueChange={(value) => setButtonSize(value as any)}>
                  <SelectTrigger id="button-status-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="button-status-active"
                  checked={buttonActive}
                  onCheckedChange={(checked) => setButtonActive(!!checked)}
                />
                <Label htmlFor="button-status-active">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="button-status-disabled"
                  checked={buttonDisabled}
                  onCheckedChange={(checked) => setButtonDisabled(!!checked)}
                />
                <Label htmlFor="button-status-disabled">Disabled</Label>
              </div>
            </div>

            <div className="flex flex-col space-y-4 items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium">Preview</h3>
              <ButtonStatus
                status={selectedStatus}
                icon={buttonIcon}
                size={buttonSize}
                isActive={buttonActive}
                disabled={buttonDisabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const NestedComponentsTestSection: React.FC = () => {
  const [cardBgColor, setCardBgColor] = useState("#FFFFFF");
  const [cardPadding, setCardPadding] = useState("6");
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showStatusIndicator, setShowStatusIndicator] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus>(MediaStatus.VALIDATED);
  const [buttonVariant, setButtonVariant] = useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link">("default");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Components Test</CardTitle>
        <CardDescription>Test how components interact when nested inside each other.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-bg-color">Card Background Color</Label>
              <Input
                id="card-bg-color"
                type="color"
                value={cardBgColor}
                onChange={(e) => setCardBgColor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-padding">Card Padding</Label>
              <Select 
                value={cardPadding.toString()} 
                onValueChange={(value) => setCardPadding(value)}>
                <SelectTrigger id="card-padding">
                  <SelectValue placeholder="Select padding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0)</SelectItem>
                  <SelectItem value="2">Extra Small (2)</SelectItem>
                  <SelectItem value="4">Small (4)</SelectItem>
                  <SelectItem value="6">Medium (6)</SelectItem>
                  <SelectItem value="8">Large (8)</SelectItem>
                  <SelectItem value="10">Extra Large (10)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-header"
                checked={showHeader}
                onCheckedChange={(checked) => setShowHeader(!!checked)}
              />
              <Label htmlFor="show-header">Show Card Header</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-footer"
                checked={showFooter}
                onCheckedChange={(checked) => setShowFooter(!!checked)}
              />
              <Label htmlFor="show-footer">Show Card Footer</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-status"
                checked={showStatusIndicator}
                onCheckedChange={(checked) => setShowStatusIndicator(!!checked)}
              />
              <Label htmlFor="show-status">Show Status Indicator</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nested-status">Status Indicator</Label>
              <Select 
                value={selectedStatus.toString()} 
                onValueChange={(value) => setSelectedStatus(parseInt(value))}>
                <SelectTrigger id="nested-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MediaStatus.VALIDATED.toString()}>Validated</SelectItem>
                  <SelectItem value={MediaStatus.ERROR_DURING_BROADCAST.toString()}>Error</SelectItem>
                  <SelectItem value={MediaStatus.SELECTED.toString()}>Selected</SelectItem>
                  <SelectItem value={MediaStatus.REFUSED_1.toString()}>Refused</SelectItem>
                  <SelectItem value={MediaStatus.SUBMITTED_FOR_APPROVAL.toString()}>Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nested-button-variant">Button Variant</Label>
              <Select 
                value={buttonVariant} 
                onValueChange={(value) => setButtonVariant(value as any)}>
                <SelectTrigger id="nested-button-variant">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Preview</h3>
            <Card style={{ backgroundColor: cardBgColor, padding: `${parseInt(cardPadding) * 4}px` }}>
              {showHeader && (
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Nested Card Example</CardTitle>
                    <CardDescription>A card with nested components</CardDescription>
                  </div>
                  {showStatusIndicator && <StatusIndicator status={selectedStatus} />}
                </CardHeader>
              )}
              <CardContent>
                <div className="space-y-4">
                  <p>This is a card with nested components inside it.</p>
                  <div className="flex space-x-4">
                    <ButtonCircle
                      icon="Check"
                      size="small"
                    />
                    <Button variant={buttonVariant}>Button</Button>
                    <ButtonStatus
                      status={selectedStatus}
                      icon="Check"
                      size="small"
                    />
                  </div>
                </div>
              </CardContent>
              {showFooter && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit</Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Test;
