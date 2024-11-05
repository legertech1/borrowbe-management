import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Graph({ dates, dataObj }) {
  const data = dates.map((date, index) => ({
    date,
    ...dataObj.labels.reduce(
      (obj, l, i, arr) => ({ ...obj, [l.value]: dataObj[l.value][index] }),
      {}
    ),
  }));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxHeight: "calc(100% - 40px)",
      }}
    >
      {" "}
      <div
        className="legend"
        style={{
          position: "absolute",
          top: "-43px", // Adjust the position to float above the chart
          left: "50%", // Center horizontally
          transform: "translateX(-50%)", // Centering using transform
          backgroundColor: "#000", // Background color to make it look like a card
          padding: "8px 20px", // Padding for spacing
          borderRadius: "5px", // Rounded corners for a card-like effect
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Light shadow for depth
          zIndex: 1000, // Ensures the legend appears above the chart
          display: "flex", // Aligns items horizontally
          alignItems: "center", // Vertically centers items
          justifyContent: "center", // Centers items within the div
          gap: "48px", // Adds space between legend items
          paddingLeft: "34px",
        }}
      >
        {/* Custom legend items */}
        <span
          className="legend_bullet"
          style={{
            color: dataObj.colors[0],
            fontSize: "14px",
            fontWeight: "500",
            fontFamily: "var(--font1)",
          }}
        >
          {dataObj.labels[0].value}
        </span>
        <span
          className="legend_bullet"
          style={{
            color: dataObj.colors[1],
            fontSize: "14px",
            fontWeight: "500",
            fontFamily: "var(--font1)",
          }}
        >
          {dataObj.labels[1].value}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={"100%"}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="date" label={{ value: "Dates", position: "bottom" }} />
        <YAxis label={{ angle: -90, position: "insideLeft" }} /> */}
          <XAxis
            dataKey="date"
            stroke="#fff" // Change axis text color to white
            style={{ fontSize: 14, fill: "#fff" }} // Ensure text is white
          />
          <YAxis
            stroke="#fff" // Change axis text color to white
            style={{ fontSize: 14, fill: "#fff" }} // Ensure text is white
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000",
              borderRadius: "5px",
              boxShadow: "0px 0px 12px #1114",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: "white",
              padding: "8px 20px",
              minWidth: "100px",
            }}
          />
          {/* <Legend /> */}
          {dataObj.labels.map((l, i) => (
            <Line
              type="linear"
              dataKey={l.value}
              stroke={dataObj.colors[i]}
              strokeWidth={2}
              dot={{
                stroke: "none",
                strokeWidth: 2,
                fill: dataObj.colors[i],
                r: 3,
              }}
              activeDot={{ r: 3, stroke: dataObj.colors[i], strokeWidth: 2 }}
              animationDuration={500}
              strokeDasharray={l.strokeDasharray}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
