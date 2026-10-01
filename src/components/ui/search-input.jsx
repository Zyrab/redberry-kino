import "../../styles/search-input.css";
import Icon from "./icon";

export default function SearchInput({ value, onChange, onClear, placeholder = "Search films and live events", ...props }) {
  return (
    <div className="search">
      <Icon name="search" />
      <input className="search-input" value={value} onChange={onChange} placeholder={placeholder} {...props} />
      {value && (
        <button type="button" className="search-clear" onClick={onClear} aria-label="Clear search">
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}
