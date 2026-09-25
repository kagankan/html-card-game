import { CSSProperties } from "react";

export type CardBackColor = "green" | "blue" | "red";

interface CardBackProps {
  /** 裏面の模様の色 */
  color?: CardBackColor;
  style?: CSSProperties;
}

const COLOR_CLASS: Record<CardBackColor, string> = {
  green: "bg-green-700",
  blue: "bg-blue-700",
  red: "bg-red-700",
};

export default function CardBack({ color = "green", style }: CardBackProps) {
  return (
    <section
      className="aspect-58/89 w-full rounded-lg bg-white p-2 shadow"
      style={style}
      role="img"
      aria-label="裏向きのカード"
    >
      <div className={`h-full w-full rounded ${COLOR_CLASS[color]}`}></div>
    </section>
  );
}
