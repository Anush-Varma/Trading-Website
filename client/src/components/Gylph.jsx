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

    const width = 285;
    const height = 285;

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
      { startAngle: 5.8, endAngle: 5.4, label: "SMA 50" },
      { startAngle: 5.3, endAngle: 4.9, label: "SMA 100" },
      { startAngle: 4, endAngle: 4.4, label: "EMA" },
      { startAngle: 3.5, endAngle: 3.9, label: "MACD" },
    ];

    arcsData.forEach((arcsData, index) => {
      const arc = generateButton(
        5,
        arcsData.startAngle,
        arcsData.endAngle,
        outerRadii[index]
      );

      mainGroup
        .append("path")
        .attr("d", arc)
        .attr("fill", buttonFillColour)
        .attr("stroke", buttonStrokeColour)
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", () => handleArcClick(index));

      const textArc = d3
        .arc()
        .innerRadius(circleRadius + outerRadii[index] + 10) // Adjust radius to place text above the arc
        .outerRadius(circleRadius + outerRadii[index] + 10)
        .startAngle(arcsData.startAngle)
        .endAngle(arcsData.endAngle);

      mainGroup
        .append("path")
        .attr("d", textArc)
        .attr("id", `arcPath-${index}`)
        .attr("fill", "none")
        .attr("stroke", "none");

      mainGroup
        .append("text")
        .attr("dy", "5px")
        .attr("x", "5px")
        .append("textPath")
        .attr("xlink:href", `#arcPath-${index}`)
        .attr("startOffset", "50%")
        .attr("fill", "rgb(224, 225, 221)")
        .attr("font-size", "14px")
        .text(arcsData.label)
        .style("cursor", "pointer")
        .on("click", () => handleArcClick(index));
    });
  }, [outerRadii]);

  return (
    <div className="circle-container">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}

export default Gylph;
