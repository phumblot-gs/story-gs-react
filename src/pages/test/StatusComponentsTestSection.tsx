
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MediaStatus } from "@/utils/mediaStatus";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ButtonStatus } from "@/components/ButtonStatus";

const StatusComponentsTestSection: React.FC = () => {
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

export default StatusComponentsTestSection;
