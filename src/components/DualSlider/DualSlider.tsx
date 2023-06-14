import { useState } from "react";

import "./DualSlider.scss";

export default function DualSlider() {
  const [minPace, setMinPace] = useState(0);
  const [maxPace, setMaxPace] = useState(100);
  const [midPace, setMidPace] = useState(100);

  const handleMinChange = (event) => {
    setMinPace(event.target.value);
  };

  const handleMaxChange = (event) => {
    setMaxPace(event.target.value);
  };

  return (
    <div className="dual-range">
      <div className="dual-range__track"></div>
      <div className="dual-range__range"></div>
      <input
        className="dual-range__slider-lower"
        type="range"
        min="1"
        max="50"
        value={minPace}
        onChange={handleMinChange}
      ></input>
      <input
        className="dual-range__slider-upper"
        type="range"
        min="50"
        max="100"
        value={maxPace}
        onChange={handleMaxChange}
      ></input>
      <input
        className="dual-range__slider-center"
        type="range"
        min="50"
        max="100"
      ></input>
      <p>{minPace}</p>
      <p>{maxPace}</p>
    </div>
  );
}
