const splitLabel = (label) => {
  const m = label.match(/^(.+?)\s*\((.+)\)$/); // "Morning (before 12:00)"
  return m ? { label: m[1], hint: m[2] } : { label };
};

export const FILTER_GROUPS = [
  { param: "venue", title: "Venue", source: "venues", toOption: (v) => ({ value: v.slug, label: v.name, hint: v.city }) },
  { param: "format", title: "Format", source: "formats", toOption: (f) => ({ value: f.slug, label: f.name }) },
  { param: "language", title: "Language", source: "languages", toOption: (l) => ({ value: l.slug, label: l.name }) },
  { param: "time", title: "Time of day", source: "timeBands", toOption: (t) => ({ value: t.id, ...splitLabel(t.label) }) },
];

// only formats shown by the selected venues (all formats when no venue is selected)
export function formatsForVenues(options, selectedSlugs) {
  const formats = options.formats ?? [];
  if (!selectedSlugs.length) return formats;
  const allowed = new Set((options.venues ?? []).filter((v) => selectedSlugs.includes(v.slug)).flatMap((v) => v.formats.map((f) => f.slug)));
  return formats.filter((f) => allowed.has(f.slug));
}

export const buildGroups = (options, selectedVenues = []) =>
  FILTER_GROUPS.map((g) => {
    const list = g.param === "format" ? formatsForVenues(options, selectedVenues) : (options[g.source] ?? []);
    return { ...g, options: list.map(g.toOption) };
  });
