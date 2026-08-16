import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import { DatePickerInput } from "./components/DatePickerInput";
import { DayGrid } from "./components/DayGrid";
import { MonthGrid } from "./components/MonthGrid";
import { PickerPopover } from "./components/PickerPopover";
import { PickerFormInput } from "./components/PickerFormInput";
import { TimeSelector } from "./components/TimeSelector";
import { YearGrid } from "./components/YearGrid";
import { DateTimePickerProps, ViewMode } from "./types";
import {
  formatDateByString,
  formatLocalDateTime,
  clampDateToRange,
  isDateInRange,
  monthNames,
  normalizeToDateTime,
} from "./utils/dateUtils";
import {
  combineDateAndTime,
  formatTimeForDisplay,
  getTimeFromDate,
} from "./utils/timeUtils";
import { useDarkMode } from "./hooks/useDarkMode";

type DateTimeStep = "date" | "time";

function normalizeValueToMinute(value?: Date | string | null): Date | null {
  const normalized = normalizeToDateTime(value);
  if (!normalized) return null;
  normalized.setSeconds(0, 0);
  return normalized;
}

export default function ByteDateTimePicker(props: DateTimePickerProps) {
  const {
    value,
    onChange,
    placeholder = "Select date and time",
    disabled = false,
    hideInput = false,
    required = false,
    name,
    onBlur,
    error,
    className = "",
    theme = "light",
    clearable = false,
    minDateTime,
    maxDateTime,
    dateFormatString = "dd month yyyy",
    hourFormat = 12,
    minuteStep = 1,
    children,
  } = props;

  const controlled = value !== undefined;
  const normalizedValue = useMemo(
    () => normalizeValueToMinute(value),
    [value],
  );
  const [internalValue, setInternalValue] = useState<Date | null>(
    normalizedValue,
  );
  const selectedDateTime = controlled ? normalizedValue : internalValue;
  const min = useMemo(() => normalizeToDateTime(minDateTime), [minDateTime]);
  const max = useMemo(() => normalizeToDateTime(maxDateTime), [maxDateTime]);
  const initialCalendarDate =
    selectedDateTime ?? clampDateToRange(new Date(), min, max);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<DateTimeStep>("date");
  const [draftDate, setDraftDate] = useState<Date | null>(selectedDateTime);
  const [draftTime, setDraftTime] = useState<string | null>(
    selectedDateTime ? getTimeFromDate(selectedDateTime) : null,
  );
  const [currentYear, setCurrentYear] = useState(
    initialCalendarDate.getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState(
    initialCalendarDate.getMonth(),
  );
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const containerRef = useRef<HTMLDivElement>(null);

  const isDarkMode = useDarkMode(theme);

  const open = useCallback(() => {
    if (disabled) return;
    const startingDate =
      selectedDateTime ?? clampDateToRange(new Date(), min, max);
    setDraftDate(selectedDateTime);
    setDraftTime(selectedDateTime ? getTimeFromDate(selectedDateTime) : null);
    setCurrentYear(startingDate.getFullYear());
    setCurrentMonth(startingDate.getMonth());
    setViewMode("days");
    setStep("date");
    setIsOpen(true);
  }, [disabled, selectedDateTime, min, max]);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const clear = useCallback(() => {
    if (disabled || required) return;
    setDraftDate(null);
    setDraftTime(null);
    setStep("date");
    if (!controlled) setInternalValue(null);
    onChange?.(null);
  }, [controlled, disabled, onChange, required]);

  const handleDaySelect = (day: number) => {
    const nextDate = new Date(currentYear, currentMonth, day);
    if (!isDateInRange(nextDate, min, max)) return;
    setDraftDate(nextDate);
    setStep("time");
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setViewMode("days");
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode("months");
  };

  const navigate = (direction: "prev" | "next") => {
    const amount = direction === "prev" ? -1 : 1;
    if (viewMode === "years") {
      setCurrentYear((previous) => previous + amount * 20);
    } else if (viewMode === "months") {
      setCurrentYear((previous) => previous + amount);
    } else {
      const nextMonth = currentMonth + amount;
      if (nextMonth > 11) {
        setCurrentMonth(0);
        setCurrentYear((previous) => previous + 1);
      } else if (nextMonth < 0) {
        setCurrentMonth(11);
        setCurrentYear((previous) => previous - 1);
      } else {
        setCurrentMonth(nextMonth);
      }
    }
  };

  const draftDateTime =
    draftDate && draftTime ? combineDateAndTime(draftDate, draftTime) : null;
  const draftIsValid = Boolean(
    draftDateTime &&
    (!min || draftDateTime >= min) &&
    (!max || draftDateTime <= max),
  );

  const confirm = () => {
    if (disabled || !draftDateTime || !draftIsValid) return;
    if (!controlled) setInternalValue(new Date(draftDateTime.getTime()));
    onChange?.(new Date(draftDateTime.getTime()));
    dismiss();
  };

  const renderCalendar = () => {
    let title: string;
    let content: ReactNode;

    if (viewMode === "years") {
      title = `${currentYear - 10} - ${currentYear + 9}`;
      content = (
        <YearGrid
          currentYear={currentYear}
          selectedDate={draftDate}
          min={min}
          max={max}
          onSelect={handleYearSelect}
        />
      );
    } else if (viewMode === "months") {
      title = `${currentYear}`;
      content = (
        <MonthGrid
          currentYear={currentYear}
          selectedDate={draftDate}
          min={min}
          max={max}
          onSelect={handleMonthSelect}
        />
      );
    } else {
      title = `${monthNames[currentMonth]} ${currentYear}`;
      content = (
        <DayGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDate={draftDate}
          min={min}
          max={max}
          onSelect={handleDaySelect}
        />
      );
    }

    return (
      <>
        <CalendarHeader
          title={title}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
          onTitleClick={
            viewMode === "years"
              ? undefined
              : () => setViewMode(viewMode === "days" ? "months" : "years")
          }
        />
        {content}
      </>
    );
  };

  const formattedValue = selectedDateTime
    ? `${formatDateByString(selectedDateTime, dateFormatString)} ${formatTimeForDisplay(
        getTimeFromDate(selectedDateTime),
        hourFormat,
      )}`
    : "";

  return (
    <div
      className={`byte-datepicker-container ${className} ${isDarkMode ? "byte-dark" : ""}`}
      ref={containerRef}
    >
      <PickerFormInput
        sourceRef={containerRef}
        name={name}
        value={selectedDateTime ? formatLocalDateTime(selectedDateTime) : ""}
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
          ariaLabel={placeholder}
        />
      ) : (
        children?.({
          open,
          isOpen,
          selectedDateTime,
          formattedValue,
          clear,
        })
      )}

      <PickerPopover
        open={isOpen}
        sourceRef={containerRef}
        onDismiss={dismiss}
        dark={isDarkMode}
        ariaLabel="Choose a date and time"
      >
        {isOpen && (
          <>
            <div
              className="byte-picker-steps"
              aria-label="Date and time selection progress"
            >
              <span className={step === "date" ? "active" : "complete"}>Date</span>
              <span aria-hidden="true">→</span>
              <span className={step === "time" ? "active" : ""}>Time</span>
            </div>

            {step === "date" ? (
              <>
                {renderCalendar()}
                <div className="byte-picker-footer">
                  <button
                    className="byte-action-btn byte-action-secondary"
                    type="button"
                    onClick={dismiss}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
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
                    Choose a time within the allowed date and time range.
                  </p>
                )}
                <div className="byte-picker-footer">
                  <button
                    className="byte-action-btn byte-action-secondary"
                    type="button"
                    onClick={() => setStep("date")}
                  >
                    Back
                  </button>
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
          </>
        )}
      </PickerPopover>
    </div>
  );
}
