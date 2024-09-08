import React, { useEffect, useState } from "react";
import "./index.css";
import { useSelector } from "react-redux";
import axios from "axios";
import apis from "../../services/api";
function Terminal({}) {
  const [active, setActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const user = useSelector((state) => state.auth);
  const [commands, setCommands] = useState([
    {
      type: "info",
      text: "Borrowbe Terminal. Enter a command to continue.",
      by: "system",
    },
  ]);
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key == "/") {
        setActive((active) => !active);
      }
    });
  }, []);
  useEffect(() => {
    if (active) document.querySelector(".__app").style.filter = "blur(10px)";
    else document.querySelector(".__app").style.filter = "none";
  }, [active]);

  async function executeCommand(comm) {
    setCommands((c) => [
      ...c,
      { type: "command", text: comm, by: user?.firstName || "Anonymous user" },
    ]);
    const commandObj = {};
    const arr = comm.split(" ");
    commandObj.command = arr[0];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] == "-") {
        commandObj[arr[i].slice(1)] = arr[i + 1];
      }
    }
    setProcessing(true);
    const res = (await axios.post(apis.executeCommand, commandObj)).data;
    console.log(res);
    setProcessing(false);
    setCommands((c) => [
      ...c,
      { type: res.type, text: res.message, by: "system" },
    ]);
  }
  return (
    <div className="terminal_cont">
      {active && (
        <div className="__terminal">
          <div className="commands">
            {commands.map((c) => (
              <div className={"comm_" + c.type}>
                {"[" + c.by + "] >>> "}
                {c.text}{" "}
              </div>
            ))}
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="type a command"
              onKeyDown={(e) => {
                if (e.target.value.trim() && !processing && e.key == "Enter") {
                  executeCommand(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Terminal;
