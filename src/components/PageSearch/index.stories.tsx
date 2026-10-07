import type { Meta, StoryObj } from "@storybook/react-vite";
import PageSearch from "./index";
import { Search } from "@/components/ui/search";
import { TagStar } from "@/components/ui/tag-star";
import { ButtonMenuSmall } from "@/components/ui/button-menu-small";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactSheetReference } from "@/components/ContactSheetReference";

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
- Padding of 20px on every side (px-4 py-4) and gap of 40px between left and right sections
- Uses Layout component with bg="grey" for proper context propagation
- Left content automatically takes maximum available space (no max-width by default)
- Optional max-width constraint for left content via \`leftContentMaxWidth\` prop
- \`alignWithContactSheet\`: shifts the left content 3px to the left, so that a leading checkbox
  lines up with the checkboxes of the \`ContactSheetReference\` rows below

## Basic Usage

\`\`\`tsx
import { PageSearch } from '@gs/gs-components-library';
import { Search } from '@gs/gs-components-library';

<PageSearch
  leftContent={<Search placeholder="Search..." />}
  rightContent={<ButtonMenuSmall actions={[...]} />}
/>
\`\`\`

## With Max Width

\`\`\`tsx
<PageSearch
  leftContent={<Search placeholder="Search..." />}
  leftContentMaxWidth="max-w-md"
  rightContent={<ButtonMenuSmall actions={[...]} />}
/>
\`\`\`

## Aligned with a contact sheet

\`\`\`tsx
<PageSearch
  alignWithContactSheet
  leftContent={
    <>
      <Checkbox aria-label="Select all" />
      <Search placeholder="Search..." />
    </>
  }
/>
<ContactSheetReference reference={reference} exports={exports} onSelectionChange={…} />
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
      leftContent={<Search placeholder="Search..." />}
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


/**
 * `alignWithContactSheet`: the select-all checkbox of the PageSearch lines up with the checkboxes
 * of the ContactSheetReference rows below.
 */
export const AlignedWithContactSheet: Story = {
  render: () => (
    <div className="bg-grey min-h-screen">
      <PageSearch
        alignWithContactSheet
        leftContent={
          <>
            <Checkbox aria-label="Select all" />
            <Search placeholder="Search..." />
          </>
        }
      />
      {["7e0125de91", "7e0127dr0x"].map((ref, i) => (
        <ContactSheetReference
          key={ref}
          reference={{ reference_id: i, ref }}
          onSelectionChange={() => {}}
          exports={[
            {
              id: "e",
              thumbnails: [1, 2, 3].map((n) => ({
                picture_id: i * 10 + n,
                src: `https://picsum.photos/seed/${ref}-${n}/600/750`,
                filename: `${ref.toUpperCase()}_${n}.tif`,
                view: "worn",
              })),
            },
          ]}
          thumbnailsPerRow={8}
        />
      ))}
    </div>
  ),
};
