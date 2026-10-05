import "../../styles/text-input.css";
import Icon from "./icon";

export default function TextInput({ label, error, success, id, className = "", info, ...props }) {
  const state = error ? "error" : success ? "success" : "";

  return (
    <div className={`field ${state && `field-${state}`} ${className}`}>
      {label && (
        <label htmlFor={id} className="field-label text-label-s">
          {label}
        </label>
      )}
      <div className="field-control">
        <input id={id} className="field-input text-label-s" aria-invalid={!!error} {...props} />
        {error && <Icon name="error" />}
        {success && <Icon name="check" />}
      </div>
      {error && <p className="field-message text-label-s">{error}</p>}
      {info && <p className="field-info text-label-s">{info}</p>}
    </div>
  );
}
