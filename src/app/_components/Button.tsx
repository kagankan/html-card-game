import React, { CSSProperties } from "react";
import styles from "./Button.module.css";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "primary" | "secondary" | "disabled";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
}

export default function Button({
  children,
  onClick,
  size = "medium",
  variant = "secondary",
  disabled = false,
  type = "button",
  className = "",
  style,
}: ButtonProps) {
  const effectiveVariant = disabled ? "disabled" : variant;

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[size]} ${styles[effectiveVariant]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
