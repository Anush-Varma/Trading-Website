import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/gylph.css";

function Gylph() {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 200;
    const height = 200;
    const circleRadius = 80;
    const buttonCount = 4;
    const buttonWidth = 20;
    const buttonHeight = 40;
    const buttonDistance = circleRadius + 10;

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

    const startAngle = (2 * Math.Pi) / 3;
    const endAngle = (5 * Math.Pi) / 6;
    // add arced buttons
    const arcButton = d3
      .arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + 25)
      .cornerRadius(5)
      .startAngle(5.2)
      .endAngle(5.8);

    mainGroup
      .append("path")
      .attr("d", arcButton)
      .attr("fill", "black")
      .attr("stroke", "white")
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
