import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "disabled"],
    },
    disabled: {
      control: "boolean",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryLarge: Story = {
  args: {
    children: "ゲームスタート",
    size: "large",
    variant: "primary",
  },
};

export const PrimaryMedium: Story = {
  args: {
    children: "ゲームスタート",
    size: "medium",
    variant: "primary",
  },
};

export const SecondaryMedium: Story = {
  args: {
    children: "カードを出す",
    size: "medium",
    variant: "secondary",
  },
};

export const SecondarySmall: Story = {
  args: {
    children: "閉じる",
    size: "small",
    variant: "secondary",
  },
};

export const Disabled: Story = {
  args: {
    children: "無効なボタン",
    size: "medium",
    variant: "secondary",
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Button size="small" variant="secondary">
        Small Button
      </Button>
      <Button size="medium" variant="secondary">
        Medium Button
      </Button>
      <Button size="large" variant="primary">
        Large Button
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Button size="medium" variant="primary">
        Primary Button
      </Button>
      <Button size="medium" variant="secondary">
        Secondary Button
      </Button>
      <Button size="medium" variant="secondary" disabled>
        Disabled Button
      </Button>
    </div>
  ),
};
