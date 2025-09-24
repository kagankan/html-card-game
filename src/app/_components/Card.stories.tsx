import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    element: "div",
    description: "",
    disabled: false,
    selected: false,
  },
  argTypes: {
    element: {
      control: "select",
      options: [
        "div",
        "span",
        "p",
        "button",
        "h1",
        "h2",
        "a",
        "ul",
        "li",
        "body",
        "main",
        "header",
        "footer",
        "nav",
        "section",
        "article",
        "aside",
      ],
    },
    description: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    selected: {
      control: "boolean",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    element: "div",
  },
};

export const WithDescription: Story = {
  args: {
    element: "p",
    description: "Paragraph element for text content",
  },
};

export const Selected: Story = {
  args: {
    element: "button",
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    element: "span",
    disabled: true,
  },
};

export const HeaderElement: Story = {
  args: {
    element: "h1",
    description: "Main heading element",
  },
};

export const InteractiveElement: Story = {
  args: {
    element: "button",
    description: "Interactive button element",
  },
};
