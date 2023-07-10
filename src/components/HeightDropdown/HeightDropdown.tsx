export default function HeightDropdown({ setUserHeight }) {
  //Helper function to create a range of incrementing numbers
  const range = (begin: number, end: number) => {
    const arr = [];
    for (var i = begin; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  };

  //Helper function to convert inches to feet and inches
  const heightToFeetAndInches = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${feet}' - ${inch}"`;
  };

  const handleChange = (event) => {
    setUserHeight(event.target.value);
  };

  const heights = range(21, 84); //Measured in inches: 36" to 84" (3' to 7')

  return (
    <div>
      <select onChange={handleChange} defaultValue={70}>
        {heights.map((heightInInches) => {
          return (
            <option key={heightInInches} value={heightInInches}>
              {heightToFeetAndInches(heightInInches)}
            </option>
          );
        })}
      </select>
    </div>
  );
}
