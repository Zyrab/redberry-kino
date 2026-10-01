import "../../styles/button.css";

export default function Button({ children, variant = "primary", leftIcon, rightIcon, className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {leftIcon && <span className="btn-icon">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn-icon">{rightIcon}</span>}
    </button>
  );
}
