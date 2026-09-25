import { CSSProperties } from "react";
import type { ElementName } from "../../service/constants";

export type CardSize = "small" | "medium" | "large";

interface CardProps {
  element: ElementName;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  /** カードの文字サイズ。幅は親要素に合わせる */
  size?: CardSize;
  style?: CSSProperties;
}

const ELEMENT_TEXT_CLASS: Record<CardSize, string> = {
  small: "text-xl",
  medium: "text-3xl",
  large: "text-5xl",
};

export default function Card({
  element,
  description = "",
  onClick,
  disabled = false,
  selected = false,
  size = "medium",
  style,
}: CardProps) {
  return (
    <section
      className={`relative isolate aspect-58/89 w-full overflow-clip rounded-lg shadow ${
        disabled ? "bg-gray-300" : "bg-white"
      } ${selected ? "border-4 border-blue-500" : ""}`}
      style={style}
    >
      <button
        type="button"
        onClick={onClick}
        className="h-full w-full p-2 disabled:text-gray-500"
        disabled={disabled}
        aria-pressed={selected}
        aria-label={`${element} 要素のカード`}
      >
        <span className="absolute top-0 left-0">&lt;{element}&gt;</span>
        <span className={`${ELEMENT_TEXT_CLASS[size]} font-bold`}>
          {element}
        </span>
        {description && (
          <span
            className="block"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </button>
    </section>
  );
}
