import React from "react";

export type PickerTheme = "light" | "dark" | "system";
export type HourFormat = 12 | 24;

interface BasePickerProps {
  placeholder?: string;
  disabled?: boolean;
  hideInput?: boolean;
  required?: boolean;
  name?: string;
  onBlur?: () => void;
  error?: boolean;
  className?: string;
  theme?: PickerTheme;
  clearable?: boolean;
}

export interface DatePickerProps extends BasePickerProps {
  value?: Date | string | null;
  onChange?: (value: Date | null) => void;
  includeDays?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  formatString?: string;
  yearOnly?: boolean;
  children?: (props: {
    open: () => void;
    isOpen: boolean;
    selectedDate: Date | null;
    formattedValue: string;
    clear: () => void;
  }) => React.ReactNode;
}

export interface TimePickerProps extends BasePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  hourFormat?: HourFormat;
  minuteStep?: number;
  minTime?: string;
  maxTime?: string;
  children?: (props: {
    open: () => void;
    isOpen: boolean;
    selectedTime: string | null;
    formattedValue: string;
    clear: () => void;
  }) => React.ReactNode;
}

export interface DateTimePickerProps extends BasePickerProps {
  value?: Date | string | null;
  onChange?: (value: Date | null) => void;
  minDateTime?: Date | string;
  maxDateTime?: Date | string;
  dateFormatString?: string;
  hourFormat?: HourFormat;
  minuteStep?: number;
  children?: (props: {
    open: () => void;
    isOpen: boolean;
    selectedDateTime: Date | null;
    formattedValue: string;
    clear: () => void;
  }) => React.ReactNode;
}

export type ViewMode = "days" | "months" | "years";
