import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Thumbnail } from "./Thumbnail";
import { AlertIndicator } from "./AlertIndicator";
import { VedetteIndicator } from "./VedetteIndicator";
import { UrgentIndicator } from "./UrgentIndicator";
import { Three60Indicator } from "./Three60Indicator";
import { ViewIndicator } from "./ViewIndicator";
import { MediaStatus } from "@/utils/mediaStatus";
import { Layout, HStack, VStack } from "@/components/layout";

const meta: Meta<typeof Thumbnail> = {
  title: "Components/Thumbnail",
  component: Thumbnail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "large", "150px", "200px", "250px", "300px", "400px"],
      description: 'Taille prédéfinie ("small", "large") ou personnalisée ("200px", "15rem", etc.)',
    },
    status: {
      control: "select",
      options: [
        undefined,
        MediaStatus.TO_RESHOOT,
        MediaStatus.SUBMITTED_FOR_APPROVAL,
        MediaStatus.VALIDATED,
        MediaStatus.SELECTED,
        MediaStatus.READY_TO_BROADCAST,
        MediaStatus.IGNORED,
        MediaStatus.REFUSED_1,
        MediaStatus.BROADCAST,
      ],
    },
    label: {
      control: "select",
      options: ["blue", "green", "orange", "pink", "purple", "red", "yellow", "white", "transparent"],
    },
    rating: {
      control: { type: "range", min: 0, max: 5, step: 1 },
    },
  },
  args: {
    onImageClick: fn(),
    onSelectionChange: fn(),
    onRatingChange: fn(),
    onLabelChange: fn(),
    onTagAdd: fn(),
    onTagRemove: fn(),
    onCommentAdd: fn(),
    onValidate: fn(),
    onReject: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample image URL
const sampleImageUrl = "https://picsum.photos/340/340";
const sampleImageUrl2 = "https://picsum.photos/341/341";
const sampleImageUrl3 = "https://picsum.photos/342/342";

/**
 * Default thumbnail with all features
 */
export const Default: Story = {
  args: {
    src: sampleImageUrl,
    alt: "Sample image",
    filename: "photo_2024_01_15_very_long_filename_that_should_truncate.jpg",
    rating: 3,
    label: "yellow",
    tags: { "product-shot": true, "hero-image": true },
    comments: [
      { comment: "Great shot!", type: "Comment", date_mod: "2024-01-15" },
    ],
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    rightIndicators: <ViewIndicator view="F" />,
  },
};

/**
 * Thumbnail with all different status values
 * Shows the MediaStatus bar at the bottom with different colors
 */
export const WithStatus: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">All Status Types:</div>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="to_reshoot.jpg"
              status={MediaStatus.TO_RESHOOT}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">To Reshoot (5)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="for_approval.jpg"
              status={MediaStatus.SUBMITTED_FOR_APPROVAL}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">For Approval (40)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="validated.jpg"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Validated (50)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="selected.jpg"
              status={MediaStatus.SELECTED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Selected (30)</span>
          </VStack>
        </HStack>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="ready_to_broadcast.jpg"
              status={MediaStatus.READY_TO_BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Ready to Broadcast (51)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="ignored.jpg"
              status={MediaStatus.IGNORED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Ignored (1)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="refused.jpg"
              status={MediaStatus.REFUSED_1}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Refused (31)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="broadcast.jpg"
              status={MediaStatus.BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Broadcast (55)</span>
          </VStack>
        </HStack>
        <HStack gap={4} className="flex-wrap">
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="not_selected.jpg"
              status={MediaStatus.NOT_SELECTED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Not Selected (10)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="error.jpg"
              status={MediaStatus.ERROR_DURING_BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Error (52)</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="archived.jpg"
              status={MediaStatus.ARCHIVED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">Archived (80)</span>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  ),
};

/**
 * Thumbnail with multiple indicators
 */
export const WithIndicators: Story = {
  args: {
    src: sampleImageUrl,
    filename: "urgent_photo.jpg",
    rating: 5,
    label: "red",
    status: MediaStatus.TO_RESHOOT,
    leftIndicators: (
      <>
        <UrgentIndicator />
        <AlertIndicator />
        <VedetteIndicator />
        <Three60Indicator />
      </>
    ),
    rightIndicators: <ViewIndicator view="B" />,
  },
};

/**
 * Selected thumbnail
 */
export const Selected: Story = {
  args: {
    src: sampleImageUrl,
    filename: "selected_photo.jpg",
    selected: true,
    rating: 4,
    label: "green",
    status: MediaStatus.VALIDATED,
    rightIndicators: <ViewIndicator view="F" />,
  },
};

/**
 * Small size thumbnail
 */
export const SmallSize: Story = {
  args: {
    src: sampleImageUrl,
    filename: "small_photo.jpg",
    size: "small",
    rating: 2,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    rightIndicators: <ViewIndicator view="L" />,
  },
};

/**
 * Custom size thumbnails
 * You can pass any CSS size value like "400px", "200px", "15rem", etc.
 */
export const CustomSize: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <VStack gap={4}>
        <div className="text-sm font-medium mb-2">Custom Sizes:</div>
        <HStack gap={4} className="flex-wrap items-end">
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="custom_150px.jpg"
              size="150px"
              status={MediaStatus.VALIDATED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">150px</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="custom_200px.jpg"
              size="200px"
              status={MediaStatus.SUBMITTED_FOR_APPROVAL}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">200px</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="custom_250px.jpg"
              size="250px"
              status={MediaStatus.SELECTED}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">250px</span>
          </VStack>
          <VStack gap={1} align="center">
            <Thumbnail
              src={sampleImageUrl}
              filename="custom_400px.jpg"
              size="400px"
              status={MediaStatus.BROADCAST}
              onSelectionChange={fn()}
              onValidate={undefined}
              onReject={undefined}
            />
            <span className="text-xs">400px</span>
          </VStack>
        </HStack>
      </VStack>
    </Layout>
  ),
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    filename: "loading_photo.jpg",
    isLoading: true,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
  },
};

/**
 * Error state (no image)
 */
export const Error: Story = {
  args: {
    filename: "missing_photo.jpg",
    hasError: true,
    placeholder: "Image non disponible",
    status: MediaStatus.REFUSED_1,
  },
};

/**
 * With custom actions
 */
export const WithActions: Story = {
  args: {
    src: sampleImageUrl,
    filename: "photo_with_actions.jpg",
    rating: 3,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    actions: [
      { key: "download", label: "Télécharger", action: () => console.log("Download") },
      { key: "edit", label: "Modifier", action: () => console.log("Edit") },
      { key: "delete", label: "Supprimer", action: () => console.log("Delete"), disabled: true },
      { key: "share", label: "Partager", action: () => console.log("Share") },
    ],
    rightIndicators: <ViewIndicator view="F" />,
  },
};

/**
 * Without validation buttons
 */
export const WithoutValidation: Story = {
  args: {
    src: sampleImageUrl,
    filename: "no_validation_photo.jpg",
    rating: 2,
    status: MediaStatus.BROADCAST,
    onValidate: undefined,
    onReject: undefined,
    rightIndicators: <ViewIndicator view="F" />,
  },
};

/**
 * Read-only (no callbacks)
 */
export const ReadOnly: Story = {
  args: {
    src: sampleImageUrl,
    filename: "readonly_photo.jpg",
    rating: 4,
    label: "blue",
    status: MediaStatus.SELECTED,
    onImageClick: undefined,
    onSelectionChange: undefined,
    onRatingChange: undefined,
    onLabelChange: undefined,
    onTagAdd: undefined,
    onTagRemove: undefined,
    onCommentAdd: undefined,
    onValidate: undefined,
    onReject: undefined,
    rightIndicators: <ViewIndicator view="R" />,
  },
};

/**
 * Grid of thumbnails
 */
export const ThumbnailGrid: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <HStack gap={4} className="flex-wrap">
        <Thumbnail
          src={sampleImageUrl}
          filename="photo_001.jpg"
          rating={3}
          status={MediaStatus.SUBMITTED_FOR_APPROVAL}
          onSelectionChange={fn()}
          onRatingChange={fn()}
          onLabelChange={fn()}
          rightIndicators={<ViewIndicator view="F" />}
        />
        <Thumbnail
          src={sampleImageUrl2}
          filename="photo_002.jpg"
          rating={5}
          selected
          status={MediaStatus.VALIDATED}
          onSelectionChange={fn()}
          onRatingChange={fn()}
          onLabelChange={fn()}
          leftIndicators={<VedetteIndicator />}
          rightIndicators={<ViewIndicator view="B" />}
        />
        <Thumbnail
          src={sampleImageUrl3}
          filename="photo_003.jpg"
          rating={1}
          status={MediaStatus.REFUSED_1}
          onSelectionChange={fn()}
          onRatingChange={fn()}
          onLabelChange={fn()}
          leftIndicators={<AlertIndicator />}
          rightIndicators={<ViewIndicator view="L" />}
        />
      </HStack>
    </Layout>
  ),
};

/**
 * Small thumbnails grid
 */
export const SmallThumbnailGrid: Story = {
  render: () => (
    <Layout bg="grey" padding={4}>
      <HStack gap={2} className="flex-wrap">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Thumbnail
            key={i}
            src={`https://picsum.photos/100/100?random=${i}`}
            filename={`photo_${i.toString().padStart(3, "0")}.jpg`}
            size="small"
            rating={i % 6}
            status={
              i % 3 === 0
                ? MediaStatus.VALIDATED
                : i % 3 === 1
                ? MediaStatus.SUBMITTED_FOR_APPROVAL
                : MediaStatus.REFUSED_1
            }
            onSelectionChange={fn()}
            onRatingChange={fn()}
            onLabelChange={fn()}
            onValidate={undefined}
            onReject={undefined}
            rightIndicators={<ViewIndicator view={["F", "B", "L", "R", "T", "D"][i - 1]} />}
          />
        ))}
      </HStack>
    </Layout>
  ),
};
