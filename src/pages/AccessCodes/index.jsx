import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apis from "../../services/api";
import axios from "axios";
import "./index.css";
import {
  Backspace,
  Layers,
  Pages,
  Person,
  Save,
  Storage,
  Terminal,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Switch } from "../Manage/ManageShared";
function AccessCodes() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const admin = useSelector((state) => state.auth);
  console.log(Object.keys(admin?.accessCode?.collections));
  async function getUser() {
    const res = await axios.get(apis.manageGetUser + id);
    setUser(res.data);
  }
  useEffect(() => {
    getUser();
  }, [id]);
  async function update() {
    try {
      const res = await axios.post(apis.updateAccessCode + id, {
        accessCode: user?.accessCode,
      });
    } catch (err) {
      alert(err.response.data);
    }
    getUser();
  }
  return (
    <div className="AccessCodes">
      <div className="right">
        <div className="user_info">
          <h1>
            <Person />
            User Info
          </h1>
          <div>
            <h4>
              User ID: <span>{user?._id}</span>
            </h4>
            <h4>
              Customer ID: <span>{user?.customerID}</span>
            </h4>
            <h4>
              Full Name: <span>{user?.firstName + " " + user?.lastName}</span>
            </h4>
          </div>
        </div>

        <div className="access">
          <h1>
            <Layers /> Permissions for Pages
          </h1>
        </div>
        <div className="commands">
          <h1>
            {" "}
            <Terminal> </Terminal> Permissions for Commands
          </h1>
        </div>
      </div>
      <div className="left">
        <div className="permissions">
          <h1>
            {" "}
            <Storage /> Permissions for DB collections{" "}
            <div className="actions">
              <button onClick={update}>
                <Save /> Save
              </button>
              <button className="revert" onClick={getUser}>
                <Backspace />
                Revert{" "}
              </button>
            </div>
          </h1>
          <table className="collections">
            <tr>
              <th>Collection Name</th>
              <th>Read </th>
              <th>Create</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Override</th>
            </tr>
            {Object.keys(admin?.accessCode?.collections).map((c) => {
              return (
                <tr>
                  <td className="collection_name blue">{c}</td>
                  <td className="permission">
                    {" "}
                    <Switch
                      checked={user?.accessCode?.collections[c]?.read}
                      onChange={(e) => {
                        setUser((user) => {
                          return {
                            ...user,
                            accessCode: {
                              ...(user?.accessCode || {}),
                              collections: {
                                ...((user?.accessCode || {})?.collections ||
                                  {}),
                                [c]: {
                                  ...user?.accessCode?.collections[c],
                                  read: e.target.checked,
                                },
                              },
                            },
                          };
                        });
                      }}
                    />
                  </td>
                  <td className="permission">
                    {" "}
                    <Switch
                      checked={user?.accessCode?.collections[c]?.create}
                      onChange={(e) => {
                        setUser((user) => {
                          return {
                            ...user,
                            accessCode: {
                              ...(user?.accessCode || {}),
                              collections: {
                                ...((user?.accessCode || {})?.collections ||
                                  {}),
                                [c]: {
                                  ...user?.accessCode?.collections[c],
                                  create: e.target.checked,
                                },
                              },
                            },
                          };
                        });
                      }}
                    />
                  </td>{" "}
                  <td className="permission">
                    {" "}
                    <Switch
                      checked={user?.accessCode?.collections[c]?.update}
                      onChange={(e) => {
                        setUser((user) => {
                          return {
                            ...user,
                            accessCode: {
                              ...(user?.accessCode || {}),
                              collections: {
                                ...((user?.accessCode || {})?.collections ||
                                  {}),
                                [c]: {
                                  ...user?.accessCode?.collections[c],
                                  update: e.target.checked,
                                },
                              },
                            },
                          };
                        });
                      }}
                    />
                  </td>{" "}
                  <td className="permission">
                    {" "}
                    <Switch
                      checked={user?.accessCode?.collections[c]?.delete}
                      onChange={(e) => {
                        setUser((user) => {
                          return {
                            ...user,
                            accessCode: {
                              ...(user?.accessCode || {}),
                              collections: {
                                ...((user?.accessCode || {})?.collections ||
                                  {}),
                                [c]: {
                                  ...user?.accessCode?.collections[c],
                                  delete: e.target.checked,
                                },
                              },
                            },
                          };
                        });
                      }}
                    />
                  </td>{" "}
                  <td className="permission">
                    {" "}
                    <Switch
                      checked={user?.accessCode?.collections[c]?.override}
                      onChange={(e) => {
                        setUser((user) => {
                          return {
                            ...user,
                            accessCode: {
                              ...(user?.accessCode || {}),
                              collections: {
                                ...((user?.accessCode || {})?.collections ||
                                  {}),
                                [c]: {
                                  ...user?.accessCode?.collections[c],
                                  override: e.target.checked,
                                },
                              },
                            },
                          };
                        });
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}

export default AccessCodes;
