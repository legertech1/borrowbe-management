import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Graph({
  dates,
  values,
  label,
  percent,
  width,
  height,
}) {
  //   const options = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     scales: {
  //       y: {
  //         grid: {
  //           color: "rgba(0, 0, 0, 0.1)",
  //           lineWidth: 1,
  //         },
  //         ticks: {
  //           color: "#333",
  //           font: {
  //             size: 14,
  //           },
  //         },
  //       },
  //       x: {
  //         grid: {
  //           color: "rgba(0, 0, 0, 0.1)",
  //           lineWidth: 1,
  //         },
  //         ticks: {
  //           color: "#333",
  //           font: {
  //             size: 14,
  //           },
  //         },
  //       },
  //     },
  //     tooltips: {
  //       backgroundColor: "rgba(0, 0, 0, 0.8)",
  //       titleFontColor: "#fff",
  //       bodyFontColor: "#fff",
  //     },
  //     animations: {
  //       tension: {
  //         duration: 1000,
  //         easing: "linear",
  //         from: 1,
  //         to: 0,
  //         loop: true,
  //       },
  //     },
  //   };
  return (
    <LineChart
      series={[
        {
          curve: "natural",
          data: values.users,
          label: "Users Gained",
          color: "#2196f3",
        },
        {
          curve: "natural",
          data: values.ads,
          label: "Ads Gained",
          color: "#f0ca35",
        },
        // {
        //   curve: "catmullRom",
        //   data: values["click through rate"],
        //   label: "Click through rate",
        //   color: "#cd5c5c",
        //   valueFormatter: (v) => (v || 0).toFixed(2) + "%",
        // },
      ]}
      xAxis={[{ scaleType: "point", data: dates, label: "Dates" }]}
      sx={{
        ".MuiMarkElement-root": {
          scale: "0.4",

          strokeWidth: 6,
        }, // Customize styles here
        "& .MuiLineChart-mark": {
          // Control the styling of marks
          scale: 1.2, // Increase the size of marks
          strokeWidth: 2, // Control stroke width
          opacity: 0.8, // Adjust the opacity of marks
        },
        "& .MuiGrid-line": {
          stroke: "rgba(0, 0, 0, 0.1)", // Customize grid line color
          strokeWidth: 1, // Customize grid line width
        },
        "& .MuiTypography-root": {
          fontSize: 14, // Control the font size of the labels
          color: "#333", // Control the font color of the labels
        },
      }}
      yAxis={[{ scaleType: "linear", label: "Count" }]}
    ></LineChart>
  );
}
