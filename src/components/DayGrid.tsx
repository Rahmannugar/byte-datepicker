import React from "react";
import {
  weekDays,
  monthNames,
  getFirstDayOfMonth,
  getDaysInMonth,
  isDateInRange,
} from "../utils/dateUtils";

interface DayGridProps {
  currentYear: number;
  currentMonth: number;
  selectedDate: Date | null;
  min?: Date;
  max?: Date;
  onSelect: (day: number) => void;
}

export const DayGrid: React.FC<DayGridProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  min,
  max,
  onSelect,
}) => {
  const today = new Date();
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const isSelectedDay = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentMonth &&
    selectedDate?.getFullYear() === currentYear;

  return (
    <>
      <div className="byte-grid-days">
        {weekDays.map((day) => (
          <div key={day} className="byte-weekday" aria-hidden="true">
            {day}
          </div>
        ))}
      </div>
      <div className="byte-grid-days">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="byte-cell empty" aria-hidden="true" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayDate = new Date(currentYear, currentMonth, day);
          const disabled = !isDateInRange(dayDate, min, max);

          return (
            <button
              key={day}
              className={`byte-cell ${isSelectedDay(day) ? "selected" : ""} ${isToday(day) ? "today" : ""}`}
              onClick={() => onSelect(day)}
              disabled={disabled}
              type="button"
              aria-label={`${monthNames[currentMonth]} ${day}, ${currentYear}`}
              aria-pressed={isSelectedDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
};
