import { useState, useEffect, useCallback } from "react";
import { ViewMode, DatePickerProps } from "../types";
import { normalizeToDate, normalizeToStartOfDay } from "../utils/dateUtils";

export function useDatePicker({
  value,
  onChange,
  includeDays,
  yearOnly,
  minDate,
  maxDate,
  required,
}: DatePickerProps) {
  const today = new Date();
  const normalizedValue = normalizeToDate(value) ?? null;

  const [selectedDate, setSelectedDate] = useState<Date | null>(normalizedValue);
  const [currentYear, setCurrentYear] = useState(
    normalizedValue?.getFullYear() || today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    normalizedValue?.getMonth() || today.getMonth()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    yearOnly ? "years" : includeDays ? "days" : "months"
  );

  const min = minDate ? normalizeToDate(minDate) : undefined;
  const max = maxDate ? normalizeToDate(maxDate) : undefined;

  useEffect(() => {
    const newDate = normalizeToDate(value) ?? null;
    setSelectedDate(newDate);
    if (newDate) {
      setCurrentYear(newDate.getFullYear());
      setCurrentMonth(newDate.getMonth());
    }
  }, [value]);

  useEffect(() => {
    if (yearOnly) setViewMode("years");
  }, [yearOnly]);

  const handleChange = useCallback((newDate: Date | null) => {
    if (required && !newDate) return;
    onChange?.(newDate);
  }, [required, onChange]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev: boolean) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setViewMode(yearOnly ? "years" : includeDays ? "days" : "months");
  }, [yearOnly, includeDays]);

  const clear = useCallback(() => {
    handleChange(null);
  }, [handleChange]);

  return {
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
  };
}
