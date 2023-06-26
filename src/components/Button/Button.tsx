import "./Button.scss";

export default function Button({ onClick, text, variant, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        variant === "primary" && !disabled
          ? "button-primary"
          : variant === "secondary" && !disabled
          ? "button-secondary"
          : variant === "primary-small" && !disabled
          ? "button-primary-small"
          : "primary" && disabled
          ? "button-primary--disabled"
          : "button"
      }
    >
      {text}
    </button>
  );
}
