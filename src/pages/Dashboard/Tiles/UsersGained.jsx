import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../../services/api";
import useNotification from "../../../hooks/useNotification";
import Graph from "../../../components/Grapgh/recharts";
import { Insights, QueryStats } from "@mui/icons-material";
import Dropdown from "../../../components/Shared/Dropdown";
import { colors } from "@mui/material";

function UsersGained() {
  const [dates, setDates] = useState([]);
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [days, setDays] = useState({
    text: "30 days",
    value: 30,
  });
  const notification = useNotification();
  async function getData(days) {
    try {
      const { data } = await axios.get(apis.getUsersGained + days);

      setDates(Object.keys(data || {}));
      let users = [];
      let ads = [];
      Object.values(data).forEach((v, i) => {
        users[i] = v.users;
        ads[i] = v.ads;
      });
      setUsers(users);
      setAds(ads);
    } catch (err) {
      notification.error(
        err?.response?.data?.error || err?.response?.data || err?.message
      );
    }
  }
  useEffect(() => {
    if (days) getData(days.value);
  }, [days]);
  return (
    <div className="tile users_gained graph">
      <Graph
        dates={dates}
        dataObj={{
          users,
          ads,
          labels: [
            { text: "Users Gained", value: "users" },
            { text: "Ads Gained", value: "ads" },
          ],
          colors: ["#12b012", "#f0ca35"],
        }}
      />
      <h2>
        <span>
          <QueryStats /> Users and Ads gained{" "}
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

export default UsersGained;
