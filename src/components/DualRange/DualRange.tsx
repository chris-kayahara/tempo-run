import { useState } from "react";

export default function DualRange() {
  const [upperPace, setUpperPace] = useState(50);
  const [lowerPace, setLowerPace] = useState(100);

  return (
    <div>
      <input type="range"></input>
      <input type="range"></input>
    </div>
  );
}
