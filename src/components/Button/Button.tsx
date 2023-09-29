import "./Button.scss";

type Props = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  type?: "button" | "submit" | "reset" | undefined;
  variant: string;
  disabled?: boolean;
  flashing?: boolean;
};

export default function Button({
  onClick,
  text,
  type,
  variant,
  disabled,
  flashing,
}: Props) {
  return (
    <button
      type={type}
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
