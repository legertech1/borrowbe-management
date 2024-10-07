import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../../services/api";
import useNotification from "../../../hooks/useNotification";
import Graph from "../../../components/Grapgh/recharts";
import { Insights } from "@mui/icons-material";
import Dropdown from "../../../components/Shared/Dropdown";

function AdsGained() {
  const [dates, setDates] = useState([]);
  const [visits, setVisits] = useState([]);
  const [searches, setSearches] = useState([]);
  const [days, setDays] = useState({
    text: "30 days",
    value: 30,
  });
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
  return (
    <div className="tile ads_gained graph">
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
          <Insights /> Visits and Searches{" "}
        </span>
        <Dropdown
          array={[
            { text: "7 days", value: 7 },
            { text: "14 days", value: 14 },
            { text: "30 days", value: 30 },
            { text: "60 days", value: 60 },
          ]}
          value={days}
          setValue={(v) => setDays(v)}
        />
      </h2>
    </div>
  );
}

export default AdsGained;
