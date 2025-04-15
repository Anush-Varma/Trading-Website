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
    const yValues = [
      ...data.map((d) => d.close),
      ...data.map((d) => d.SMA10 || d.close),
      ...data.map((d) => d.SMA50 || d.close),
    ];
    const yExtent = d3.extent(yValues);

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

    const sma10Line = d3
      .line()
      .x((d) => xScale(parseDate(d.date)))
      .y((d) => yScale(d.SMA10 || d.close))
      .curve(d3.curveBasis);

    const sma50Line = d3
      .line()
      .x((d) => xScale(parseDate(d.date)))
      .y((d) => yScale(d.SMA50 || d.close))
      .curve(d3.curveBasis);
    //price line
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", line);
    //SMA10 line
    const sma10Path = svg
      .append("path")
      .datum(data.filter((d) => d.SMA10))
      .attr("fill", "none")
      .attr("stroke", "#ca0020")
      .attr("stroke-width", 1.5)
      .attr("d", sma10Line);

    //SMA50 line
    const sma50Path = svg
      .append("path")
      .datum(data.filter((d) => d.SMA50))
      .attr("fill", "none")
      .attr("stroke", "#f4a582")
      .attr("stroke-width", 1.5)
      .attr("d", sma50Line);

    // Animate the price line
    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .delay(500)
      .attr("stroke-dashoffset", 0);

    // Animate the SMA10 line
    const sma10TotalLength = sma10Path.node().getTotalLength();

    sma10Path
      .attr("stroke-dasharray", sma10TotalLength + " " + sma10TotalLength)
      .attr("stroke-dashoffset", sma10TotalLength)
      .transition()
      .duration(2000)
      .delay(2000)
      .attr("stroke-dashoffset", 0);

    const sma50TotalLength = sma50Path.node().getTotalLength();
    sma50Path
      .attr("stroke-dasharray", sma50TotalLength + " " + sma50TotalLength)
      .attr("stroke-dashoffset", sma50TotalLength)
      .transition()
      .duration(2000)
      .delay(2000)
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

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Date");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Price");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${ticker} Stock Price`);

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left + 10}, ${margin.top + 10})`);

    // Price line
    legend
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .attr("stroke", "blue")
      .attr("stroke-width", 2);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 4)
      .text("Price")
      .style("font-size", "12px");

    // SMA10 line
    legend
      .append("line")
      .attr("x1", 0)
      .attr("y1", 20)
      .attr("x2", 20)
      .attr("y2", 20)
      .attr("stroke", "#ca0020")
      .attr("stroke-width", 1.5);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 24)
      .text("SMA10")
      .style("font-size", "12px");

    // SMA50 line
    legend
      .append("line")
      .attr("x1", 0)
      .attr("y1", 40)
      .attr("x2", 20)
      .attr("y2", 40)
      .attr("stroke", "#f4a582")
      .attr("stroke-width", 1.5);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 44)
      .text("SMA50")
      .style("font-size", "12px");
  }, [data, ticker]);

  return <svg ref={svgRef}></svg>;
}

export default TimeSeriesPlot;
