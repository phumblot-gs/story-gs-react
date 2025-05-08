
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { IconProvider } from "@/components/ui/icon-provider";

const ToastTestSection: React.FC = () => {
  const [toastTitle, setToastTitle] = useState("Toast Notification");
  const [toastDescription, setToastDescription] = useState("This is a toast message");
  const [toastType, setToastType] = useState<"default" | "success" | "error" | "warning" | "info" | "loading">("default");
  const [toastDuration, setToastDuration] = useState(5000);
  const [showAction, setShowAction] = useState(false);

  const handleShowToast = () => {
    let toastAction;
    
    if (showAction) {
      toastAction = (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => console.log("Action clicked")}
        >
          Action
        </Button>
      );
    }

    // Pass the custom icon based on toast type
    let icon;
    if (toastType === "success") {
      icon = <IconProvider icon="ToastSuccessIcon" size={21} className="text-white" />;
    } else if (toastType === "error") {
      icon = <IconProvider icon="ToastErrorIcon" size={21} className="text-white" />;
    }

    toast({
      title: toastTitle,
      description: toastDescription,
      type: toastType,
      duration: toastDuration,
      action: toastAction
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Test the toast notification component with different configurations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toast-title">Title</Label>
              <Input 
                id="toast-title" 
                value={toastTitle} 
                onChange={(e) => setToastTitle(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toast-description">Description</Label>
              <Input 
                id="toast-description" 
                value={toastDescription} 
                onChange={(e) => setToastDescription(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toast-type">Type</Label>
              <Select 
                value={toastType} 
                onValueChange={(value) => setToastType(value as any)}>
                <SelectTrigger id="toast-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toast-duration">Duration (ms)</Label>
              <Select 
                value={toastDuration.toString()} 
                onValueChange={(value) => setToastDuration(parseInt(value))}>
                <SelectTrigger id="toast-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 second</SelectItem>
                  <SelectItem value="3000">3 seconds</SelectItem>
                  <SelectItem value="5000">5 seconds</SelectItem>
                  <SelectItem value="10000">10 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-action"
                checked={showAction}
                onCheckedChange={(checked) => setShowAction(!!checked)}
              />
              <Label htmlFor="show-action">Show Action Button</Label>
            </div>
          </div>

          <div className="flex flex-col space-y-4 items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="flex flex-col items-center gap-4">
              <div className={`w-64 p-4 rounded-md border ${
                toastType === "error" ? "bg-red-strong text-white" :
                toastType === "success" ? "bg-green text-white" :
                toastType === "warning" ? "bg-orange text-white" :
                toastType === "info" ? "bg-pastel-yellow-secondary text-black" :
                toastType === "loading" ? "bg-grey text-white" :
                "bg-white border-gray-300"
              }`}>
                <div className="font-semibold">{toastTitle}</div>
                <div className="text-sm">{toastDescription}</div>
                {showAction && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm">Action</Button>
                  </div>
                )}
              </div>
              
              <Button onClick={handleShowToast}>
                Show Toast
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Click the button to trigger the toast notification with your selected options.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToastTestSection;
