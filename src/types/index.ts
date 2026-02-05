import React from "react";

export interface DatePickerProps {
  value?: Date | string | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  includeDays?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  formatString?: string;
  hideInput?: boolean;
  required?: boolean;
  name?: string;
  onBlur?: () => void;
  error?: boolean;
  className?: string;
  yearOnly?: boolean;
  theme?: "light" | "dark" | "system";
  clearable?: boolean;
  children?: (props: {
    open: () => void;
    isOpen: boolean;
    selectedDate: Date | null;
    formattedValue: string;
    clear: () => void;
  }) => React.ReactNode;
}

export type ViewMode = "days" | "months" | "years";
