
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster, toast, dismissToast } from "./sonner";
import { withReducedMotion } from "@/stories/reducedMotion";
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

// --- Loading toasts -------------------------------------------------------------

/**
 * Interactive loading scenario: "Start" opens a loading toast (`id` fixed), optional counter updates in
 * the SAME toast, then "Finish" (or "Fail") turns it into a success (or error) toast with the same id.
 * The success closing delay only starts at that moment. No toast is created automatically.
 */
function LoadingScenario({
  id,
  title,
  counter,
  doneTitle = "Tri des visuels terminé",
  errorTitle = "Le tri des visuels a échoué",
  autoFinishAfter,
}: {
  id: string;
  title: string | ((count: number) => string);
  counter?: boolean;
  doneTitle?: string;
  errorTitle?: string;
  /** Finishes on its own after N seconds (long-running demo). */
  autoFinishAfter?: number;
}) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = React.useRef<ReturnType<typeof setInterval>>();
  const label = (count: number) => (typeof title === "function" ? title(count) : title);

  const stop = () => {
    clearInterval(timer.current);
    setRunning(false);
  };
  React.useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    let count = 1;
    setElapsed(0);
    setRunning(true);
    toast({ id, type: "loading", title: label(count) });
    timer.current = setInterval(() => {
      count += 1;
      setElapsed(count - 1);
      if (counter) toast({ id, type: "loading", title: label(count) });
      if (autoFinishAfter && count > autoFinishAfter) {
        clearInterval(timer.current);
        setRunning(false);
        toast({ id, type: "success", title: doneTitle });
      }
    }, 1000);
  };
  const finish = () => {
    stop();
    toast({ id, type: "success", title: doneTitle });
  };
  const fail = () => {
    stop();
    toast({ id, type: "error", title: errorTitle });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Toaster />
      <div className="flex gap-3">
        <Button onClick={start} disabled={running}>Start</Button>
        <Button onClick={finish} disabled={!running}>Finish</Button>
        <Button onClick={fail} disabled={!running}>Fail</Button>
        <Button onClick={() => { stop(); dismissToast(id); }}>Dismiss</Button>
      </div>
      {running && <span className="text-xs">Running for {elapsed} s</span>}
    </div>
  );
}

/**
 * Neutral loading toast: grey background, dark text, 16 px Spinner, 20 px between the spinner and the
 * text. It stays visible until it is updated or dismissed.
 *
 * ```tsx
 * toast({ id: "sort", type: "loading", title: "Tri automatique des visuels" });
 * // later, same toast:
 * toast({ id: "sort", type: "success", title: "Tri des visuels terminé" });
 * dismissToast("sort"); // or close it
 * ```
 */
export const Loading: Story = {
  render: () => <LoadingScenario id="loading" title="Tri automatique des visuels" />,
};

/** The counter is updated every second in a single toast (no new toast, no entry animation replayed). */
export const LoadingCounterUpdates: Story = {
  render: () => (
    <LoadingScenario
      id="counter"
      counter
      title={(n) => `Analyse des visuels en cours (${n} référence${n > 1 ? "s" : ""})`}
      doneTitle="Analyse des visuels terminée"
    />
  ),
};

/** "Finish": the same toast turns into a success (160 ms fade of the icon and colours), then closes after the usual delay. */
export const LoadingToSuccess: Story = {
  render: () => <LoadingScenario id="to-success" title="Tri automatique des visuels" />,
};

/** "Fail": the same toast turns into an error. */
export const LoadingToError: Story = {
  render: () => <LoadingScenario id="to-error" title="Tri automatique des visuels" />,
};

/** Long label: the text wraps without squeezing the spinner. */
export const LoadingLongText: Story = {
  render: () => (
    <LoadingScenario
      id="long-text"
      title="Analyse des visuels en cours (128 références) : détourage, recadrage et contrôle des formats demandés par le cahier des charges"
    />
  ),
};

/** Reduced motion: static spinner, immediate state change. */
export const LoadingReducedMotion: Story = {
  decorators: [withReducedMotion],
  render: () => <LoadingScenario id="reduced" title="Tri automatique des visuels" />,
};

/** An action longer than the usual toast duration (8 s): the toast stays until the end, then the success closes after 3 s. */
export const LoadingLongRunning: Story = {
  render: () => <LoadingScenario id="long-running" title="Import des visuels" doneTitle="Import terminé" autoFinishAfter={8} />,
};
