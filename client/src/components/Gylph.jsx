import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import "../styles/gylph.css";
import data from "../data/stockData/test_data.json";

// TO DO: Make RSI indicator
// TO DO: Mke connected scatter plot andimport Vijay's data set.
// TO DO: Make expanssion of connected scatter plot as 2 graphs with sychronisation.

function Gylph({ id }) {
  const svgRef = useRef();
  const circleRadius = 85;
  const componentColour = "rgb(13, 27, 42)";
  const componentColour2 = "rgb(119, 141, 169)";
  const initialRadius = 40;
  const clickedRadius = 30;

  const [outerRadii, setOuterRadii] = useState([
    initialRadius,
    initialRadius,
    initialRadius,
    initialRadius,
    initialRadius,
  ]);

  const handleArcClick = useCallback((index) => {
    setOuterRadii((prevRadii) =>
      prevRadii.map((_, i) => (i === index ? clickedRadius : initialRadius))
    );
  }, []);

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

    const width = 300;
    const height = 300;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // create a mainGroup layer and stack ontop each element
    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // create circle glyph
    mainGroup
      .append("circle")
      .attr("r", circleRadius)
      .attr("fill", "rgb(119, 141, 169)");

    const arcsData = [
      { startAngle: 6, endAngle: 5.4, label: "SMA 10 / 50" },
      { startAngle: 5.3, endAngle: 4.7, label: "SMA 50 / 100" },
      { startAngle: 4, endAngle: 4.6, label: "EMA 10 / 50" },
      { startAngle: 3.5, endAngle: 3.9, label: "MACD" },
      { startAngle: 2.5, endAngle: 2.9, label: "%k / %d" },
    ];

    // add buttons to glyph with text

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
        .attr("fill", componentColour)

        .attr("stroke", componentColour2)
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", () => handleArcClick(index));

      const textArc = d3
        .arc()
        .innerRadius(circleRadius + outerRadii[index] + 10)
        .outerRadius(circleRadius + outerRadii[index] + 10)
        .startAngle(arcsData.startAngle)
        .endAngle(arcsData.endAngle);

      mainGroup
        .append("path")
        .attr("d", textArc)
        .attr("id", `arcTextPath-${index}-${id}`)
        .attr("fill", "none")
        .attr("stroke", "none");

      mainGroup
        .append("text")
        .attr("dy", "6px")
        .attr("x", "7px")
        .append("textPath")
        .attr("xlink:href", `#arcTextPath-${index}-${id}`)
        .attr("startOffset", "50%")
        .attr("fill", "rgb(224, 225, 221)")
        .attr("font-size", "11px")
        .text(arcsData.label)
        .style("cursor", "pointer")
        .on("click", () => handleArcClick(index));
    });

    const rsiIndicator = d3
      .arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + 15)
      .startAngle(Math.PI / 2)
      .endAngle(0);

    mainGroup
      .append("path")
      .attr("d", rsiIndicator)
      .attr("fill", componentColour);

    const lineValues = [
      {
        // 0% line data
        text: "0%",
        textx: +20,
        texty: -5,
        angle: -Math.PI / 2,
        x1: circleRadius,
        y1: -5 + circleRadius,
        x2: circleRadius,
        y2: circleRadius + 20,
      },
      {
        // 100% line data
        text: "100%",
        textx: +45,
        texty: +5,
        angle: 0,
        x1: -5 + circleRadius,
        y1: circleRadius,
        x2: circleRadius + 20,
        y2: circleRadius,
      },
      {
        // 30% line data
        text: "30%",
        textx: +30,
        texty: -5,
        angle: (-7 / 20) * Math.PI,
        x1: circleRadius,
        y1: circleRadius,
        x2: circleRadius + 20,
        y2: circleRadius + 20,
      },
      {
        // 70% line data
        text: "70%",
        textx: +35,
        texty: 0,
        angle: (-3 / 20) * Math.PI,
        x1: circleRadius,
        y1: circleRadius,
        x2: circleRadius + 20,
        y2: circleRadius + 20,
      },
    ];

    lineValues.forEach((line) => {
      const startX = line.x1 * Math.cos(line.angle);
      const startY = line.y1 * Math.sin(line.angle);

      const endX = line.x2 * Math.cos(line.angle);
      const endY = line.y2 * Math.sin(line.angle);

      mainGroup
        .append("line")
        .attr("x1", startX)
        .attr("y1", startY)
        .attr("x2", endX)
        .attr("y2", endY)
        .attr("stroke", "rgb(119, 141, 169)")
        .attr("stroke-width", 3);
      mainGroup
        .append("text")
        .attr("fill", "rgb(224, 225, 221)")
        .attr("font-size", "15px")
        .attr("text-anchor", "end")
        .attr("x", endX + line.textx)
        .attr("y", endY + line.texty)
        .text(line.text);
    });

    const graphRadius = circleRadius * 0.55;

    const xExtent = d3.extent(data, (d) => d.SMA10);
    const yExtent = d3.extent(data, (d) => d.SMA50);

    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([-graphRadius, graphRadius]);

    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([graphRadius, -graphRadius]);

    const colourScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range(["red", "green"]);

    mainGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", componentColour)
      .attr("stroke-width", 1);

    mainGroup
      .selectAll(".scatter-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "scatter-point")
      .attr("cx", (d) => xScale(d.SMA10))
      .attr("cy", (d) => yScale(d.SMA50))
      .attr("r", 2)
      .attr("fill", (d, i) => colourScale(i))
      .attr("opacity", 0.7)
      .on("mouseover", function (d) {
        d3.select(this).attr("r", 5).attr("opacity", 1);

        mainGroup
          .append("text")
          .attr("id", "tooltip-text") // Add an ID for easy removal
          .attr("x", xScale(d.SMA10) + 5) // Position slightly offset from the point
          .attr("y", yScale(d.SMA50) - 5)
          .attr("font-size", "12px")
          .attr("fill", "yellow")
          .text(`(${d.SMA10.toFixed(2)}, ${d.SMA50.toFixed(2)})`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 2).attr("opacity", 0.7);

        d3.select("#tooltip-text").remove();
      });

    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    mainGroup
      .append("g")
      .attr("transform", `translate(0, ${graphRadius})`)
      .call(xAxis);

    mainGroup
      .append("g")
      .attr("transform", `translate(-${graphRadius}, 0)`)
      .call(yAxis);

    mainGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", graphRadius + 30)
      .text("SMA 10")
      .attr("fill", componentColour)
      .attr("font-size", "11px");
  }, [outerRadii, id, handleArcClick]);

  return (
    <div className="circle-container">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}

export default Gylph;
