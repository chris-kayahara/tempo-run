import { useState } from "react";
import DualRange from "../../components/DualRange/DualRange";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

export default function CreatePage() {
  const [tempoRange, setTempoRange] = useState<number[]>([40, 50, 60]);

  const minDistance = 10;

  const handleTempoRangeChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(value)) {
      return;
    }

    switch (activeThumb) {
      case 0:
        setTempoRange([
          Math.min(value[0], tempoRange[2] - minDistance),
          Math.min(
            (tempoRange[2] - value[0]) / 2 + value[0],
            tempoRange[2] - minDistance / 2
          ),
          tempoRange[2],
        ]);
        break;
      case 1:
        setTempoRange([
          value[1] - (tempoRange[2] - tempoRange[0]) / 2,
          value[1],
          (tempoRange[2] - tempoRange[0]) / 2 + value[1],
        ]);
        break;
      case 2:
        setTempoRange([
          tempoRange[0],
          Math.max(
            (value[2] - tempoRange[0]) / 2 + tempoRange[0],
            tempoRange[0] + minDistance / 2
          ),
          Math.max(value[2], tempoRange[0] + minDistance),
        ]);
        break;
    }
  };

  function valuetext(value: number) {
    return `${value} BPM`;
  }
  console.log(tempoRange);

  return (
    <Box>
      <h1>Select pace range</h1>
      {/* <DualRange /> */}
      <Slider
        style={{ width: "20rem" }}
        aria-labelledby="track-range-slider"
        getAriaValueText={valuetext}
        value={tempoRange}
        disableSwap
        valueLabelDisplay="auto"
        onChange={handleTempoRangeChange}
      />
      <h1>Select Genres</h1>
    </Box>
  );
}
