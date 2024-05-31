import React, { useEffect, useState } from "react";
import "./ExpandedUser.css";

import axios from "axios";
import apis from "../../../services/api";

import { Button, Checkbox } from "../ManageShared";
import useNotification from "../../../hooks/useNotification";

export default function ExpandedUser({ user }) {
  console.log("user: ", user);
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
      <div>
        <div className="expanded-user-details">
          <div className="user-address">
            <h2>User Address</h2>
            <div className="user-detail">
              <p>
                <strong>Address:</strong> {user?.info?.address}
              </p>
              <p>
                <strong>City:</strong> {user?.info?.city}
              </p>
              <p>
                <strong>Province:</strong> {user?.info?.province}
              </p>
              <p>
                <strong>Postal Code:</strong> {user?.info?.postalCode}
              </p>
            </div>
          </div>
          <div className="user-other-details">
            <h2>Other Details</h2>
            <div className="user-detail">
              <p>
                <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Account Locked:</strong>{" "}
                {user.accountLocked ? "Yes" : "No"}
              </p>
              <p>
                <strong>Ads Count:</strong> {user.userAdsCount}
              </p>
              <p>
                <strong>User ID:</strong> {user._id}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="user-other-details">
        <div className="perms-header">
          <div>
            <h2>Permissions</h2>
          </div>
          {
            <div>
              <Button
                className="primary"
                onClick={() => {
                  updatePermissions();
                }}
              >
                Update Permissions
              </Button>
            </div>
          }
        </div>
        <div className="perm_cont">
          {/* {ALL_PERMISSIONS_ARRAY.map((perm) => (
            <div className="perm_item" key={perm}>
              <Checkbox
                checked={permissions.includes(perm)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPermissions([...permissions, perm]);
                  } else {
                    setPermissions(permissions.filter((p) => p !== perm));
                  }
                }}
              />
              <label>{perm}</label>
            </div>
          ))} */}
          needs work
        </div>
      </div>
    </div>
  );
}
