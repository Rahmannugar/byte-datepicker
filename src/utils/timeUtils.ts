import { HourFormat } from "../types";

export interface TimeParts {
  hour: number;
  minute: number;
}

export function parseTime(value?: string | null): TimeParts | null {
  if (!value) return null;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function toTimeValue(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatTimeForDisplay(
  value: string,
  hourFormat: HourFormat
): string {
  const parsed = parseTime(value);
  if (!parsed) return "";
  if (hourFormat === 24) return toTimeValue(parsed.hour, parsed.minute);

  const period = parsed.hour >= 12 ? "PM" : "AM";
  const displayHour = parsed.hour % 12 || 12;
  return `${displayHour}:${String(parsed.minute).padStart(2, "0")} ${period}`;
}

export function isTimeInRange(
  value: string,
  minTime?: string,
  maxTime?: string
): boolean {
  const parsed = parseTime(value);
  if (!parsed) return false;

  const minutes = parsed.hour * 60 + parsed.minute;
  const min = parseTime(minTime);
  const max = parseTime(maxTime);
  if (min && minutes < min.hour * 60 + min.minute) return false;
  if (max && minutes > max.hour * 60 + max.minute) return false;
  return true;
}

export function getMinuteStep(value?: number): number {
  if (!value || !Number.isInteger(value) || value < 1 || value > 60) return 1;
  return value;
}

export function getTimeFromDate(date: Date): string {
  return toTimeValue(date.getHours(), date.getMinutes());
}

export function combineDateAndTime(date: Date, time: string): Date | null {
  const parsed = parseTime(time);
  if (!parsed) return null;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parsed.hour,
    parsed.minute,
    0,
    0
  );
}
