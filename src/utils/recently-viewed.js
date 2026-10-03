const KEY = "recentlyViewed";
const MAX = 10;

export function getRecentlyViewed() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(movie) {
  const { id, title, posterUrl, runtimeMinutes, ageRating, genres } = movie;
  const entry = { id, title, posterUrl, runtimeMinutes, ageRating, genres };
  const next = [entry, ...getRecentlyViewed().filter((m) => m.id !== id)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}
