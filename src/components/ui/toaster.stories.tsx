
import React, { useState } from "react";
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
    debug: {
      control: "boolean",
      description: "Enable debug mode to log toast actions in console",
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  args: {
    defaultDuration: 2000,
    position: "top-center",
    debug: false,
  },
  render: (args) => {
    const [title, setTitle] = useState("Toast Title");
    const [description, setDescription] = useState("This is a toast notification");
    
    return (
      <div className="flex flex-col gap-4 items-center">
        <Toaster {...args} />
        
        <div className="w-full max-w-md space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Toast Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Toast Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 max-w-xl">
          <Button
            onClick={() =>
              toast({
                title,
                description,
                debug: args.debug,
              })
            }
          >
            Default Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title,
                description,
                type: "success",
                debug: args.debug,
              })
            }
          >
            Success Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title,
                description,
                type: "error",
                debug: args.debug,
              })
            }
          >
            Error Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title,
                description,
                type: "warning",
                debug: args.debug,
              })
            }
          >
            Warning Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title,
                description,
                type: "info",
                debug: args.debug,
              })
            }
          >
            Info Toast
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title,
                description,
                duration: 5000,
                debug: args.debug,
              })
            }
          >
            Custom Duration (5s)
          </Button>
          
          <Button
            onClick={() =>
              toast({
                title,
                description,
                action: (
                  <Button
                    size="small"
                    background="black"
                    onClick={() => console.log("Action button clicked")}
                  >
                    Action
                  </Button>
                ),
                debug: args.debug,
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

// Success toast with debug mode
toast({
  title: "Success",
  description: "Your action was completed successfully",
  type: "success", 
  debug: true // Logs information to console
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

export const ToastTypes: Story = {
  render: (args) => {
    return (
      <div className="flex flex-col gap-4">
        <Toaster debug={args.debug} />
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => 
              toast({
                title: "Default Toast",
                description: "Standard notification",
                debug: args.debug,
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
                debug: args.debug,
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
                debug: args.debug,
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
                debug: args.debug,
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
                debug: args.debug,
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
                debug: args.debug,
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
