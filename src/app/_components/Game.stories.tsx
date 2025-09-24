import type { Meta, StoryObj } from "@storybook/react";
import Game from "./Game";

const meta: Meta<typeof Game> = {
  title: "Components/Game",
  component: Game,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem", minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export const LoadingState: Story = {
  render: () => (
    <div style={{ padding: "1rem", minHeight: "100vh" }}>
      <div>Loading...</div>
    </div>
  ),
};
