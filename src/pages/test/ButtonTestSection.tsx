import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconProvider } from "@/components/ui/icon-provider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const ButtonTestSection: React.FC = () => {
  const [buttonText, setButtonText] = useState("Button");
  const [buttonSize, setButtonSize] = useState<"small" | "large">("large");
  const [buttonBackground, setButtonBackground] = useState<"white" | "black" | "grey">("white");
  const [buttonFeatured, setButtonFeatured] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonIndicator, setButtonIndicator] = useState(false);

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
          <CardDescription>Test the standard button component with different options.</CardDescription>
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
                <Label htmlFor="button-size">Size</Label>
                <Select 
                  value={buttonSize} 
                  onValueChange={(value) => setButtonSize(value as any)}>
                  <SelectTrigger id="button-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-bg">Background</Label>
                <Select 
                  value={buttonBackground} 
                  onValueChange={(value) => setButtonBackground(value as any)}>
                  <SelectTrigger id="button-bg">
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
                  id="button-featured"
                  checked={buttonFeatured}
                  onCheckedChange={(checked) => setButtonFeatured(!!checked)}
                />
                <Label htmlFor="button-featured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="button-disabled"
                  checked={buttonDisabled}
                  onCheckedChange={(checked) => setButtonDisabled(!!checked)}
                />
                <Label htmlFor="button-disabled">Disabled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="button-indicator"
                  checked={buttonIndicator}
                  onCheckedChange={(checked) => setButtonIndicator(!!checked)}
                />
                <Label htmlFor="button-indicator">Show Indicator</Label>
              </div>
            </div>

            <div className="flex flex-col space-y-4 items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium">Preview</h3>
              <Button
                size={buttonSize}
                background={buttonBackground}
                featured={buttonFeatured}
                disabled={buttonDisabled}
                indicator={buttonIndicator}
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
              <div className="relative">
                <Button
                  className={circleButtonSize === "small" ? "p-1 w-4 h-4" : "p-0 w-6 h-6"}
                  disabled={circleButtonDisabled}
                >
                  <IconProvider icon="Check" />
                </Button>
                {circleButtonIndicator && (
                  <span className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ButtonTestSection;
