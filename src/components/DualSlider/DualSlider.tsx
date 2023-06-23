import "./DualSlider.scss";

export default function DualSlider({
  min,
  max,
  range,
  setRange,
  minDistance,
  showMarks,
  showThumbLabel,
}) {
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    const thumbIndex = event.currentTarget.id;

    switch (thumbIndex) {
      case "min":
        setRange([Math.min(value, range[1] - minDistance), range[1]]);
        break;
      case "max":
        setRange([range[0], Math.max(value, range[0] + minDistance)]);
        break;
    }
  };

  const minPos = ((range[0] - min) / (max - min)) * 100;
  const maxPos = ((range[1] - min) / (max - min)) * 100;

  return (
    <div className="dual-range">
      <div className="dual-range__input-container">
        <input
          className="dual-range__input-range-lower"
          type="range"
          min={min}
          max={max}
          id="min"
          value={range[0]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>
        {showThumbLabel && (
          <label
            className="dual-range__input-range-label-lower"
            htmlFor="min"
            style={{
              left: `max(calc(${minPos}% + (${8 - minPos * 0.15}px)), 2rem)`,
            }}
          >
            <div className="dual-range__input-range-label-box">
              <span className="dual-range__input-range-label-value">
                {range[0]}
              </span>
            </div>
          </label>
        )}
        <input
          className="dual-range__input-range-upper"
          type="range"
          min={min}
          max={max}
          id="max"
          value={range[1]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>
        {showThumbLabel && (
          <label
            className="dual-range__input-range-label-upper"
            htmlFor="max"
            style={{
              left: `min(calc(${maxPos}% + (${
                8 - maxPos * 0.15
              }px)), calc(100% - 2rem))`,
            }}
          >
            <div className="dual-range__input-range-label-box">
              <span className="dual-range__input-range-label-value">
                {range[1]}
              </span>
            </div>
          </label>
        )}
      </div>
      <div className="dual-range__rail">
        <div
          className="dual-range__inner-rail"
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        />
      </div>
      {showMarks && (
        <div className="dual-range__min-max-container">
          <div>{Math.round(min)}</div>
          <div>{Math.round(max)}</div>
        </div>
      )}
    </div>
  );
}
