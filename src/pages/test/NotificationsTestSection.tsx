
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MediaStatus } from "@/utils/mediaStatus";
import EventPanel from "@/components/notifications/EventPanel";
import ActivityPanel from "@/components/notifications/ActivityPanel";
import ButtonNotifications from "@/components/ButtonNotifications";
import { useGlobalActivityStatus } from "@/hooks/useGlobalActivityStatus";

const NotificationsTestSection: React.FC = () => {
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const { setActivityStatus } = useGlobalActivityStatus();
  
  // Generate events for activity panel
  const generateMockEvents = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as const,
        redirectLink: "#",
        date: today,
        unread: true
      },
      {
        title: "Files transferred to editing team",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.VALIDATED,
        type: "transfer" as const,
        redirectLink: "#",
        date: today,
        unread: true
      },
      {
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.BROADCAST,
        type: "comment" as const,
        redirectLink: "#",
        date: yesterday,
        unread: false
      },
      {
        title: "Files published to website",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.BROADCAST,
        type: "other" as const,
        redirectLink: "#",
        date: yesterday,
        unread: false
      },
    ];
  };

  const toggleActivityPanel = () => {
    setIsActivityPanelOpen(!isActivityPanelOpen);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ButtonNotifications</CardTitle>
          <CardDescription>A button that displays notification count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-md">
                <p className="mb-2 font-medium">With count</p>
                <ButtonNotifications count={5} onClick={() => {}} />
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md">
                <p className="mb-2 font-medium">No count</p>
                <ButtonNotifications count={0} onClick={() => {}} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button onClick={() => setActivityStatus(true)}>
                Set Has Activity (Global)
              </Button>
              <Button variant="outline" onClick={() => setActivityStatus(false)}>
                Set No Activity (Global)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ActivityPanel</CardTitle>
          <CardDescription>Panel displaying activity notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center flex-col gap-4">
            <div className="flex gap-4 justify-center">
              <Button onClick={toggleActivityPanel}>
                {isActivityPanelOpen ? "Close Activity Panel" : "Open Activity Panel"}
              </Button>
              <Button 
                variant={debugMode ? "default" : "outline"} 
                onClick={() => setDebugMode(!debugMode)}
              >
                {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {debugMode && "Debug mode enabled. Click on events to see details in console."}
            </div>
          </div>
          <ActivityPanel 
            isOpen={isActivityPanelOpen}
            onClose={() => setIsActivityPanelOpen(false)}
            events={generateMockEvents()}
            debug={debugMode}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>EventPanel</CardTitle>
          <CardDescription>Individual notification event panels</CardDescription>
        </CardHeader>
        <CardContent className="bg-black p-6 space-y-4">
          <EventPanel
            title="Connect Added Comments on photos"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.SUBMITTED_FOR_APPROVAL}
            type="comment"
            redirectLink="#"
            date={new Date()}
            unread={true}
          />
          <EventPanel
            title="Files transferred to editing team"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.VALIDATED}
            type="transfer"
            redirectLink="#"
            date={new Date()}
            unread={true}
          />
          
          {/* Add new EventPanels with unread=false */}
          <EventPanel
            title="Connect Added Comments on photos"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.BROADCAST}
            type="comment"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 1))}
            unread={false}
          />
          <EventPanel
            title="Files published to website"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.BROADCAST}
            type="other"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 1))}
            unread={false}
          />
          <EventPanel
            title="Project review completed"
            subtitle="STANDARD-2025-05-07 H03-PART-2"
            pictureStatus={MediaStatus.SELECTED}
            type="comment"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 2))}
            unread={false}
          />
          <EventPanel
            title="Image collection updated"
            subtitle="STANDARD-2025-05-08 H01-PART-1"
            pictureStatus={MediaStatus.SUBMITTED_FOR_APPROVAL}
            type="other"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 2))}
            unread={false}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default NotificationsTestSection;
