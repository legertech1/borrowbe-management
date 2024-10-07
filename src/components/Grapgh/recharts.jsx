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
    [dataObj.labels[0].value]: dataObj[dataObj.labels[0].value][index],
    [dataObj.labels[1].value]: dataObj[dataObj.labels[1].value][index],
  }));

  return (
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
          }}
        />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey={dataObj.labels[0].value}
          stroke={dataObj.colors[0]}
          strokeWidth={2}
          dot={{
            stroke: dataObj.colors[0],
            strokeWidth: 2,
            fill: "#555",
            r: 2,
          }}
          activeDot={{ r: 4, stroke: dataObj.colors[0], strokeWidth: 3 }}
          animationDuration={500}
        />
        <Line
          type="monotone"
          dataKey={dataObj.labels[1].value}
          stroke={dataObj.colors[1]}
          strokeWidth={2}
          dot={{
            stroke: dataObj.colors[1],
            strokeWidth: 2,
            fill: "#555",
            r: 2,
          }}
          activeDot={{ r: 4, stroke: dataObj.colors[1], strokeWidth: 3 }}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
