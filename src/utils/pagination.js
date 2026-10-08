export function getPageRange(page, lastPage, siblings = 1) {
  const slots = siblings * 2 + 5;
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  if (lastPage <= slots) return range(1, lastPage);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, lastPage);
  const showLeftDots = left > 3;
  const showRightDots = right < lastPage - 2;
  const edgeCount = siblings * 2 + 3;

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), "…", lastPage];

  if (showLeftDots && !showRightDots) return [1, "…", ...range(lastPage - edgeCount + 1, lastPage)];

  return [1, "…", ...range(left, right), "…", lastPage];
}
