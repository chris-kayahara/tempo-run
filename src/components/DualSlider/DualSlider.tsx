import SliderMarks from "../SliderMarks/SliderMarks";
import "./DualSlider.scss";

type Props = {
  min: number;
  max: number;
  range: number[];
  setRange: React.Dispatch<React.SetStateAction<number[]>>;
  minDistance: number;
  showMarks: boolean;
  showThumbLabel: boolean;
  showOffsetSliderMarks: boolean;
  dataIsLoaded: boolean;
};

export default function DualSlider({
  min,
  max,
  range,
  setRange,
  minDistance,
  showMarks,
  showThumbLabel,
  showOffsetSliderMarks,
  dataIsLoaded,
}: Props) {
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

  const labelPos = (maxPos - minPos) / 2 + minPos;

  //TODO
  // Add markers for recommended pace
  // Make recommended pace the max pace and add message if there are no songs (tell them to add more songs to their saved tracks)

  return (
    <div className="dual-range">
      <div className="dual-range__input-container">
        <input
          className={
            dataIsLoaded
              ? "dual-range__input-range-lower"
              : "dual-range__input-range-lower--hidden"
          }
          type="range"
          min={min}
          max={max}
          id="min"
          value={range[0]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>
        <input
          className={
            dataIsLoaded
              ? "dual-range__input-range-upper"
              : "dual-range__input-range-upper--hidden"
          }
          type="range"
          min={min}
          max={max}
          id="max"
          value={range[1]}
          onInput={handleRangeChange}
          onChange={handleRangeChange}
        ></input>

        {showThumbLabel && dataIsLoaded && (
          <div
            className="dual-range__input-range-label"
            style={{
              //prettier-ignore
              left: `calc(${labelPos}% + (${9 - labelPos * 0.18}px))`,
            }}
          >
            <div className="dual-range__input-range-label-arrow"></div>
            <div className="dual-range__input-range-label-box">
              {range[0] + " - " + range[1]}
            </div>
          </div>
        )}
      </div>
      <div
        className={
          dataIsLoaded ? "dual-range__rail" : "dual-range__rail--loading"
        }
      >
        <div
          className={
            dataIsLoaded
              ? "dual-range__inner-rail"
              : "dual-range__inner-rail--hidden"
          }
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        />
      </div>
      {showMarks && (
        <div className="dual-range__min-max-container">
          <div>{!dataIsLoaded ? "---" : Math.round(min)}</div>
          <div>{!dataIsLoaded ? "---" : Math.round(max)}</div>
        </div>
      )}
      {showOffsetSliderMarks && (
        <SliderMarks range={range} dataIsLoaded={dataIsLoaded} />
      )}
    </div>
  );
}
