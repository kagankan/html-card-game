import React, { CSSProperties } from "react";
import styles from "./Button.module.css";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "primary" | "secondary" | "danger" | "disabled";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** 処理中の表示にする。処理中はクリックを受け付けない */
  loading?: boolean;
  /** 親要素の幅いっぱいに広げる */
  fullWidth?: boolean;
  /** テキストの前に表示するアイコン */
  icon?: React.ReactNode;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
}

const joinClassNames = (...names: (string | false | undefined)[]): string =>
  names.filter(Boolean).join(" ");

export default function Button({
  children,
  onClick,
  size = "medium",
  variant = "secondary",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  "aria-label": ariaLabel,
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
      aria-label={ariaLabel}
      aria-busy={loading}
      className={joinClassNames(
        styles.button,
        styles[size],
        styles[effectiveVariant],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      style={style}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
