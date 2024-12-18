import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.auth);
  const pages = user?.accessCode?.pages || {};
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="main">
        {pages["Users"] && (
          <div className="tile" onClick={(e) => navigate("/users")}>
            <PersonIcon />
            <h1>User Management</h1>
          </div>
        )}
        {pages["Ads"] && (
          <div className="tile" onClick={(e) => navigate("/ads")}>
            <WindowSharpIcon />
            <h1>Ad Management</h1>
          </div>
        )}
        {pages["Categories"] && (
          <div className="tile" onClick={(e) => navigate("/categories")}>
            <CategoryIcon />
            <h1>Category Management</h1>
          </div>
        )}
        {pages["Dashboard"] && (
          <div className="tile" onClick={(e) => navigate("/dashboard")}>
            <DashboardIcon />
            <h1>Dashboard</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
