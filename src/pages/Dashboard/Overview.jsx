import React from "react";
import ActiveUsers from "./Tiles/ActiveUsers";
import TotalUsers from "./Tiles/TotalUsers";
import UsersGained from "./Tiles/UsersGained";
import TotalAds from "./Tiles/TotalAds";
import ActiveAds from "./Tiles/ActiveAds";
import AdsGained from "./Tiles/AdsGained";
import Revenue from "./Tiles/Revenue";
import ActiveCategories from "./Tiles/ActiveCategroies";
import Visits from "./Tiles/Visits";
import Searches from "./Tiles/Searches";

function Overview() {
  return (
    <div className="main overview">
      <TotalUsers />
      <ActiveUsers />

      <TotalAds />
      <ActiveAds />
      <Revenue />
      <ActiveCategories />
      <Visits />
      <Searches />
      <AdsGained />
      <UsersGained />
    </div>
  );
}

export default Overview;
