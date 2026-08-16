import { useCallback, useRef } from "react";
import { DatePickerProps } from "./types";
import { useDatePicker } from "./hooks/useDatePicker";
import {
  monthNames,
  formatDateByString,
  formatLocalDate,
  isDateInRange,
} from "./utils/dateUtils";
import { DatePickerInput } from "./components/DatePickerInput";
import { CalendarHeader } from "./components/CalendarHeader";
import { DayGrid } from "./components/DayGrid";
import { MonthGrid } from "./components/MonthGrid";
import { YearGrid } from "./components/YearGrid";
import { PickerPopover } from "./components/PickerPopover";

export default function ByteDatePicker(props: DatePickerProps) {
  const {
    placeholder = "Select Date",
    disabled = false,
    includeDays = false,
    formatString,
    hideInput = false,
    required = false,
    name,
    onBlur,
    error,
    className = "",
    yearOnly = false,
    theme = "light",
    clearable = false,
    children,
  } = props;

  const {
    selectedDate,
    currentYear,
    setCurrentYear,
    currentMonth,
    setCurrentMonth,
    isOpen,
    setIsOpen,
    viewMode,
    setViewMode,
    min,
    max,
    handleChange,
    toggleOpen,
    close,
    clear,
  } = useDatePicker(props);

  const containerRef = useRef<HTMLDivElement>(null);

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const dismiss = useCallback(() => {
    close();
    onBlur?.();
  }, [close, onBlur]);

  const formatDisplay = (date: Date | null) => {
    if (!date) return "";
    if (formatString) return formatDateByString(date, formatString);
    return includeDays
      ? `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
      : `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (!isDateInRange(newDate, min, max)) return;
    handleChange(newDate);
    dismiss();
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (includeDays) {
      setCurrentMonth(monthIndex);
      setViewMode("days");
    } else {
      const newDate = new Date(currentYear, monthIndex, 1);
      if (!isDateInRange(newDate, min, max)) return;
      handleChange(newDate);
      dismiss();
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    if (yearOnly) {
      const newDate = new Date(year, 0, 1);
      if (!isDateInRange(newDate, min, max)) return;
      handleChange(newDate);
      dismiss();
    } else {
      setViewMode("months");
    }
  };

  const navigate = (direction: "prev" | "next") => {
    const step = direction === "prev" ? -1 : 1;

    if (viewMode === "years") {
      setCurrentYear((prev) => prev + step * 20);
    } else if (viewMode === "months") {
      setCurrentYear((prev) => prev + step);
    } else {
      const newMonth = currentMonth + step;
      if (newMonth > 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else if (newMonth < 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth(newMonth);
      }
    }
  };

  const renderDropdown = () => {
    let headerTitle = "";
    let content = null;

    if (viewMode === "years") {
      headerTitle = `${currentYear - 10} - ${currentYear + 9}`;
      content = (
        <YearGrid
          currentYear={currentYear}
          min={min}
          max={max}
          onSelect={handleYearSelect}
        />
      );
    } else if (viewMode === "months") {
      headerTitle = `${currentYear}`;
      content = (
        <MonthGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          includeDays={includeDays}
          min={min}
          max={max}
          onSelect={handleMonthSelect}
        />
      );
    } else {
      headerTitle = `${monthNames[currentMonth]} ${currentYear}`;
      content = (
        <DayGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          min={min}
          max={max}
          onSelect={handleDaySelect}
        />
      );
    }

    return (
      <>
        <CalendarHeader
          title={headerTitle}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
          onTitleClick={() =>
            !yearOnly && setViewMode(viewMode === "days" ? "months" : "years")
          }
        />
        {content}
      </>
    );
  };

  const formattedValue = formatDisplay(selectedDate);

  return (
    <div
      className={`byte-datepicker-container ${className} ${isDarkMode ? "byte-dark" : ""}`}
      ref={containerRef}
    >
      {!hideInput ? (
        <DatePickerInput
          label={formattedValue}
          placeholder={placeholder}
          isOpen={isOpen}
          disabled={disabled}
          error={error}
          required={required}
          name={name}
          value={selectedDate ? formatLocalDate(selectedDate) : ""}
          onClick={isOpen ? dismiss : toggleOpen}
          onClear={clear}
          clearable={clearable}
          onBlur={() => {
            if (!isOpen) onBlur?.();
          }}
          ariaLabel={placeholder}
        />
      ) : (
        children &&
        children({
          open: () => !disabled && setIsOpen(true),
          isOpen,
          selectedDate,
          formattedValue,
          clear,
        })
      )}
      <PickerPopover
        open={isOpen}
        sourceRef={containerRef}
        onDismiss={dismiss}
        dark={isDarkMode}
        ariaLabel="Choose a date"
      >
        {renderDropdown()}
      </PickerPopover>
    </div>
  );
}
