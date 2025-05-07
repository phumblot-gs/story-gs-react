
import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "./index";
import { ButtonCircle } from "@/components/ui/button-circle";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title text displayed in the header"
    },
    showTitleButton: {
      control: "boolean",
      description: "Whether to show the edit button next to the title"
    },
    titleButtonIcon: {
      control: "select",
      options: ["Pencil", "Edit", "Settings", "Plus"],
      description: "Icon to use for the title button"
    },
    logo: {
      control: "object",
      description: "Custom logo component to display"
    },
    centerContent: {
      control: "object",
      description: "Content to display in the center section"
    },
    rightContent: {
      control: "object",
      description: "Content to display in the right section"
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply"
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// Custom logo component for the stories
const GsLogo = () => (
  <div className="flex items-center justify-center font-bold text-black text-lg">
    <span>GS</span>
  </div>
);

// Example workflow tabs for center content
const WorkflowTabs = () => (
  <div className="flex items-center gap-4">
    <div className="px-3 py-1">LIVE</div>
    <div className="px-3 py-1">PHASE 1</div>
    <div className="px-3 py-1">EXPORTS</div>
    <div className="px-3 py-1 bg-black text-white rounded-full">VALIDATION</div>
  </div>
);

// Right side content with buttons
const RightSideButtons = () => (
  <>
    <span className="text-sm font-medium">FR</span>
    <ButtonCircle icon="User" />
    <ButtonCircle icon="Settings" />
    <ButtonCircle icon="Help" />
    <ButtonCircle icon="Bell" indicator={true} />
    <ButtonCircle icon="Logout" />
  </>
);

export const Default: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
  },
};

export const WithLogo: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
  },
};

export const Complete: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    centerContent: <WorkflowTabs />,
    rightContent: <RightSideButtons />,
  },
};

export const NoTitleButton: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: false,
    centerContent: <WorkflowTabs />,
    rightContent: <RightSideButtons />,
  },
};

export const CustomTitleButton: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    titleButtonIcon: "Plus",
    centerContent: <WorkflowTabs />,
    rightContent: <RightSideButtons />,
  },
};
