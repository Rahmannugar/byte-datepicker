import { useState, useEffect, useCallback, useMemo } from "react";
import { ViewMode, DatePickerProps } from "../types";
import { clampDateToRange, normalizeToDate } from "../utils/dateUtils";

export function useDatePicker({
  value,
  onChange,
  includeDays,
  yearOnly,
  minDate,
  maxDate,
  required,
  disabled,
}: DatePickerProps) {
  const controlled = value !== undefined;
  const normalizedValue = useMemo(() => normalizeToDate(value) ?? null, [value]);
  const min = useMemo(() => normalizeToDate(minDate), [minDate]);
  const max = useMemo(() => normalizeToDate(maxDate), [maxDate]);
  const initialCalendarDate =
    normalizedValue ?? clampDateToRange(new Date(), min, max);

  const [internalValue, setInternalValue] = useState<Date | null>(normalizedValue);
  const selectedDate = controlled ? normalizedValue : internalValue;
  const [currentYear, setCurrentYear] = useState(
    initialCalendarDate.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    initialCalendarDate.getMonth()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    yearOnly ? "years" : includeDays ? "days" : "months"
  );

  useEffect(() => {
    if (normalizedValue) {
      setCurrentYear(normalizedValue.getFullYear());
      setCurrentMonth(normalizedValue.getMonth());
    }
  }, [normalizedValue]);

  useEffect(() => {
    if (!selectedDate) {
      const fallbackDate = clampDateToRange(new Date(), min, max);
      setCurrentYear(fallbackDate.getFullYear());
      setCurrentMonth(fallbackDate.getMonth());
    }
  }, [selectedDate, min, max]);

  useEffect(() => {
    setViewMode(yearOnly ? "years" : includeDays ? "days" : "months");
  }, [yearOnly, includeDays]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setViewMode(yearOnly ? "years" : includeDays ? "days" : "months");
    }
  }, [disabled, yearOnly, includeDays]);

  const handleChange = useCallback((newDate: Date | null) => {
    if (disabled || (required && !newDate)) return;
    const nextValue = newDate ? new Date(newDate.getTime()) : null;
    if (!controlled) {
      setInternalValue(nextValue ? new Date(nextValue.getTime()) : null);
    }
    onChange?.(nextValue);
  }, [controlled, disabled, required, onChange]);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev: boolean) => !prev);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
    setViewMode(yearOnly ? "years" : includeDays ? "days" : "months");
  }, [yearOnly, includeDays]);

  const clear = useCallback(() => {
    if (disabled) return;
    handleChange(null);
  }, [disabled, handleChange]);

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
