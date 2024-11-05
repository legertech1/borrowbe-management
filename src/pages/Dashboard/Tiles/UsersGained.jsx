import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import apis from "../../../services/api";
import useNotification from "../../../hooks/useNotification";
import Graph from "../../../components/Grapgh/recharts";
import {
  CloseFullscreen,
  Expand,
  Fullscreen,
  Height,
  Insights,
  OpenInFull,
  QueryStats,
} from "@mui/icons-material";
import Dropdown from "../../../components/Shared/Dropdown";
import { colors } from "@mui/material";
import Button from "../../../components/Shared/Button";

function UsersGained({ maximise, minimise }) {
  const [dates, setDates] = useState([]);
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalAds, setTotalAds] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [days, setDays] = useState({
    text: "last week",
    value: 7,
  });
  const notification = useNotification();
  async function getData(days) {
    try {
      const { data } = await axios.get(apis.getUsersGained + days);

      setDates(Object.keys(data || {}));
      let users = [];
      let ads = [];
      let totalAds = [];
      let totalUsers = [];
      Object.values(data).forEach((v, i) => {
        users[i] = v.users;
        ads[i] = v.ads;
        totalUsers[i] = v.totalUsers;
        totalAds[i] = v.totalAds;
      });
      setUsers(users);
      setAds(ads);
      setTotalUsers(totalUsers);
      setTotalAds(totalAds);
    } catch (err) {
      notification.error(
        err?.response?.data?.error || err?.response?.data || err?.message
      );
    }
  }
  const ref = useRef();
  useEffect(() => {
    if (days) getData(days.value);
  }, [days]);
  return (
    <div className="tile users_gained graph" ref={ref}>
      <Graph
        dates={dates}
        dataObj={{
          users,
          ads,
          totalUsers,
          totalAds,
          labels: [
            { text: "Users Gained", value: "users" },
            { text: "Ads Gained", value: "ads" },
            {
              text: "Total Users Gained",
              value: "totalUsers",
              strokeDasharray: "8 8",
            },
            {
              text: "Total Ads Gained",
              value: "totalAds",
              strokeDasharray: "8 8",
            },
          ],
          colors: ["#12b012", "#f0ca35", "#12b012", "#f0ca35"],
        }}
      />
      <h2>
        <span>
          <QueryStats /> Users and Ads gained{" "}
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

export default UsersGained;
