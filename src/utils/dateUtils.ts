export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const shortMonthNames = monthNames.map(month => month.slice(0, 3));
export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

export function formatDateByString(date: Date, format: string): string {
  const yyyy = date.getFullYear().toString();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const mmm = shortMonthNames[date.getMonth()];
  const monthFull = monthNames[date.getMonth()];
  const dd = String(date.getDate()).padStart(2, "0");

  return format
    .replace(/yyyy/gi, yyyy)
    .replace(/mmm/gi, mmm)
    .replace(/mm/gi, mm)
    .replace(/month/gi, monthFull)
    .replace(/dd/gi, dd);
}

export function normalizeToDate(val?: Date | string | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? undefined : new Date(val.getTime());
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(val);
  if (match) {
    const [_, year, month, day] = match;
    return createLocalDate(Number(year), Number(month), Number(day));
  }

  const isoDatePrefix = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
  if (
    isoDatePrefix &&
    !createLocalDate(
      Number(isoDatePrefix[1]),
      Number(isoDatePrefix[2]),
      Number(isoDatePrefix[3]),
    )
  ) {
    return undefined;
  }

  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export function normalizeToDateTime(
  val?: Date | string | null
): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? undefined : new Date(val.getTime());
  }

  const localDateTime =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(val);
  if (localDateTime) {
    const [, year, month, day, hour, minute, second = "0"] = localDateTime;
    return createLocalDate(
      Number(year),
      Number(month),
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
  }

  const localDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
  if (localDate) {
    const [, year, month, day] = localDate;
    return createLocalDate(Number(year), Number(month), Number(day));
  }

  const isoDatePrefix = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
  if (
    isoDatePrefix &&
    !createLocalDate(
      Number(isoDatePrefix[1]),
      Number(isoDatePrefix[2]),
      Number(isoDatePrefix[3]),
    )
  ) {
    return undefined;
  }

  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

function createLocalDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date | undefined {
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return undefined;
  }

  const parsed = new Date(0);
  parsed.setHours(0, 0, 0, 0);
  parsed.setFullYear(year, month - 1, day);
  parsed.setHours(hour, minute, second, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute ||
    parsed.getSeconds() !== second
  ) {
    return undefined;
  }

  return parsed;
}

export function clampDateToRange(date: Date, min?: Date, max?: Date): Date {
  const normalizedDate = normalizeToStartOfDay(date);
  if (min && normalizedDate < normalizeToStartOfDay(min)) {
    return new Date(min.getTime());
  }
  if (max && normalizedDate > normalizeToStartOfDay(max)) {
    return new Date(max.getTime());
  }
  return new Date(date.getTime());
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLocalDateTime(date: Date): string {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${formatLocalDate(date)}T${hour}:${minute}`;
}

export function normalizeToStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateInRange(date: Date, min?: Date, max?: Date): boolean {
  const normalizedDate = normalizeToStartOfDay(date);
  if (min && normalizedDate < normalizeToStartOfDay(min)) return false;
  if (max && normalizedDate > normalizeToStartOfDay(max)) return false;
  return true;
}

export function isMonthInRange(year: number, month: number, min?: Date, max?: Date): boolean {
  if (!min && !max) return true;

  const firstDay = normalizeToStartOfDay(new Date(year, month, 1));
  const lastDay = normalizeToStartOfDay(new Date(year, month + 1, 0));

  if (min && lastDay < normalizeToStartOfDay(min)) return false;
  if (max && firstDay > normalizeToStartOfDay(max)) return false;

  return true;
}

export function isYearInRange(year: number, min?: Date, max?: Date): boolean {
  if (!min && !max) return true;

  const firstDay = normalizeToStartOfDay(new Date(year, 0, 1));
  const lastDay = normalizeToStartOfDay(new Date(year, 11, 31));

  if (min && lastDay < normalizeToStartOfDay(min)) return false;
  if (max && firstDay > normalizeToStartOfDay(max)) return false;

  return true;
}
