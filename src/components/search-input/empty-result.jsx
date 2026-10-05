import Icon from "../ui/icon";
import Button from "../ui/button";

export default function EmptyResult({ handleBrowse, title = "", subtitle = "", icon = "popcorn" }) {
  return (
    <div className="result-empty">
      <span className="result-icon">
        <Icon name={icon} />
      </span>
      <h4 className="text-label-m">{title}</h4>
      <p className="text-body-m">{subtitle}</p>
      <Button variant="transparent" onClick={handleBrowse}>
        Browse all sessions
      </Button>
    </div>
  );
}
