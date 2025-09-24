import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CardBack from "./CardBack";

const meta: Meta<typeof CardBack> = {
  title: "Components/CardBack",
  component: CardBack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
  argTypes: {
    style: {
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomSize: Story = {
  args: {
    style: {
      width: "200px",
      height: "300px",
    },
  },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <CardBack />
      <CardBack />
      <CardBack />
    </div>
  ),
};
