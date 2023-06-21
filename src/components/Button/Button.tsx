import "./Button.scss";

export default function Button({ onClick, text, variant }) {
  return (
    <button
      onClick={onClick}
      className={
        variant === "primary"
          ? "button-primary"
          : variant === "secondary"
          ? "button-secondary"
          : variant === "primary-small"
          ? "button-primary-small"
          : "button"
      }
    >
      {text}
    </button>
  );
}
