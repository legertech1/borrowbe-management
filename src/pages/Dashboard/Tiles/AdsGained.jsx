import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import apis from "../../../services/api";
import useNotification from "../../../hooks/useNotification";
import Graph from "../../../components/Grapgh/recharts";
import { CloseFullscreen, Insights, OpenInFull } from "@mui/icons-material";
import Dropdown from "../../../components/Shared/Dropdown";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { Button } from "../../Manage/ManageShared";

function AdsGained({ maximise, minimise }) {
  const [dates, setDates] = useState([]);
  const [visits, setVisits] = useState([]);
  const [searches, setSearches] = useState([]);
  const [days, setDays] = useState({
    text: "last week",
    value: 7,
  });
  const [expanded, setExpanded] = useState(false);
  const notification = useNotification();
  async function getData(days) {
    try {
      const { data } = await axios.get(apis.getSearchAnalytics + days);

      setDates(Object.keys(data || {}));
      let visits = [];
      let getSearches = [];
      Object.values(data).forEach((v, i) => {
        visits[i] = v.visits;
        searches[i] = v.searches;
      });
      setVisits(visits);
      setSearches(searches);
    } catch (err) {
      notification.error(
        err?.response?.data?.error || err?.response?.data || err?.message
      );
    }
  }
  useEffect(() => {
    if (days.value) getData(days.value);
  }, [days]);
  const ref = useRef();
  return (
    <div className="tile ads_gained graph" ref={ref}>
      <Graph
        dates={dates}
        dataObj={{
          visits,
          searches,
          labels: [
            { text: "Visits", value: "visits" },
            { text: "Searches", value: "searches" },
          ],
          colors: ["#12b012", "#f0ca35"],
        }}
      />
      <h2>
        <span>
          <QueryStatsIcon /> Visits and Searches{" "}
        </span>
        <span>
          {" "}
          <Dropdown
            array={[
              { text: "last week", value: 7 },
              { text: "last 2 weeks", value: 14 },
              { text: "last month", value: 30 },
              { text: "last 2 months", value: 60 },
              { text: "last 3 month", value: 90 },
              { text: "last 6 months", value: 180 },
            ]}
            value={days}
            setValue={(v) => setDays(v)}
          />
          <Button
            className={"maximise" + (expanded ? " open" : " close")}
            onClick={() => {
              expanded ? minimise(ref) : maximise(ref);
              setExpanded(!expanded);
            }}
          >
            {!expanded ? <OpenInFull /> : <CloseFullscreen />}
          </Button>
        </span>
      </h2>
    </div>
  );
}

export default AdsGained;
