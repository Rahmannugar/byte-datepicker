import React from "react";
import {
  monthNames,
  shortMonthNames,
  isMonthInRange,
} from "../utils/dateUtils";

interface MonthGridProps {
  currentYear: number;
  currentMonth: number;
  selectedDate: Date | null;
  includeDays: boolean;
  min?: Date;
  max?: Date;
  onSelect: (monthIndex: number) => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  includeDays,
  min,
  max,
  onSelect,
}) => {
  const today = new Date();

  return (
    <div className="byte-grid-months">
      {monthNames.map((month, index) => {
        const disabled = !isMonthInRange(currentYear, index, min, max);
        const isCurrent =
          index === today.getMonth() && currentYear === today.getFullYear();
        const isSelected = includeDays
          ? index === currentMonth &&
            currentYear === (selectedDate?.getFullYear() || currentYear)
          : selectedDate?.getMonth() === index &&
            selectedDate?.getFullYear() === currentYear;

        return (
          <button
            key={month}
            className={`byte-cell byte-cell-lg ${isSelected ? "selected" : ""} ${isCurrent && !isSelected ? "today" : ""}`}
            onClick={() => onSelect(index)}
            disabled={disabled}
            type="button"
          >
            {shortMonthNames[index]}
          </button>
        );
      })}
    </div>
  );
};
