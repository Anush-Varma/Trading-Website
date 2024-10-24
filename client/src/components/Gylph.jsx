import React from "react";

import "../styles/gylph.css";

function Gylph() {
  const radius = 75;
  const buttonWidth = 30;
  const angleOfButton = -30; // in Degrees
  const buttons = ["A", "B", "C"];

  const angleInRad = (angleOfButton * Math.PI) / 180;

  const buttonXPosition = radius * Math.cos(angleInRad);
  const buttonYPostision = radius * Math.sin(angleInRad);

  return (
    <div className="circle-container">
      <div className="circle"></div>
    </div>
  );
}

export default Gylph;
