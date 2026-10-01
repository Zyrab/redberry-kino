import "../../styles/button.css";
import Icon from "./icon";

export default function Button({ children, variant = "primary", leftIcon, rightIcon, className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {leftIcon && <Icon name={leftIcon} className="btn-icon" />}
      {children}
      {rightIcon && <Icon name={rightIcon} className="btn-icon" />}
    </button>
  );
}
