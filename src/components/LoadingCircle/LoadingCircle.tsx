import "./LoadingCircle.scss";

type Props = {
  show: boolean;
};

export default function LoadingCircle({ show }: Props) {
  return (
    <div
      className="loading-circle"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="loading-circle__profile-main-loader">
        <div className="loading-circle__loader">
          <svg
            className="loading-circle__circular-loader"
            viewBox="25 25 50 50"
          >
            <circle
              className="loading-circle__loader-path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
