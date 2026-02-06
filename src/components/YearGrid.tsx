import React from "react";
import { isYearInRange } from "../utils/dateUtils";

interface YearGridProps {
  currentYear: number;
  min?: Date;
  max?: Date;
  onSelect: (year: number) => void;
}

export const YearGrid: React.FC<YearGridProps> = ({
  currentYear,
  min,
  max,
  onSelect,
}) => {
  const today = new Date();
  const yearRange = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="byte-grid-years">
      {yearRange.map((year) => {
        const disabled = !isYearInRange(year, min, max);
        const isCurrent = year === today.getFullYear();
        const isSelected = year === currentYear;

        return (
          <button
            key={year}
            className={`byte-cell byte-cell-lg ${isCurrent ? "today" : ""} ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(year)}
            disabled={disabled}
            type="button"
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};
