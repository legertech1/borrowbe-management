import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { Workspaces } from "@mui/icons-material";
function DashNav({ page, setPage }) {
  return (
    <div className="_dashnav">
      <div className={"item tile " + (page == "overview" ? "active" : "")}>
        {" "}
        <HomeIcon /> Overview
      </div>
      <div className={"item tile " + (page == "" ? "active" : "")}>
        {" "}
        <Workspaces /> Lorem Ipsum
      </div>
      <div className={"item tile " + (page == "" ? "active" : "")}>
        {" "}
        <Workspaces /> Lorem Ipsum
      </div>
      <div className={"item tile " + (page == "" ? "active" : "")}>
        {" "}
        <Workspaces /> Lorem Ipsum
      </div>
      <div className={"item tile " + (page == "" ? "active" : "")}>
        {" "}
        <Workspaces /> Lorem Ipsum
      </div>
    </div>
  );
}

export default DashNav;
