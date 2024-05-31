import React, { useRef, useState } from "react";
import { Input, Select } from "../ManageShared";
import GenericCard from "./GenericCard";
import { CANADA_PROVINCES } from "../../../utils/constants";

const tempUser = {
  address: "",
  city: "",
  province: "",
  postalCode: "",
  locationHidden: false,
};

export default function GeneralInfo({ user, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...tempUser });
  const [postalCode, setPostalCode] = useState(user?.info?.postalCode || "");

  const inputRefs = {
    address: useRef(),
    city: useRef(),
    province: useRef(),
    postalCode: useRef(),
    locationHidden: useRef(),
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser({
      address: user?.info?.address || "",
      city: user?.info?.city || "",
      province: user?.info?.province || "",
      postalCode: user?.info?.postalCode || "",
      locationHidden: user?.info?.locationHidden || false,
    });
  };

  const handleSaveClick = () => {
    if (postalCode.length !== 6) return alert("Invalid Postal Code");
    const payload = {
      info: {
        ...(user?.info || {}),
        address: editedUser.address,
        city: editedUser.city,
        province: editedUser.province,
        postalCode: postalCode,
        locationHidden: editedUser.locationHidden,
      },
    };

    handleSave(payload, () => {
      setIsEditing(false);
    });
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser({ ...tempUser });
  };

  const saveData = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleKeyPress = (event, field) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "address") {
        inputRefs.city.current.focus();
      } else if (field === "city") {
        inputRefs.province.current.focus();
      } else if (field === "province") {
        inputRefs.postalCode.current.focus();
      } else if (field === "postalCode") {
        inputRefs.locationHidden.current.focus();
      }
    }
  };

  function parsePostalCode(code) {
    code = (code.split(" ")[0] || "") + (code.split(" ")[1] || "");

    let res = "";
    res += code?.slice(0, 3);
    if (res.length == 3) res += " ";
    res += code?.slice(3, 6);

    return res;
  }

  function handleCodeChange(e, setState) {
    const isNumber = /^[0-9]$/i.test(e.key);
    const isLetter = /^[a-zA-Z]*$/.test(e.key);

    if (e.key == "Backspace")
      return setState((state) => state.slice(0, state.length - 1));

    if ((!isLetter && !isNumber) || e.key.length > 1) return;

    setState((state) => {
      if (state.length % 2 && isLetter) return state;
      if (!(state.length % 2) && isNumber) return state;
      if (state.length == 6) return state;
      return state + e.key.toUpperCase();
    });
  }

  return (
    <GenericCard

      title={"Address Info : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div className="row">
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Address:</label>
              <Input
                onChange={(e) => saveData("address", e.target.value)}
                type="text"
                name="address"
                value={editedUser.address}
                onKeyPress={(e) => handleKeyPress(e, "address")}
                ref={inputRefs.address}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Address:</p>
              </div>
              <div className="value_col">{user?.info?.address}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">City:</label>
              <Input
                type="text"
                name="city"
                value={editedUser.city}
                onChange={(e) => saveData("city", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "city")}
                ref={inputRefs.city}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">City:</p>
              </div>
              <div className="value_col">{user?.info?.city}</div>
            </div>
          )}

          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Province:</label>
              <Select
                name="province"
                value={editedUser.province}
                ref={inputRefs.province}
                onKeyPress={(e) => handleKeyPress(e, "province")}
                onChange={(e) => {
                  saveData("province", e.target.value);
                }}
              >
                {["Select", ...CANADA_PROVINCES.map((obj) => obj.value)].map(
                  (item) => (
                    <option value={item}>{item}</option>
                  )
                )}
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Province:</p>
              </div>
              <div className="value_col">{user?.info?.province}</div>
            </div>
          )}
        </div>
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Postal Code:</label>
              <Input
                type="text"
                name="postalCode"
                // value={editedUser.postalCode}
                // onKeyPress={(e) => handleKeyPress(e, "postalCode")}
                // onChange={(e) => saveData("postalCode", e.target.value)}
                value={parsePostalCode(postalCode)}
                onKeyDown={(e) => handleCodeChange(e, setPostalCode)}
                ref={inputRefs.postalCode}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Postal Code:</p>
              </div>
              <div className="value_col">{user?.info?.postalCode}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Location Hidden:</label>
              <Select
                name="locationHidden"
                value={editedUser.locationHidden}
                onChange={(e) => {
                  saveData("locationHidden", e.target.value);
                }}
                onKeyPress={(e) => handleKeyPress(e, "locationHidden")}
                ref={inputRefs.locationHidden}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Location Hidden:</p>
              </div>
              <div className="value_col">
                {user?.info?.locationHidden ? "Yes" : "No"}
              </div>
            </div>
          )}
        </div>
      </div>
    </GenericCard>
  );
}
