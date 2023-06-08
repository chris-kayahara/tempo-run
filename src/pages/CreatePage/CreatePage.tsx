import { useState } from "react";
import DualRange from "../../components/DualRange/DualRange";
import Slider from "@mui/material/Slider";

export default function CreatePage() {
  const [tempoRange, setTempoRange] = useState<number | number[]>([40, 50, 60]);

  const marks = [
    {
      value: 0,
      label: "60 BPM",
    },
    {
      value: 100,
      label: "200 BPM",
    },
  ];

  const minDistance = 10;

  const handleTempoRangeChange = (
    event: Event,
    newTempoRange: number | number[],
    activeThumb: number
  ) => {
    switch (activeThumb) {
      case 0:
        setTempoRange([
          Math.min(newTempoRange[0], tempoRange[2] - minDistance),
          (tempoRange[2] - newTempoRange[0]) / 2 + newTempoRange[0],
          tempoRange[2],
        ]);
        break;
      case 1:
        setTempoRange([
          newTempoRange[1] - (tempoRange[2] - tempoRange[0]) / 2,
          newTempoRange[1],
          (tempoRange[2] - tempoRange[0]) / 2 + newTempoRange[1],
        ]);
        break;
      case 2:
        setTempoRange([
          tempoRange[0],
          (newTempoRange[2] - tempoRange[0]) / 2 + tempoRange[0],
          Math.max(newTempoRange[2], tempoRange[0] + minDistance),
        ]);
        break;
    }
  };

  function valuetext(value: number) {
    return `${value} BPM`;
  }
  console.log(tempoRange);

  return (
    <div>
      <h1>Select pace range</h1>
      {/* <DualRange /> */}
      <Slider
        style={{ width: "20rem" }}
        aria-labelledby="track-range-slider"
        getAriaValueText={valuetext}
        value={tempoRange}
        marks={marks}
        disableSwap
        valueLabelDisplay="auto"
        onChange={handleTempoRangeChange}
      />
      <h1>Select Genres</h1>
    </div>
  );
}
