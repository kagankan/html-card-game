import { CSSProperties } from "react";
import type { ElementName } from "./constants";

interface CardProps {
  element: ElementName;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  style?: CSSProperties;
}

export default function Card({
  element,
  description = "",
  onClick,
  disabled = false,
  selected = false,
  style,
}: CardProps) {
  return (
    <section
      className={`relative isolate aspect-[58/89] w-full overflow-clip rounded-lg shadow ${
        disabled ? "bg-gray-300" : "bg-white"
      } ${selected ? "border-4 border-blue-500" : ""}`}
      style={style }
    >
      <button
        type="button"
        onClick={onClick}
        className="h-full w-full p-2 disabled:text-gray-500"
        disabled={disabled}
        aria-pressed={selected}
      >
        <span className="absolute left-0 top-0">&lt;{element}&gt;</span>
        <span className="text-3xl font-bold">{element}</span>
        {description && <span className="block">{description}</span>}
      </button>
    </section>
  );
}
