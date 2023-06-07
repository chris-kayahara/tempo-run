import { useState } from "react";

import "./DualRange.scss";

export default function DualRange() {
  const [upperPace, setUpperPace] = useState(50);
  const [lowerPace, setLowerPace] = useState(100);

  return (
    <div className="dual-range">
      <div className="dual-range__track"></div>
      <div className="dual-range__range"></div>
      <input
        className="dual-range__slider-lower"
        type="range"
        min="1"
        max="50"
      ></input>
      <input
        className="dual-range__slider-upper"
        type="range"
        min="50"
        max="100"
      ></input>
      <input
        className="dual-range__slider-center"
        type="range"
        min="50"
        max="100"
      ></input>
    </div>
  );
}
