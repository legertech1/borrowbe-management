import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apis from "../../services/api";

function Manage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState([]);
  async function loadusers() {
    setUsers((await axios.get(apis.manage)).data);
  }
  async function searchUsers() {
    console.log(users);
    if (!search) return setSearched([]);
    let arr = [];
    users.forEach((user) => {
      if (
        (user.firstName + " " + user.lastName)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      ) {
        arr = [...arr, user];
      }
    });
    setSearched(arr);
  }
  useEffect(() => {
    loadusers();
  }, []);
  useEffect(() => {
    searchUsers();
  }, [search]);

  return (
    <div className="Management" style={{ margin: "20px" }}>
      <p>
        <Link to="/">Back to home </Link>
      </p>

      <table border="1" style={{ textAlign: "left" }}>
        <tr>
          <th>
            <h2>Manage users</h2>
            <div className="search" style={{ width: "300px" }}>
              <input
                type="text"
                name=""
                id=""
                placeholder="search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </th>
          {(searched.length ? searched : users).map((user) => (
            <td className="user" style={{ padding: "20px" }}>
              {Object.keys(user).map((key) => {
                if (["image", "info", "data"].includes(key)) return "";
                return (
                  <div>
                    <p>
                      {" "}
                      <b>{key}</b> :{" "}
                      {typeof user[key] === "object" ? null : user[key]}
                    </p>
                  </div>
                );
              })}
              <div className="actions">
                <button
                  onClick={async () => {
                    await axios.delete(apis.manage + "/" + user._id);
                    loadusers();
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          ))}
        </tr>
      </table>
    </div>
  );
}

export default Manage;
