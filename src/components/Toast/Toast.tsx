import "./Toast.scss";

export default function Toast({ toast }) {
  return (
    <div
      className={
        toast.show && toast.type === "success"
          ? "toast toast--show toast--success"
          : toast.show && toast.type === "error"
          ? "toast toast--show toast--error"
          : "toast"
      }
    >
      <p className="toast__message">{toast.message}</p>
    </div>
  );
}
