import { useEffect, useMemo, useState } from "react";
import { HourFormat } from "../types";
import { getMinuteStep, parseTime, toTimeValue } from "../utils/timeUtils";

interface TimeSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  hourFormat: HourFormat;
  minuteStep?: number;
}

export function TimeSelector({
  value,
  onChange,
  hourFormat,
  minuteStep,
}: TimeSelectorProps) {
  const parsedValue = parseTime(value);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    if (!parsedValue) {
      setHour("");
      setMinute("");
      setPeriod("");
      return;
    }

    setMinute(String(parsedValue.minute).padStart(2, "0"));
    if (hourFormat === 24) {
      setHour(String(parsedValue.hour).padStart(2, "0"));
      setPeriod("");
    } else {
      setHour(String(parsedValue.hour % 12 || 12));
      setPeriod(parsedValue.hour >= 12 ? "PM" : "AM");
    }
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
