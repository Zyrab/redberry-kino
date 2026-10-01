import "../../styles/badge.css";
import Icon from "./icon";

export default function Badge({ variant = "default", label = "", className = "", leftIcon = "", rightIcon = "" }) {
  return (
    <div className={`badge badge-${variant} ${className}`}>
      {leftIcon && <Icon name={leftIcon} className="badge-icon" />}
      <span>{label}</span>
      {rightIcon && <Icon name={rightIcon} className="badge-icon" />}
    </div>
  );
}
