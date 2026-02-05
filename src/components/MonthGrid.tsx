import React from "react";
import { monthNames, shortMonthNames, isMonthInRange } from "../utils/dateUtils";

interface MonthGridProps {
  currentYear: number;
  selectedDate: Date | null;
  min?: Date;
  max?: Date;
  onSelect: (monthIndex: number) => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentYear,
  selectedDate,
  min,
  max,
  onSelect,
}) => {
  const today = new Date();

  return (
    <div className="month-grid">
      {monthNames.map((month, index) => {
        const disabled = !isMonthInRange(currentYear, index, min, max);
        const isCurrent = index === today.getMonth() && currentYear === today.getFullYear();
        const isSelected = selectedDate?.getMonth() === index && selectedDate?.getFullYear() === currentYear;

        return (
          <button
            key={month}
            className={`month-button ${isCurrent ? "current" : ""} ${isSelected ? "selected" : ""}`}
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
