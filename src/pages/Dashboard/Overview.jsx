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
      <AdsGained
        maximise={(ref) => {
          // ref.current.style.gridColumnStart = 1;
          ref.current.style.minWidth = "90vw";
          // ref.current.style.position = "absolute";
          ref.current.style.right = "0";
          // ref.current.style.top = "16px";
        }}
        minimise={(ref) => {
          ref.current.style.minWidth = "760px";
          // ref.current.style.position = "static";
          // ref.current.style.right = "unset";
          // ref.current.style.top = "16px";
        }}
      />
      <UsersGained
        maximise={(ref) => {
          // ref.current.style.gridColumnStart = 1;
          ref.current.style.minWidth = "90vw";
          // ref.current.style.position = "absolute";
          ref.current.style.right = "0";
          // ref.current.style.top = "16px";
        }}
        minimise={(ref) => {
          ref.current.style.minWidth = "760px";
          // ref.current.style.position = "static";
          // ref.current.style.right = "unset";
          // ref.current.style.top = "16px";
        }}
      />
    </div>
  );
}

export default Overview;
