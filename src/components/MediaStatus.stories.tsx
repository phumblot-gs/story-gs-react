
import type { Meta, StoryObj } from "@storybook/react-vite";
import MediaStatus from "./MediaStatus";
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus";

const meta: Meta<typeof MediaStatus> = {
  title: "Components/MediaStatus",
  component: MediaStatus,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: {
        type: "select",
        options: Object.values(MediaStatusEnum).filter(value => typeof value === 'number'),
      },
      description: "Status code of the media",
    },
    width: {
      control: { type: "number" },
      description: "Width of the status indicator in pixels",
    },
    height: {
      control: { type: "number" },
      description: "Height of the status indicator in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaStatus>;

export const Default: Story = {
  args: {
    status: MediaStatusEnum.SELECTED,
    width: 12,
    height: 3,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Media Status Indicators</h3>
      <div className="flex flex-col space-y-4">
        {Object.entries(MediaStatusEnum)
          .filter(([key, value]) => typeof value === 'number')
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <MediaStatus status={value as MediaStatusEnum} />
              <span className="text-sm font-medium">{key} ({value})</span>
            </div>
          ))}
      </div>
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Different Sizes</h3>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-3">
          <MediaStatus status={MediaStatusEnum.SELECTED} width={8} height={2} />
          <span className="text-sm">Small (8×2)</span>
        </div>
        <div className="flex items-center gap-3">
          <MediaStatus status={MediaStatusEnum.SELECTED} width={12} height={3} />
          <span className="text-sm">Default (12×3)</span>
        </div>
        <div className="flex items-center gap-3">
          <MediaStatus status={MediaStatusEnum.SELECTED} width={24} height={4} />
          <span className="text-sm">Large (24×4)</span>
        </div>
        <div className="flex items-center gap-3">
          <MediaStatus status={MediaStatusEnum.SELECTED} width={48} height={6} />
          <span className="text-sm">Extra Large (48×6)</span>
        </div>
      </div>
    </div>
  ),
};
