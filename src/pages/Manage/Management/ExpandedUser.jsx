import React, { useEffect, useState } from "react";
import "./ExpandedUser.css";

import axios from "axios";
import apis from "../../../services/api";

import useNotification from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Shared/Button";

export default function ExpandedUser({ user }) {
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState([]);
  const notification = useNotification();

  const getPermissions = async (id) => {
    try {
      let perms = await axios.get(apis.permissions + "/" + id);

      setPermissions(perms.data.permissions);
    } catch (error) {}
  };

  const updatePermissions = async () => {
    try {
      await axios.put(apis.permissions + "/" + user._id, {
        permissions,
      });
      notification.success("Permissions updated successfully");
    } catch (error) {
      notification.error("Error updating permissions");
    }
  };

  useEffect(() => {
    user?._id && getPermissions(user?._id);
  }, [user?._id]);

  return (
    <div className="expand-page">
      <div className="more_info">
        <p>
          UID: <span>{user?._id}</span>
        </p>
        <p>
          Phone: <span>{user?.info?.phone}</span>
        </p>
        <p>
          City: <span>{user?.info?.city}</span>
        </p>
        <p>
          Province: <span> {user?.info?.province}</span>
        </p>
        <p>
          Account Verified: <span>{user?.verified ? "true" : "false"}</span>{" "}
        </p>
        <p>
          Authentication Risk : <span>{user?.authenticationRisk}</span>
        </p>
        <Button onClick={() => navigate("/permissions/" + user?._id)}>
          Update Permissions
        </Button>
      </div>

      {user?.BusinessInfo && (
        <div className="more_info">
          <p>
            Business Name: <span>{user?.BusinessInfo?.name}</span>
          </p>
          <p>
            Business Email: <span>{user?.BusinessInfo?.email}</span>
          </p>
          <p>
            Business Phone Number: <span>{user?.BusinessInfo?.phone}</span>
          </p>
          <p>
            Business Website: <span>{user?.BusinessInfo?.website}</span>
          </p>
        </div>
      )}
    </div>
  );
}
