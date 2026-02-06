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
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
  if (match) {
    const [_, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
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
