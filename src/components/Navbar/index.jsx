import React from "react";
import LOGO from "../../assets/images/Logo.png";
import "./index.css";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Logout } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../../services/api";
function Navbar() {
  const user = useSelector((state) => state.auth);
  const pages = user?.accessCode?.pages || {};
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="_navbar">
      <img src={LOGO} alt="" className="logo" onClick={() => navigate("/")} />
      <div className="nav">
        {pages["Users"] && (
          <li
            className={
              pathname.includes("users") || pathname.includes("permissions")
                ? "active"
                : ""
            }
            onClick={() => navigate("/users")}
          >
            <PersonIcon />
            users
          </li>
        )}
        {pages["Categories"] && (
          <li
            className={pathname.includes("categories") ? "active" : ""}
            onClick={() => navigate("/categories")}
          >
            <CategoryIcon />
            Categories
          </li>
        )}
        {pages["Ads"] && (
          <li
            className={pathname.includes("ads") ? "active" : ""}
            onClick={() => navigate("/ads")}
          >
            <WindowSharpIcon />
            Ads
          </li>
        )}
        {pages["Dashboard"] && (
          <li className={pathname.includes("dashboard") ? "active" : ""}>
            {" "}
            <DashboardIcon />
            Dashboard
          </li>
        )}
        <li
          className="logout"
          onClick={async () => {
            await axios.get(apis.logout);
            navigate("/");
            window.location.reload();
          }}
        >
          <Logout />
          Logout
        </li>
        <div className="user">
          <img src={user?.image} alt="" />
          <div>
            <h3>
              {user?.firstName} {user?.lastName}
            </h3>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
