import "../../styles/button.css";
import Icon from "./icon";

export default function Button({ children, variant = "primary", leftIcon, rightIcon, type = "button", className = "", ...props }) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} {...props}>
      {leftIcon && <Icon name={leftIcon} />}
      {children}
      {rightIcon && <Icon name={rightIcon} />}
    </button>
  );
}
