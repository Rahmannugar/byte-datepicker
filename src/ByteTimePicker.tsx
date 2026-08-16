import { useCallback, useEffect, useRef, useState } from "react";
import { DatePickerInput } from "./components/DatePickerInput";
import { PickerPopover } from "./components/PickerPopover";
import { PickerFormInput } from "./components/PickerFormInput";
import { TimeSelector } from "./components/TimeSelector";
import { useDarkMode } from "./hooks/useDarkMode";
import { TimePickerProps } from "./types";
import {
  formatTimeForDisplay,
  isTimeInRange,
  parseTime,
  toTimeValue,
} from "./utils/timeUtils";

function normalizeTime(value?: string | null): string | null {
  const parsed = parseTime(value);
  return parsed ? toTimeValue(parsed.hour, parsed.minute) : null;
}

export default function ByteTimePicker(props: TimePickerProps) {
  const {
    value,
    onChange,
    placeholder = "Select time",
    disabled = false,
    hideInput = false,
    required = false,
    name,
    onBlur,
    error,
    className = "",
    theme = "light",
    clearable = false,
    hourFormat = 12,
    minuteStep = 1,
    minTime,
    maxTime,
    children,
  } = props;

  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(() =>
    normalizeTime(value),
  );
  const selectedTime = controlled ? normalizeTime(value) : internalValue;
  const [draftTime, setDraftTime] = useState<string | null>(selectedTime);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDarkMode = useDarkMode(theme);

  const open = useCallback(() => {
    if (disabled) return;
    setDraftTime(selectedTime);
    setIsOpen(true);
  }, [disabled, selectedTime]);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const clear = useCallback(() => {
    if (disabled || required) return;
    setDraftTime(null);
    if (!controlled) setInternalValue(null);
    onChange?.(null);
  }, [controlled, disabled, onChange, required]);

  const draftIsValid = Boolean(
    draftTime && isTimeInRange(draftTime, minTime, maxTime),
  );

  const confirm = () => {
    if (disabled || !draftTime || !draftIsValid) return;
    if (!controlled) setInternalValue(draftTime);
    onChange?.(draftTime);
    dismiss();
  };

  const formattedValue = selectedTime
    ? formatTimeForDisplay(selectedTime, hourFormat)
    : "";

  return (
    <div
      className={`byte-datepicker-container ${className} ${isDarkMode ? "byte-dark" : ""}`}
      ref={containerRef}
    >
      <PickerFormInput
        sourceRef={containerRef}
        name={name}
        value={selectedTime || ""}
        required={required}
        disabled={disabled}
      />
      {!hideInput ? (
        <DatePickerInput
          label={formattedValue}
          placeholder={placeholder}
          isOpen={isOpen}
          disabled={disabled}
          error={error}
          required={required}
          onClick={isOpen ? dismiss : open}
          onClear={clear}
          clearable={clearable}
          onBlur={() => {
            if (!isOpen) onBlur?.();
          }}
          icon="clock"
          ariaLabel={placeholder}
        />
      ) : (
        children?.({
          open,
          isOpen,
          selectedTime,
          formattedValue,
          clear,
        })
      )}

      <PickerPopover
        open={isOpen}
        sourceRef={containerRef}
        onDismiss={dismiss}
        dark={isDarkMode}
        ariaLabel="Choose a time"
      >
        {isOpen && (
          <>
            <h2 className="byte-picker-heading">Select time</h2>
            <TimeSelector
              value={draftTime}
              onChange={setDraftTime}
              hourFormat={hourFormat}
              minuteStep={minuteStep}
            />
            {draftTime && !draftIsValid && (
              <p className="byte-picker-error" role="status">
                Choose a time within the allowed range.
              </p>
            )}
            <div className="byte-picker-footer">
              <button
                className="byte-action-btn byte-action-secondary"
                type="button"
                onClick={dismiss}
              >
                Cancel
              </button>
              <button
                className="byte-action-btn byte-action-primary"
                type="button"
                onClick={confirm}
                disabled={!draftIsValid}
              >
                Done
              </button>
            </div>
          </>
        )}
      </PickerPopover>
    </div>
  );
}
