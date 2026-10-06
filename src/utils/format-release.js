import { formatDate } from "./dates";

export function getReleaseEyebrow(releaseDate) {
  const formatted = formatDate(releaseDate, { day: "numeric", month: "long" });
  return formatted ? `In cinemas ${formatted}` : null;
}
