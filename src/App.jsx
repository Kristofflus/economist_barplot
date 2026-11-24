import { useState } from "react";
import { scaleLinear, scaleBand, range } from "d3";
import { data } from "./data";
import Tooltip from "./Tooltip";

export default function App() {
  // 1. State for bar highlighting and tooltip
  const [hoveredBar, setHoveredBar] = useState(null);

  // 2. Dimensions
  const width = 750;
  const height = 320;

  const margin = {
    top: 30,
    right: 120,
    bottom: 20,
    left: 10,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 3. Sort data in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // 4. Scales
  const xScale = scaleLinear().domain([0, 55]).range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(sortedData.map((d) => d.name))
    .range([0, innerHeight])
    .padding(0.35);

  // Find the currently hovered disease
  const hoveredDisease = sortedData.find((d) => d.name === hoveredBar);

  // 5. Axis ticks
  const ticks = range(0, 56, 5);

  // 6. Styling
  const barColor = "#2864A0";
  const hoverColor = "#6199CF";
  const fontSize = 12;
  const labelPadding = 6;
  const fontFamily = "Arial, sans-serif";

  const estimateTextWidth = (text) => {
    return text.length * fontSize * 0.6;
  };

  // 7. Tooltip positioning
  const tooltipWidth = 270;
  const tooltipHeight = 160;

  const tooltipX = hoveredDisease
    ? Math.min(
        margin.left + xScale(hoveredDisease.count) + 12,
        width - tooltipWidth,
      )
    : 0;

  const tooltipY = hoveredDisease
    ? Math.max(
        0,
        Math.min(
          margin.top + yScale(hoveredDisease.name),
          height - tooltipHeight,
        ),
      )
    : 0;

  return (
    <div
      style={{
        width,
        fontFamily,
        textAlign: "left",
      }}
    >
      {/* Red line above header */}
      <div
        style={{
          width: "80%",
          height: 2,
          backgroundColor: "#D52B35",
          marginBottom: 30,
          marginTop: 20,
        }}
      />

      {/* Header */}
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 8px 0",
        }}
      >
        Escape artists
      </h1>

      <p
        style={{
          fontSize: 13,
          margin: "0 0 18px 0",
        }}
      >
        Number of laboratory-acquired infections, 1970–2021
      </p>

      {/* Chart and tooltip container */}
      <div
        style={{
          position: "relative",
          width,
          height,
        }}
      >
        <svg width={width} height={height}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid lines and axis */}
            {ticks.map((tick) => (
              <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
                <line
                  y1={0}
                  y2={innerHeight}
                  stroke={tick === 0 ? "#555" : "#ddd"}
                  strokeWidth={tick === 0 ? 1.5 : 1}
                />

                <text y={-10} textAnchor="middle" fontSize={12} fill="#555">
                  {tick}
                </text>
              </g>
            ))}

            {/* Bars and labels */}
            {sortedData.map((d) => {
              const barWidth = xScale(d.count);
              const barY = yScale(d.name);
              const barHeight = yScale.bandwidth();

              const labelWidth = estimateTextWidth(d.name);

              const fitsInside = labelWidth + labelPadding * 2 <= barWidth;

              const labelX = fitsInside
                ? labelPadding
                : barWidth + labelPadding;

              const isHovered = hoveredBar === d.name;

              return (
                <g
                  key={d.name}
                  onMouseEnter={() => setHoveredBar(d.name)}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Bar */}
                  <rect
                    x={0}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={isHovered ? hoverColor : barColor}
                    style={{
                      transition: "fill 150ms ease",
                    }}
                  />

                  {/* Inline label */}
                  <text
                    x={labelX}
                    y={barY + labelPadding / 2}
                    fontSize={fontSize}
                    fill={
                      fitsInside ? "white" : isHovered ? hoverColor : barColor
                    }
                    dominantBaseline="hanging"
                    pointerEvents="none"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredDisease && (
          <Tooltip disease={hoveredDisease} x={tooltipX} y={tooltipY} />
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          fontSize: 12,
          color: "#666",
          paddingTop: 8,
        }}
      >
        <p style={{ margin: "0 0 5px 0" }}>
          Sources: Laboratory-Acquired Infection Database; American Biological
          Safety Association
        </p>
        <strong>The Economist</strong>
      </footer>
    </div>
  );
}
