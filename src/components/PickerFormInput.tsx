import { RefObject } from "react";

interface PickerFormInputProps {
  sourceRef: RefObject<HTMLDivElement | null>;
  name?: string;
  value: string;
  required: boolean;
  disabled: boolean;
}

export function PickerFormInput({
  sourceRef,
  name,
  value,
  required,
  disabled,
}: PickerFormInputProps) {
  return (
    <input
      className="byte-form-input"
      type="text"
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      tabIndex={-1}
      aria-hidden="true"
      onChange={() => undefined}
      onInvalid={(event) => {
        const focusTarget = sourceRef.current?.querySelector<HTMLElement>(
          "[data-byte-picker-trigger], button, input:not(.byte-form-input), [tabindex]:not([tabindex='-1'])",
        );
        if (focusTarget) {
          event.preventDefault();
          focusTarget.focus();
        }
      }}
    />
  );
}
