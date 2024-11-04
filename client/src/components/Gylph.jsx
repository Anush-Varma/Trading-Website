import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../styles/gylph.css";

function Gylph() {
  const svgRef = useRef();
  const circleRadius = 100;
  const buttonFillColour = "rgb(13, 27, 42)";
  const buttonStrokeColour = "rgb(119, 141, 169)";
  const initialRadius = 30;
  const clickedRadius = 35;

  const [outerRadii, setOuterRadii] = useState([
    initialRadius,
    initialRadius,
    initialRadius,
    initialRadius,
  ]);

  const handleArcClick = (index) => {
    setOuterRadii((prevRadii) =>
      prevRadii.map((_, i) => (i === index ? clickedRadius : initialRadius))
    );
  };

  function generateButton(cornerRadius, startAngle, endAngle, outerRadius) {
    const arcButton = d3
      .arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + outerRadius)
      .cornerRadius(cornerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    return arcButton;
  }

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 275;
    const height = 275;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // create a mainGroup layer and stack ontop each element
    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    mainGroup
      .append("circle")
      .attr("r", circleRadius)
      .attr("fill", "rgb(119, 141, 169)");

    const arcsData = [
      { startAngle: 5.8, endAngle: 5.4 },
      { startAngle: 5.3, endAngle: 4.9 },
      { startAngle: 4, endAngle: 4.4 },
      { startAngle: 3.5, endAngle: 3.9 },
    ];

    arcsData.forEach((arcsData, index) => {
      mainGroup
        .append("path")
        .attr(
          "d",
          generateButton(
            5,
            arcsData.startAngle,
            arcsData.endAngle,
            outerRadii[index]
          )
        )
        .attr("fill", buttonFillColour)
        .attr("stroke", buttonStrokeColour)
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", () => handleArcClick(index));
    });
  });

  return (
    <div className="circle-container">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}

export default Gylph;
