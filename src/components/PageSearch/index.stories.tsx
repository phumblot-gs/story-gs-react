import type { Meta, StoryObj } from "@storybook/react-vite";
import PageSearch from "./index";
import { Search } from "@/components/ui/search";
import { TagStar } from "@/components/ui/tag-star";
import { ButtonMenuSmall } from "@/components/ui/button-menu-small";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";

const meta: Meta<typeof PageSearch> = {
  title: "Components/PageSearch",
  component: PageSearch,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `PageSearch component for displaying a search bar with filters and actions.

## Features
- Flexible left area for Search component and other filters (e.g., TagStar)
- Flexible right area for actions (e.g., ButtonMenuSmall, Toggle)
- Fixed style with grey background and bottom border
- Horizontal spacing of 20px (px-4) and gap of 40px between left and right sections
- Uses Layout component with bg="grey" for proper context propagation

## Basic Usage

\`\`\`tsx
import { PageSearch } from '@gs/gs-components-library';
import { Search } from '@gs/gs-components-library';

<PageSearch
  leftContent={<Search placeholder="Search..." />}
  rightContent={<ButtonMenuSmall actions={[...]} />}
/>
\`\`\`

## With Filters

\`\`\`tsx
<PageSearch
  leftContent={
    <>
      <Search placeholder="Search..." />
      <TagStar value={5} />
    </>
  }
  rightContent={
    <>
      <ButtonMenuSmall actions={[...]} />
      <Toggle />
    </>
  }
/>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageSearch>;

export const Default: Story = {
  render: () => (
    <PageSearch
      leftContent={<Search placeholder="Search..." className="w-full max-w-md" />}
    />
  ),
};

export const WithFilters: Story = {
  render: () => {
    return (
      <PageSearch
        leftContent={
          <>
            <Search placeholder="Search..." />
            <TagStar value={5} />
            <Button variant="link" className="px-0">Deselect</Button>
          </>
        }
        rightContent={
          <Button variant="secondary" size="medium" className="p-0 w-6 h-6">
            <Icon name="Settings" size={12} />
          </Button>
        }
      />
    );
  },
};

