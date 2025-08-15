import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  includeDays?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  formatString?: string;
  hideInput?: boolean;
  children?: (props: {
    open: () => void;
    isOpen: boolean;
    selectedDate: Date | null;
    formattedValue: string;
  }) => React.ReactNode;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const shortMonthNames = monthNames.map((month) => month.slice(0, 3));
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

function formatDateByString(date: Date, format: string): string {
  const yyyy = date.getFullYear().toString();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return format.replace(/yyyy/g, yyyy).replace(/mm/g, mm).replace(/dd/g, dd);
}

function normalizeToDate(val?: Date | string): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return val;
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function ByteDatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  disabled = false,
  includeDays = false,
  minDate,
  maxDate,
  formatString,
  hideInput = false,
  children,
}: DatePickerProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [currentYear, setCurrentYear] = useState(
    value?.getFullYear() || today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    value?.getMonth() || today.getMonth()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">(
    includeDays ? "days" : "months"
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const min = normalizeToDate(minDate);
  const max = normalizeToDate(maxDate);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setViewMode("months");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedDate(value ?? null);
    if (value) {
      setCurrentYear(value.getFullYear());
      setCurrentMonth(value.getMonth());
    }
  }, [value]);

  const yearRange = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const formatDisplay = (date: Date | null) => {
    if (!date) return "";
    if (formatString) return formatDateByString(date, formatString);
    return includeDays
      ? `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
      : `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isDateInRange = (date: Date) => {
    if (min && date < min) return false;
    if (max && date > max) return false;
    return true;
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (!isDateInRange(newDate)) return;
    setSelectedDate(newDate);
    onChange?.(newDate);
    setIsOpen(false);
    setViewMode(includeDays ? "days" : "months");
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (includeDays) {
      setCurrentMonth(monthIndex);
      setViewMode("days");
    } else {
      const newDate = new Date(currentYear, monthIndex, 1);
      if (!isDateInRange(newDate)) return;
      setSelectedDate(newDate);
      onChange?.(newDate);
      setIsOpen(false);
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode("months");
  };

  const navigateYear = (direction: "prev" | "next") => {
    const increment = viewMode === "years" ? 20 : 1;
    setCurrentYear(
      (prev) => prev + (direction === "prev" ? -increment : increment)
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "next") {
      currentMonth === 11
        ? (setCurrentMonth(0), setCurrentYear((prev) => prev + 1))
        : setCurrentMonth((prev) => prev + 1);
    } else {
      currentMonth === 0
        ? (setCurrentMonth(11), setCurrentYear((prev) => prev - 1))
        : setCurrentMonth((prev) => prev - 1);
    }
  };

  const isCurrentMonth = (monthIndex: number) =>
    monthIndex === today.getMonth() && currentYear === today.getFullYear();

  const isSelected = (monthIndex: number) =>
    selectedDate?.getMonth() === monthIndex &&
    selectedDate?.getFullYear() === currentYear;

  const isSelectedDay = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentMonth &&
    selectedDate?.getFullYear() === currentYear;

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const open = () => {
    if (!disabled) setIsOpen(true);
  };

  return (
    <div className="datepicker-container" ref={containerRef}>
      {!hideInput ? (
        <div
          className={`datepicker-input ${disabled ? "disabled" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedDate ? "selected" : "placeholder"}>
            {selectedDate ? formatDisplay(selectedDate) : placeholder}
          </span>
          <svg
            className="datepicker-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      ) : (
        children &&
        children({
          open,
          isOpen,
          selectedDate,
          formattedValue: formatDisplay(selectedDate),
        })
      )}

      {isOpen && (
        <>
          <div
            className="datepicker-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="datepicker-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            {viewMode === "months" && (
              <>
                <div className="datepicker-header">
                  <button
                    className="nav-button"
                    onClick={() => navigateYear("prev")}
                  >
                    <svg viewBox="0 0 24 24" stroke="currentColor">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                  <button
                    className="month-year-button"
                    onClick={() => setViewMode("years")}
                  >
                    {currentYear}
                  </button>
                  <button
                    className="nav-button"
                    onClick={() => navigateYear("next")}
                  >
                    <svg viewBox="0 0 24 24" stroke="currentColor">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                </div>

                <div className="month-grid">
                  {monthNames.map((month, index) => {
                    const monthDate = new Date(currentYear, index, 1);
                    const isDisabled = !isDateInRange(monthDate);
                    return (
                      <button
                        key={month}
                        className={`month-button ${
                          isCurrentMonth(index) ? "current" : ""
                        } ${isSelected(index) ? "selected" : ""}`}
                        onClick={() => handleMonthSelect(index)}
                        disabled={isDisabled}
                        style={
                          isDisabled
                            ? { opacity: 0.5, cursor: "not-allowed" }
                            : {}
                        }
                      >
                        <span className="month-name">{month}</span>
                        <span className="month-short">
                          {shortMonthNames[index]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {viewMode === "years" && (
              <>
                <div className="datepicker-header">
                  <button
                    className="nav-button"
                    onClick={() => navigateYear("prev")}
                  >
                    <svg viewBox="0 0 24 24" stroke="currentColor">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                  <span className="year-range-title">
                    {yearRange[0]} - {yearRange[yearRange.length - 1]}
                  </span>
                  <button
                    className="nav-button"
                    onClick={() => navigateYear("next")}
                  >
                    <svg viewBox="0 0 24 24" stroke="currentColor">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                </div>

                <div className="year-grid">
                  {yearRange.map((year) => {
                    const yearDate = new Date(year, 0, 1);
                    const isDisabled = !isDateInRange(yearDate);
                    return (
                      <button
                        key={year}
                        className={`year-button ${
                          year === currentYear ? "current" : ""
                        }`}
                        onClick={() => handleYearSelect(year)}
                        disabled={isDisabled}
                        style={
                          isDisabled
                            ? { opacity: 0.5, cursor: "not-allowed" }
                            : {}
                        }
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {viewMode === "days" && (
              <>
                <div className="datepicker-header">
                  <button
                    className="nav-button"
                    onClick={() => navigateMonth("prev")}
                  >
                    <svg viewBox="0 0 24 24" stroke="currentColor">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                  <button
                    className="month-year-button"
                    onClick={() => setViewMode("months")}
                  >
                    {monthNames[currentMonth]} {currentYear}
                  </button>
                  <button
                    className="nav-button"
                    onClick={() => navigateMonth("next")}
                  >
                    <svg viewBox="0 0 24 24" stroke="currentColor">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                </div>

                <div className="weekday-header">
                  {weekDays.map((day) => (
                    <div key={day} className="weekday">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="day-grid">
                  {Array.from(
                    { length: getFirstDayOfMonth(currentYear, currentMonth) },
                    (_, i) => (
                      <div key={`empty-${i}`} className="day-cell empty" />
                    )
                  )}
                  {Array.from(
                    { length: getDaysInMonth(currentYear, currentMonth) },
                    (_, i) => {
                      const day = i + 1;
                      const dayDate = new Date(currentYear, currentMonth, day);
                      const isDisabled = !isDateInRange(dayDate);
                      return (
                        <button
                          key={day}
                          className={`day-cell ${
                            isSelectedDay(day) ? "selected" : ""
                          } ${isToday(day) ? "current" : ""}`}
                          onClick={() => handleDaySelect(day)}
                          disabled={isDisabled}
                          style={
                            isDisabled
                              ? { opacity: 0.5, cursor: "not-allowed" }
                              : {}
                          }
                        >
                          {day}
                        </button>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
