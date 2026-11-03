import type { Meta, StoryObj } from "@storybook/react-vite";
import { SSOBackofficeExample } from "./SSOBackofficeExample";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

const meta = {
  title: "Examples/CRUD",
  component: SSOBackofficeExample,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 850 } },
  },
  decorators: [Story => <ThemeProvider><TranslationProvider><Story /></TranslationProvider></ThemeProvider>],
} satisfies Meta<typeof SSOBackofficeExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Liste: Story = { name: "List" };
export const Detail: Story = { args: { initialView: "detail" } };
export const Invitation: Story = { args: { initialView: "invite" } };
export const Modification: Story = { name: "Edit", args: { initialView: "edit" } };
export const ErreurDeValidation: Story = { name: "Validation error", args: { initialView: "errors" } };
export const SelectionMultiple: Story = { name: "Multiple selection", args: { initialView: "selection" } };
