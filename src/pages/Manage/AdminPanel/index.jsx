import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

function AdminPanel() {
  const routes = [
    {
      name: "Home",
      path: "/",
      visible: true,
    },
    {
      name: "User Management",
      path: "/admin/management",
      visible: true,
    },
    {
      name: "Category Management",
      path: "/admin/categories",
      visible: true,
    },
    {
      name: "Feature Flag",
      path: "/admin/feature-flag",
      visible: true,
    },
  ];
  return (
    <div className="admin_panel">
      <h1>Admin Panel</h1>
      <ul>
        {routes.map(
          (route) =>
            route.visible && (
              <li key={route.path}>
                <Link to={route.path}>{route.name}</Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default AdminPanel;
