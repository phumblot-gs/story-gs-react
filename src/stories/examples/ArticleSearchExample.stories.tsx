import type { Meta, StoryObj } from "@storybook/react-vite";
import { referenceListSample } from "./reference-list";
import { ArticleSearchExample } from "./ArticleSearchExample";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

const meta = {
  title: "Examples/Article search",
  component: ArticleSearchExample,
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 900 } } },
  decorators: [Story => <ThemeProvider><TranslationProvider><Story /></TranslationProvider></ThemeProvider>],
} satisfies Meta<typeof ArticleSearchExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ByShelf: Story = { name: "By shelf" };
export const ArticleList: Story = { name: "Article list", args: { initialView: "articles" } };
export const EmptyShelves: Story = { name: "Empty shelves", args: { initiallyIncludeEmpty: true } };
export const SearchByZone: Story = { name: "Search by zone", args: { initialQuery: "Zone A", initialField: "zone" } };
export const NoResults: Story = { name: "No results", args: { initialQuery: "inconnu" } };

export const SmartPaste: Story = { name: "Proposal 1 — smart paste", args: { referenceInput: "smart", initialView: "articles" } };
export const SmartPasteWithList: Story = { name: "Proposal 1 — pasted list", args: { referenceInput: "smart", initialView: "articles", initialReferences: referenceListSample } };
export const ExplicitListMode: Story = { name: "Proposal 2 — explicit mode", args: { referenceInput: "explicit", initialView: "articles" } };
export const ExplicitListWithData: Story = { name: "Proposal 2 — pasted list", args: { referenceInput: "explicit", initialView: "articles", initialReferences: referenceListSample } };

export const KeyboardExpandable: Story = { name: "Keyboard — expandable search", args: { referenceInput: "keyboard", initialField: "reference", initialView: "articles" } };
export const KeyboardWithCriteria: Story = { name: "Keyboard — collapsed criteria", args: { referenceInput: "keyboard", initialField: "reference", initialView: "articles", initialReferences: referenceListSample } };
export const KeyboardExpanded: Story = { name: "Keyboard — expanded editor", args: { referenceInput: "keyboard", initialField: "reference", initialView: "articles", initialReferences: referenceListSample, initiallyExpanded: true } };
