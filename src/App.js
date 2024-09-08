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
import AdminPanel from "./pages/Manage/AdminPanel";
import { fetchCategories } from "./store/categorySlice";
import Terminal from "./components/Terminal";
import AccessCodes from "./pages/AccessCodes";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

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
              <Route path="/ads" exact element={<Home />} />
              <Route
                path="/categories"
                exact
                element={<CategoryManagement />}
              />
              <Route path="/dashboard" exact element={<Home />} />
              <Route path="/users" exact element={<Management />} />
              <Route path="/user/:id" exact element={<UserDetails />} />
              <Route path="/ad/:id" exact element={<AdDetails />} />
              <Route path="/permissions/:id" exact element={<AccessCodes />} />
            </>
          )}
          {!user && <Route path="/" exact element={<Login />} />}\
        </Routes>
      </div>
    </>
  );
}

export default App;
