import { useState } from "react";

import "./DualSlider.scss";

export default function DualSlider({ min, max, range, setRange }) {
  const minDistance = 10;

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    const thumbIndex = event.currentTarget.id;

    switch (thumbIndex) {
      case "min":
        setRange([
          Math.min(value, range[2] - minDistance),
          Math.min(value + (range[2] - value) / 2, range[2] - minDistance / 2),
          range[2],
        ]);
        break;
      case "mid":
        setRange([
          value - (range[2] - range[0]) / 2,
          value,
          (range[2] - range[0]) / 2 + value,
        ]);
        break;
      case "max":
        setRange([
          range[0],
          Math.max(
            (value - range[0]) / 2 + range[0],
            range[0] + minDistance / 2
          ),
          Math.max(value, range[0] + minDistance),
        ]);
        break;
    }
  };

  const minPos = ((range[0] - min) / (max - min)) * 100;
  const maxPos = ((range[2] - min) / (max - min)) * 100;

  return (
    <div className="dual-range">
      <div className="dual-range__input-container">
        <input
          className="dual-range__slider-lower"
          type="range"
          min={min}
          max={max}
          id="min"
          value={range[0]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>
        <input
          className="dual-range__slider-center"
          type="range"
          min={min}
          max={max}
          id="mid"
          value={range[1]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>
        <input
          className="dual-range__slider-upper"
          type="range"
          min={min}
          max={max}
          id="max"
          value={range[2]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>
      </div>
      <div className="dual-range__rail">
        <div
          className="dual-range__inner-rail"
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        />
      </div>
      <div className="dual-range__min-max-container">
        <div>{Math.round(min)}</div>
        <div>{Math.round(max)}</div>
      </div>
    </div>
  );
}
