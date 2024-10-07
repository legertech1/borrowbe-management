import { useEffect, useState } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import { logout, me } from "./store/authSlice";
import CategoryManagement from "./pages/CategoryManagement";
import Management from "./pages/Manage/Management/Management";
import UserDetails from "./pages/Manage/UserDetails";
import AdDetails from "./pages/Manage/AdDetails";

import { fetchCategories } from "./store/categorySlice";
import Terminal from "./components/Terminal";
import AccessCodes from "./pages/AccessCodes";
import Navbar from "./components/Navbar";
import { collections } from "./pages/Manage/Management/manageConfig";
import Dashboard from "./pages/Dashboard";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const pages = user?.accessCode?.pages || {};
  useEffect(() => {
    dispatch(me());
    dispatch(fetchCategories());
  }, []);

  return (
    <>
      <Terminal></Terminal>
      <div className="__app">
        {user && <Navbar />}
        <Routes>
          {user && (
            <>
              <Route path="/" exact element={<Home />} />
              {pages["Ads"] && (
                <Route
                  path="/ads"
                  element={<Management currentCollection={collections[1]} />}
                />
              )}
              {pages["Categories"] && (
                <Route
                  path="/categories"
                  exact
                  element={<CategoryManagement />}
                />
              )}
              {pages["Dashboard"] && (
                <Route path="/dashboard" exact element={<Dashboard />} />
              )}
              {pages["Users"] && (
                <Route
                  path="/users"
                  exact
                  element={<Management currentCollection={collections[0]} />}
                />
              )}
              {pages["UserDetails"] && (
                <Route path="/user/:id" exact element={<UserDetails />} />
              )}
              {pages["AdDetails"] && (
                <Route path="/ad/:id" exact element={<AdDetails />} />
              )}

              {pages["Permissions"] && (
                <Route
                  path="/permissions/:id"
                  exact
                  element={<AccessCodes />}
                />
              )}
            </>
          )}
          {!user && <Route path="/" exact element={<Login />} />}\
        </Routes>
      </div>
    </>
  );
}

export default App;
