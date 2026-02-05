import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DatePickerProps } from "./types";
import { useDatePicker } from "./hooks/useDatePicker";
import { 
  monthNames, 
  formatDateByString, 
  isDateInRange
} from "./utils/dateUtils";
import { DatePickerInput } from "./components/DatePickerInput";
import { CalendarHeader } from "./components/CalendarHeader";
import { DayGrid } from "./components/DayGrid";
import { MonthGrid } from "./components/MonthGrid";
import { YearGrid } from "./components/YearGrid";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDarkMode = 
    theme === "dark" || 
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        close();
        if (onBlur) onBlur();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onBlur, close]);

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
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (includeDays) {
      setCurrentMonth(monthIndex);
      setViewMode("days");
    } else {
      const newDate = new Date(currentYear, monthIndex, 1);
      if (!isDateInRange(newDate, min, max)) return;
      handleChange(newDate);
      setIsOpen(false);
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    if (yearOnly) {
      const newDate = new Date(year, 0, 1);
      if (!isDateInRange(newDate, min, max)) return;
      handleChange(newDate);
      setIsOpen(false);
    } else {
      setViewMode("months");
    }
  };

  const navigate = (direction: "prev" | "next") => {
    const step = direction === "prev" ? -1 : 1;
    
    if (viewMode === "years") {
      setCurrentYear(prev => prev + (step * 20));
    } else if (viewMode === "months") {
      setCurrentYear(prev => prev + step);
    } else {
      const newMonth = currentMonth + step;
      if (newMonth > 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else if (newMonth < 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
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
      content = <YearGrid currentYear={currentYear} min={min} max={max} onSelect={handleYearSelect} />;
    } else if (viewMode === "months") {
      headerTitle = `${currentYear}`;
      content = (
        <MonthGrid 
          currentYear={currentYear} 
          selectedDate={selectedDate} 
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
        <div className="datepicker-overlay" onClick={close} />
        <div 
          className="datepicker-dropdown" 
          ref={dropdownRef} 
          onClick={(e) => e.stopPropagation()}
        >
          <CalendarHeader 
            title={headerTitle}
            onPrev={() => navigate("prev")}
            onNext={() => navigate("next")}
            onTitleClick={() => !yearOnly && setViewMode(viewMode === "days" ? "months" : "years")}
          />
          {content}
        </div>
      </>
    );
  };

  const formattedValue = formatDisplay(selectedDate);

  return (
    <div 
      className={`datepicker-container ${className} ${isDarkMode ? "byte-dark" : ""}`} 
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
          value={selectedDate?.toISOString() || ""}
          onClick={toggleOpen}
          onClear={clear}
          clearable={clearable}
          onBlur={onBlur}
        />
      ) : (
        children && children({
          open: () => !disabled && setIsOpen(true),
          isOpen,
          selectedDate,
          formattedValue,
          clear
        })
      )}
      {isOpen && createPortal(renderDropdown(), document.body)}
    </div>
  );
}
