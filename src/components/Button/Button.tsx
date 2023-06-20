import "./Button.scss";

export default function Button({ onClick, text }) {
  return (
    <button onClick={onClick} className="button">
      {text}
    </button>
  );
}
