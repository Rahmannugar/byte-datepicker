import React from "react";

interface DatePickerInputProps {
  label: string;
  placeholder: string;
  isOpen: boolean;
  disabled: boolean;
  error?: boolean;
  required?: boolean;
  onClick: () => void;
  onClear?: () => void;
  clearable?: boolean;
  onBlur?: () => void;
  icon?: "calendar" | "clock";
  ariaLabel?: string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  placeholder,
  isOpen,
  disabled,
  error,
  required,
  onClick,
  onClear,
  clearable,
  onBlur,
  icon = "calendar",
  ariaLabel,
}) => {
  const showClear = Boolean(clearable && label && !disabled && !required);

  return (
    <div
      className={`byte-input ${error ? "invalid" : ""} ${disabled ? "disabled" : ""} ${showClear ? "has-clear" : ""}`}
    >
      <button
        className="byte-input-trigger"
        data-byte-picker-trigger
        type="button"
        onClick={onClick}
        onBlur={onBlur}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        aria-label={ariaLabel || placeholder}
      >
        <span className={label ? "selected" : "placeholder"}>
          {label || placeholder}
          {required && !label && " *"}
        </span>
        {icon === "clock" ? (
          <svg className="byte-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        ) : (
          <svg className="byte-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
      </button>
      {showClear && (
        <button
          className="byte-clear-btn"
          onClick={onClear}
          type="button"
          aria-label="Clear selection"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};
