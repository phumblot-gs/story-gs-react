
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./sonner";
import { Button } from "./button-default";

const meta: Meta<typeof Toaster> = {
  title: "UI/Toaster",
  component: Toaster,
  parameters: {
    layout: "centered",
    controls: {
      sort: "alpha",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultDuration: {
      control: { type: "number" },
      description: "Default duration for all toasts in milliseconds",
      defaultValue: 2000,
    },
    position: {
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      control: { type: "select" },
      description: "Position of the toast on the screen",
      defaultValue: "top-center",
    },
    theme: {
      options: ["system", "light", "dark"],
      control: { type: "radio" },
      description: "Toast theme",
      defaultValue: "system",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  args: {
    defaultDuration: 2000,
    position: "top-center",
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-4 items-center">
        <Toaster {...args} />
        <div className="flex flex-wrap gap-4 max-w-xl">
          <Button
            onClick={() =>
              toast({
                title: "Default Toast",
                description: "This is a default toast notification",
              })
            }
          >
            Default Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title: "Success Toast",
                description: "Your action was completed successfully",
                type: "success",
              })
            }
          >
            Success Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title: "Error Toast",
                description: "An error occurred during the process",
                type: "error",
              })
            }
          >
            Error Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title: "Warning Toast",
                description: "This action might cause issues",
                type: "warning",
              })
            }
          >
            Warning Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title: "Info Toast",
                description: "Here's some information you might find useful",
                type: "info",
              })
            }
          >
            Info Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title: "Custom Duration",
                description: "This toast will disappear after 5 seconds",
                duration: 5000,
              })
            }
          >
            Custom Duration (5s)
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title: "With Action",
                description: "This toast has an action button",
                action: (
                  <Button
                    size="small"
                    background="black"
                    onClick={() => console.log("Action clicked")}
                  >
                    Action
                  </Button>
                ),
              })
            }
          >
            With Action
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-medium mb-2">Usage Example:</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
{`import { toast } from "@/components/ui/sonner";

// Basic usage
toast({
  title: "Hello",
  description: "This is a toast notification",
});

// Success toast
toast({
  title: "Success",
  description: "Your action was completed successfully",
  type: "success",
});

// Error toast
toast({
  title: "Error",
  description: "An error occurred during the process",
  type: "error",
});

// Custom duration
toast({
  title: "Custom Duration",
  description: "This toast will stay for 5 seconds",
  duration: 5000,
});

// With action button
toast({
  title: "Action Required",
  description: "Click the button to proceed",
  action: <Button onClick={() => console.log("Action")}>Action</Button>,
});`}
          </pre>
        </div>
      </div>
    );
  },
};

export const ToastPositions: Story = {
  render: () => {
    const showToast = (position: string) => {
      toast({
        title: `Toast (${position})`,
        description: `This toast appears at ${position}`,
      });
    };

    return (
      <div className="flex flex-col gap-4">
        <Toaster position="top-center" />
        <div className="grid grid-cols-3 gap-4">
          <Button onClick={() => showToast("top-left")}>Top Left</Button>
          <Button onClick={() => showToast("top-center")}>Top Center</Button>
          <Button onClick={() => showToast("top-right")}>Top Right</Button>
          <Button onClick={() => showToast("bottom-left")}>Bottom Left</Button>
          <Button onClick={() => showToast("bottom-center")}>Bottom Center</Button>
          <Button onClick={() => showToast("bottom-right")}>Bottom Right</Button>
        </div>
      </div>
    );
  },
};

export const ToastTypes: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <Toaster />
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => 
              toast({
                title: "Default Toast",
                description: "Standard notification",
              })
            }
          >
            Default
          </Button>
          
          <Button
            onClick={() => 
              toast({
                title: "Success Toast",
                description: "Action completed successfully",
                type: "success",
              })
            }
          >
            Success
          </Button>
          
          <Button
            onClick={() => 
              toast({
                title: "Error Toast",
                description: "An error has occurred",
                type: "error",
              })
            }
          >
            Error
          </Button>
          
          <Button
            onClick={() => 
              toast({
                title: "Warning Toast",
                description: "Proceed with caution",
                type: "warning",
              })
            }
          >
            Warning
          </Button>
          
          <Button
            onClick={() => 
              toast({
                title: "Info Toast",
                description: "For your information",
                type: "info",
              })
            }
          >
            Info
          </Button>
          
          <Button
            onClick={() => 
              toast({
                title: "Loading Toast",
                description: "Please wait...",
                type: "loading",
              })
            }
          >
            Loading
          </Button>
        </div>
      </div>
    );
  },
};
