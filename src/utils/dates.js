const LOCALE = "en-GB";
const pad = (n) => String(n).padStart(2, "0");

export function parseDate(value) {
  if (!value) return null;
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, options = { day: "numeric", month: "long", year: "numeric" }) {
  const date = parseDate(value);
  return date ? date.toLocaleDateString(LOCALE, options) : "";
}

export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function buildDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: toISODate(d),
      weekday: formatDate(toISODate(d), { weekday: "short" }),
      day: d.getDate(),
    };
  });
}
