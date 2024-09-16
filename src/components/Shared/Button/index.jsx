import React from "react";
import "../Button/index.css";

export default function Button({
  children,
  onClick,
  className = "btn_blue",
  disabled,
}) {
  return (
    <button
      className={`_btn_core ${className} ${disabled ? "disabled_btn" : ""}`}
      onClick={() => {
        if (disabled) return;
        onClick && onClick();
      }}
      disabled={disabled || false}
    >
      <span> {children}</span>
    </button>
  );
}
