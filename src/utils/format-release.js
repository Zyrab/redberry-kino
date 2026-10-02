export function getReleaseEyebrow(releaseDate) {
  if (!releaseDate) return null;

  const date = new Date(releaseDate.length === 10 ? `${releaseDate}T00:00:00` : releaseDate);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // coming soon dates are in the past actually
  //   if (date <= today) return null;

  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  return `In cinemas ${formatted}`;
}
