
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MediaStatus } from "@/utils/mediaStatus";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ButtonCircle } from "@/components/ui/button-circle";
import { ButtonStatus } from "@/components/ButtonStatus";

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

export default NestedComponentsTestSection;
