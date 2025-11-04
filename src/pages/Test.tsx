
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger, SegmentedControlContent } from "@/components/ui/segmented-control";

// Import all test section components
import PageHeaderTestSection from "./test/PageHeaderTestSection";
import NotificationsTestSection from "./test/NotificationsTestSection";
import ButtonTestSection from "./test/ButtonTestSection";
import ToastTestSection from "./test/ToastTestSection";
import StatusComponentsTestSection from "./test/StatusComponentsTestSection";
import NestedComponentsTestSection from "./test/NestedComponentsTestSection";
import FormComponentsTestSection from "./test/FormComponentsTestSection";

const Test: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Components Test Page</h1>
        <div className="flex gap-4">
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
          <Link to="/examples">
            <Button>View Examples</Button>
          </Link>
        </div>
      </div>

      <SegmentedControl defaultValue="page-header" className="w-full">
        <SegmentedControlList className="mb-4">
          <SegmentedControlTrigger value="page-header">Page Header</SegmentedControlTrigger>
          <SegmentedControlTrigger value="notifications">Notifications</SegmentedControlTrigger>
          <SegmentedControlTrigger value="buttons">Buttons</SegmentedControlTrigger>
          <SegmentedControlTrigger value="forms">Forms</SegmentedControlTrigger>
          <SegmentedControlTrigger value="status">Status Components</SegmentedControlTrigger>
          <SegmentedControlTrigger value="nested">Nested Components</SegmentedControlTrigger>
        </SegmentedControlList>

        <SegmentedControlContent value="page-header" className="space-y-8">
          <PageHeaderTestSection />
        </SegmentedControlContent>

        <SegmentedControlContent value="notifications" className="space-y-8">
          <NotificationsTestSection />
        </SegmentedControlContent>

        <SegmentedControlContent value="buttons" className="space-y-8">
          <ButtonTestSection />
          <ToastTestSection />
        </SegmentedControlContent>
        
        <SegmentedControlContent value="forms" className="space-y-8">
          <FormComponentsTestSection />
        </SegmentedControlContent>

        <SegmentedControlContent value="status" className="space-y-8">
          <StatusComponentsTestSection />
        </SegmentedControlContent>

        <SegmentedControlContent value="nested" className="space-y-8">
          <NestedComponentsTestSection />
        </SegmentedControlContent>
      </SegmentedControl>
    </div>
  );
};

export default Test;
