import "./SliderMarks.scss";

export default function SliderMarks({ range, dataIsLoaded }) {
  const defaultClass = "slider-marks__number";
  const selectedClass = "slider-marks__number--selected";
  // Math.ceil(track.energy * 5) >= energyRange[0] + 1 &&
  // Math.ceil(track.energy * 5) <= energyRange[1]

  const setClass = (number) => {
    if (number >= range[0] && number <= range[1]) {
      return selectedClass;
    } else {
      return defaultClass;
    }
  };

  return (
    <div className="slider-marks">
      <div className="slider-marks__tick"></div>
      <div
        className={
          dataIsLoaded && 1 >= range[0] + 1 && 1 <= range[1]
            ? selectedClass
            : defaultClass
        }
      >
        1
      </div>
      <div className="slider-marks__tick"></div>
      <div
        className={
          dataIsLoaded && 2 >= range[0] + 1 && 2 <= range[1]
            ? selectedClass
            : defaultClass
        }
      >
        2
      </div>
      <div className="slider-marks__tick"></div>
      <div
        className={
          dataIsLoaded && 3 >= range[0] + 1 && 3 <= range[1]
            ? selectedClass
            : defaultClass
        }
      >
        3
      </div>
      <div className="slider-marks__tick"></div>
      <div
        className={
          dataIsLoaded && 4 >= range[0] + 1 && 4 <= range[1]
            ? selectedClass
            : defaultClass
        }
      >
        4
      </div>
      <div className="slider-marks__tick"></div>
      <div
        className={
          dataIsLoaded && 5 >= range[0] + 1 && 5 <= range[1]
            ? selectedClass
            : defaultClass
        }
      >
        5
      </div>
      <div className="slider-marks__tick"></div>
    </div>
  );
}
