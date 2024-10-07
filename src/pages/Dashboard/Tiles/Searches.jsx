import {
  GridView,
  People,
  Person,
  RemoveRedEye,
  Search,
  WindowSharp,
} from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../../services/api";
import useNotification from "../../../hooks/useNotification";

function Searches() {
  const [count, setCount] = useState(null);
  const notification = useNotification();
  async function getCount() {
    try {
      const { data } = await axios.get(apis.getSearches);
      setCount(data.count);
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
    <div className="tile searches">
      <h2 className="heading">
        <Search /> Searches today
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

export default Searches;