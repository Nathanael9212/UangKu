import {
    endOfDay,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    getWeek,
    isWithinInterval,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from "date-fns";
import { id } from "date-fns/locale";

export type PeriodType = "harian" | "mingguan" | "bulanan" | "tahunan";

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), "dd MMM yyyy", { locale: id });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, "MMM yyyy", { locale: id });
};

export const getDateRange = (date: Date, period: PeriodType) => {
  switch (period) {
    case "harian":
      return { start: startOfDay(date), end: endOfDay(date) };
    case "mingguan":
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case "bulanan":
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case "tahunan":
      return { start: startOfYear(date), end: endOfYear(date) };
  }
};

export const isInRange = (
  date: Date | string,
  start: Date,
  end: Date,
): boolean => {
  return isWithinInterval(new Date(date), { start, end });
};

export const getWeekNumber = (date: Date): number => {
  return getWeek(date, { weekStartsOn: 1 });
};

export const formatDisplayDate = (date: Date, period: PeriodType): string => {
  switch (period) {
    case "harian":
      return format(date, "dd MMM yyyy", { locale: id });
    case "mingguan":
      return `Minggu ke-${getWeekNumber(date)} ${format(date, "MMM yyyy", { locale: id })}`;
    case "bulanan":
      return format(date, "MMMM yyyy", { locale: id });
    case "tahunan":
      return format(date, "yyyy");
  }
};
