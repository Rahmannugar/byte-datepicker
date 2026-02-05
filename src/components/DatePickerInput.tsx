import React from "react";

interface DatePickerInputProps {
  label: string;
  placeholder: string;
  isOpen: boolean;
  disabled: boolean;
  error?: boolean;
  required?: boolean;
  name?: string;
  value: string;
  onClick: () => void;
  onClear?: () => void;
  clearable?: boolean;
  onBlur?: () => void;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  placeholder,
  isOpen,
  disabled,
  error,
  required,
  name,
  value,
  onClick,
  onClear,
  clearable,
  onBlur,
}) => {
  return (
    <div
      className={`datepicker-input ${error ? "invalid" : ""} ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onClick()}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          !disabled && onClick();
        }
      }}
    >
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        onBlur={onBlur}
      />
      <span className={label ? "selected" : "placeholder"}>
        {label || placeholder}
        {required && !label && " *"}
      </span>
      <div className="datepicker-input-actions">
        {clearable && label && !disabled && (
          <button
            className="clear-button"
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
            type="button"
            aria-label="Clear selection"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <svg
          className="datepicker-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
    </div>
  );
};
