import "./Button.scss";

export default function Button({ onClick, text, variant, disabled, flashing }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        variant === "primary" && !disabled
          ? "button-primary"
          : variant === "secondary" && !disabled && !flashing
          ? "button-secondary"
          : variant === "secondary" && !disabled && flashing
          ? "button-secondary button--flashing"
          : variant === "tertiary" && !disabled
          ? "button-tertiary"
          : "primary" && disabled
          ? "button-primary--disabled"
          : "button"
      }
    >
      {text}
    </button>
  );
}
