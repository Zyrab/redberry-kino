import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import useSearch from "../../hooks/use-search";
import "../../styles/search-input.css";
import Icon from "../ui/icon";
import EmptyResult from "./empty-result";
import ResultList from "./result-list";

export default function SearchInput() {
  const { query, results, status, onSearch, onClear } = useSearch();

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const trimmedQuery = query.trim();

  const view = getView(trimmedQuery, results, status);

  function close() {
    setOpen(false);
    inputRef.current?.blur();
  }
  function handleSelect() {
    close();
    onClear();
  }
  function handleBrowse() {
    handleSelect();
    navigate("/sessions");
  }
  function handleClear() {
    onClear();
    inputRef.current?.focus(); // the clear button unmounts, so hand focus back to the input
  }
  // close only when focus leaves the whole component (not when moving between input and links)
  function handleBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
  }

  return (
    <div className="search" role="search" onFocus={() => setOpen(true)} onBlur={handleBlur}>
      <Icon name="search" />
      <input
        ref={inputRef}
        className="search-input"
        value={query}
        onChange={onSearch}
        onKeyDown={(e) => e.key === "Escape" && close()}
        placeholder="Search films and live events"
        aria-label="Search films and live events"
      />
      {query && (
        <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear search">
          <Icon name="close" />
        </button>
      )}

      {open && (
        <div className="result-card" onMouseDown={(e) => e.preventDefault()}>
          {view === "idle" && (
            <EmptyResult handleBrowse={handleBrowse} title="What do you want to watch?" subtitle="Search by title, director or cast" />
          )}

          {view === "results" && <ResultList results={results} handleSelect={handleSelect} />}

          {view === "empty" && (
            <EmptyResult
              handleBrowse={handleBrowse}
              icon="search"
              title={`No results for “${trimmedQuery}”`}
              subtitle="Check the spelling or try another film or live event."
            />
          )}

          {view === "loading" && <p className="result-status text-body-s">Searching…</p>}
          {view === "error" && <p className="result-status text-body-s">Couldn't load results. Try again.</p>}
        </div>
      )}
    </div>
  );
}

function getView(query, results, status) {
  if (!query) return "idle";
  if (results.length) return "results";
  if (status === "done") return "empty";
  if (status === "error") return "error";
  return "loading";
}
