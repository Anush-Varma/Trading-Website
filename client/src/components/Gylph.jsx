import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/gylph.css";

function Gylph() {
  const svgRef = useRef();

  useEffect(() => {
    const width = 150;
    const height = 150;
    const circleRadius = 75;
    const buttonCount = 4;
    const arcInnerButtonRadius = circleRadius + 10;
    const arcOuterButtonRadius = arcInnerButtonRadius + 30;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg
      .append("circle")
      .attr("r", circleRadius)
      .attr("fill", "rgb(119, 141, 169)");

    const arc = d3
      .arc()
      .innerRadius(arcInnerButtonRadius)
      .outerRadius(arcOuterButtonRadius)
      .cornerRadius(5);
  });

  return (
    <div className="circle-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default Gylph;
