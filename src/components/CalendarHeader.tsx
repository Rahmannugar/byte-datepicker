import React from "react";

interface CalendarHeaderProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onTitleClick?: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  onPrev,
  onNext,
  onTitleClick,
}) => {
  return (
    <div className="datepicker-header">
      <button className="nav-button" onClick={onPrev} type="button">
        <svg viewBox="0 0 24 24">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>
      <button 
        className="month-year-button" 
        onClick={onTitleClick}
        type="button"
        disabled={!onTitleClick}
      >
        {title}
      </button>
      <button className="nav-button" onClick={onNext} type="button">
        <svg viewBox="0 0 24 24">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </div>
  );
};
