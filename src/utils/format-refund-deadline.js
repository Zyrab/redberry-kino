import { parseDate } from "./dates";

const REFUND_CUTOFF_MS = 2 * 60 * 60 * 1000;
const LOCALE = "en-GB";

export function formatRefundDeadline(startsAt) {
  const start = parseDate(startsAt);
  if (!start) return "";

  const deadline = new Date(start.getTime() - REFUND_CUTOFF_MS);
  const parts = new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(deadline);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("hour")}:${get("minute")}, ${get("weekday")} ${get("day")} ${get("month").slice(0, 3)}`;
}
