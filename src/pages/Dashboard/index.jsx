import React, { useState } from "react";
import DashNav from "./DashNav";
import "./index.css";
import Overview from "./Overview";
function Dashboard() {
  const [page, setPage] = useState("overview");
  function returnContent(page) {
    if (page == "overview") return <Overview />;
  }
  return (
    <div className="_dashboard">
      <DashNav page={page} setPage={setPage} />
      {returnContent(page)}
    </div>
  );
}

export default Dashboard;
