import Icon from "./icon";
import "../../styles/select-input.css";

export default function SelectInput({ label, options, placeholder, error, ...props }) {
  return (
    <label className="select-input">
      <span className="text-label-s">{label}</span>
      <span className="select-input-field">
        <select {...props}>
          <option value="">{placeholder}</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="arrow" className="select-input-chevron" />
      </span>
      {error && <span className="text-body-s select-input-error">{error}</span>}
    </label>
  );
}
