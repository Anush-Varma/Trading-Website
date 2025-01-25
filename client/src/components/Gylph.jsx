import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import "../styles/gylph.css";
import { use } from "react";

function Gylph({ id, data }) {
  const circleRadius = 85;
  const componentColour = "rgb(13, 27, 42)";
  const componentColour2 = "rgb(119, 141, 169)";
  const initialRadius = 40;
  const clickedRadius = 30;

  const indicatorXColour = "#E07A1F";
  const indicatorYColour = "#1FE07A";

  const svgRef = useRef();
  const expandedPlot = useRef(null);
  const expandedPlot2 = useRef(null);
  const timeSeriesScaleRef = useRef({
    xScale: null,
    parseDate: d3.timeParse("%Y-%m-%d"),
  });

  const [indicatorSeclected, setIndicatorSelected] = useState({
    xAxis: "SMA10",
    yAxis: "SMA50",
  });
  const [timeSeriesData, setTimeSeriesData] = useState({
    xAxis: "date",
    yAxis: "close",
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [outerRadii, setOuterRadii] = useState([
    clickedRadius,
    initialRadius,
    initialRadius,
    initialRadius,
    initialRadius,
  ]);

  const handleArcClick = useCallback((index) => {
    setOuterRadii((prevRadii) =>
      prevRadii.map((_, i) => (i === index ? clickedRadius : initialRadius))
    );
    switch (index) {
      case 0:
        setIndicatorSelected({
          xAxis: "SMA10",
          yAxis: "SMA50",
        });
        break;
      case 1:
        setIndicatorSelected({
          xAxis: "SMA50",
          yAxis: "SMA100",
        });
        break;
      case 2:
        setIndicatorSelected({
          xAxis: "EMA10",
          yAxis: "EMA50",
        });
        break;
      case 3:
        setIndicatorSelected({
          xAxis: "MACD",
          yAxis: "EMA10",
        });
        break;
      case 4:
        setIndicatorSelected({
          xAxis: "percentK",
          yAxis: "percentD",
        });
        break;
    }
  }, []);

  const handlePlotClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
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
    generateGlyphConnectedGraph(mainGroup);
  }, [outerRadii, id, handleArcClick]);

  useEffect(() => {
    if (!data || data.length === 0 || !isExpanded) return;
    if (isExpanded) {
      if (expandedPlot.current) {
        generateExpandedGraph(expandedPlot, 650, 500);
      }
      if (expandedPlot2.current) {
        generateExpandedTimeGraph(expandedPlot2, 700, 500);
      }
    }
  }, [isExpanded, data, timeSeriesData]);

  useEffect(() => {
    if (!isExpanded || hoveredIndex === null) return;

    const verticalLine = d3
      .select(expandedPlot2.current)
      .select(".vertical-line");

    if (hoveredIndex !== null && timeSeriesScaleRef.current.xScale) {
      const hoveredData = data[hoveredIndex];
      const xPos = timeSeriesScaleRef.current.xScale(
        timeSeriesScaleRef.current.parseDate(hoveredData[timeSeriesData.xAxis])
      );

      verticalLine
        .style("display", null)
        .attr("transform", `translate(${xPos}, 0)`);
    } else {
      verticalLine.style("display", "none");
    }
  }, [hoveredIndex, isExpanded, data, timeSeriesData.xAxis]);

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

  function generateGlyphConnectedGraph(mainGroup) {
    const connectedGraphGroup = mainGroup.append("g");

    const graphRadius = circleRadius * 0.55;

    const xExtent = d3.extent(data, (d) => d[indicatorSeclected.xAxis]);
    const yExtent = d3.extent(data, (d) => d[indicatorSeclected.yAxis]);

    const xPadding = (xExtent[1] - xExtent[0]) * 0.05;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.05;

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([-graphRadius, graphRadius]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([graphRadius, -graphRadius]);

    const colourScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range(["red", "green"]);

    connectedGraphGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", componentColour)
      .attr("stroke-width", 1);

    connectedGraphGroup
      .attr("class", "connected-graph")
      .style("cursor", "pointer")
      .on("click", (e) => {
        e.stopPropagation();
        handlePlotClick(id);
        setIsExpanded(!isExpanded);
      });

    connectedGraphGroup
      .append("circle")
      .attr("r", graphRadius)
      .attr("fill", "transparent");

    connectedGraphGroup
      .selectAll(".scatter-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "scatter-point")
      .attr("cx", (d) => xScale(d[indicatorSeclected.xAxis]))
      .attr("cy", (d) => yScale(d[indicatorSeclected.yAxis]))
      .attr("r", 2)
      .attr("fill", (d, i) => colourScale(i))
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        // NEEED event DO NOT REMOVE!!!!!
        d3.select(this).attr("r", 5).attr("opacity", 1);

        connectedGraphGroup
          .append("text")
          .attr("id", "tooltip-text")
          .attr("x", xScale(d[indicatorSeclected.xAxis]))
          .attr("y", yScale(d[indicatorSeclected.yAxis]))
          .attr("font-size", "12px")
          .attr("fill", "yellow")
          .text(
            `(${d[indicatorSeclected.xAxis].toFixed(2)}, ${d[
              indicatorSeclected.yAxis
            ].toFixed(2)})`
          );
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 2).attr("opacity", 0.7);

        d3.select("#tooltip-text").remove();
      });

    const xAxis = d3.axisBottom(xScale).ticks(3);
    const yAxis = d3.axisLeft(yScale).ticks(3);

    connectedGraphGroup
      .append("g")
      .attr("transform", `translate(0, ${graphRadius})`)
      .call(xAxis);

    connectedGraphGroup
      .append("g")
      .attr("transform", `translate(-${graphRadius}, 0)`)
      .call(yAxis);

    connectedGraphGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", graphRadius + 30)
      .text(`${indicatorSeclected.xAxis}`)
      .attr("fill", componentColour)
      .attr("font-size", "11px");

    connectedGraphGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90) translate(0,-${graphRadius + 25})`)
      .text(`${indicatorSeclected.yAxis}`)
      .attr("fill", componentColour)
      .attr("font-size", "11px");

    return connectedGraphGroup;
  }

  function generateExpandedGraph(ref, width, height) {
    d3.select(ref.current).selectAll("*").remove();
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + 20)
      .attr("height", height);

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xExtent = d3.extent(data, (d) => d[indicatorSeclected.xAxis]);
    const yExtent = d3.extent(data, (d) => d[indicatorSeclected.yAxis]);

    const xPadding = (xExtent[1] - xExtent[0]) * 0.05;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.05;

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([margin.left, innerWidth + margin.left]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([innerHeight + margin.top, margin.top]);

    const colourScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range(["red", "green"]);

    const expandedGraphGroup = svg.append("g");

    const tooltip = d3
      .select(ref.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none");

    expandedGraphGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => xScale(d[indicatorSeclected.xAxis]))
          .y((d) => yScale(d[indicatorSeclected.yAxis]))
      );
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0);

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "red");

    gradient.append("stop").attr("offset", "100%").attr("stop-color", "green");

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight + margin.top})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text(`${indicatorSeclected.xAxis}`);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text(`${indicatorSeclected.yAxis}`);

    expandedGraphGroup
      .selectAll(".scatter-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "scatter-point")
      .attr("cx", (d) => xScale(d[indicatorSeclected.xAxis]))
      .attr("cy", (d) => yScale(d[indicatorSeclected.yAxis]))
      .attr("r", 3)
      .attr("fill", (d, i) => colourScale(i))
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        // NEEED event DO NOT REMOVE!!!!!
        d3.select(this).attr("r", 5).attr("opacity", 1);
        setHoveredIndex(data.indexOf(d));

        tooltip.transition().duration(200).style("opacity", 1);

        tooltip
          .html(
            `(${d[indicatorSeclected.xAxis].toFixed(2)}, ${d[
              indicatorSeclected.yAxis
            ].toFixed(2)})`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 3).attr("opacity", 0.7);
        setHoveredIndex(null);

        tooltip.transition().duration(500).style("opacity", 0);
      });
  }

  function generateExpandedTimeGraph(ref, width, height) {
    d3.select(ref.current).selectAll("*").remove();
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + 70)
      .attr("height", height);

    const parseDate = d3.timeParse("%Y-%m-%d");
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yValues = [
      ...data.map((d) => d[timeSeriesData.yAxis]),
      ...data.map((d) => d[indicatorSeclected.xAxis]),
      ...data.map((d) => d[indicatorSeclected.yAxis]),
    ];
    const xExtent = d3.extent(data, (d) => parseDate(d[timeSeriesData.xAxis]));
    const yExtent = d3.extent(yValues);
    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range([margin.left, innerWidth + margin.left]);

    timeSeriesScaleRef.current.xScale = xScale;

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0], yExtent[1]])
      .range([innerHeight + margin.top, margin.top]);

    const timeSeriesGroup = svg.append("g");

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat("%b %Y"));

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight + margin.top})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Price");

    timeSeriesGroup
      .selectAll(".scatter-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(parseDate(d[timeSeriesData.xAxis])))
      .attr("cy", (d) => yScale(d[timeSeriesData.yAxis]))
      .attr("r", 3)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .style("pointer-events", "all")
      .on("mouseover", function (event, d) {
        // NEEED event DO NOT REMOVE!!!!!
        d3.select(this).attr("r", 4).attr("opacity", 1).raise();
        timeSeriesGroup
          .append("text")
          .attr("id", "tooltip-text")
          .attr("x", xScale(parseDate(d[timeSeriesData.xAxis])))
          .attr("y", yScale(d[timeSeriesData.yAxis]) - 10)
          .attr("font-size", "12px")
          .attr("fill", "#7A1FE0")
          .text(`${d.date}: $${d.high.toFixed(2)}`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 3).attr("opacity", 0.7);
        d3.select("#tooltip-text").remove();
      });

    timeSeriesGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", indicatorXColour)
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => xScale(parseDate(d[timeSeriesData.xAxis])))
          .y((d) => yScale(d[indicatorSeclected.xAxis]))
      );

    timeSeriesGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", indicatorYColour)
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => xScale(parseDate(d[timeSeriesData.xAxis])))
          .y((d) => yScale(d[indicatorSeclected.yAxis]))
      );

    const verticalLine = timeSeriesGroup
      .append("g")
      .attr("class", "vertical-line")
      .style("display", "none");

    verticalLine
      .append("line")
      .attr("stroke", "#666")
      .attr("stroke-width", 2)
      .attr("y1", margin.top)
      .attr("y2", innerHeight + margin.top);

    const legend = timeSeriesGroup
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left + 10}, ${margin.top + 10})`);

    const legendItems = [
      { color: indicatorXColour, text: indicatorSeclected.xAxis },
      { color: indicatorYColour, text: indicatorSeclected.yAxis },
    ];

    legendItems.forEach((item, i) => {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", i * 20)
        .attr("r", 5)
        .attr("fill", item.color);

      legend
        .append("text")
        .attr("x", 10)
        .attr("y", i * 20 + 5)
        .text(item.text)
        .attr("font-size", "12px");
    });
  }

  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="circle-container">
      <svg ref={svgRef} className="w-full h-full"></svg>
      {isExpanded && (
        <div
          className="expanded-graph-overlay"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="expanded-graph-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="left-graph" ref={expandedPlot}></div>
            <div className="right-graph" ref={expandedPlot2}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gylph;
