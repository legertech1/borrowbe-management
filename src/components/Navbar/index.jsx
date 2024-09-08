import React from "react";
import LOGO from "../../assets/images/Logo.png";
import "./index.css";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Logout } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../../services/api";
function Navbar() {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="_navbar">
      <img src={LOGO} alt="" className="logo" />
      <div className="nav">
        <li onClick={() => navigate("/users")}>
          <PersonIcon />
          users
        </li>
        <li onClick={() => navigate("/categories")}>
          <CategoryIcon />
          Categories
        </li>
        <li>
          <WindowSharpIcon />
          Ads
        </li>
        <li>
          {" "}
          <DashboardIcon />
          Dashboard
        </li>
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
