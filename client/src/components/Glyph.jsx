import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import styles from "../styles/glyph.module.css";
import { use } from "react";

function Gylph({ id, data }) {
  const circleRadius = 70;
  const componentColour = "rgb(13, 27, 42)";
  const componentColour2 = "rgb(119, 141, 169)";

  const indicatorXColour = "#ca0020";
  const indicatorYColour = "#f4a582";
  const rsiStartAngle = (5 * Math.PI) / 4;
  const rsiEndAngle = (3 * Math.PI) / 4;

  const svgRef = useRef();
  const expandedPlot = useRef(null);
  const expandedPlot2 = useRef(null);
  const timeSeriesScaleRef = useRef({
    xScale: null,
    parseDate: d3.timeParse("%Y-%m-%d"),
  });

  const [rsiValue, setRsiValue] = useState(null);

  const [indicatorSeclected, setIndicatorSelected] = useState({
    xAxis: "SMA10",
    yAxis: "SMA50",
  });

  const [selectedTShapeButton, setSelectedTShapeButton] = useState(2);

  const [timeSeriesData, setTimeSeriesData] = useState({
    xAxis: "date",
    yAxis: "close",
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleArcClick = useCallback((index) => {
    switch (index) {
      case 0:
        setIndicatorSelected({
          xAxis: "EMA10",
          yAxis: "EMA50",
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
          xAxis: "SMA10",
          yAxis: "SMA50",
        });
        break;
      case 3:
        setIndicatorSelected({
          xAxis: "MACD",
          yAxis: "Signal Line",
        });
        break;
      case 4:
        setIndicatorSelected({
          xAxis: "UBB",
          yAxis: "LBB",
        });
        break;
      default:
        break;
    }
  }, []);

  const handlePlotClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      // Set initial RSI value from the latest data point
      setRsiValue(data[data.length - 1]?.RSI || 50);
    }
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const mainGroup = d3.select(svgRef.current).select("g").select("g");

    mainGroup.selectAll(".rsi-arc").remove();
    mainGroup.selectAll(".rsi-text").remove();

    const rsiToAngle = d3
      .scaleLinear()
      .domain([100, 0])
      .range([rsiStartAngle, rsiEndAngle]);

    const endAngle = rsiValue ? rsiToAngle(rsiValue) : 0;

    const rsiIndicator = d3
      .arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + 15)
      .startAngle(rsiStartAngle)
      .endAngle(endAngle);

    mainGroup
      .append("path")
      .attr("class", "rsi-arc")
      .attr("d", rsiIndicator)
      .attr(
        "fill",
        rsiValue
          ? rsiValue >= 70 || rsiValue <= 30
            ? "red"
            : "green"
          : componentColour
      )
      .attr("stroke", componentColour2)
      .attr("stroke-width", 1);
  }, [rsiValue, data, circleRadius, componentColour, componentColour2]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 250;
    const height = 250;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // create a mainGroup layer and stack ontop each element
    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const tooltipGroup = svg
      .append("g")
      .attr("class", "tooltip-group")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pi = Math.PI;

    const verticalBarWidth = 10;
    const verticalBarHeight = 20;
    const horizontalBarWidth = 50;
    const horizontalBarHeight = 10;

    const NumberOfbuttons = 5;
    const selectedButtonColor = "rgb(232,70,23)";

    const arcLength = pi / (NumberOfbuttons - 1);

    for (let i = 0; i < NumberOfbuttons; i++) {
      const angle = arcLength * i;
      const baseTransform = `rotate(${(angle * 180) / Math.PI - 90})`;
      const pressedTransform = `${baseTransform} translate(0, 10)`;

      const tShapeButtonGroup = mainGroup
        .append("g")
        .attr("class", `t-shape-group-${id}-${i}`)
        .attr(
          "transform",
          selectedTShapeButton === i ? pressedTransform : baseTransform
        );

      // Vertical rectangle
      tShapeButtonGroup
        .append("rect")
        .attr("x", -verticalBarWidth / 2)
        .attr("y", -circleRadius - verticalBarHeight)
        .attr("width", verticalBarWidth)
        .attr("height", verticalBarHeight)
        .attr(
          "fill",
          selectedTShapeButton === i ? selectedButtonColor : componentColour
        )
        .style("cursor", "pointer");

      // Horizontal rectangle
      tShapeButtonGroup
        .append("rect")
        .attr("x", -horizontalBarWidth / 2)
        .attr("y", -circleRadius - verticalBarHeight - horizontalBarHeight)
        .attr("width", horizontalBarWidth)
        .attr("height", horizontalBarHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr(
          "fill",
          selectedTShapeButton === i ? selectedButtonColor : componentColour
        )
        .style("cursor", "pointer");

      const buttonLabels = ["EMA", "SMA 50", "SMA 10", "MACD", "UBB"];

      tShapeButtonGroup
        .append("text")
        .attr("x", 0)
        .attr("y", -circleRadius - verticalBarHeight - horizontalBarHeight - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "rgb(224, 225, 221)")
        .attr("font-size", "11px")
        .style("pointer-events", "none")
        .text(buttonLabels[i]);

      tShapeButtonGroup.on("click", function () {
        setSelectedTShapeButton(i);
        d3.select(this)
          .selectAll("rect")
          .transition()
          .duration(200)
          .attr("fill", selectedButtonColor);
        handleArcClick(i);
      });

      if (selectedTShapeButton === i) {
        tShapeButtonGroup.attr("transform", pressedTransform);
      }
    }

    const rsiIndicator = d3
      .arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + 15)
      .startAngle(rsiStartAngle)
      .endAngle(rsiEndAngle);

    mainGroup
      .append("path")
      .attr("d", rsiIndicator)
      .attr("fill", componentColour);

    mainGroup
      .append("circle")
      .attr("r", circleRadius)
      .attr("fill", "rgb(119, 141, 169)");

    generateGlyphConnectedGraph(mainGroup, tooltipGroup);
  }, [id, handleArcClick, indicatorSeclected, selectedTShapeButton]);

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

  useEffect(() => {
    if (!isExpanded || hoveredIndex === null) return;

    // Reset all points to normal size and opacity
    d3.select(expandedPlot.current)
      .selectAll(".scatter-point")
      .attr("r", 3)
      .attr("opacity", 0.7);

    // Highlight the hovered point
    d3.select(expandedPlot.current)
      .select(`.point-${hoveredIndex}`)
      .attr("r", 6)
      .attr("opacity", 1)
      .attr("stroke", "none")
      .attr("stroke-width", 1);

    // Show tooltip for this point
    const hoveredData = data[hoveredIndex];
    const tooltip = d3
      .select(expandedPlot.current)
      .select(`.${styles.expandedTooltip}`);

    tooltip.transition().duration(200).style("opacity", 1);
    tooltip.html(
      `(${hoveredData[indicatorSeclected.xAxis].toFixed(2)}, ${hoveredData[
        indicatorSeclected.yAxis
      ].toFixed(2)})`
    );
  }, [hoveredIndex, isExpanded, data]);

  function generateGlyphConnectedGraph(mainGroup, tooltipGroup) {
    const connectedGraphGroup = mainGroup.append("g");

    const graphRadius = circleRadius * 0.55;

    const xExtent = d3.extent(data, (d) => d[indicatorSeclected.xAxis]);
    const yExtent = d3.extent(data, (d) => d[indicatorSeclected.yAxis]);

    const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([-graphRadius, graphRadius]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([graphRadius, -graphRadius]);

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

    const colourScale = d3
      .scaleQuantize()
      .domain([0, data.length - 1])
      .range(customColours);

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
        setRsiValue(d.RSI);
        tooltipGroup
          .append("text")
          .attr("id", styles.tooltipText)
          .attr("x", xScale(d[indicatorSeclected.xAxis]))
          .attr("y", yScale(d[indicatorSeclected.yAxis]))
          .attr("font-size", "13px")
          .attr("fill", "rgb(156, 248, 255)")
          .text(
            `(${d[indicatorSeclected.xAxis].toFixed(2)}, ${d[
              indicatorSeclected.yAxis
            ].toFixed(2)})`
          );
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 2).attr("opacity", 0.7);

        d3.select(`#${styles.tooltipText}`).remove();
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
      .attr("y", graphRadius + 25)
      .text(`${indicatorSeclected.xAxis}`)
      .attr("fill", componentColour)
      .attr("font-size", "10px");

    connectedGraphGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90) translate(0,-${graphRadius + 22})`)
      .text(`${indicatorSeclected.yAxis}`)
      .attr("fill", componentColour)
      .attr("font-size", "10px");

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

    const colourScale = d3
      .scaleQuantize()
      .domain([0, data.length - 1])
      .range(customColours);

    const expandedGraphGroup = svg.append("g");

    const tooltip = d3
      .select(ref.current)
      .append("div")
      .attr("class", styles.expandedTooltip)
      .style("opacity", 0);

    expandedGraphGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 1)
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
      .attr("class", (d, i) => `scatter-point point-${i}`)
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

        tooltip.html(
          `(${d[indicatorSeclected.xAxis].toFixed(2)}, ${d[
            indicatorSeclected.yAxis
          ].toFixed(2)})`
        );
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 3).attr("opacity", 0.7);
        setHoveredIndex(null);

        tooltip.transition().duration(500).style("opacity", 0);
      });

    const triangleSize = 8;
    const trianglePoints = (x, y, size) => {
      return `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`;
    };

    // First point triangle (pointing up)
    expandedGraphGroup
      .append("polygon")
      .attr("points", () =>
        trianglePoints(
          xScale(data[0][indicatorSeclected.xAxis]),
          yScale(data[0][indicatorSeclected.yAxis]),
          triangleSize
        )
      )
      .attr("fill", colourScale(0))
      .attr("opacity", 0.9)
      .attr(
        "transform",
        `rotate(180 ${xScale(data[0][indicatorSeclected.xAxis])} ${yScale(
          data[0][indicatorSeclected.yAxis]
        )})`
      );

    // Last point triangle (pointing down)
    expandedGraphGroup
      .append("polygon")
      .attr("points", () =>
        trianglePoints(
          xScale(data[data.length - 1][indicatorSeclected.xAxis]),
          yScale(data[data.length - 1][indicatorSeclected.yAxis]) +
            2 * triangleSize,
          triangleSize
        )
      )
      .attr("fill", colourScale(data.length - 1))
      .attr("opacity", 0.9);
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

    const yValues =
      indicatorSeclected.xAxis === "MACD"
        ? [
            ...data.map((d) => d[indicatorSeclected.xAxis]),
            ...data.map((d) => d[indicatorSeclected.yAxis]),
          ]
        : [
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

    if (indicatorSeclected.xAxis !== "MACD") {
      timeSeriesGroup
        .selectAll(".scatter-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(parseDate(d[timeSeriesData.xAxis])))
        .attr("cy", (d) => yScale(d[timeSeriesData.yAxis]))
        .attr("r", 3)
        .attr("fill", "rgb(255,255,191)")
        .attr("opacity", 0.7)
        .style("pointer-events", "all");
    }

    timeSeriesGroup
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", indicatorXColour)
      .attr("stroke-width", 3)
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
      .attr("stroke-width", 3)
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
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("y1", margin.top)
      .attr("y2", innerHeight + margin.top);

    timeSeriesGroup
      .append("rect")
      .attr("class", "mouse-overlay")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);
        verticalLine
          .style("display", null)
          .attr("transform", `translate(${mouseX}, 0)`);

        if (this._lastX && Math.abs(this._lastX - mouseX) < 3) {
          return;
        }
        this._lastX = mouseX;

        try {
          const bisectDate = d3.bisector((d) =>
            parseDate(d[timeSeriesData.xAxis])
          ).left;
          const x0 = xScale.invert(mouseX);
          if (
            x0 < parseDate(data[0][timeSeriesData.xAxis]) ||
            x0 > parseDate(data[data.length - 1][timeSeriesData.xAxis])
          ) {
            return;
          }

          const index = bisectDate(data, x0, 1);

          if (index <= 0 || index >= data.length) {
            const idx = Math.max(0, Math.min(data.length - 1, index));
            setHoveredIndex(idx);
            return;
          }

          const d0 = data[index - 1];
          const d1 = data[index] || d0;
          if (!d0 || !d1) return;

          // Calculate distances and add slight preference for current point (hysteresis)
          const dist0 = Math.abs(x0 - parseDate(d0[timeSeriesData.xAxis]));
          const dist1 = Math.abs(parseDate(d1[timeSeriesData.xAxis]) - x0);
          const closestPoint = dist0 > dist1 ? d1 : d0;
          const closestIndex = data.indexOf(closestPoint);

          setHoveredIndex(closestIndex);

          verticalLine
            .style("display", null)
            .attr(
              "transform",
              `translate(${xScale(
                parseDate(closestPoint[timeSeriesData.xAxis])
              )}, 0)`
            );

          const tooltip = d3
            .select(ref.current)
            .select(`.${styles.expandedTooltip}`);

          tooltip
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style(
              "top",
              `${event.pageY - 25}px`
            ).html(`Date: ${closestPoint[timeSeriesData.xAxis]}<br>
                   ${
                     indicatorSeclected.xAxis
                   }: ${closestPoint[indicatorSeclected.xAxis].toFixed(2)}<br>
                   ${
                     indicatorSeclected.yAxis
                   }: ${closestPoint[indicatorSeclected.yAxis].toFixed(2)}`);
        } catch (e) {
          console.error("Error in mousemove fro expanded right graph", e);
        }
      })
      .on("mouseout", function () {
        verticalLine.style("display", "none");
        setHoveredIndex(null);

        // Hide tooltip
        d3.select(ref.current)
          .select(`.${styles.expandedTooltip}`)
          .style("opacity", 0);
      });

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
    <div className={styles.circleContainer}>
      <svg ref={svgRef} className="w-full h-full"></svg>
      {isExpanded && (
        <div
          className={styles.expandedGraphOverlay}
          onClick={() => setIsExpanded(false)}
        >
          <div
            className={styles.expandedGraphContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.leftGraph} ref={expandedPlot}></div>
            <div className={styles.rightGraph} ref={expandedPlot2}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gylph;
