import React, { useRef, useState } from "react";
import { Input, Select } from "../ManageShared";
import GenericCard from "./GenericCard";
import validateEmail from "../../../utils/validateEmail";

const tempUser = {
  phone: "",
  email: "",
  phoneHidden: false,
};

export default function GeneralInfo({ user, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...tempUser });

  const inputRefs = {
    phone: useRef(),
    email: useRef(),
    phoneHidden: useRef(),
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser({
      phone: user?.info?.phone || "",
      email: user?.email || "",
      phoneHidden: user?.info?.phoneHidden || false,
    });
  };

  const handleSaveClick = () => {
    let isValidEmail = validateEmail(editedUser.email);
    if (!isValidEmail) {
      alert("Please enter a valid email address");
      return;
    }

    const payload = {
      email: editedUser.email,
      info: {
        ...(user?.info || {}),
        phone: editedUser.phone,
        phoneHidden: editedUser.phoneHidden,
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
      if (field === "phone") {
        inputRefs.email.current.focus();
      } else if (field === "email") {
        inputRefs.phoneHidden.current.focus();
      }
    }
  };

  function parsePhone(phone) {
    phone =
      (phone.split(" ")[0] || "") +
      (phone.split(" ")[1] || "") +
      (phone.split(" ")[2] || "");
    let res = "";
    res += phone?.slice(0, 3);
    if (res.length == 3) res += " ";
    res += phone?.slice(3, 6);
    if (res.length == 7) res += " ";
    res += phone?.slice(6, 10);

    return res;
  }

  function handlePhoneChange(e, setState) {
    const isNumber = /^[0-9]$/i.test(e.key);
    if (e.key == "Backspace")
      saveData("phone", editedUser.phone.slice(0, editedUser.phone.length - 1));
    if (!isNumber) return;
    saveData(
      "phone",
      editedUser.phone.length == 10
        ? editedUser.phone
        : editedUser.phone + e.key
    );
  }

  return (
    <GenericCard
      hide
      title={"Contact Details : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div className="row">
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Phone:</label>
              <Input
                // onChange={(e) => saveData("phone", e.target.value)}
                type="text"
                name="phone"
                // value={editedUser.phone}
                ref={inputRefs.phone}
                onKeyPress={(e) => handleKeyPress(e, "phone")}
                value={parsePhone(editedUser.phone)}
                onKeyDown={(e) => handlePhoneChange(e, saveData)}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Phone:</p>
              </div>
              <div className="value_col">{user?.info?.phone}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Email:</label>
              <Input
                type="text"
                name="city"
                value={editedUser.email}
                onChange={(e) => saveData("email", e.target.value)}
                ref={inputRefs.email}
                onKeyPress={(e) => handleKeyPress(e, "email")}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Email:</p>
              </div>
              <div className="value_col">{user?.email}</div>
            </div>
          )}
        </div>
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Phone Hidden:</label>
              <Select
                name="phoneHidden"
                value={editedUser.phoneHidden}
                onChange={(e) => {
                  saveData("phoneHidden", e.target.value);
                }}
                ref={inputRefs.phoneHidden}
                onKeyPress={(e) => handleKeyPress(e, "phoneHidden")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Phone Hidden:</p>
              </div>
              <div className="value_col">
                {user?.info?.phoneHidden ? "Yes" : "No"}
              </div>
            </div>
          )}
        </div>
      </div>
    </GenericCard>
  );
}
