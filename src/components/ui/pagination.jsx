import "../../styles/pagination.css";
import { getPageRange } from "../../utils/pagination";
import Icon from "./icon";

export default function Pagination({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null;
  const pages = getPageRange(page, lastPage);
  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="pagination-arrow is-prev" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <Icon name="arrow" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="pagination-dots text-label-m" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`pagination-page text-label-m ${p === page ? "is-active" : ""}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => p !== page && onChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button className="pagination-arrow" disabled={page >= lastPage} onClick={() => onChange(page + 1)} aria-label="Next page">
        <Icon name="arrow" />
      </button>
    </nav>
  );
}
