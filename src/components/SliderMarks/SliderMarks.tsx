import "./SliderMarks.scss";

type Props = {
  range: number[];
  dataIsLoaded: boolean;
};

export default function SliderMarks({ range, dataIsLoaded }: Props) {
  const defaultClass = "slider-marks__number";
  const selectedClass = "slider-marks__number--selected";

  const numbers = [1, 2, 3, 4, 5];

  return (
    <div className="slider-marks">
      {numbers.map((number: number) => {
        return (
          <div className="slider-marks__tick-number-container" key={number}>
            <div className="slider-marks__tick"></div>
            <div className="slider-marks__number-container">
              <div
                className={
                  dataIsLoaded && number >= range[0] + 1 && number <= range[1]
                    ? selectedClass
                    : defaultClass
                }
              >
                {number}
              </div>
            </div>
          </div>
        );
      })}
      <div className="slider-marks__tick"></div>
    </div>
  );
}
