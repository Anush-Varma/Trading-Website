import React from "react";

import "../styles/gylph.css";

function Gylph() {
  const radius = 150;
  const buttons = ["A", "B", "C"];
  const center = 200; // change

  const getButtonPosition = (index, totalButtons) => {
    const angle = (index / totalButtons) * (2 * Math.PI);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);

    return { x, y };
  };

  return (
    <div className="circle-container">
      <div className="circle"></div>
    </div>
  );
}

export default Gylph;
