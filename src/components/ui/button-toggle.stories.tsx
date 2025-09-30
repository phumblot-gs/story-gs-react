import type { Meta, StoryObj } from "@storybook/react";
import { ButtonToggle } from "./button-toggle";
import { useState } from "react";

const meta: Meta<typeof ButtonToggle> = {
  title: "UI/ButtonToggle",
  component: ButtonToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A switch-style toggle button component that follows the Figma design system with a sliding pill indicator.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "boolean",
      description: "The current toggle state (true = ON, false = OFF)",
    },
    onValueChange: {
      action: "value changed",
      description: "Callback when the toggle state changes",
    },
    onText: {
      control: "text",
      description: "Text to display when toggle is ON",
    },
    offText: {
      control: "text",
      description: "Text to display when toggle is OFF",
    },
    bg: {
      options: ["White", "Black", "Grey"],
      control: { type: "radio" },
      description: "Background context color variant",
    },
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with interactive state
export const Default: Story = {
  args: {
    value: false,
    onText: "On",
    offText: "Off",
    bg: "White",
    disabled: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <ButtonToggle
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

// ON state
export const On: Story = {
  args: {
    value: true,
    bg: "White",
  },
  render: (args) => {
    const [value, setValue] = useState(true);
    return (
      <ButtonToggle
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

// OFF state
export const Off: Story = {
  args: {
    value: false,
    bg: "White",
  },
  render: (args) => {
    const [value, setValue] = useState(false);
    return (
      <ButtonToggle
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

// Different backgrounds with all states
export const AllVariants: Story = {
  render: () => {
    const [values, setValues] = useState({
      whiteOn: true,
      whiteOff: false,
      blackOn: true,
      blackOff: false,
      greyOn: true,
      greyOff: false,
    });
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">White Background</h3>
          <div className="flex gap-4 items-center p-4 bg-white rounded">
            <ButtonToggle
              value={values.whiteOn}
              onValueChange={(v) => setValues({...values, whiteOn: v})}
              bg="White"
            />
            <ButtonToggle
              value={values.whiteOff}
              onValueChange={(v) => setValues({...values, whiteOff: v})}
              bg="White"
            />
            <ButtonToggle
              value={true}
              bg="White"
              disabled
            />
            <ButtonToggle
              value={false}
              bg="White"
              disabled
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-3">Black Background</h3>
          <div className="flex gap-4 items-center p-4 bg-black rounded">
            <ButtonToggle
              value={values.blackOn}
              onValueChange={(v) => setValues({...values, blackOn: v})}
              bg="Black"
            />
            <ButtonToggle
              value={values.blackOff}
              onValueChange={(v) => setValues({...values, blackOff: v})}
              bg="Black"
            />
            <ButtonToggle
              value={true}
              bg="Black"
              disabled
            />
            <ButtonToggle
              value={false}
              bg="Black"
              disabled
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-3">Grey Background</h3>
          <div className="flex gap-4 items-center p-4 bg-grey rounded">
            <ButtonToggle
              value={values.greyOn}
              onValueChange={(v) => setValues({...values, greyOn: v})}
              bg="Grey"
            />
            <ButtonToggle
              value={values.greyOff}
              onValueChange={(v) => setValues({...values, greyOff: v})}
              bg="Grey"
            />
            <ButtonToggle
              value={true}
              bg="Grey"
              disabled
            />
            <ButtonToggle
              value={false}
              bg="Grey"
              disabled
            />
          </div>
        </div>
      </div>
    );
  },
};

// Different backgrounds
export const Backgrounds: Story = {
  render: () => {
    const [value1, setValue1] = useState(false);
    const [value2, setValue2] = useState(false);
    const [value3, setValue3] = useState(false);
    
    return (
      <div className="flex gap-4 items-center">
        <div className="p-4 bg-white rounded">
          <ButtonToggle
            value={value1}
            onValueChange={setValue1}
            bg="White"
          />
        </div>
        <div className="p-4 bg-black rounded">
          <ButtonToggle
            value={value2}
            onValueChange={setValue2}
            bg="Black"
          />
        </div>
        <div className="p-4 bg-grey rounded">
          <ButtonToggle
            value={value3}
            onValueChange={setValue3}
            bg="Grey"
          />
        </div>
      </div>
    );
  },
};

// Disabled states
export const Disabled: Story = {
  render: () => {
    return (
      <div className="flex gap-4 items-center">
        <ButtonToggle
          value={false}
          disabled
          bg="White"
        />
        <ButtonToggle
          value={true}
          disabled
          bg="White"
        />
      </div>
    );
  },
};

// Custom text labels
export const CustomLabels: Story = {
  render: () => {
    const [value1, setValue1] = useState(true);
    const [value2, setValue2] = useState(false);
    const [value3, setValue3] = useState(true);
    
    return (
      <div className="flex gap-4 items-center">
        <ButtonToggle
          value={value1}
          onValueChange={setValue1}
          onText="Active"
          offText="Inactive"
          bg="White"
        />
        <ButtonToggle
          value={value2}
          onValueChange={setValue2}
          onText="Enabled"
          offText="Disabled"
          bg="White"
        />
        <ButtonToggle
          value={value3}
          onValueChange={setValue3}
          onText="Published"
          offText="Draft"
          bg="White"
        />
      </div>
    );
  },
};

// Real-world examples
export const Examples: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between w-64">
          <span className="text-sm">Notifications</span>
          <ButtonToggle
            value={notifications}
            onValueChange={setNotifications}
            onText="On"
            offText="Off"
            bg="White"
          />
        </div>
        <div className="flex items-center justify-between w-64">
          <span className="text-sm">Dark Mode</span>
          <ButtonToggle
            value={darkMode}
            onValueChange={setDarkMode}
            onText="Dark"
            offText="Light"
            bg="White"
          />
        </div>
        <div className="flex items-center justify-between w-64">
          <span className="text-sm">Auto-save</span>
          <ButtonToggle
            value={autoSave}
            onValueChange={setAutoSave}
            onText="Yes"
            offText="No"
            bg="White"
          />
        </div>
      </div>
    );
  },
};