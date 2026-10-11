import { formatDate } from "./dates";

const round2 = (n) => Math.round(n * 100) / 100;

export const formatPrice = (n) => `₾${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const seatPrice = (base, type) => round2(base * type.priceRatio);
export const sumPrices = (lines) => round2(lines.reduce((sum, l) => sum + l.price, 0));
export const ratioLabel = (type) => `${type.name} ${Math.round(type.priceRatio * 100)}%`;

// a ticket type is blocked when the title's min age reaches the type's threshold (child on 16+/18+)
export function getViolation(type, ageRating) {
  const blocked = type.blockedFromRatingAge != null && ageRating && ageRating.minAge >= type.blockedFromRatingAge;
  return blocked ? type.note : null;
}

// "2 x Adult, 1 x Child"
export function summarizeTickets(lines) {
  const counts = new Map();
  lines.forEach((l) => counts.set(l.type.name, (counts.get(l.type.name) ?? 0) + 1));
  return [...counts].map(([name, n]) => `${n} x ${name}`).join(", ");
}

// "Galleria Tbilisi · Hall B · Tuesday 15 September · 16:30 · Standard · Original + Subtitles"
export function sessionSubtitle(s) {
  const day = formatDate(s.date, { weekday: "long", day: "numeric", month: "long" });
  return [s.venue.name, `Hall ${s.hall.name}`, day, s.time, s.format.name, s.language.name].join(" · ");
}

// "Hall B · Tue 15 Sep · 16:30"
export function sessionShort(s) {
  const day = formatDate(s.date, { weekday: "short", day: "numeric", month: "short" });
  return `Hall ${s.hall.name} · ${day} · ${s.time}`;
}

export const BOOKING_MSG = {
  holdExpired: "Your hold time expired. Please re-select your seats.",
  profileIncomplete: "Please complete your profile to enable booking.",
  tooYoung: (minAge) => `This title requires an account aged ${minAge} or over.`,
  seatLimit: (max) => `You can select up to ${max} seats per order.`,
  conflict: (codes) => `${codes.join(", ")} ${codes.length === 1 ? "was" : "were"} just taken. Please choose other seats.`,
};

// why this user can't book this movie
export function getBlocker(user, movie) {
  if (!user?.profileComplete) return BOOKING_MSG.profileIncomplete;
  const minAge = movie.ageRating?.minAge ?? 0;
  if (user.age != null && user.age < minAge) return BOOKING_MSG.tooYoung(minAge);
  return null;
}
