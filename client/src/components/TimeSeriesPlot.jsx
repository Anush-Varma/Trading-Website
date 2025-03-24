import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function TimeSeriesPlot({ data, ticker }) {
  const svgRef = useRef();
  useEffect(() => {
    if (!data || !data.length === 0) return;

    const width = 650;
    const height = 400;
    const margin = { top: 40, right: 0, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const parseDate = d3.timeParse("%Y-%m-%d");
    const xExtent = d3.extent(data, (d) => parseDate(d.date));
    const yExtent = d3.extent(data, (d) => d.close);

    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range([margin.left, innerWidth + margin.left]);
    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([innerHeight + margin.top, margin.top]);

    const line = d3
      .line()
      .x((d) => xScale(parseDate(d.date)))
      .y((d) => yScale(d.close))
      .curve(d3.curveBasis);

    // Add the line path
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .delay(1000) // Start after points appear
      .attr("stroke-dashoffset", 0);

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight + margin.top})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMonth.every(1))
          .tickFormat(d3.timeFormat("%b %Y"))
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add X axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Date");

    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Price");

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${ticker} Stock Price`);
  }, [data, ticker]);

  return <svg ref={svgRef}></svg>;
}

export default TimeSeriesPlot;
