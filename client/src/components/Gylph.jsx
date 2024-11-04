import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/gylph.css";

function Gylph() {
  const svgRef = useRef();
  const circleRadius = 100;
  const buttonFillColour = "rgb(13, 27, 42)";
  const buttonStrokeColour = "rgb(119, 141, 169)";

  function generateButton(cornerRadius, startAngle, endAngle) {
    const arcButton = d3
      .arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + 30)
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

    // add circle to layer
    mainGroup
      .append("circle")
      .attr("r", circleRadius)
      .attr("fill", "rgb(119, 141, 169)");

    mainGroup
      .append("path")
      .attr("d", generateButton(5, 5.8, 5.4))
      .attr("fill", buttonFillColour)
      .attr("stroke", buttonStrokeColour)
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        alert("button clicked");
      });

    mainGroup
      .append("path")
      .attr("d", generateButton(5, 5.3, 4.9))
      .attr("fill", buttonFillColour)
      .attr("stroke", buttonStrokeColour)
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        alert("button clicked");
      });

    mainGroup
      .append("path")
      .attr("d", generateButton(5, 4, 4.4))
      .attr("fill", buttonFillColour)
      .attr("stroke", buttonStrokeColour)
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        alert("button clicked");
      });

    mainGroup
      .append("path")
      .attr("d", generateButton(5, 3.5, 3.9))
      .attr("fill", buttonFillColour)
      .attr("stroke", buttonStrokeColour)
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", () => {
        alert("button clicked");
      });
  });

  return (
    <div className="circle-container">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}

export default Gylph;
