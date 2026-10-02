import "../../styles/button.css";
import Icon from "./icon";

export default function Button({ children, variant = "primary", size = "md", leftIcon, rightIcon, type = "button", className = "", ...props }) {
  return (
    <button type={type} className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {leftIcon && <Icon name={leftIcon} />}
      {children}
      {rightIcon && <Icon name={rightIcon} />}
    </button>
  );
}
