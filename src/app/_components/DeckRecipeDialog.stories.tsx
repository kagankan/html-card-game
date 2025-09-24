import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef } from "react";
import DeckRecipeDialog, { type DeckRecipeDialogRef } from "./DeckRecipeDialog";
import type { ElementName } from "../../service/constants";

const allowedElements: ElementName[] = [
  "body",
  "div",
  "span",
  "a",
  "hr",
  "p",
  "button",
  "ul",
  "li",
  "br",
  "nav",
  "header",
  "footer",
  "main",
  "aside",
  "section",
  "article",
  "h1",
  "h2",
  "script",
  "style",
  "meta",
  "title",
];

const defaultDeckRecipe = {
  body: 1,
  div: 1,
  span: 1,
  a: 1,
  hr: 1,
  p: 1,
  button: 1,
  ul: 1,
  li: 1,
  br: 1,
  nav: 0,
  header: 0,
  footer: 0,
  main: 1,
  aside: 1,
  section: 1,
  article: 1,
  h1: 1,
  h2: 1,
  script: 1,
  style: 1,
  meta: 0,
  title: 0,
} as const;

// Wrapper component to handle the ref and opening state
const DeckRecipeDialogWrapper = ({
  allowedElements,
  defaultDeckRecipe,
  onSubmit,
}: {
  allowedElements: readonly ElementName[];
  defaultDeckRecipe: Partial<Record<ElementName, number>>;
  onSubmit?: (deckRecipe: Partial<Record<ElementName, number>>) => void;
}) => {
  const dialogRef = useRef<DeckRecipeDialogRef>(null);

  const handleOpen = () => {
    dialogRef.current?.onOpen();
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Open Deck Recipe Dialog
      </button>
      <DeckRecipeDialog
        ref={dialogRef}
        allowedElements={allowedElements}
        defaultDeckRecipe={defaultDeckRecipe}
        onSubmit={onSubmit}
      />
    </div>
  );
};

const meta: Meta<typeof DeckRecipeDialogWrapper> = {
  title: "Components/DeckRecipeDialog",
  component: DeckRecipeDialogWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    allowedElements,
    defaultDeckRecipe,
  },
  argTypes: {
    onSubmit: { action: "submitted" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    allowedElements,
    defaultDeckRecipe,
  },
};

export const MinimalElements: Story = {
  args: {
    allowedElements: ["div", "span", "p"] as ElementName[],
    defaultDeckRecipe: {
      div: 2,
      span: 3,
      p: 1,
    },
  },
};

export const ManyElements: Story = {
  args: {
    allowedElements,
    defaultDeckRecipe: {
      ...defaultDeckRecipe,
      div: 5,
      span: 4,
      p: 3,
      button: 2,
      h1: 1,
      h2: 2,
    },
  },
};
