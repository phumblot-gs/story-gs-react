
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

      <Tabs defaultValue="page-header" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="page-header">Page Header</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="status">Status Components</TabsTrigger>
          <TabsTrigger value="nested">Nested Components</TabsTrigger>
        </TabsList>

        <TabsContent value="page-header" className="space-y-8">
          <PageHeaderTestSection />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-8">
          <NotificationsTestSection />
        </TabsContent>

        <TabsContent value="buttons" className="space-y-8">
          <ButtonTestSection />
          <ToastTestSection />
        </TabsContent>
        
        <TabsContent value="forms" className="space-y-8">
          <FormComponentsTestSection />
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

export default Test;
