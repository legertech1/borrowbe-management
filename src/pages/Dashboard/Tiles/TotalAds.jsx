import { GridView, People, Person, WindowSharp } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../../services/api";
import useNotification from "../../../hooks/useNotification";

function TotalAds() {
  const [count, setCount] = useState(null);
  const [total, setTotal] = useState(null);
  const notification = useNotification();
  async function getCount() {
    try {
      const { data } = await axios.get(apis.getTotalAds);
      setCount(data.count);
      setTotal(data.total);
    } catch (err) {
      notification.error(
        err?.response?.data?.error || err?.response?.data || err?.message
      );
    }
  }
  useEffect(() => {
    getCount();
  }, []);
  return (
    <div className="tile total_ads">
      <h2 className="heading">
        <WindowSharp /> Total Ads{" "}
        <p> {!isNaN(total) && total !== null ? <>({total})</> : ""}</p>
      </h2>
      <div className="data">
        <h1>
          {!isNaN(count) && count !== null ? (
            <span className="_data">{count}</span>
          ) : (
            "No Data"
          )}
        </h1>
      </div>
    </div>
  );
}

export default TotalAds;
