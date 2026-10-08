import { useSearchParams } from "react-router";
import { formatsForVenues } from "../utils/filter-group";

const FILTER_KEYS = ["venue", "format", "language", "time"];

export default function useSessionFilters(options) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getList = (key) => searchParams.get(key)?.split(",").filter(Boolean) ?? [];
  const setList = (params, key, list) => (list.length ? params.set(key, list.join(",")) : params.delete(key));

  // every change goes through here: new history entry (Back works) and page resets to 1
  function update(mutate) {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    next.delete("page");
    setSearchParams(next);
  }

  function toggle(key, value) {
    update((next) => {
      const list = getList(key);
      const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      setList(next, key, updated);

      // a format that is no longer offered by the selected venues must not stay in the URL
      if (key === "venue") {
        const allowed = new Set(formatsForVenues(options, updated).map((f) => f.slug));
        setList(
          next,
          "format",
          getList("format").filter((slug) => allowed.has(slug)),
        );
      }
    });
  }

  const setDate = (iso) => update((next) => next.set("date", iso));

  // clears every filter, keeps date and sort
  const clearAll = () => update((next) => FILTER_KEYS.forEach((k) => next.delete(k)));

  const activeCount = FILTER_KEYS.reduce((sum, k) => sum + getList(k).length, 0);

  return { getList, toggle, setDate, clearAll, activeCount, date: searchParams.get("date") };
}
