import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function ConnectedScatterPlot({ data, ticker }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 650;
    const height = 400;
    const margin = { top: 40, right: 0, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const customColours = [
      "#ffffcc",
      "#ffeda0",
      "#fed976",
      "#feb24c",
      "#fd8d3c",
      "#fc4e2a",
      "#e31a1c",
      "#bd0026",
      "#800026",
    ];

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xExtent = d3.extent(data, (d) => d.SMA10);
    const yExtent = d3.extent(data, (d) => d.SMA50);

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([margin.left, innerWidth + margin.left]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0], yExtent[1]])
      .range([innerHeight + margin.top, margin.top]);

    const colourScale = d3
      .scaleQuantize()
      .domain([0, data.length - 1])
      .range(customColours);

    // Add scatter points
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.SMA10))
      .attr("cy", (d) => yScale(d.SMA50))
      .attr("r", 4)
      .attr("fill", (d, i) => colourScale(i))
      .attr("opacity", 0.7);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight + margin.top})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("SMA10");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("SMA50");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${ticker} SMA10 vs SMA50`);
  }, [data, ticker]);

  return <svg ref={svgRef}></svg>;
}

export default ConnectedScatterPlot;
