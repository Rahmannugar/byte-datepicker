import { useEffect, useMemo, useState } from "react";
import { HourFormat } from "../types";
import { getMinuteStep, parseTime, toTimeValue } from "../utils/timeUtils";

interface TimeSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  hourFormat: HourFormat;
  minuteStep?: number;
}

function getSelectorValue(value: string | null, hourFormat: HourFormat) {
  const parsed = parseTime(value);
  if (!parsed) return { hour: "", minute: "", period: "" };

  return {
    hour:
      hourFormat === 24
        ? String(parsed.hour).padStart(2, "0")
        : String(parsed.hour % 12 || 12),
    minute: String(parsed.minute).padStart(2, "0"),
    period: hourFormat === 12 ? (parsed.hour >= 12 ? "PM" : "AM") : "",
  };
}

export function TimeSelector({
  value,
  onChange,
  hourFormat,
  minuteStep,
}: TimeSelectorProps) {
  const initialValue = getSelectorValue(value, hourFormat);
  const [hour, setHour] = useState(initialValue.hour);
  const [minute, setMinute] = useState(initialValue.minute);
  const [period, setPeriod] = useState(initialValue.period);

  useEffect(() => {
    const nextValue = getSelectorValue(value, hourFormat);
    setHour(nextValue.hour);
    setMinute(nextValue.minute);
    setPeriod(nextValue.period);
  }, [value, hourFormat]);

  const minuteOptions = useMemo(() => {
    const step = getMinuteStep(minuteStep);
    const options = Array.from(
      { length: Math.ceil(60 / step) },
      (_, index) => index * step
    ).filter((option) => option < 60);
    const currentMinute = Number(minute);
    if (minute && !options.includes(currentMinute)) options.push(currentMinute);
    return options.sort((first, second) => first - second);
  }, [minute, minuteStep]);

  const emitValue = (nextHour: string, nextMinute: string, nextPeriod: string) => {
    if (!nextHour || !nextMinute || (hourFormat === 12 && !nextPeriod)) {
      onChange(null);
      return;
    }

    let normalizedHour = Number(nextHour);
    if (hourFormat === 12) {
      normalizedHour %= 12;
      if (nextPeriod === "PM") normalizedHour += 12;
    }
    onChange(toTimeValue(normalizedHour, Number(nextMinute)));
  };

  const hourOptions =
    hourFormat === 24
      ? Array.from({ length: 24 }, (_, index) =>
          String(index).padStart(2, "0")
        )
      : Array.from({ length: 12 }, (_, index) => String(index + 1));

  return (
    <div className="byte-time-selector">
      <label className="byte-time-field">
        <span>Hour</span>
        <select
          value={hour}
          onChange={(event) => {
            const nextHour = event.target.value;
            setHour(nextHour);
            emitValue(nextHour, minute, period);
          }}
        >
          <option value="">--</option>
          {hourOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <span className="byte-time-separator" aria-hidden="true">:</span>

      <label className="byte-time-field">
        <span>Minute</span>
        <select
          value={minute}
          onChange={(event) => {
            const nextMinute = event.target.value;
            setMinute(nextMinute);
            emitValue(hour, nextMinute, period);
          }}
        >
          <option value="">--</option>
          {minuteOptions.map((option) => {
            const formatted = String(option).padStart(2, "0");
            return (
              <option key={formatted} value={formatted}>
                {formatted}
              </option>
            );
          })}
        </select>
      </label>

      {hourFormat === 12 && (
        <label className="byte-time-field byte-time-period">
          <span>Period</span>
          <select
            value={period}
            onChange={(event) => {
              const nextPeriod = event.target.value;
              setPeriod(nextPeriod);
              emitValue(hour, minute, nextPeriod);
            }}
          >
            <option value="">--</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </label>
      )}
    </div>
  );
}
